"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma, ArticleStatus } from "@prisma/client";
import { calculateSEOScore } from "@/helpers/utils/seo-score-calculator";
import { authorSEOConfig } from "../helpers/author-seo-config";

export interface AuthorFilters {
  createdFrom?: Date;
  createdTo?: Date;
  minArticleCount?: number;
  maxArticleCount?: number;
  hasArticles?: boolean;
  search?: string;
}

export async function getAuthors(filters?: AuthorFilters) {
  try {
    const where: Prisma.AuthorWhereInput = {};

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

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
        { jobTitle: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const authors = await db.author.findMany({
      where,
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: { name: "asc" },
    });

    let filteredAuthors = authors;

    if (filters?.minArticleCount !== undefined || filters?.maxArticleCount !== undefined) {
      filteredAuthors = authors.filter((author) => {
        const articleCount = author._count.articles;
        if (filters.minArticleCount !== undefined && articleCount < filters.minArticleCount) {
          return false;
        }
        if (filters.maxArticleCount !== undefined && articleCount > filters.maxArticleCount) {
          return false;
        }
        return true;
      });
    }

    return filteredAuthors;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

export async function getAuthorById(id: string) {
  try {
    return await db.author.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
}

export async function getAuthorArticles(authorId: string) {
  try {
    const { getArticles } = await import("@/app/(dashboard)/articles/actions/articles-actions");
    return await getArticles({ authorId });
  } catch (error) {
    console.error("Error fetching author articles:", error);
    return [];
  }
}

export async function createAuthor(data: {
  name: string;
  slug: string;
  jobTitle?: string;
  worksFor?: string;
  bio?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  sameAs?: string[];
  credentials?: string[];
  qualifications?: string[];
  expertiseAreas?: string[];
  experienceYears?: number;
  verificationStatus?: boolean;
  education?: Array<Record<string, string | number | boolean>>;
  userId?: string;
  seoTitle?: string;
  seoDescription?: string;
}) {
  try {
    const author = await db.author.create({
      data: {
        name: data.name,
        slug: data.slug,
        jobTitle: data.jobTitle,
        worksFor: data.worksFor || null,
        bio: data.bio,
        image: data.image,
        imageAlt: data.imageAlt || null,
        url: data.url,
        linkedIn: data.linkedIn,
        twitter: data.twitter,
        facebook: data.facebook,
        sameAs: data.sameAs || [],
        credentials: data.credentials || [],
        qualifications: data.qualifications || [],
        expertiseAreas: data.expertiseAreas || [],
        experienceYears: data.experienceYears,
        verificationStatus: data.verificationStatus || false,
        education: data.education ? (JSON.parse(JSON.stringify(data.education)) as Prisma.InputJsonValue) : null,
        userId: data.userId || null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      },
    });
    revalidatePath("/authors");
    return { success: true, author };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create author";
    return { success: false, error: message };
  }
}

export async function updateAuthor(
  id: string,
  data: {
    name: string;
    slug: string;
    jobTitle?: string;
    worksFor?: string;
    bio?: string;
    image?: string;
    imageAlt?: string;
    url?: string;
    linkedIn?: string;
    twitter?: string;
    facebook?: string;
    sameAs?: string[];
    credentials?: string[];
    qualifications?: string[];
    expertiseAreas?: string[];
    experienceYears?: number;
    verificationStatus?: boolean;
    education?: Array<Record<string, string | number | boolean>>;
    userId?: string;
    seoTitle?: string;
    seoDescription?: string;
  }
) {
  try {
    const author = await db.author.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        jobTitle: data.jobTitle,
        worksFor: data.worksFor || null,
        bio: data.bio,
        image: data.image,
        imageAlt: data.imageAlt || null,
        url: data.url,
        linkedIn: data.linkedIn,
        twitter: data.twitter,
        facebook: data.facebook,
        sameAs: data.sameAs || [],
        credentials: data.credentials || [],
        qualifications: data.qualifications || [],
        expertiseAreas: data.expertiseAreas || [],
        experienceYears: data.experienceYears,
        verificationStatus: data.verificationStatus || false,
        education: data.education ? (JSON.parse(JSON.stringify(data.education)) as Prisma.InputJsonValue) : null,
        userId: data.userId || null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      },
    });
    revalidatePath("/authors");
    return { success: true, author };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update author";
    return { success: false, error: message };
  }
}

export async function deleteAuthor(id: string) {
  try {
    const author = await db.author.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!author) {
      return { success: false, error: "Author not found" };
    }

    if (author._count.articles > 0) {
      return {
        success: false,
        error: `Cannot delete author. This author has ${author._count.articles} article(s). Please delete or reassign the articles first.`,
      };
    }

    await db.author.delete({ where: { id } });
    revalidatePath("/authors");
    return { success: true };
  } catch (error) {
    console.error("Error deleting author:", error);
    const message = error instanceof Error ? error.message : "Failed to delete author";
    return { success: false, error: message };
  }
}

export async function bulkDeleteAuthors(authorIds: string[]) {
  try {
    if (authorIds.length === 0) {
      return { success: false, error: "No authors selected" };
    }

    const authors = await db.author.findMany({
      where: {
        id: { in: authorIds },
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    const authorsWithArticles = authors.filter((author) => author._count.articles > 0);

    if (authorsWithArticles.length > 0) {
      const authorNames = authorsWithArticles.map((a) => a.name).join(", ");
      const totalArticles = authorsWithArticles.reduce((sum, a) => sum + a._count.articles, 0);
      return {
        success: false,
        error: `Cannot delete ${authorsWithArticles.length} author${authorsWithArticles.length === 1 ? "" : "s"} with articles: ${authorNames}. Total articles: ${totalArticles}. Please delete or reassign the articles first.`,
      };
    }

    await db.author.deleteMany({
      where: {
        id: { in: authorIds },
      },
    });

    revalidatePath("/authors");
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting authors:", error);
    const message = error instanceof Error ? error.message : "Failed to delete authors";
    return { success: false, error: message };
  }
}

export async function getClients() {
  try {
    return await db.client.findMany({ orderBy: { name: "asc" } });
  } catch (error) {
    return [];
  }
}

export async function getAuthorsStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, withArticles, withoutArticles, createdThisMonth, allAuthors] =
      await Promise.all([
        db.author.count(),
        db.author.count({
          where: {
            articles: {
              some: {
                status: ArticleStatus.PUBLISHED,
              },
            },
          },
        }),
        db.author.count({
          where: {
            articles: {
              none: {},
            },
          },
        }),
        db.author.count({
          where: {
            createdAt: { gte: startOfMonth },
          },
        }),
        db.author.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            jobTitle: true,
            worksFor: true,
            bio: true,
            image: true,
            imageAlt: true,
            url: true,
            linkedIn: true,
            twitter: true,
            facebook: true,
            sameAs: true,
            credentials: true,
            qualifications: true,
            expertiseAreas: true,
            experienceYears: true,
            verificationStatus: true,
            seoTitle: true,
            seoDescription: true,
          },
        }),
      ]);

    let averageSEO = 0;
    if (allAuthors.length > 0) {
      const scores = allAuthors.map((author) => {
        const scoreResult = calculateSEOScore(author, authorSEOConfig);
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
    console.error("Error fetching authors stats:", error);
    return {
      total: 0,
      withArticles: 0,
      withoutArticles: 0,
      createdThisMonth: 0,
      averageSEO: 0,
    };
  }
}

