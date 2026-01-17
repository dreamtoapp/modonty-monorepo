# 📊 Client Analytics Dashboard - Schema Guide

## How Clients View Analytics for Their Articles

This guide explains how the schema enables clients to access comprehensive analytics about their articles through the dashboard.

---

## 🔗 The Data Flow: Client → Articles → Analytics

### Schema Relationships

```
Client (1) ──→ (Many) Article ──→ (Many) Analytics
```

**Key Points:**

- Each `Article` belongs to **one** `Client` (via `clientId`)
- Each `Analytics` record belongs to **one** `Article` (via `articleId`)
- `Analytics` also has optional `clientId` for direct filtering
- All analytics events are **event-based** (one record per view)

---

## 📋 Schema Structure for Analytics

### 1. Client Model

```prisma
model Client {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  slug      String  @unique
  // ... other fields

  articles    Article[]     // All articles owned by this client
  subscribers Subscriber[] // Newsletter subscribers
}
```

### 2. Article Model

```prisma
model Article {
  id        String @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  slug      String
  content   String

  clientId  String @db.ObjectId
  client    Client @relation(...)  // Which client owns this

  // ... other fields

  analytics Analytics[]  // All view events for this article

  @@unique([clientId, slug])  // Slug unique per client
  @@index([clientId, status, datePublished])  // Fast client queries
}
```

### 3. Analytics Model (Event-Based)

```prisma
model Analytics {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  articleId String  @db.ObjectId
  article   Article @relation(...)
  clientId  String? @db.ObjectId  // Optional: for direct client filtering

  // User/Session tracking
  sessionId String?  // Browser session (for unique visitors)
  userId    String? @db.ObjectId  // If logged in

  // Performance metrics (per view)
  lcp       Float?  // Largest Contentful Paint
  cls       Float?  // Cumulative Layout Shift
  inp       Float?  // Interaction to Next Paint
  timeOnPage Float? // Seconds spent
  scrollDepth Float? // Percentage (0-100)
  bounced   Boolean // Did they leave immediately?

  // Traffic source
  source    TrafficSource  // ORGANIC, DIRECT, SOCIAL, etc.
  timestamp DateTime

  @@index([articleId, timestamp])  // Fast article queries
  @@index([clientId, timestamp])   // Fast client queries
  @@index([timestamp])              // Time-based queries
  @@index([sessionId])              // Unique visitor queries
}
```

---

## 🎯 How Client Dashboard Queries Work

### Query Pattern 1: Get All Client's Articles with Analytics

```typescript
// Step 1: Get client's articles
const client = await db.client.findUnique({
  where: { slug: 'techcorp-solutions' },
  include: {
    articles: {
      where: { status: 'PUBLISHED' },
      include: {
        analytics: true, // All analytics events
      },
    },
  },
});

// Result: Client with all articles and their analytics events
```

### Query Pattern 2: Aggregate Analytics by Client (Direct)

```typescript
// Get all analytics for a client's articles (using clientId index)
const clientAnalytics = await db.analytics.findMany({
  where: {
    clientId: clientId,
    timestamp: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    },
  },
  include: {
    article: {
      select: {
        id: true,
        title: true,
        slug: true,
      },
    },
  },
  orderBy: { timestamp: 'desc' },
});
```

### Query Pattern 3: Get Client's Articles with Analytics Summary

```typescript
// Get articles with aggregated analytics
const articles = await db.article.findMany({
  where: {
    clientId: clientId,
    status: 'PUBLISHED',
  },
  include: {
    author: true,
    category: true,
    featuredImage: true,
  },
});

// Then aggregate analytics for each article
const articlesWithStats = await Promise.all(
  articles.map(async (article) => {
    const [totalViews, uniqueVisitors, avgTime, bounceRate] = await Promise.all([
      // Total views
      db.analytics.count({
        where: { articleId: article.id },
      }),

      // Unique visitors (distinct sessions)
      db.analytics
        .groupBy({
          by: ['sessionId'],
          where: {
            articleId: article.id,
            sessionId: { not: null },
          },
        })
        .then((r) => r.length),

      // Average time on page
      db.analytics
        .aggregate({
          where: {
            articleId: article.id,
            timeOnPage: { not: null },
          },
          _avg: { timeOnPage: true },
        })
        .then((r) => r._avg.timeOnPage || 0),

      // Bounce rate
      db.analytics
        .count({
          where: {
            articleId: article.id,
            bounced: true,
          },
        })
        .then((bounced) => {
          const total = await db.analytics.count({
            where: { articleId: article.id },
          });
          return total > 0 ? (bounced / total) * 100 : 0;
        }),
    ]);

    return {
      ...article,
      analytics: {
        totalViews,
        uniqueVisitors,
        avgTimeOnPage: Math.round(avgTime),
        bounceRate: Math.round(bounceRate * 100) / 100,
      },
    };
  }),
);
```

