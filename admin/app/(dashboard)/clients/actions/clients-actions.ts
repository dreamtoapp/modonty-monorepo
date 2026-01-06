"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ArticleStatus, Prisma, SubscriptionTier, SubscriptionStatus, PaymentStatus } from "@prisma/client";
import { ClientFormData } from "@/lib/types";
import { calculateSEOScore } from "@/helpers/utils/seo-score-calculator";
import { organizationSEOConfig } from "../helpers/client-seo-config";

/**
 * Validates and normalizes social profile URLs on server side
 */
function validateAndNormalizeUrls(urls: string[] | undefined): string[] {
  if (!urls || !Array.isArray(urls)) return [];

  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const url of urls) {
    if (!url || typeof url !== "string") continue;

    const trimmed = url.trim();
    if (!trimmed) continue;

    // Normalize URL (add https:// if missing)
    let normalizedUrl: string;
    try {
      if (/^https?:\/\//i.test(trimmed)) {
        normalizedUrl = trimmed;
      } else {
        normalizedUrl = `https://${trimmed}`;
      }

      // Validate URL format
      const urlObj = new URL(normalizedUrl);
      if (!["http:", "https:"].includes(urlObj.protocol)) continue;
      if (!urlObj.hostname || urlObj.hostname.length === 0) continue;
      if (normalizedUrl.length > 2048) continue;

      // Check for duplicates (case-insensitive)
      const lowerUrl = normalizedUrl.toLowerCase();
      if (seen.has(lowerUrl)) continue;
      seen.add(lowerUrl);

      normalized.push(normalizedUrl);
    } catch {
      // Invalid URL, skip it
      continue;
    }
  }

  return normalized;
}

export interface ClientFilters {
  createdFrom?: Date;
  createdTo?: Date;
  minArticleCount?: number;
  maxArticleCount?: number;
  hasArticles?: boolean;
  search?: string;
}

