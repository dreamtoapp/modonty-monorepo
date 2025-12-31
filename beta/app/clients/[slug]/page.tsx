import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArticleStatus } from "@prisma/client";
import { generateMetadataFromSEO, generateStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Building2, ArrowLeft, Globe, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ClientPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const clients = await db.client.findMany({
      select: { slug: true },
    });

    return clients.map((client) => ({
      slug: client.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for clients:", error);
    return [];
  }
}

export async function generateMetadata({ params }: ClientPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const client = await db.client.findUnique({
      where: { slug },
      select: {
        name: true,
        seoTitle: true,
        seoDescription: true,
        logo: true,
        ogImage: true,
      },
    });

    if (!client) {
      return {
        title: "عميل غير موجود - مودونتي",
      };
    }

    return generateMetadataFromSEO({
      title: client.seoTitle || client.name,
      description: client.seoDescription || `استكشف مقالات ${client.name}`,
      image: client.ogImage || client.logo || undefined,
      url: `/clients/${slug}`,
      type: "website",
    });
  } catch (error) {
    console.error("Error generating metadata for client:", error);
    return {
      title: "العملاء - مودونتي",
    };
  }
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { slug } = await params;

  try {
    const client = await db.client.findUnique({
      where: { slug },
      include: {
        articles: {
          where: {
            status: ArticleStatus.PUBLISHED,
          },
          include: {
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
                alt: true,
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

    if (!client) {
      notFound();
    }

    const initials = client.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const structuredData = generateStructuredData({
      type: "Client",
      name: client.name,
      description: client.seoDescription || undefined,
      url: `/clients/${slug}`,
      image: client.logo || client.ogImage || undefined,
      "@type": "Organization",
      legalName: client.legalName || undefined,
      url: client.url || undefined,
      email: client.email || undefined,
      telephone: client.phone || undefined,
      sameAs: client.sameAs.length > 0 ? client.sameAs : undefined,
    });

    const breadcrumbData = generateBreadcrumbStructuredData([
      { name: "الرئيسية", url: "/" },
      { name: "العملاء", url: "/clients" },
      { name: client.name, url: `/clients/${slug}` },
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
              <Link href="/clients">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  العودة إلى العملاء
                </Button>
              </Link>
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={client.logo || undefined} alt={client.name} />
                      <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{client.name}</CardTitle>
                      {client.legalName && client.legalName !== client.name && (
                        <p className="text-sm text-muted-foreground">{client.legalName}</p>
                      )}
                      {client.seoDescription && (
                        <p className="text-muted-foreground mt-2">{client.seoDescription}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {client.url && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={client.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {client.url}
                        </a>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${client.email}`}
                          className="text-primary hover:underline"
                        >
                          {client.email}
                        </a>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${client.phone}`}
                          className="text-primary hover:underline"
                        >
                          {client.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary">
                        {client._count.articles} مقال
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {client.articles.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">لا توجد مقالات من هذا العميل بعد.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">المقالات</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {client.articles.map((article) => (
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
                            {article.category && (
                              <Link
                                href={`/categories/${article.category.slug}`}
                                className="hover:text-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {article.category.name}
                              </Link>
                            )}
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
              </>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching client:", error);
    notFound();
  }
}
