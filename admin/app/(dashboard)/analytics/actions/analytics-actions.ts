"use server";

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { format, startOfDay, endOfDay } from "date-fns";

type AnalyticsWithArticle = Prisma.AnalyticsGetPayload<{
  include: {
    article: {
      select: {
        title: true;
        client: { select: { name: true } };
      };
    };
  };
}>;

type TopArticle = {
  articleId: string;
  title: string;
  client: string;
  views: number;
};

export async function getAnalyticsData(filters?: {
  clientId?: string;
  articleId?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const where: Prisma.AnalyticsWhereInput = {};
    if (filters?.clientId) where.clientId = filters.clientId;
    if (filters?.articleId) where.articleId = filters.articleId;
    
    const defaultStartDate = startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const defaultEndDate = endOfDay(new Date());
    
    const startDate = filters?.startDate ? startOfDay(filters.startDate) : defaultStartDate;
    const endDate = filters?.endDate ? endOfDay(filters.endDate) : defaultEndDate;
    
    where.timestamp = {
      gte: startDate,
      lte: endDate,
    };

    const analytics = await db.analytics.findMany({
      where,
      include: {
        article: {
          select: {
            title: true,
            client: { select: { name: true } },
          },
        },
      },
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    const totalViews = analytics.length;
    const uniqueSessions = new Set(
      analytics.map((a: AnalyticsWithArticle) => a.sessionId).filter(Boolean)
    ).size;

    const validTimeOnPageRecords = analytics.filter(
      (a: AnalyticsWithArticle) => a.timeOnPage != null && a.timeOnPage !== undefined
    );
    const avgTimeOnPage =
      validTimeOnPageRecords.length > 0
        ? validTimeOnPageRecords.reduce(
            (sum: number, a: AnalyticsWithArticle) => sum + (a.timeOnPage || 0),
            0
          ) / validTimeOnPageRecords.length
        : 0;

    const bounceRate =
      totalViews > 0
        ? (analytics.filter((a: AnalyticsWithArticle) => a.bounced).length / totalViews) * 100
        : 0;

    const validScrollDepthRecords = analytics.filter(
      (a: AnalyticsWithArticle) => a.scrollDepth != null && a.scrollDepth !== undefined
    );
    const avgScrollDepth =
      validScrollDepthRecords.length > 0
        ? validScrollDepthRecords.reduce(
            (sum: number, a: AnalyticsWithArticle) => sum + (a.scrollDepth || 0),
            0
          ) / validScrollDepthRecords.length
        : 0;

    const topArticles = analytics.reduce(
      (acc: Record<string, TopArticle>, a: AnalyticsWithArticle) => {
        if (!a.article) {
          return acc;
        }
        const articleId = a.articleId;
        if (!acc[articleId]) {
          acc[articleId] = {
            articleId,
            title: a.article.title || "Untitled",
            client: a.article.client?.name || "Unknown",
            views: 0,
          };
        }
        acc[articleId].views++;
        return acc;
      },
      {} as Record<string, TopArticle>
    );

    const topArticlesList = Object.values(topArticles)
      .sort((a: TopArticle, b: TopArticle) => b.views - a.views)
      .slice(0, 10);

    const trafficSources = analytics.reduce(
      (acc: Record<string, number>, a: AnalyticsWithArticle) => {
        const source = a.source || "UNKNOWN";
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalViews: totalViews || 0,
      uniqueSessions: uniqueSessions || 0,
      avgTimeOnPage: Math.round(avgTimeOnPage) || 0,
      bounceRate: Math.round(bounceRate * 100) / 100 || 0,
      avgScrollDepth: Math.round(avgScrollDepth * 100) / 100 || 0,
      topArticles: topArticlesList || [],
      trafficSources: trafficSources || {},
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
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

export async function getViewsTrendData(filters?: {
  clientId?: string;
  articleId?: string;
  startDate?: Date;
  endDate?: Date;
  groupBy?: "day" | "week" | "month";
}) {
  try {
    const where: Prisma.AnalyticsWhereInput = {};
    if (filters?.clientId) where.clientId = filters.clientId;
    if (filters?.articleId) where.articleId = filters.articleId;
    
    const defaultStartDate = startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const defaultEndDate = endOfDay(new Date());
    const groupBy = filters?.groupBy || "day";
    
    const startDate = filters?.startDate ? startOfDay(filters.startDate) : defaultStartDate;
    const endDate = filters?.endDate ? endOfDay(filters.endDate) : defaultEndDate;
    
    where.timestamp = {
      gte: startDate,
      lte: endDate,
    };

    const analytics = await db.analytics.findMany({
      where,
      select: {
        timestamp: true,
        sessionId: true,
      },
      orderBy: { timestamp: "asc" },
    });

    const grouped = analytics.reduce((acc, record) => {
      const date = new Date(record.timestamp);
      let key: string;

      if (groupBy === "day") {
        key = date.toISOString().split("T")[0];
      } else if (groupBy === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }

      if (!acc[key]) {
        acc[key] = { views: 0, sessions: new Set() };
      }
      acc[key].views++;
      if (record.sessionId) {
        acc[key].sessions.add(record.sessionId);
      }
      return acc;
    }, {} as Record<string, { views: number; sessions: Set<string> }>);

    return Object.entries(grouped)
      .map(([date, data]) => ({
        date: formatDate(date, groupBy),
        views: data.views,
        sessions: data.sessions.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("Error fetching views trend:", error);
    return [];
  }
}

function formatDate(dateStr: string, groupBy: "day" | "week" | "month"): string {
  const date = new Date(dateStr);
  if (groupBy === "day") {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } else if (groupBy === "week") {
    return `Week of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
}

export async function getClients() {
  try {
    return await db.client.findMany({ orderBy: { name: "asc" } });
  } catch (error) {
    return [];
  }
}

export async function getArticles() {
  try {
    return await db.article.findMany({
      where: {
        status: {
          in: ["DRAFT", "PUBLISHED", "ARCHIVED"],
        },
      },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}