export async function getClients(filters?: ClientFilters) {
  try {
    const where: Prisma.ClientWhereInput = {};

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
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const clients = await db.client.findMany({
      where,
      include: {
        logoMedia: {
          select: {
            url: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        ogImageMedia: {
          select: {
            url: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        twitterImageMedia: {
          select: {
            url: true,
            altText: true,
            width: true,
            height: true,
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
      orderBy: { createdAt: "desc" },
    });

    let filteredClients = clients;

    if (filters?.minArticleCount !== undefined || filters?.maxArticleCount !== undefined) {
      filteredClients = clients.filter((client) => {
        const articleCount = client._count.articles;
        if (filters.minArticleCount !== undefined && articleCount < filters.minArticleCount) {
          return false;
        }
        if (filters.maxArticleCount !== undefined && articleCount > filters.maxArticleCount) {
          return false;
        }
        return true;
      });
    }

    return filteredClients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function getClientById(id: string) {
  try {
    const client = await db.client.findUnique({
      where: { id },
      include: {
        logoMedia: {
          select: {
            id: true,
            url: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        ogImageMedia: {
          select: {
            id: true,
            url: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        twitterImageMedia: {
          select: {
            id: true,
            url: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        industry: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
    return client;
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
}

export async function createClient(data: ClientFormData) {
  try {
    const validatedSameAs = validateAndNormalizeUrls(data.sameAs);

    const client = await db.client.create({
      data: {
        name: data.name,
        slug: data.slug,
        legalName: data.legalName,
        url: data.url,
        logoMediaId: data.logoMediaId || null,
        ogImageMediaId: data.ogImageMediaId || null,
        twitterImageMediaId: data.twitterImageMediaId || null,
        sameAs: validatedSameAs,
        email: data.email,
        phone: data.phone,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        description: data.description || null,
        businessBrief: data.businessBrief,
        industryId: data.industryId || null,
        targetAudience: data.targetAudience,
        contentPriorities: data.contentPriorities || [],
        foundingDate: data.foundingDate || null,
        contactType: data.contactType || null,
        addressStreet: data.addressStreet || null,
        addressCity: data.addressCity || null,
        addressCountry: data.addressCountry || null,
        addressPostalCode: data.addressPostalCode || null,
        twitterCard: data.twitterCard || null,
        twitterTitle: data.twitterTitle || null,
        twitterDescription: data.twitterDescription || null,
        twitterSite: data.twitterSite || null,
        canonicalUrl: data.canonicalUrl || null,
        gtmId: data.gtmId,
        subscriptionTier: data.subscriptionTier as any || null,
        subscriptionStartDate: data.subscriptionStartDate || null,
        subscriptionEndDate: data.subscriptionEndDate || null,
        articlesPerMonth: data.articlesPerMonth || null,
        subscriptionStatus: (data.subscriptionStatus as any) || "PENDING",
        paymentStatus: (data.paymentStatus as any) || "PENDING",
      },
    });
    revalidatePath("/clients");
    revalidatePath("/media");
    return { success: true, client };
  } catch (error) {
    console.error("Error creating client:", error);
    const message = error instanceof Error ? error.message : "Failed to create client";
    return { success: false, error: message };
  }
}

export async function updateClient(id: string, data: ClientFormData) {
  try {
    const validatedSameAs = validateAndNormalizeUrls(data.sameAs);

    const client = await db.client.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        legalName: data.legalName,
        url: data.url,
        logoMediaId: data.logoMediaId || null,
        ogImageMediaId: data.ogImageMediaId || null,
        twitterImageMediaId: data.twitterImageMediaId || null,
        sameAs: validatedSameAs,
        email: data.email,
        phone: data.phone,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        description: data.description || null,
        businessBrief: data.businessBrief,
        industryId: data.industryId || null,
        targetAudience: data.targetAudience,
        contentPriorities: data.contentPriorities || [],
        foundingDate: data.foundingDate || null,
        contactType: data.contactType || null,
        addressStreet: data.addressStreet || null,
        addressCity: data.addressCity || null,
        addressCountry: data.addressCountry || null,
        addressPostalCode: data.addressPostalCode || null,
        twitterCard: data.twitterCard || null,
        twitterTitle: data.twitterTitle || null,
        twitterDescription: data.twitterDescription || null,
        twitterSite: data.twitterSite || null,
        canonicalUrl: data.canonicalUrl || null,
        gtmId: data.gtmId,
        subscriptionTier: data.subscriptionTier as any || null,
        subscriptionStartDate: data.subscriptionStartDate || null,
        subscriptionEndDate: data.subscriptionEndDate || null,
        articlesPerMonth: data.articlesPerMonth || null,
        subscriptionStatus: (data.subscriptionStatus as any) || "PENDING",
        paymentStatus: (data.paymentStatus as any) || "PENDING",
      },
    });
    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    revalidatePath("/media");
    return { success: true, client };
  } catch (error) {
    console.error("Error updating client:", error);
    const message = error instanceof Error ? error.message : "Failed to update client";
    return { success: false, error: message };
  }
}

export async function deleteClient(id: string) {
  try {
    const client = await db.client.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!client) {
      return { success: false, error: "Client not found" };
    }

    if (client._count.articles > 0) {
      return {
        success: false,
        error: `Cannot delete client. This client has ${client._count.articles} article(s). Please delete or reassign the articles first.`,
      };
    }

    await db.client.delete({
      where: { id },
    });
    revalidatePath("/clients");
    return { success: true };
  } catch (error) {
    console.error("Error deleting client:", error);
    const message = error instanceof Error ? error.message : "Failed to delete client";
    return { success: false, error: message };
  }
}

export async function getClientsStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, withArticles, withoutArticles, createdThisMonth, allClients] =
      await Promise.all([
        db.client.count(),
        db.client.count({
          where: {
            articles: {
              some: {
                status: ArticleStatus.PUBLISHED,
              },
            },
          },
        }),
        db.client.count({
          where: {
            articles: {
              none: {},
            },
          },
        }),
        db.client.count({
          where: {
            createdAt: { gte: startOfMonth },
          },
        }),
        db.client.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            legalName: true,
            url: true,
            email: true,
            phone: true,
            description: true,
            seoTitle: true,
            seoDescription: true,
            logoMedia: {
              select: {
                url: true,
                altText: true,
                width: true,
                height: true,
              },
            },
            ogImageMedia: {
              select: {
                url: true,
                altText: true,
                width: true,
                height: true,
              },
            },
            twitterImageMedia: {
              select: {
                url: true,
                altText: true,
                width: true,
                height: true,
              },
            },
            sameAs: true,
            businessBrief: true,
            gtmId: true,
            foundingDate: true,
            contactType: true,
            addressStreet: true,
            addressCity: true,
            addressCountry: true,
            addressPostalCode: true,
            twitterCard: true,
            twitterTitle: true,
            twitterDescription: true,
            twitterSite: true,
            canonicalUrl: true,
          },
        }),
      ]);

    let averageSEO = 0;
    if (allClients.length > 0) {
      const scores = allClients.map((client) => {
        const scoreResult = calculateSEOScore(client, organizationSEOConfig);
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
    console.error("Error fetching clients stats:", error);
    return {
      total: 0,
      withArticles: 0,
      withoutArticles: 0,
      createdThisMonth: 0,
      averageSEO: 0,
    };
  }
}

export async function bulkDeleteClients(clientIds: string[]) {
  try {
    if (clientIds.length === 0) {
      return { success: false, error: "No clients selected" };
    }

    const clients = await db.client.findMany({
      where: {
        id: { in: clientIds },
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    const clientsWithArticles = clients.filter((client) => client._count.articles > 0);

    if (clientsWithArticles.length > 0) {
      const clientNames = clientsWithArticles.map((c) => c.name).join(", ");
      const totalArticles = clientsWithArticles.reduce((sum, c) => sum + c._count.articles, 0);
      return {
        success: false,
        error: `Cannot delete ${clientsWithArticles.length} client(s) with articles: ${clientNames}. Total articles: ${totalArticles}. Please delete or reassign the articles first.`,
      };
    }

    await db.client.deleteMany({
      where: {
        id: { in: clientIds },
      },
    });

    revalidatePath("/clients");
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting clients:", error);
    const message = error instanceof Error ? error.message : "Failed to delete clients";
    return { success: false, error: message };
  }
}

export async function getClientArticles(clientId: string) {
  try {
    const articles = await db.article.findMany({
      where: {
        clientId,
      },
      include: {
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
      orderBy: [
        { datePublished: "desc" },
        { createdAt: "desc" },
      ],
    });

    const articleIds = articles.map((a) => a.id);

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

      return articles.map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status,
        createdAt: article.createdAt,
        datePublished: article.datePublished,
        scheduledAt: article.scheduledAt,
        category: article.category,
        author: article.author,
        views: viewsMap.get(article.id) || 0,
      }));
    }

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      status: article.status,
      createdAt: article.createdAt,
      datePublished: article.datePublished,
      scheduledAt: article.scheduledAt,
      category: article.category,
      author: article.author,
      views: 0,
    }));
  } catch (error) {
    console.error("Error fetching client articles:", error);
    return [];
  }
}

export async function getClientAnalytics(clientId: string) {
  try {
    const { getAnalyticsData } = await import("@/app/(dashboard)/analytics/actions/analytics-actions");
    return await getAnalyticsData({ clientId });
  } catch (error) {
    console.error("Error fetching client analytics:", error);
    return {
      totalViews: 0,
      uniqueSessions: 0,
      avgTimeOnPage: 0,
      bounceRate: 0,
      avgScrollDepth: 0,
      topArticles: [],
      trafficSources: {},
    };
  }
}
