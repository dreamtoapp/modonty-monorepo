"use server";

import { db } from "@/lib/db";
import { subDays, startOfDay, endOfDay } from "date-fns";

export async function getDashboardStats() {
  try {
    const now = new Date();
    const thirtyDaysAgo = startOfDay(subDays(now, 30));
    const sixtyDaysAgo = startOfDay(subDays(now, 60));

    const [
      articlesCount,
      clientsCount,
      usersCount,
      subscribersCount,
      articlesLastMonth,
      clientsLastMonth,
      usersLastMonth,
      subscribersLastMonth,
      articlesLastPeriod,
      clientsLastPeriod,
      usersLastPeriod,
      subscribersLastPeriod,
    ] = await Promise.all([
      db.article.count(),
      db.client.count(),
      db.user.count(),
      db.subscriber.count(),
      db.article.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      db.client.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      db.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      db.subscriber.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      db.article.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
      db.client.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
      db.user.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
      db.subscriber.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
    ]);

    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      articles: {
        count: articlesCount,
        trend: calculateTrend(articlesLastMonth, articlesLastPeriod),
      },
      clients: {
        count: clientsCount,
        trend: calculateTrend(clientsLastMonth, clientsLastPeriod),
      },
      users: {
        count: usersCount,
        trend: calculateTrend(usersLastMonth, usersLastPeriod),
      },
      subscribers: {
        count: subscribersCount,
        trend: calculateTrend(subscribersLastMonth, subscribersLastPeriod),
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      articles: { count: 0, trend: 0 },
      clients: { count: 0, trend: 0 },
      users: { count: 0, trend: 0 },
      subscribers: { count: 0, trend: 0 },
    };
  }
}

export async function getRecentArticles() {
  try {
    const articles = await db.article.findMany({
      take: 5,
      where: {
        status: {
          in: ["DRAFT", "PUBLISHED", "ARCHIVED"],
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: { name: true },
        },
        category: {
          select: { name: true },
        },
        author: {
          select: { name: true },
        },
      },
    });

    return articles;
  } catch (error) {
    console.error("Error fetching recent articles:", error);
    return [];
  }
}

export async function getStatusBreakdown() {
  try {
    const [draft, published, archived] = await Promise.all([
      db.article.count({ where: { status: "DRAFT" } }),
      db.article.count({ where: { status: "PUBLISHED" } }),
      db.article.count({ where: { status: "ARCHIVED" } }),
    ]);

    return {
      draft,
      published,
      archived,
      total: draft + published + archived,
    };
  } catch (error) {
    console.error("Error fetching status breakdown:", error);
    return {
      draft: 0,
      published: 0,
      archived: 0,
      total: 0,
    };
  }
}
