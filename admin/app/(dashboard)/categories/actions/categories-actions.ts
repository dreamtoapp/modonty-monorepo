"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma, ArticleStatus } from "@prisma/client";
import { calculateSEOScore } from "@/helpers/utils/seo-score-calculator";
import { categorySEOConfig } from "../helpers/category-seo-config";

export interface CategoryFilters {
  createdFrom?: Date;
  createdTo?: Date;
  minArticleCount?: number;
  maxArticleCount?: number;
  hasArticles?: boolean;
  search?: string;
  parentId?: string;
}

export async function getCategories(filters?: CategoryFilters) {
  try {
    const where: Prisma.CategoryWhereInput = {};

    if (filters?.createdFrom || filters?.createdTo) {
      where.createdAt = {};
      if (filters.createdFrom) {
        where.createdAt.gte = filters.createdFrom;
      }
      if (filters.createdTo) {
        where.createdAt.lte = filters.createdTo;
      }
    }

    if (filters?.hasArticles !== undefined) {
      if (filters.hasArticles) {
        where.articles = {
          some: {
            status: ArticleStatus.PUBLISHED,
          },
        };
      } else {
        where.articles = {
          none: {},
        };
      }
    }

    if (filters?.parentId !== undefined) {
      where.parentId = filters.parentId || null;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const categories = await db.category.findMany({
      where,
      include: {
        parent: { select: { name: true } },
        _count: { select: { articles: true } },
      },
      orderBy: { name: "asc" },
    });

    let filteredCategories = categories;

    if (filters?.minArticleCount !== undefined || filters?.maxArticleCount !== undefined) {
      filteredCategories = categories.filter((category) => {
        const articleCount = category._count.articles;
        if (filters.minArticleCount !== undefined && articleCount < filters.minArticleCount) {
          return false;
        }
        if (filters.maxArticleCount !== undefined && articleCount > filters.maxArticleCount) {
          return false;
        }
        return true;
      });
    }

    return filteredCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryById(id: string) {
  try {
    return await db.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            articles: true,
            children: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function getCategoryArticles(categoryId: string) {
  try {
    const { getArticles } = await import("@/app/(dashboard)/articles/actions/articles-actions");
    return await getArticles({ categoryId });
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return [];
  }
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  canonicalUrl?: string;
}) {
  try {
    const category = await db.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        ogImage: data.ogImage,
        ogImageAlt: data.ogImageAlt,
        ogImageWidth: data.ogImageWidth,
        ogImageHeight: data.ogImageHeight,
        twitterCard: data.twitterCard,
        twitterTitle: data.twitterTitle,
        twitterDescription: data.twitterDescription,
        twitterImage: data.twitterImage,
        twitterImageAlt: data.twitterImageAlt,
        canonicalUrl: data.canonicalUrl,
      },
    });
    revalidatePath("/categories");
    return { success: true, category };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create category";
    return { success: false, error: message };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
    ogImageAlt?: string;
    ogImageWidth?: number;
    ogImageHeight?: number;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    twitterImageAlt?: string;
    canonicalUrl?: string;
  }
) {
  try {
    const category = await db.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        ogImage: data.ogImage,
        ogImageAlt: data.ogImageAlt,
        ogImageWidth: data.ogImageWidth,
        ogImageHeight: data.ogImageHeight,
        twitterCard: data.twitterCard,
        twitterTitle: data.twitterTitle,
        twitterDescription: data.twitterDescription,
        twitterImage: data.twitterImage,
        twitterImageAlt: data.twitterImageAlt,
        canonicalUrl: data.canonicalUrl,
      },
    });
    revalidatePath("/categories");
    return { success: true, category };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update category";
    return { success: false, error: message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    if (category._count.articles > 0 || category._count.children > 0) {
      const errors: string[] = [];
      if (category._count.articles > 0) {
        errors.push(`${category._count.articles} article(s)`);
      }
      if (category._count.children > 0) {
        errors.push(`${category._count.children} child categor${category._count.children === 1 ? "y" : "ies"}`);
      }
      return {
        success: false,
        error: `Cannot delete category. This category has ${errors.join(" and ")}. Please delete or reassign them first.`,
      };
    }

    await db.category.delete({ where: { id } });
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    const message = error instanceof Error ? error.message : "Failed to delete category";
    return { success: false, error: message };
  }
}

export async function bulkDeleteCategories(categoryIds: string[]) {
  try {
    if (categoryIds.length === 0) {
      return { success: false, error: "No categories selected" };
    }

    const categories = await db.category.findMany({
      where: {
        id: { in: categoryIds },
      },
      include: {
        _count: {
          select: {
            articles: true,
            children: true,
          },
        },
      },
    });

    const categoriesWithDependencies = categories.filter(
      (category) => category._count.articles > 0 || category._count.children > 0
    );

    if (categoriesWithDependencies.length > 0) {
      const categoryNames = categoriesWithDependencies.map((c) => c.name).join(", ");
      const totalArticles = categoriesWithDependencies.reduce((sum, c) => sum + c._count.articles, 0);
      const totalChildren = categoriesWithDependencies.reduce((sum, c) => sum + c._count.children, 0);
      return {
        success: false,
        error: `Cannot delete ${categoriesWithDependencies.length} categor${categoriesWithDependencies.length === 1 ? "y" : "ies"} with dependencies: ${categoryNames}. Total articles: ${totalArticles}, Total child categories: ${totalChildren}. Please delete or reassign the dependencies first.`,
      };
    }

    await db.category.deleteMany({
      where: {
        id: { in: categoryIds },
      },
    });

    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting categories:", error);
    const message = error instanceof Error ? error.message : "Failed to delete categories";
    return { success: false, error: message };
  }
}

export async function getCategoriesStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, withArticles, withoutArticles, createdThisMonth, allCategories] =
      await Promise.all([
        db.category.count(),
        db.category.count({
          where: {
            articles: {
              some: {
                status: ArticleStatus.PUBLISHED,
              },
            },
          },
        }),
        db.category.count({
          where: {
            articles: {
              none: {},
            },
          },
        }),
        db.category.count({
          where: {
            createdAt: { gte: startOfMonth },
          },
        }),
        db.category.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            seoTitle: true,
            seoDescription: true,
          },
        }),
      ]);

    let averageSEO = 0;
    if (allCategories.length > 0) {
      const scores = allCategories.map((category) => {
        const scoreResult = calculateSEOScore(category, categorySEOConfig);
        return scoreResult.percentage;
      });
      averageSEO = Math.round(
        scores.reduce((sum, score) => sum + score, 0) / scores.length
      );
    }

    return {
      total,
      withArticles,
      withoutArticles,
      createdThisMonth,
      averageSEO,
    };
  } catch (error) {
    console.error("Error fetching categories stats:", error);
    return {
      total: 0,
      withArticles: 0,
      withoutArticles: 0,
      createdThisMonth: 0,
      averageSEO: 0,
    };
  }
}

