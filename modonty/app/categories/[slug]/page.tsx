import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArticleStatus } from "@prisma/client";
import { generateMetadataFromSEO, generateStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const categories = await db.category.findMany({
      select: { slug: true },
    });

    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for categories:", error);
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const category = await db.category.findUnique({
      where: { slug },
      select: {
        name: true,
        description: true,
        seoTitle: true,
        seoDescription: true,
      },
    });

    if (!category) {
      return {
        title: "فئة غير موجودة - مودونتي",
      };
    }

    return generateMetadataFromSEO({
      title: category.seoTitle || category.name,
      description: category.seoDescription || category.description || `استكشف مقالات فئة ${category.name}`,
      keywords: [category.name],
      url: `/categories/${slug}`,
      type: "website",
    });
  } catch (error) {
    console.error("Error generating metadata for category:", error);
    return {
      title: "الفئات - مودونتي",
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  try {
    const category = await db.category.findUnique({
      where: { slug },
      include: {
        articles: {
          where: {
            status: ArticleStatus.PUBLISHED,
          },
          include: {
            client: {
              select: {
                id: true,
                name: true,
                slug: true,
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
              },
            },
          },
          orderBy: {
            datePublished: "desc",
          },
        },
        _count: {
          select: {
            articles: {
              where: {
                status: ArticleStatus.PUBLISHED,
              },
            },
          },
        },
      },
    });

    if (!category) {
      notFound();
    }

    const structuredData = generateStructuredData({
      type: "Category",
      name: category.name,
      description: category.description || category.seoDescription || undefined,
      url: `/categories/${slug}`,
    });

    const breadcrumbData = generateBreadcrumbStructuredData([
      { name: "الرئيسية", url: "/" },
      { name: "الفئات", url: "/categories" },
      { name: category.name, url: `/categories/${slug}` },
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
        <div className="min-h-screen bg-background">
          <div className="container mx-auto max-w-[1128px] px-4 py-8">
            <div className="mb-6">
              <Link href="/categories">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  العودة إلى الفئات
                </Button>
              </Link>
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
                    {category.description && (
                      <p className="text-muted-foreground mt-2">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="text-sm">
                    {(category as any)._count?.articles ?? 0} مقال
                  </Badge>
                </div>
              </div>
            </div>

            {((category as any).articles ?? []).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">لا توجد مقالات في هذه الفئة بعد.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {((category as any).articles ?? []).map((article: any) => (
                  <Link key={article.id} href={`/articles/${article.slug}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      {article.featuredImage && (
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                          <img
                            src={article.featuredImage.url}
                            alt={article.featuredImage.alt || article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                        {article.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {article.excerpt}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <Link
                            href={`/clients/${article.client.slug}`}
                            className="hover:text-primary"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {article.client.name}
                          </Link>
                          {article.datePublished && (
                            <span>
                              {new Date(article.datePublished).toLocaleDateString("ar-SA")}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    notFound();
  }
}
