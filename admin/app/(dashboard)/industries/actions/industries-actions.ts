"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { deleteOldImage } from "../../actions/delete-image";
import { Prisma, ArticleStatus } from "@prisma/client";
import { calculateSEOScore } from "@/helpers/utils/seo-score-calculator";
import { industrySEOConfig } from "../helpers/industry-seo-config";

export interface IndustryFilters {
  createdFrom?: Date;
  createdTo?: Date;
  minClientCount?: number;
  maxClientCount?: number;
  hasClients?: boolean;
  search?: string;
}

export async function getIndustries(filters?: IndustryFilters) {
  try {
    const where: Prisma.IndustryWhereInput = {};

    if (filters?.createdFrom || filters?.createdTo) {
      where.createdAt = {};
      if (filters.createdFrom) {
        where.createdAt.gte = filters.createdFrom;
      }
      if (filters.createdTo) {
        where.createdAt.lte = filters.createdTo;
      }
    }

    if (filters?.hasClients !== undefined) {
      if (filters.hasClients) {
        where.clients = {
          some: {},
        };
      } else {
        where.clients = {
          none: {},
        };
      }
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const industries = await db.industry.findMany({
      where,
      include: {
        _count: { select: { clients: true } },
      },
      orderBy: { name: "asc" },
    });

    let filteredIndustries = industries;

    if (filters?.minClientCount !== undefined || filters?.maxClientCount !== undefined) {
      filteredIndustries = industries.filter((industry) => {
        const clientCount = industry._count.clients;
        if (filters.minClientCount !== undefined && clientCount < filters.minClientCount) {
          return false;
        }
        if (filters.maxClientCount !== undefined && clientCount > filters.maxClientCount) {
          return false;
        }
        return true;
      });
    }

    return filteredIndustries;
  } catch (error) {
    console.error("Error fetching industries:", error);
    return [];
  }
}

export async function getIndustryById(id: string) {
  try {
    return await db.industry.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            clients: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
}

export async function getIndustryClients(industryId: string) {
  try {
    return await db.client.findMany({
      where: {
        industryId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching industry clients:", error);
    return [];
  }
}

export async function createIndustry(data: {
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  socialImage?: string;
  socialImageAlt?: string;
  cloudinaryPublicId?: string;
}) {
  try {
    const industry = await db.industry.create({ data });
    revalidatePath("/industries");
    return { success: true, industry };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create industry";
    return { success: false, error: message };
  }
}

export async function updateIndustry(
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string;
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;
    socialImage?: string | null;
    socialImageAlt?: string | null;
    cloudinaryPublicId?: string | null;
  }
) {
  try {
    const updateData: {
      name: string;
      slug: string;
      description?: string | null;
      seoTitle?: string | null;
      seoDescription?: string | null;
      canonicalUrl?: string | null;
      socialImage?: string | null;
      socialImageAlt?: string | null;
      cloudinaryPublicId?: string | null;
    } = {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      canonicalUrl: data.canonicalUrl || null,
    };

    // Only update socialImage fields if they are explicitly provided (including null for removal)
    if (data.socialImage !== undefined) {
      updateData.socialImage = data.socialImage;
    }
    if (data.socialImageAlt !== undefined) {
      updateData.socialImageAlt = data.socialImageAlt;
    }
    if (data.cloudinaryPublicId !== undefined) {
      updateData.cloudinaryPublicId = data.cloudinaryPublicId;
    }

    const industry = await db.industry.update({ where: { id }, data: updateData });
    revalidatePath("/industries");
    return { success: true, industry };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update industry";
    return { success: false, error: message };
  }
}

export async function deleteIndustry(id: string) {
  try {
    const industry = await db.industry.findUnique({
      where: { id },
      include: { _count: { select: { clients: true } } },
    });

    if (industry && industry._count.clients > 0) {
      return {
        success: false,
        error: `Cannot delete industry. It is used by ${industry._count.clients} client(s).`,
      };
    }

    // Delete Cloudinary image before database deletion (non-blocking)
    await deleteOldImage("industries", id);

    await db.industry.delete({ where: { id } });
    revalidatePath("/industries");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete industry";
    return { success: false, error: message };
  }
}

export async function bulkDeleteIndustries(industryIds: string[]) {
  try {
    if (industryIds.length === 0) {
      return { success: false, error: "No industries selected" };
    }

    const industries = await db.industry.findMany({
      where: {
        id: { in: industryIds },
      },
      include: {
        _count: {
          select: {
            clients: true,
          },
        },
      },
    });

    const industriesWithClients = industries.filter((industry) => industry._count.clients > 0);

    if (industriesWithClients.length > 0) {
      const industryNames = industriesWithClients.map((i) => i.name).join(", ");
      const totalClients = industriesWithClients.reduce((sum, i) => sum + i._count.clients, 0);
      return {
        success: false,
        error: `Cannot delete ${industriesWithClients.length} industr${industriesWithClients.length === 1 ? "y" : "ies"} with clients: ${industryNames}. Total clients: ${totalClients}. Please delete or reassign the clients first.`,
      };
    }

    // Delete Cloudinary images for all industries (non-blocking)
    for (const industryId of industryIds) {
      await deleteOldImage("industries", industryId);
    }

    await db.industry.deleteMany({
      where: {
        id: { in: industryIds },
      },
    });

    revalidatePath("/industries");
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting industries:", error);
    const message = error instanceof Error ? error.message : "Failed to delete industries";
    return { success: false, error: message };
  }
}

export async function getIndustriesStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, withClients, withoutClients, createdThisMonth, allIndustries] =
      await Promise.all([
        db.industry.count(),
        db.industry.count({
          where: {
            clients: {
              some: {},
            },
          },
        }),
        db.industry.count({
          where: {
            clients: {
              none: {},
            },
          },
        }),
        db.industry.count({
          where: {
            createdAt: { gte: startOfMonth },
          },
        }),
        db.industry.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            seoTitle: true,
            seoDescription: true,
            canonicalUrl: true,
          },
        }),
      ]);

    let averageSEO = 0;
    if (allIndustries.length > 0) {
      const scores = allIndustries.map((industry) => {
        const scoreResult = calculateSEOScore(industry, industrySEOConfig);
        return scoreResult.percentage;
      });
      averageSEO = Math.round(
        scores.reduce((sum, score) => sum + score, 0) / scores.length
      );
    }

    return {
      total,
      withClients,
      withoutClients,
      createdThisMonth,
      averageSEO,
    };
  } catch (error) {
    console.error("Error fetching industries stats:", error);
    return {
      total: 0,
      withClients: 0,
      withoutClients: 0,
      createdThisMonth: 0,
      averageSEO: 0,
    };
  }
}

