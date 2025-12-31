import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { ArticleStatus } from "@prisma/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com";

  const articles = await db.article.findMany({
    where: {
      status: ArticleStatus.PUBLISHED,
      datePublished: { lte: new Date() },
    },
    select: {
      slug: true,
      datePublished: true,
      dateModified: true,
      sitemapPriority: true,
      sitemapChangeFreq: true,
      featured: true,
    },
    orderBy: { datePublished: "desc" },
  });

  const categories = await db.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const clients = await db.client.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.dateModified || article.datePublished || new Date(),
    changeFrequency: (article.sitemapChangeFreq as any) || "weekly",
    priority: article.sitemapPriority || (article.featured ? 0.8 : 0.5),
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const clientUrls: MetadataRoute.Sitemap = clients.map((client) => ({
    url: `${baseUrl}/clients/${client.slug}`,
    lastModified: client.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/clients`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articleUrls,
    ...categoryUrls,
    ...clientUrls,
  ];
}
