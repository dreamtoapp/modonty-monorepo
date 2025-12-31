import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArticleStatus } from "@prisma/client";
import { generateMetadataFromSEO } from "@/lib/seo";
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  generateAuthorStructuredData,
  generateOrganizationStructuredData,
  generateFAQPageStructuredData,
} from "@/lib/seo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/helpers/mockData";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const articles = await db.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        datePublished: { lte: new Date() },
      },
      select: { slug: true },
      take: 100,
    });

    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const { slug } = await params;

    const article = await db.article.findFirst({
      where: {
        slug,
        status: ArticleStatus.PUBLISHED,
      },
      include: {
        client: {
          select: {
            name: true,
            logo: true,
            ogImage: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        featuredImage: {
          select: {
            url: true,
            altText: true,
          },
        },
      },
    });

    if (!article) {
      return {
        title: "مقال غير موجود - مودونتي",
      };
    }

    const title = article.seoTitle || article.title;
    const description = article.seoDescription || article.excerpt || "";
    const image =
      article.ogImage ||
      article.featuredImage?.url ||
      article.client.ogImage ||
      article.client.logo ||
      undefined;

    return generateMetadataFromSEO({
      title,
      description,
      image,
      url: article.canonicalUrl || `/articles/${slug}`,
      type: "article",
      locale: article.ogLocale || "ar_SA",
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "مقال - مودونتي",
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  try {
    const article = await db.article.findFirst({
      where: {
        slug,
        status: ArticleStatus.PUBLISHED,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            url: true,
            legalName: true,
            email: true,
            phone: true,
            sameAs: true,
            seoDescription: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            slug: true,
            bio: true,
            image: true,
            url: true,
            jobTitle: true,
            linkedIn: true,
            twitter: true,
            facebook: true,
            sameAs: true,
            expertiseAreas: true,
            credentials: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        featuredImage: {
          select: {
            url: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        faqs: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!article) {
      notFound();
    }

    const breadcrumbPath = article.breadcrumbPath as Array<{ name: string; url: string }> | null;

    const articleStructuredData = generateArticleStructuredData({
      ...article,
      faqs: article.faqs,
      featuredImage: article.featuredImage
        ? {
            url: article.featuredImage.url,
            altText: article.featuredImage.altText,
          }
        : null,
    });

    const breadcrumbStructuredData = breadcrumbPath
      ? generateBreadcrumbStructuredData(breadcrumbPath)
      : generateBreadcrumbStructuredData([
          { name: "الرئيسية", url: "/" },
          ...(article.category
            ? [{ name: article.category.name, url: `/categories/${article.category.slug}` }]
            : []),
          { name: article.title, url: `/articles/${article.slug}` },
        ]);

    const authorStructuredData = generateAuthorStructuredData(article.author);
    const organizationStructuredData = generateOrganizationStructuredData(article.client);

    const faqStructuredData =
      article.faqs && article.faqs.length > 0
        ? generateFAQPageStructuredData(article.faqs)
        : null;

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(authorStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        {faqStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqStructuredData),
            }}
          />
        )}

        <div className="min-h-screen bg-background">
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary">
                    الرئيسية
                  </Link>
                </li>
                {article.category && (
                  <>
                    <li>/</li>
                    <li>
                      <Link
                        href={`/categories/${article.category.slug}`}
                        className="hover:text-primary"
                      >
                        {article.category.name}
                      </Link>
                    </li>
                  </>
                )}
                <li>/</li>
                <li className="text-foreground">{article.title}</li>
              </ol>
            </nav>

            <article itemScope itemType="https://schema.org/Article">
              <header className="mb-8">
                <h1 itemProp="headline" className="text-3xl font-bold mb-4">
                  {article.title}
                </h1>

                {article.excerpt && (
                  <p itemProp="description" className="text-lg text-muted-foreground mb-6">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <span itemProp="author" itemScope itemType="https://schema.org/Person">
                      <Link
                        href={`/users/${article.author.slug || article.author.id}`}
                        className="hover:text-primary"
                      >
                        <span itemProp="name">{article.author.name}</span>
                      </Link>
                    </span>
                  </div>
                  <time
                    itemProp="datePublished"
                    dateTime={article.datePublished?.toISOString()}
                  >
                    {article.datePublished
                      ? formatRelativeTime(article.datePublished)
                      : formatRelativeTime(article.createdAt)}
                  </time>
                  {article.readingTimeMinutes && (
                    <span>⏱️ {article.readingTimeMinutes} دقيقة قراءة</span>
                  )}
                  {article.wordCount && <span>📝 {article.wordCount} كلمة</span>}
                </div>

                {article.featuredImage && (
                  <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
                    <Image
                      itemProp="image"
                      src={article.featuredImage.url}
                      alt={article.featuredImage.altText || article.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  <Link href={`/clients/${article.client.slug}`}>
                    <Badge variant="secondary" className="text-sm">
                      {article.client.name}
                    </Badge>
                  </Link>
                  {article.category && (
                    <Link href={`/categories/${article.category.slug}`}>
                      <Badge variant="outline" className="text-sm">
                        {article.category.name}
                      </Badge>
                    </Link>
                  )}
                  {article.tags.map((articleTag) => (
                    <Link key={articleTag.tag.id} href={`/tags/${articleTag.tag.slug}`}>
                      <Badge variant="outline" className="text-sm">
                        {articleTag.tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </header>

              <div
                itemProp="articleBody"
                className="prose prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {article.faqs && article.faqs.length > 0 && (
                <section className="mt-12 mb-8" itemScope itemType="https://schema.org/FAQPage">
                  <h2 className="text-2xl font-bold mb-6">الأسئلة الشائعة</h2>
                  <div className="space-y-4">
                    {article.faqs.map((faq, index) => (
                      <Card key={faq.id}>
                        <CardHeader>
                          <h3
                            itemProp="mainEntity"
                            itemScope
                            itemType="https://schema.org/Question"
                            className="text-lg font-semibold"
                          >
                            <span itemProp="name">{faq.question}</span>
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <div
                            itemProp="acceptedAnswer"
                            itemScope
                            itemType="https://schema.org/Answer"
                          >
                            <p itemProp="text" className="text-muted-foreground">
                              {faq.answer}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              <footer className="mt-12 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      نشر بواسطة{" "}
                      <Link
                        href={`/clients/${article.client.slug}`}
                        className="text-primary hover:underline"
                      >
                        {article.client.name}
                      </Link>
                    </p>
                    {article.dateModified && (
                      <p className="text-xs text-muted-foreground mt-1">
                        آخر تحديث: {formatRelativeTime(article.dateModified)}
                      </p>
                    )}
                  </div>
                </div>
              </footer>
            </article>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    notFound();
  }
}
