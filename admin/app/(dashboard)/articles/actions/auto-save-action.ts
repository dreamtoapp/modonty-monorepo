"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ArticleStatus } from "@prisma/client";
import type { ArticleFormData } from "@/lib/types/form-types";

export async function autoSaveArticle(data: ArticleFormData, articleId?: string) {
  try {
    if (!data.slug) {
      return { success: false, error: "Slug is required" };
    }

    if (!data.clientId || !data.authorId) {
      return { success: false, error: "Client and Author are required" };
    }

    const articleData = {
      title: data.title || "",
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content || "",
      contentFormat: data.contentFormat || "rich_text",
      clientId: data.clientId,
      categoryId: data.categoryId || null,
      authorId: data.authorId,
      status: ArticleStatus.WRITING,
      featured: data.featured || false,
      scheduledAt: data.scheduledAt || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      metaRobots: data.metaRobots || "index, follow",
      ogType: "article",
      ogUpdatedTime: new Date(),
      ogArticleAuthor: data.ogArticleAuthor || null,
      ogArticlePublishedTime: null,
      ogArticleModifiedTime: new Date(),
      twitterCard: data.twitterCard || "summary_large_image",
      twitterSite: data.twitterSite || null,
      twitterCreator: data.twitterCreator || null,
      twitterLabel1: data.twitterLabel1 || null,
      twitterData1: data.twitterData1 || null,
      canonicalUrl: data.canonicalUrl || null,
      alternateLanguages: data.alternateLanguages || [],
      robotsMeta: null,
      sitemapPriority: data.sitemapPriority || 0.5,
      sitemapChangeFreq: data.sitemapChangeFreq || "weekly",
      breadcrumbPath: null,
      featuredImageId: data.featuredImageId || null,
      featuredImageAlt: null,
      inLanguage: data.ogLocale?.split("_")[0] || "ar",
      isAccessibleForFree: true,
      license: data.license || null,
      lastReviewed: data.lastReviewed || null,
      wordCount: null,
      readingTimeMinutes: null,
      contentDepth: null,
      mainEntityOfPage: data.canonicalUrl || null,
    };

    let savedArticle;

    if (articleId) {
      savedArticle = await db.article.update({
        where: { id: articleId },
        data: articleData,
      });
    } else {
      savedArticle = await db.article.create({
        data: articleData,
      });
    }

    if (data.tags && data.tags.length > 0) {
      const tagIds: string[] = [];
      for (const tagName of data.tags) {
        let tag = await db.tag.findFirst({
          where: { name: tagName },
        });

        if (!tag) {
          tag = await db.tag.create({
            data: { name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, "-") },
          });
        }
        if (tag) tagIds.push(tag.id);
      }

      await db.articleTag.deleteMany({
        where: { articleId: savedArticle.id },
      });

      await db.articleTag.createMany({
        data: tagIds.map((tagId) => ({
          articleId: savedArticle.id,
          tagId,
        })),
      });
    }

    if (data.faqs && data.faqs.length > 0) {
      await db.articleFAQ.deleteMany({
        where: { articleId: savedArticle.id },
      });

      await db.articleFAQ.createMany({
        data: data.faqs.map((faq, index) => ({
          articleId: savedArticle.id,
          question: faq.question,
          answer: faq.answer,
          position: index,
        })),
      });
    }

    revalidatePath("/articles");
    revalidatePath(`/articles/${savedArticle.slug}`);

    return {
      success: true,
      data: {
        id: savedArticle.id,
        slug: savedArticle.slug,
      },
    };
  } catch (error) {
    console.error("Auto-save error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to auto-save article",
    };
  }
}