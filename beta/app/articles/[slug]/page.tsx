import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArticleStatus } from "@prisma/client";
import { generateMetadataFromSEO } from "@/lib/seo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/helpers/mockData";
import { GTMClientTracker } from "@/components/gtm/GTMClientTracker";

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

    // First: Try to use stored metadata
    const article = await db.article.findFirst({
      where: {
        slug,
        status: ArticleStatus.PUBLISHED,
      },
      select: {
        nextjsMetadata: true,
        nextjsMetadataLastGenerated: true,
        // Minimal fields for fallback
        seoTitle: true,
        title: true,
        seoDescription: true,
        excerpt: true,
        canonicalUrl: true,
        inLanguage: true,
        metaRobots: true,
        featuredImageId: true,
        clientId: true,
      },
    });

    if (!article) {
      return {
        title: "مقال غير موجود - مودونتي",
      };
    }

    // Use stored metadata if available
    if (article.nextjsMetadata) {
      try {
        // Validate it's a valid Metadata object
        const stored = article.nextjsMetadata as Metadata;
        // Basic validation (has title)
        if (stored.title) {
          return stored;
        }
      } catch {
        // Invalid JSON, fall through to generation
        console.warn('Invalid stored metadata for article:', slug);
      }
    }

    // Fallback: Generate on-the-fly (current behavior)
    const articleForGeneration = await db.article.findFirst({
      where: { slug, status: ArticleStatus.PUBLISHED },
      include: {
        client: {
          include: {
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

    if (!articleForGeneration) {
      return { title: "مقال غير موجود - مودونتي" };
    }

    const title = articleForGeneration.seoTitle || articleForGeneration.title;
    const description = articleForGeneration.seoDescription || articleForGeneration.excerpt || "";
    const image =
      articleForGeneration.featuredImage?.url ||
      articleForGeneration.client.ogImageMedia?.url ||
      articleForGeneration.client.logoMedia?.url ||
      undefined;

    return generateMetadataFromSEO({
      title,
      description,
      image,
      url: articleForGeneration.canonicalUrl || `/articles/${slug}`,
      type: "article",
      locale: articleForGeneration.inLanguage || "ar_SA",
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
          include: {
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

    // Get cached JSON-LD from database (Phase 6)
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
        {/* Single unified JSON-LD @graph from database cache (Phase 6) */}
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

            {/* Article content - JSON-LD is source of truth (no Microdata) */}
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
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    notFound();
  }
}
