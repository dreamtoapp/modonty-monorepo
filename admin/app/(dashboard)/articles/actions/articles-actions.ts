"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ArticleStatus, Prisma } from "@prisma/client";
import {
  calculateWordCount,
  calculateReadingTime,
  determineContentDepth,
  generateSEOTitle,
  generateSEODescription,
  generateCanonicalUrl,
  generateBreadcrumbPath,
} from "../helpers/seo-helpers";
import { ArticleFormData, FAQItem } from "@/lib/types";
import { calculateSEOScore } from "@/helpers/utils/seo-score-calculator";
import { articleSEOConfig } from "@/components/shared/seo-doctor/seo-configs";

export interface ArticleFilters {
  status?: ArticleStatus;
  clientId?: string;
  categoryId?: string;
  authorId?: string;
  createdFrom?: Date;
  createdTo?: Date;
  publishedFrom?: Date;
  publishedTo?: Date;
}

export async function getArticles(filters?: ArticleFilters) {
  try {
    const validStatuses = [
      ArticleStatus.DRAFT,
      ArticleStatus.PUBLISHED,
      ArticleStatus.ARCHIVED,
    ];
    
    // Build where clause
    const where: Prisma.ArticleWhereInput = {};

    // Status filter
    if (filters?.status && validStatuses.includes(filters.status)) {
      where.status = filters.status;
    } else {
      // Filter out any undefined values from the array
      const filteredStatuses = validStatuses.filter((status): status is ArticleStatus => status !== undefined);
      where.status = { in: filteredStatuses };
    }

    // Client filter
    if (filters?.clientId) {
      where.clientId = filters.clientId;
    }

    // Category filter
    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    // Author filter
    if (filters?.authorId) {
      where.authorId = filters.authorId;
    }

    // Created date range filter
    if (filters?.createdFrom || filters?.createdTo) {
      where.createdAt = {};
      if (filters.createdFrom) {
        where.createdAt.gte = filters.createdFrom;
      }
      if (filters.createdTo) {
        where.createdAt.lte = filters.createdTo;
      }
    }

    // Published date range filter
    if (filters?.publishedFrom || filters?.publishedTo) {
      where.datePublished = {};
      if (filters.publishedFrom) {
        where.datePublished.gte = filters.publishedFrom;
      }
      if (filters.publishedTo) {
        where.datePublished.lte = filters.publishedTo;
      }
    }

    // Clean the where clause - remove any undefined values from nested objects
    const cleanWhere = {} as Prisma.ArticleWhereInput;
    for (const [key, value] of Object.entries(where)) {
      if (value !== undefined) {
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !('in' in value)) {
          // Clean nested objects
          const cleaned = Object.fromEntries(
            Object.entries(value).filter(([_, v]) => v !== undefined)
          );
          if (Object.keys(cleaned).length > 0) {
            (cleanWhere as Record<string, unknown>)[key] = cleaned;
          }
        } else {
          (cleanWhere as Record<string, unknown>)[key] = value;
        }
      }
    }

    const articles = await db.article.findMany({
      where: cleanWhere,
      include: {
        client: { select: { name: true } },
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get views count for each article using aggregation
    const articleIds = articles.map((a) => a.id).filter((id): id is string => id !== undefined);
    
    if (articleIds.length > 0) {
      const viewsCounts = await db.analytics.groupBy({
        by: ["articleId"],
        where: {
          articleId: { in: articleIds },
        },
        _count: {
          id: true,
        },
      });

      const viewsMap = new Map(
        viewsCounts.map((v) => [v.articleId, v._count.id])
      );

      // Add views count to articles
      return articles.map((article) => ({
        id: article.id,
        title: article.title,
        status: article.status,
        createdAt: article.createdAt,
        datePublished: article.datePublished,
        scheduledAt: article.scheduledAt,
        client: article.client,
        category: article.category,
        author: article.author,
        views: viewsMap.get(article.id) || 0,
      }));
    }

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      status: article.status,
      createdAt: article.createdAt,
      datePublished: article.datePublished,
      scheduledAt: article.scheduledAt,
      client: article.client,
      category: article.category,
      author: article.author,
      views: 0,
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getArticleById(id: string) {
  try {
    const article = await db.article.findUnique({
      where: { id },
      include: {
        client: true,
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
        featuredImage: true,
        faqs: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });
    // Filter out articles with invalid status (shouldn't happen after migration)
    const validStatuses = [
      ArticleStatus.DRAFT,
      ArticleStatus.PUBLISHED,
      ArticleStatus.ARCHIVED,
    ];
    if (article && !validStatuses.includes(article.status)) {
      console.warn(`Article ${id} has invalid status: ${article.status}`);
      return null;
    }
    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function createArticle(data: ArticleFormData) {
  try {
    const client = await db.client.findUnique({
      where: { id: data.clientId },
      select: { name: true, slug: true, ogImage: true },
    });

    const category = data.categoryId
      ? await db.category.findUnique({
          where: { id: data.categoryId },
          select: { name: true, slug: true },
        })
      : null;

    const wordCount = data.wordCount || calculateWordCount(data.content);
    const readingTimeMinutes =
      data.readingTimeMinutes || calculateReadingTime(wordCount);
    const contentDepth = data.contentDepth || determineContentDepth(wordCount);

    const seoTitle =
      data.seoTitle || generateSEOTitle(data.title, client?.name);
    const seoDescription =
      data.seoDescription || generateSEODescription(data.excerpt || "");

    const canonicalUrl =
      data.canonicalUrl ||
      generateCanonicalUrl(data.slug, undefined, client?.slug);

    const breadcrumbPath = generateBreadcrumbPath(
      category?.name,
      category?.slug,
      data.title,
      data.slug
    );

    const datePublished =
      data.datePublished ||
      (data.status === ArticleStatus.PUBLISHED ? new Date() : null);

    const creativeWorkStatus =
      data.status === ArticleStatus.PUBLISHED
        ? "published"
        : (data.status as string) === "SCHEDULED"
        ? "scheduled"
        : "draft";

    const metaRobots =
      data.metaRobots ||
      (data.status === ArticleStatus.PUBLISHED
        ? "index, follow"
        : "noindex, follow");

    const sitemapPriority = data.sitemapPriority || (data.featured ? 0.8 : 0.5);

    const article = await db.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        contentFormat: data.contentFormat || "rich_text",
        clientId: data.clientId,
        categoryId: data.categoryId || null,
        authorId: data.authorId,
        status: data.status,
        scheduledAt: data.scheduledAt || null,
        featured: data.featured || false,
        featuredImageId: data.featuredImageId || null,
        featuredImageAlt: data.featuredImageAlt || null,
        datePublished,
        wordCount,
        readingTimeMinutes,
        contentDepth,
        inLanguage: "ar",
        isAccessibleForFree: true,
        license: data.license || null,
        lastReviewed: data.lastReviewed || null,
        creativeWorkStatus,
        mainEntityOfPage: canonicalUrl,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        metaRobots,
        ogTitle: data.ogTitle || seoTitle || data.title,
        ogDescription: data.ogDescription || seoDescription || data.excerpt || null,
        ogImage: data.ogImage || data.featuredImageId
          ? null
          : client?.ogImage || null,
        ogImageAlt: data.ogImageAlt || null,
        ogImageWidth: data.ogImageWidth || null,
        ogImageHeight: data.ogImageHeight || null,
        ogUrl: data.ogUrl || canonicalUrl,
        ogSiteName: data.ogSiteName || "مودونتي",
        ogLocale: data.ogLocale || "ar_SA",
        ogType: data.ogType || "article",
        ogArticleAuthor: data.ogArticleAuthor || null,
        ogArticlePublishedTime: datePublished,
        ogArticleModifiedTime: new Date(),
        ogUpdatedTime: null,
        ogArticleSection: data.ogArticleSection || category?.name || null,
        ogArticleTag: data.ogArticleTag || data.tags || [],
        twitterCard: data.twitterCard || "summary_large_image",
        twitterTitle: data.twitterTitle || data.ogTitle || seoTitle || data.title,
        twitterDescription:
          data.twitterDescription ||
          data.ogDescription ||
          seoDescription ||
          data.excerpt ||
          null,
        twitterImage: data.twitterImage || data.ogImage || null,
        twitterImageAlt: data.twitterImageAlt || null,
        twitterSite: data.twitterSite || null,
        twitterCreator: data.twitterCreator || null,
        twitterLabel1: data.twitterLabel1 || null,
        twitterData1: data.twitterData1 || null,
        canonicalUrl,
        robotsMeta: metaRobots,
        sitemapPriority,
        sitemapChangeFreq: data.sitemapChangeFreq || "weekly",
        alternateLanguages: data.alternateLanguages || [],
        breadcrumbPath: JSON.parse(JSON.stringify(breadcrumbPath)) as Prisma.InputJsonValue,
      },
    });

    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        let tag = await db.tag.findFirst({
          where: { name: tagName },
        });

        if (!tag) {
          const slug = tagName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\u0600-\u06FF\w\-]+/g, "");
          tag = await db.tag.create({
            data: {
              name: tagName,
              slug: `${slug}-${Date.now()}`,
            },
          });
        }

        await db.articleTag.create({
          data: {
            articleId: article.id,
            tagId: tag.id,
          },
        });
      }
    }

    if (data.faqs && data.faqs.length > 0) {
      await db.fAQ.createMany({
        data: data.faqs.map((faq: FAQItem, index: number) => ({
          articleId: article.id,
          question: faq.question,
          answer: faq.answer,
          position: faq.position ?? index,
        })),
      });
    }

    revalidatePath("/articles");
    return { success: true, article };
  } catch (error) {
    console.error("Error creating article:", error);
    const message = error instanceof Error ? error.message : "فشل في إنشاء المقال";
    return {
      success: false,
      error: message,
    };
  }
}

