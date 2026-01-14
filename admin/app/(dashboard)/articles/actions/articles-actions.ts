"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ArticleStatus, Prisma } from "@prisma/client";
import {
  calculateWordCountImproved,
  calculateReadingTime,
  determineContentDepth,
  generateSEOTitle,
  generateSEODescription,
  generateCanonicalUrl,
  generateBreadcrumbPath,
} from "../helpers/seo-helpers";
import { ArticleFormData, FAQItem } from "@/lib/types";
import { calculateSEOScore } from "@/helpers/utils/seo-score-calculator";
import { articleSEOConfig } from "../helpers/article-seo-config";
import { generateAndSaveNextjsMetadata } from "@/lib/seo/metadata-storage";
import { generateAndSaveJsonLd } from "@/lib/seo/jsonld-storage";

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
      ArticleStatus.WRITING,
      ArticleStatus.DRAFT,
      ArticleStatus.SCHEDULED,
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

export interface ArticleSelectionFilters {
  excludeArticleId?: string;
  categoryId?: string;
  tagIds?: string[];
  search?: string;
  status?: ArticleStatus[];
}

export interface ArticleSelectionItem {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  categoryId?: string | null;
  categoryName?: string | null;
  tags: Array<{ id: string; name: string }>;
  status: ArticleStatus;
  datePublished: Date | null;
}

export async function getArticlesForSelection(filters?: ArticleSelectionFilters): Promise<ArticleSelectionItem[]> {
  try {
    const where: Prisma.ArticleWhereInput = {
      ...(filters?.excludeArticleId ? { id: { not: filters.excludeArticleId } } : {}),
      ...(filters?.status && filters.status.length > 0
        ? { status: { in: filters.status } }
        : { status: ArticleStatus.PUBLISHED }),
      ...(filters?.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters?.tagIds && filters.tagIds.length > 0
        ? {
            tags: {
              some: {
                tagId: { in: filters.tagIds },
              },
            },
          }
        : {}),
      ...(filters?.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: 'insensitive' } },
              { slug: { contains: filters.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const articles = await db.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        datePublished: true,
        categoryId: true,
        client: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 500,
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      clientName: article.client.name,
      categoryId: article.categoryId,
      categoryName: article.category?.name || null,
      tags: article.tags.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
      })),
      status: article.status,
      datePublished: article.datePublished,
    }));
  } catch (error) {
    console.error('Error fetching articles for selection:', error);
    return [];
  }
}