---

## 📊 Dashboard Metrics Calculation

### 1. Overall Client Statistics

```typescript
async function getClientDashboardStats(clientId: string) {
  // Get all client's articles
  const articleIds = await db.article
    .findMany({
      where: { clientId },
      select: { id: true },
    })
    .then((articles) => articles.map((a) => a.id));

  // Calculate overall stats
  const [totalArticles, totalViews, uniqueVisitors, avgTimeOnPage, bounceRate, trafficSources] =
    await Promise.all([
      // Total published articles
      db.article.count({
        where: { clientId, status: 'PUBLISHED' },
      }),

      // Total views (all analytics events)
      db.analytics.count({
        where: { articleId: { in: articleIds } },
      }),

      // Unique visitors (distinct sessions)
      db.analytics
        .groupBy({
          by: ['sessionId'],
          where: {
            articleId: { in: articleIds },
            sessionId: { not: null },
          },
        })
        .then((r) => r.length),

      // Average time on page
      db.analytics
        .aggregate({
          where: {
            articleId: { in: articleIds },
            timeOnPage: { not: null },
          },
          _avg: { timeOnPage: true },
        })
        .then((r) => r._avg.timeOnPage || 0),

      // Bounce rate
      db.analytics
        .count({
          where: {
            articleId: { in: articleIds },
            bounced: true,
          },
        })
        .then((bounced) => {
          const total = await db.analytics.count({
            where: { articleId: { in: articleIds } },
          });
          return total > 0 ? (bounced / total) * 100 : 0;
        }),

      // Traffic sources breakdown
      db.analytics.groupBy({
        by: ['source'],
        where: { articleId: { in: articleIds } },
        _count: { source: true },
      }),
    ]);

  return {
    totalArticles,
    totalViews,
    uniqueVisitors,
    avgTimeOnPage: Math.round(avgTimeOnPage),
    bounceRate: Math.round(bounceRate * 100) / 100,
    trafficSources: trafficSources.map((t) => ({
      source: t.source,
      count: t._count.source,
    })),
  };
}
```

### 2. Top Performing Articles

```typescript
async function getTopArticles(clientId: string, limit: number = 10) {
  const articles = await db.article.findMany({
    where: {
      clientId,
      status: 'PUBLISHED',
    },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  // Get view counts for each article
  const articlesWithViews = await Promise.all(
    articles.map(async (article) => {
      const views = await db.analytics.count({
        where: { articleId: article.id },
      });
      return { ...article, views };
    }),
  );

  // Sort by views and return top N
  return articlesWithViews.sort((a, b) => b.views - a.views).slice(0, limit);
}
```

### 3. Time-Based Analytics (Last 7/30/90 Days)

```typescript
async function getTimeBasedAnalytics(clientId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const articleIds = await db.article
    .findMany({
      where: { clientId },
      select: { id: true },
    })
    .then((articles) => articles.map((a) => a.id));

  // Get analytics events in date range
  const analytics = await db.analytics.findMany({
    where: {
      articleId: { in: articleIds },
      timestamp: { gte: startDate },
    },
    orderBy: { timestamp: 'asc' },
  });

  // Group by date
  const dailyStats = analytics.reduce((acc, event) => {
    const date = event.timestamp.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, views: 0, uniqueVisitors: new Set() };
    }
    acc[date].views++;
    if (event.sessionId) {
      acc[date].uniqueVisitors.add(event.sessionId);
    }
    return acc;
  }, {} as Record<string, { date: string; views: number; uniqueVisitors: Set<string> }>);

  return Object.values(dailyStats).map((stat) => ({
    date: stat.date,
    views: stat.views,
    uniqueVisitors: stat.uniqueVisitors.size,
  }));
}
```

### 4. Article Performance Comparison

```typescript
async function getArticlePerformance(clientId: string) {
  const articles = await db.article.findMany({
    where: {
      clientId,
      status: 'PUBLISHED',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      datePublished: true,
    },
  });

  const performance = await Promise.all(
    articles.map(async (article) => {
      const [views, uniqueVisitors, avgTime, bounceRate, scrollDepth] = await Promise.all([
        db.analytics.count({ where: { articleId: article.id } }),
        db.analytics
          .groupBy({
            by: ['sessionId'],
            where: { articleId: article.id, sessionId: { not: null } },
          })
          .then((r) => r.length),
        db.analytics
          .aggregate({
            where: { articleId: article.id, timeOnPage: { not: null } },
            _avg: { timeOnPage: true },
          })
          .then((r) => r._avg.timeOnPage || 0),
        db.analytics
          .count({
            where: { articleId: article.id, bounced: true },
          })
          .then((bounced) => {
            const total = await db.analytics.count({ where: { articleId: article.id } });
            return total > 0 ? (bounced / total) * 100 : 0;
          }),
        db.analytics
          .aggregate({
            where: { articleId: article.id, scrollDepth: { not: null } },
            _avg: { scrollDepth: true },
          })
          .then((r) => r._avg.scrollDepth || 0),
      ]);

      return {
        ...article,
        metrics: {
          views,
          uniqueVisitors,
          avgTimeOnPage: Math.round(avgTime),
          bounceRate: Math.round(bounceRate * 100) / 100,
          avgScrollDepth: Math.round(scrollDepth * 100) / 100,
        },
      };
    }),
  );

  return performance.sort((a, b) => b.metrics.views - a.metrics.views);
}
```