export async function updateArticle(id: string, data: ArticleFormData) {
  try {
    const existingArticle = await db.article.findUnique({
      where: { id },
      include: { client: { select: { name: true, slug: true, ogImage: true } } },
    });

    if (!existingArticle) {
      return { success: false, error: "المقال غير موجود" };
    }

    const client = existingArticle.client;
    const category = data.categoryId
      ? await db.category.findUnique({
          where: { id: data.categoryId },
          select: { name: true, slug: true },
        })
      : null;

    const wordCount = data.wordCount || calculateWordCount(data.content);
    const readingTimeMinutes =
      data.readingTimeMinutes || calculateReadingTime(wordCount);
    const contentDepth = data.contentDepth || determineContentDepth(wordCount);

    const seoTitle =
      data.seoTitle || generateSEOTitle(data.title, client?.name);
    const seoDescription =
      data.seoDescription || generateSEODescription(data.excerpt || "");

    const canonicalUrl =
      data.canonicalUrl ||
      generateCanonicalUrl(data.slug, undefined, client?.slug);

    const breadcrumbPath = generateBreadcrumbPath(
      category?.name,
      category?.slug,
      data.title,
      data.slug
    );

    const datePublished =
      data.datePublished ||
      (data.status === ArticleStatus.PUBLISHED && !existingArticle.datePublished
        ? new Date()
        : existingArticle.datePublished);

    const creativeWorkStatus =
      data.status === ArticleStatus.PUBLISHED
        ? "published"
        : "draft";

    const metaRobots =
      data.metaRobots ||
      (data.status === ArticleStatus.PUBLISHED
        ? "index, follow"
        : "noindex, follow");

    const sitemapPriority = data.sitemapPriority || (data.featured ? 0.8 : 0.5);

    const article = await db.article.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        contentFormat: data.contentFormat || existingArticle.contentFormat || "rich_text",
        clientId: data.clientId,
        categoryId: data.categoryId || null,
        authorId: data.authorId,
        status: data.status,
        scheduledAt: data.scheduledAt || null,
        featured: data.featured || false,
        featuredImageId: data.featuredImageId || null,
        featuredImageAlt: data.featuredImageAlt || null,
        datePublished,
        wordCount,
        readingTimeMinutes,
        contentDepth,
        license: data.license || null,
        lastReviewed: data.lastReviewed || null,
        creativeWorkStatus,
        mainEntityOfPage: canonicalUrl,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        metaRobots,
        ogTitle: data.ogTitle || seoTitle || data.title,
        ogDescription: data.ogDescription || seoDescription || data.excerpt || null,
        ogImage: data.ogImage || null,
        ogImageAlt: data.ogImageAlt || null,
        ogImageWidth: data.ogImageWidth || null,
        ogImageHeight: data.ogImageHeight || null,
        ogUrl: data.ogUrl || canonicalUrl,
        ogSiteName: data.ogSiteName || "مودونتي",
        ogLocale: data.ogLocale || "ar_SA",
        ogType: data.ogType || "article",
        ogArticleAuthor: data.ogArticleAuthor || null,
        ogArticlePublishedTime: datePublished,
        ogArticleModifiedTime: new Date(),
        ogUpdatedTime: new Date(),
        ogArticleSection: data.ogArticleSection || category?.name || null,
        ogArticleTag: data.ogArticleTag || data.tags || [],
        twitterCard: data.twitterCard || "summary_large_image",
        twitterTitle: data.twitterTitle || data.ogTitle || seoTitle || data.title,
        twitterDescription:
          data.twitterDescription ||
          data.ogDescription ||
          seoDescription ||
          data.excerpt ||
          null,
        twitterImage: data.twitterImage || data.ogImage || null,
        twitterImageAlt: data.twitterImageAlt || null,
        twitterSite: data.twitterSite || null,
        twitterCreator: data.twitterCreator || null,
        twitterLabel1: data.twitterLabel1 || null,
        twitterData1: data.twitterData1 || null,
        canonicalUrl,
        robotsMeta: metaRobots,
        sitemapPriority,
        sitemapChangeFreq: data.sitemapChangeFreq || "weekly",
        alternateLanguages: data.alternateLanguages || [],
        breadcrumbPath: JSON.parse(JSON.stringify(breadcrumbPath)) as Prisma.InputJsonValue,
      },
    });

    await db.articleTag.deleteMany({
      where: { articleId: id },
    });

    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        let tag = await db.tag.findFirst({
          where: { name: tagName },
        });

        if (!tag) {
          const slug = tagName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\u0600-\u06FF\w\-]+/g, "");
          tag = await db.tag.create({
            data: {
              name: tagName,
              slug: `${slug}-${Date.now()}`,
            },
          });
        }

        await db.articleTag.create({
          data: {
            articleId: id,
            tagId: tag.id,
          },
        });
      }
    }

    await db.fAQ.deleteMany({
      where: { articleId: id },
    });

    if (data.faqs && data.faqs.length > 0) {
      await db.fAQ.createMany({
        data: data.faqs.map((faq: FAQItem, index: number) => ({
          articleId: id,
          question: faq.question,
          answer: faq.answer,
          position: faq.position ?? index,
        })),
      });
    }

    revalidatePath("/articles");
    revalidatePath(`/articles/${id}`);
    return { success: true, article };
  } catch (error) {
    console.error("Error updating article:", error);
    const message = error instanceof Error ? error.message : "فشل في تحديث المقال";
    return {
      success: false,
      error: message,
    };
  }
}