export async function getArticleById(id: string) {
  try {
    const article = await db.article.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            logoMedia: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
        featuredImage: {
          select: {
            id: true,
            url: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        faqs: {
          orderBy: {
            position: "asc",
          },
        },
        gallery: {
          include: {
            media: {
              select: {
                id: true,
                url: true,
                altText: true,
                width: true,
                height: true,
                filename: true,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
        relatedTo: {
          include: {
            related: {
              select: {
                id: true,
                title: true,
                slug: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                tags: {
                  select: {
                    tag: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        relatedFrom: {
          include: {
            article: {
              select: {
                id: true,
                title: true,
                slug: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                tags: {
                  select: {
                    tag: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        versions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    // Filter out articles with invalid status (shouldn't happen after migration)
    const validStatuses = [
      ArticleStatus.WRITING,
      ArticleStatus.DRAFT,
      ArticleStatus.SCHEDULED,
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

export async function getArticleBySlug(slug: string, clientId?: string) {
  try {
    const article = await db.article.findFirst({
      where: {
        slug,
        ...(clientId && { clientId }),
      },
      include: {
        client: {
          include: {
            logoMedia: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
        featuredImage: {
          select: {
            id: true,
            url: true,
            altText: true,
            width: true,
            height: true,
            filename: true,
          },
        },
        faqs: {
          orderBy: {
            position: "asc",
          },
        },
        gallery: {
          include: {
            media: {
              select: {
                id: true,
                url: true,
                altText: true,
                width: true,
                height: true,
                filename: true,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
    
    if (!article) {
      return null;
    }

    const validStatuses = [
      ArticleStatus.WRITING,
      ArticleStatus.DRAFT,
      ArticleStatus.SCHEDULED,
      ArticleStatus.PUBLISHED,
      ArticleStatus.ARCHIVED,
    ];
    
    if (!validStatuses.includes(article.status)) {
      console.warn(`Article ${slug} has invalid status: ${article.status}`);
      return null;
    }
    
    return article;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
}

export async function createArticle(data: ArticleFormData) {
  try {
    // Validate required fields before processing
    if (!data.title || data.title.trim().length === 0) {
      return {
        success: false,
        error: "العنوان مطلوب",
      };
    }

    if (!data.content || data.content.trim().length === 0) {
      return {
        success: false,
        error: "المحتوى مطلوب",
      };
    }

    if (!data.clientId) {
      return {
        success: false,
        error: "العميل مطلوب",
      };
    }

    if (!data.slug || data.slug.trim().length === 0) {
      return {
        success: false,
        error: "الرابط المختصر مطلوب",
      };
    }

    const { getModontyAuthor } = await import("@/app/(dashboard)/authors/actions/authors-actions");
    const modontyAuthor = await getModontyAuthor();
    if (!modontyAuthor) {
      return {
        success: false,
        error: "Modonty author not found. Please ensure the author is set up.",
      };
    }

    const client = await db.client.findUnique({
      where: { id: data.clientId },
      select: { name: true, slug: true },
    });

    const category = data.categoryId
      ? await db.category.findUnique({
          where: { id: data.categoryId },
          select: { name: true, slug: true },
        })
      : null;

    const wordCount = data.wordCount || calculateWordCountImproved(data.content, data.inLanguage || "ar");
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

    const metaRobots =
      data.metaRobots ||
      (data.status === ArticleStatus.PUBLISHED
        ? "index, follow"
        : "noindex, follow");

    const sitemapPriority = data.sitemapPriority || (data.featured ? 0.8 : 0.5);

    // Validate status enum if provided, then always use WRITING for new articles
    if (data.status && !Object.values(ArticleStatus).includes(data.status as ArticleStatus)) {
      return {
        success: false,
        error: "Invalid status value. Status must be a valid ArticleStatus enum value.",
      };
    }
    const finalStatus = ArticleStatus.WRITING;

    const article = await db.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        contentFormat: data.contentFormat || "rich_text",
        clientId: data.clientId,
        categoryId: data.categoryId || null,
        authorId: modontyAuthor.id,
        status: finalStatus,
        scheduledAt: data.scheduledAt || null,
        featured: data.featured || false,
        featuredImageId: data.featuredImageId || null,
        datePublished,
        wordCount,
        readingTimeMinutes,
        contentDepth,
        inLanguage: "ar",
        isAccessibleForFree: true,
        license: data.license || null,
        lastReviewed: data.lastReviewed || null,
        mainEntityOfPage: canonicalUrl,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        metaRobots,
        ogType: data.ogType || "article",
        ogArticleAuthor: data.ogArticleAuthor || null,
        ogArticlePublishedTime: datePublished,
        ogArticleModifiedTime: new Date(),
        twitterCard: data.twitterCard || "summary_large_image",
        twitterSite: data.twitterSite || null,
        twitterCreator: data.twitterCreator || null,
        canonicalUrl,
        sitemapPriority,
        sitemapChangeFreq: data.sitemapChangeFreq || "weekly",
        breadcrumbPath: JSON.parse(JSON.stringify(breadcrumbPath)) as Prisma.InputJsonValue,
      },
    });

    if (data.tags && data.tags.length > 0) {
      // Save tags with error handling - if one fails, continue with others
      for (const tagId of data.tags) {
        try {
          await db.articleTag.create({
            data: {
              articleId: article.id,
              tagId: tagId,
            },
          });
        } catch (error) {
          // Log tag creation error but don't fail article save
          console.error(`Failed to create tag ${tagId} for article ${article.id}:`, error);
          // Continue with next tag
        }
      }
    }

    if (data.faqs && data.faqs.length > 0) {
      await db.articleFAQ.createMany({
        data: data.faqs.map((faq: FAQItem, index: number) => ({
          articleId: article.id,
          question: faq.question,
          answer: faq.answer,
          position: faq.position ?? index,
        })),
      });
    }

    // Process gallery items
    if (data.gallery && data.gallery.length > 0) {
      await db.$transaction(
        data.gallery.map((item, index) =>
          db.articleMedia.create({
            data: {
              articleId: article.id,
              mediaId: item.mediaId,
              position: item.position ?? index,
              caption: item.caption || null,
              altText: item.altText || null,
            },
          })
        )
      );
    }

    // Process related articles
    if (data.relatedArticles && data.relatedArticles.length > 0) {
      await db.relatedArticle.createMany({
        data: data.relatedArticles.map((rel) => ({
          articleId: article.id,
          relatedId: rel.relatedId,
          relationshipType: rel.relationshipType || 'related',
        })),
      });
    }

    // Generate and save Next.js Metadata and JSON-LD (non-blocking)
    try {
      // Generate Next.js Metadata
      await generateAndSaveNextjsMetadata(article.id, {
        robots: metaRobots,
      });

      // Generate JSON-LD
      await generateAndSaveJsonLd(article.id);
    } catch (error) {
      // Log error but don't fail article creation
      console.error('Failed to generate metadata/JSON-LD for article:', article.id, error);
      // Article still saved successfully
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

export async function updateArticle(articleId: string, data: ArticleFormData) {
  try {
    // Validate required fields before processing
    if (!data.title || data.title.trim().length === 0) {
      return {
        success: false,
        error: "العنوان مطلوب",
      };
    }

    if (!data.content || data.content.trim().length === 0) {
      return {
        success: false,
        error: "المحتوى مطلوب",
      };
    }

    if (!data.clientId) {
      return {
        success: false,
        error: "العميل مطلوب",
      };
    }

    if (!data.slug || data.slug.trim().length === 0) {
      return {
        success: false,
        error: "الرابط المختصر مطلوب",
      };
    }

    // Get existing article to preserve authorId and other fields
    const existingArticle = await db.article.findUnique({
      where: { id: articleId },
      select: { authorId: true, ogArticlePublishedTime: true },
    });

    if (!existingArticle) {
      return {
        success: false,
        error: "المقال غير موجود",
      };
    }

    const client = await db.client.findUnique({
      where: { id: data.clientId },
      select: { name: true, slug: true },
    });

    const category = data.categoryId
      ? await db.category.findUnique({
          where: { id: data.categoryId },
          select: { name: true, slug: true },
        })
      : null;

    const wordCount = data.wordCount || calculateWordCountImproved(data.content, data.inLanguage || "ar");
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

    const datePublished = data.datePublished || null;

    const metaRobots =
      data.metaRobots ||
      (data.status === ArticleStatus.PUBLISHED
        ? "index, follow"
        : "noindex, follow");

    const sitemapPriority = data.sitemapPriority || (data.featured ? 0.8 : 0.5);

    // Validate status enum
    if (data.status && !Object.values(ArticleStatus).includes(data.status as ArticleStatus)) {
      return {
        success: false,
        error: "Invalid status value. Status must be a valid ArticleStatus enum value.",
      };
    }

    const article = await db.article.update({
      where: { id: articleId },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        contentFormat: data.contentFormat || "rich_text",
        clientId: data.clientId,
        categoryId: data.categoryId || null,
        authorId: existingArticle.authorId,
        status: data.status,
        scheduledAt: data.scheduledAt || null,
        featured: data.featured || false,
        featuredImageId: data.featuredImageId || null,
        datePublished,
        wordCount,
        readingTimeMinutes,
        contentDepth,
        inLanguage: data.inLanguage || "ar",
        isAccessibleForFree: data.isAccessibleForFree ?? true,
        license: data.license || null,
        lastReviewed: data.lastReviewed || null,
        mainEntityOfPage: canonicalUrl,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        metaRobots,
        ogType: data.ogType || "article",
        ogArticleAuthor: data.ogArticleAuthor || null,
        ogArticlePublishedTime: existingArticle.ogArticlePublishedTime,
        ogArticleModifiedTime: new Date(),
        twitterCard: data.twitterCard || "summary_large_image",
        twitterSite: data.twitterSite || null,
        twitterCreator: data.twitterCreator || null,
        canonicalUrl,
        sitemapPriority,
        sitemapChangeFreq: data.sitemapChangeFreq || "weekly",
        breadcrumbPath: JSON.parse(JSON.stringify(breadcrumbPath)) as Prisma.InputJsonValue,
      },
    });

    // Update tags (deleteMany + createMany)
    await db.articleTag.deleteMany({
      where: { articleId: article.id },
    });

    if (data.tags && data.tags.length > 0) {
      for (const tagId of data.tags) {
        try {
          await db.articleTag.create({
            data: {
              articleId: article.id,
              tagId: tagId,
            },
          });
        } catch (error) {
          console.error(`Failed to create tag ${tagId} for article ${article.id}:`, error);
        }
      }
    }

    // Update FAQs (deleteMany + createMany)
    await db.articleFAQ.deleteMany({
      where: { articleId: article.id },
    });

    if (data.faqs && data.faqs.length > 0) {
      await db.articleFAQ.createMany({
        data: data.faqs.map((faq: FAQItem, index: number) => ({
          articleId: article.id,
          question: faq.question,
          answer: faq.answer,
          position: faq.position ?? index,
        })),
      });
    }

    // Update gallery (deleteMany + createMany)
    await db.articleMedia.deleteMany({
      where: { articleId: article.id },
    });

    if (data.gallery && data.gallery.length > 0) {
      await db.$transaction(
        data.gallery.map((item, index) =>
          db.articleMedia.create({
            data: {
              articleId: article.id,
              mediaId: item.mediaId,
              position: item.position ?? index,
              caption: item.caption || null,
              altText: item.altText || null,
            },
          })
        )
      );
    }

    // Update related articles (deleteMany + createMany)
    await db.relatedArticle.deleteMany({
      where: { articleId: article.id },
    });

    if (data.relatedArticles && data.relatedArticles.length > 0) {
      await db.relatedArticle.createMany({
        data: data.relatedArticles.map((rel) => ({
          articleId: article.id,
          relatedId: rel.relatedId,
          relationshipType: rel.relationshipType || 'related',
        })),
      });
    }

    // Generate and save Next.js Metadata and JSON-LD (non-blocking)
    try {
      await generateAndSaveNextjsMetadata(article.id, {
        robots: metaRobots,
      });

      await generateAndSaveJsonLd(article.id);
    } catch (error) {
      console.error('Failed to generate metadata/JSON-LD for article:', article.id, error);
    }

    revalidatePath("/articles");
    revalidatePath(`/articles/${article.id}`);
    revalidatePath(`/articles/${article.slug}`);
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

export async function deleteArticle(id: string) {
  try {
    // Delete related records first (they have onDelete: NoAction)
    await Promise.all([
      db.articleTag.deleteMany({ where: { articleId: id } }),
      db.articleVersion.deleteMany({ where: { articleId: id } }),
      db.articleFAQ.deleteMany({ where: { articleId: id } }),
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
    const { getModontyAuthor } = await import("@/app/(dashboard)/authors/actions/authors-actions");
    const modontyAuthor = await getModontyAuthor();
    return modontyAuthor ? [{ id: modontyAuthor.id, name: modontyAuthor.name }] : [];
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
            featuredImage: {
              select: {
                id: true,
                url: true,
                altText: true,
                width: true,
                height: true,
              },
            },
            twitterCard: true,
            canonicalUrl: true,
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
      db.articleFAQ.deleteMany({ where: { articleId: { in: articleIds } } }),
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