---

## 🔍 Real-World Dashboard Query Example

### Complete Client Dashboard Data

```typescript
// Server Action: Get full dashboard data for a client
export async function getClientDashboard(clientSlug: string) {
  // 1. Get client
  const client = await db.client.findUnique({
    where: { slug: clientSlug },
    select: { id: true, name: true },
  });

  if (!client) throw new Error('Client not found');

  // 2. Get all client's article IDs
  const articleIds = await db.article
    .findMany({
      where: { clientId: client.id },
      select: { id: true },
    })
    .then((articles) => articles.map((a) => a.id));

  // 3. Calculate overall stats
  const overallStats = await getClientDashboardStats(client.id);

  // 4. Get top 10 articles
  const topArticles = await getTopArticles(client.id, 10);

  // 5. Get time-based analytics (last 30 days)
  const timeBasedAnalytics = await getTimeBasedAnalytics(client.id, 30);

  // 6. Get traffic sources
  const trafficSources = await db.analytics.groupBy({
    by: ['source'],
    where: { articleId: { in: articleIds } },
    _count: { source: true },
  });

  // 7. Get performance by category
  const articlesByCategory = await db.article.findMany({
    where: { clientId: client.id, status: 'PUBLISHED' },
    include: { category: true },
  });

  const categoryStats = articlesByCategory.reduce((acc, article) => {
    const categoryName = article.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = { category: categoryName, articles: 0, views: 0 };
    }
    acc[categoryName].articles++;
    return acc;
  }, {} as Record<string, { category: string; articles: number; views: number }>);

  // Calculate views per category
  for (const category of Object.keys(categoryStats)) {
    const categoryArticles = articlesByCategory
      .filter((a) => (a.category?.name || 'Uncategorized') === category)
      .map((a) => a.id);

    categoryStats[category].views = await db.analytics.count({
      where: { articleId: { in: categoryArticles } },
    });
  }

  return {
    client: {
      id: client.id,
      name: client.name,
    },
    overallStats,
    topArticles,
    timeBasedAnalytics,
    trafficSources: trafficSources.map((t) => ({
      source: t.source,
      count: t._count.source,
    })),
    categoryStats: Object.values(categoryStats),
  };
}
```

---

## 📈 Dashboard Metrics Summary

### What Clients Can See:

1. **Overall Statistics**

   - Total articles published
   - Total views (all time)
   - Unique visitors
   - Average time on page
   - Bounce rate

2. **Top Performing Articles**

   - Most viewed articles
   - Best engagement (time on page, scroll depth)
   - Lowest bounce rate

3. **Time-Based Trends**

   - Views per day/week/month
   - Unique visitors over time
   - Growth trends

4. **Traffic Sources**

   - Organic search (Google, Bing)
   - Social media (Facebook, Twitter)
   - Direct traffic
   - Referrals

5. **Category Performance**

   - Views per category
   - Best performing categories
   - Category comparison

6. **Article-Level Metrics**
   - Views per article
   - Unique visitors per article
   - Average time on page
   - Scroll depth
   - Bounce rate
   - Core Web Vitals (LCP, CLS, INP)

---

## 🎯 Key Schema Features Enabling This

1. **Client Isolation**: `Article.clientId` ensures clients only see their articles
2. **Event-Based Analytics**: Each view = one record, enabling flexible aggregation
3. **Indexes**: `@@index([clientId, timestamp])` enables fast client-specific queries
4. **Session Tracking**: `sessionId` enables unique visitor calculation
5. **Time Tracking**: `timestamp` enables time-based analysis
6. **Traffic Source**: `source` field enables traffic breakdown

---

## 💡 Best Practices

1. **Use Aggregation**: Don't fetch all analytics events, aggregate in the database
2. **Cache Results**: Dashboard stats can be cached (5-15 minutes)
3. **Paginate**: For large datasets, paginate article lists
4. **Date Ranges**: Always allow clients to filter by date range
5. **Real-Time Updates**: Use `timestamp` index for recent activity

---

This schema design enables comprehensive analytics dashboards while maintaining data isolation between clients (multi-tenancy).