export async function createUpdateArticleAction(id: string) {
  return async (data: ArticleFormData) => {
    return updateArticle(id, data);
  };
}

export async function deleteArticle(id: string) {
  try {
    // Delete related records first (they have onDelete: NoAction)
    await Promise.all([
      db.articleTag.deleteMany({ where: { articleId: id } }),
      db.articleVersion.deleteMany({ where: { articleId: id } }),
      db.fAQ.deleteMany({ where: { articleId: id } }),
      db.relatedArticle.deleteMany({
        where: {
          OR: [{ articleId: id }, { relatedId: id }],
        },
      }),
      db.analytics.deleteMany({ where: { articleId: id } }),
    ]);

    // Now delete the article
    await db.article.delete({
      where: { id },
    });
    revalidatePath("/articles");
    return { success: true };
  } catch (error) {
    console.error("Error deleting article:", error);
    const message = error instanceof Error ? error.message : "Failed to delete article";
    return { success: false, error: message };
  }
}

export async function duplicateArticle(id: string) {
  try {
    const original = await db.article.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });

    if (!original) {
      return { success: false, error: "Article not found" };
    }

    // Create new article with copy suffix
    const newArticle = await db.article.create({
      data: {
        title: `${original.title} (Copy)`,
        slug: `${original.slug}-copy-${Date.now()}`,
        excerpt: original.excerpt,
        content: original.content,
        contentFormat: original.contentFormat,
        clientId: original.clientId,
        categoryId: original.categoryId,
        authorId: original.authorId,
        status: ArticleStatus.DRAFT,
        featuredImageId: original.featuredImageId,
        seoTitle: original.seoTitle,
        seoDescription: original.seoDescription,
        metaRobots: original.metaRobots,
        ogTitle: original.ogTitle,
        ogDescription: original.ogDescription,
        ogImage: original.ogImage,
        twitterCard: original.twitterCard,
        twitterTitle: original.twitterTitle,
        twitterDescription: original.twitterDescription,
        twitterImage: original.twitterImage,
        canonicalUrl: original.canonicalUrl,
        featuredImageAlt: original.featuredImageAlt,
      },
    });

    // Duplicate tags if any
    if (original.tags.length > 0) {
      await db.articleTag.createMany({
        data: original.tags.map((tag) => ({
          articleId: newArticle.id,
          tagId: tag.tagId,
        })),
      });
    }

    revalidatePath("/articles");
    return { success: true, article: newArticle };
  } catch (error) {
    console.error("Error duplicating article:", error);
    const message = error instanceof Error ? error.message : "Failed to duplicate article";
    return { success: false, error: message };
  }
}

