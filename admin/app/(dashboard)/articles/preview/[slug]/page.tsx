import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { generateMetadataFromSEO } from "@/lib/seo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/helpers/utils/format-relative-time";
import { GTMClientTracker } from "@/components/gtm/GTMClientTracker";
import { PreviewValidationSection } from "../../components/preview/preview-validation-section";
import { AnalyticsSection } from "../../components/preview/analytics-section";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;

    const article = await db.article.findFirst({
      where: {
        slug,
      },
      include: {
        client: {
          select: {
            name: true,
            logoMedia: {
              select: {
                url: true,
              },
            },
            ogImageMedia: {
              select: {
                url: true,
              },
            },
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
      article.featuredImage?.url ||
      article.client.ogImageMedia?.url ||
      article.client.logoMedia?.url ||
      undefined;

    return generateMetadataFromSEO(
      {
        title,
        description,
        image,
        url: article.canonicalUrl || `/articles/${slug}`,
        type: "article",
        locale: article.ogLocale || "ar_SA",
      },
      { robots: "noindex,nofollow" }
    );
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "مقال - مودونتي",
    };
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;

  try {
    const article = await db.article.findFirst({
      where: {
        slug,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoMedia: {
              select: {
                url: true,
              },
            },
            ogImageMedia: {
              select: {
                url: true,
              },
            },
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

    let jsonLdGraph: object | null = null;
    if (article?.jsonLdStructuredData) {
      try {
        jsonLdGraph = JSON.parse(article.jsonLdStructuredData);
      } catch {
        console.error("Failed to parse cached JSON-LD for article:", slug);
      }
    }

    if (!article) {
      notFound();
    }

    return (
      <>
        {jsonLdGraph && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLdGraph),
            }}
          />
        )}

        {article.client && (
          <GTMClientTracker
            clientContext={{
              client_id: article.client.id,
              client_slug: article.client.slug,
              client_name: article.client.name,
            }}
            articleId={article.id}
            pageTitle={article.seoTitle || article.title}
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

            <article>
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-4">
                  {article.title}
                </h1>

                {article.excerpt && (
                  <p className="text-lg text-muted-foreground mb-6">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <span>{article.author.name}</span>
                  </div>
                  <time dateTime={article.datePublished?.toISOString()}>
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
                className="prose prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {article.faqs && article.faqs.length > 0 && (
                <section className="mt-12 mb-8">
                  <h2 className="text-2xl font-bold mb-6">الأسئلة الشائعة</h2>
                  <div className="space-y-4">
                    {article.faqs.map((faq) => (
                      <Card key={faq.id}>
                        <CardHeader>
                          <h3 className="text-lg font-semibold">
                            {faq.question}
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            {faq.answer}
                          </p>
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

            {/* Analytics Section */}
            <AnalyticsSection articleId={article.id} />

            {/* Validation Section */}
            <PreviewValidationSection articleId={article.id} articleSlug={slug} />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    notFound();
  }
}