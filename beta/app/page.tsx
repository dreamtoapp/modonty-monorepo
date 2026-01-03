import { Metadata } from "next";
import { FeedContainer } from "@/components/FeedContainer";
import { db } from "@/lib/db";
import { ArticleStatus } from "@prisma/client";
import { generateMetadataFromSEO, generateStructuredData } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const featuredArticles = await db.article.findMany({
    where: {
      status: ArticleStatus.PUBLISHED,
      featured: true,
    },
    take: 3,
    orderBy: { datePublished: "desc" },
    select: {
      title: true,
      seoTitle: true,
    },
  });

  const title = featuredArticles.length > 0
    ? `أحدث المقالات المميزة - ${featuredArticles[0].seoTitle || featuredArticles[0].title}`
    : "أحدث المقالات - مودونتي";

  return generateMetadataFromSEO({
    title,
    description: "استكشف أحدث المقالات والمدونات الاحترافية من أفضل الكتّاب والمؤلفين. محتوى عالي الجودة في التقنية، التصميم، التسويق، والابتكار.",
    keywords: ["مقالات", "مدونات", "محتوى", "تقنية", "تصميم", "تسويق"],
    type: "website",
    locale: "ar_SA",
  });
}

export default async function HomePage() {
  const articles = await db.article.findMany({
    where: {
      status: ArticleStatus.PUBLISHED,
      datePublished: { lte: new Date() },
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
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
    orderBy: [
      { featured: "desc" },
      { datePublished: "desc" },
    ],
    take: 20,
  });

  const posts = articles.map((article) => ({
    id: article.id,
    title: article.title,
    content: article.excerpt || "",
    excerpt: article.excerpt ?? undefined,
    image: article.featuredImage?.url,
    slug: article.slug,
    publishedAt: article.datePublished || article.createdAt,
    clientName: article.client.name,
    clientSlug: article.client.slug,
    author: {
      id: article.author.id,
      name: article.author.name,
      title: "",
      company: article.client.name,
      avatar: "",
    },
    likes: 0,
    dislikes: 0,
    comments: 0,
    favorites: 0,
    status: "published" as const,
  }));

  const collectionPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "أحدث المقالات",
    description: "مجموعة من أحدث المقالات والمدونات الاحترافية",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com"}/articles/${article.slug}`,
          datePublished: article.datePublished?.toISOString(),
          author: {
            "@type": "Person",
            name: article.author.name,
          },
          publisher: {
            "@type": "Organization",
            name: article.client.name,
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageStructuredData),
        }}
      />
      <FeedContainer posts={posts} />
    </>
  );
}