export async function getClients() {
  try {
    return await db.client.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function getCategories() {
  try {
    return await db.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getAuthors() {
  try {
    return await db.author.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

export async function getArticlesStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, published, draft, scheduled, archived, publishedThisMonth, allArticles] =
      await Promise.all([
        db.article.count(),
        db.article.count({ where: { status: ArticleStatus.PUBLISHED } }),
        db.article.count({ where: { status: ArticleStatus.DRAFT } }),
        db.article.count({ where: { scheduledAt: { not: null }, status: { not: ArticleStatus.PUBLISHED } } }),
        db.article.count({ where: { status: ArticleStatus.ARCHIVED } }),
        db.article.count({
          where: {
            status: ArticleStatus.PUBLISHED,
            datePublished: { gte: startOfMonth },
          },
        }),
        db.article.findMany({
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            content: true,
            seoTitle: true,
            seoDescription: true,
            ogTitle: true,
            ogDescription: true,
            ogImage: true,
            ogImageAlt: true,
            ogImageWidth: true,
            ogImageHeight: true,
            twitterCard: true,
            twitterTitle: true,
            twitterDescription: true,
            twitterImage: true,
            twitterImageAlt: true,
            canonicalUrl: true,
            featuredImageAlt: true,
          },
        }),
      ]);

    let averageSEO = 0;
    if (allArticles.length > 0) {
      const scores = allArticles.map((article) => {
        const scoreResult = calculateSEOScore(article, articleSEOConfig);
        return scoreResult.percentage;
      });
      averageSEO = Math.round(
        scores.reduce((sum, score) => sum + score, 0) / scores.length
      );
    }

    return {
      total,
      published,
      draft,
      scheduled,
      archived,
      publishedThisMonth,
      averageSEO,
    };
  } catch (error) {
    console.error("Error fetching articles stats:", error);
    return {
      total: 0,
      published: 0,
      draft: 0,
      scheduled: 0,
      archived: 0,
      publishedThisMonth: 0,
      averageSEO: 0,
    };
  }
}

export async function bulkDeleteArticles(articleIds: string[]) {
  try {
    // Delete related records first (they have onDelete: NoAction)
    await Promise.all([
      db.articleTag.deleteMany({ where: { articleId: { in: articleIds } } }),
      db.articleVersion.deleteMany({ where: { articleId: { in: articleIds } } }),
      db.fAQ.deleteMany({ where: { articleId: { in: articleIds } } }),
      db.relatedArticle.deleteMany({
        where: {
          OR: [
            { articleId: { in: articleIds } },
            { relatedId: { in: articleIds } },
          ],
        },
      }),
      db.analytics.deleteMany({ where: { articleId: { in: articleIds } } }),
    ]);

    // Now delete the articles
    await db.article.deleteMany({
      where: {
        id: { in: articleIds },
      },
    });
    revalidatePath("/articles");
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting articles:", error);
    const message = error instanceof Error ? error.message : "Failed to delete articles";
    return { success: false, error: message };
  }
}

export async function bulkUpdateArticleStatus(articleIds: string[], status: ArticleStatus) {
  try {
    await db.article.updateMany({
      where: {
        id: { in: articleIds },
      },
      data: {
        status,
        datePublished: status === ArticleStatus.PUBLISHED ? new Date() : undefined,
      },
    });
    revalidatePath("/articles");
    return { success: true };
  } catch (error) {
    console.error("Error bulk updating article status:", error);
    const message = error instanceof Error ? error.message : "Failed to update article status";
    return { success: false, error: message };
  }
}
