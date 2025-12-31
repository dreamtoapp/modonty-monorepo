# 📚 The Modonty Schema Story

## A Complete Guide to Understanding Your Database

---

## 🎭 The Big Picture: A Multi-Client Blog Platform

Imagine **Modonty** as a **content management system** where multiple companies (clients) can publish their articles. Think of it like a **shared office building** where each company has their own floor, but they all use the same infrastructure.

**The Core Concept:**

- **One Platform** → Many Clients
- **Each Client** → Many Articles
- **Each Article** → One Author, One Category, Many Tags
- **Everything** → Tracked with Analytics

---

## 🏢 Chapter 1: The Foundation - Clients

### What is a Client?

A **Client** represents a company or organization that uses the platform to publish articles.

```prisma
model Client {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  name      String  // "حلول التقنية المتقدمة"
  slug      String  @unique // "techcorp-solutions"
  // ... branding, SEO, contact info
  articles    Article[]     // This client's articles
  subscribers Subscriber[] // Newsletter subscribers
}
```

### Real-World Example

```javascript
// Example Client Document in MongoDB
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "حلول التقنية المتقدمة",
  slug: "techcorp-solutions",
  logo: "https://...",
  email: "info@techcorp.com",
  // This client owns 25 articles
  // This client has 150 newsletter subscribers
}
```

### How It Works

- **One Client** can have **many Articles** (one-to-many)
- **One Client** can have **many Subscribers** (one-to-many)
- Each article belongs to **exactly one Client**
- Articles are **isolated by client** (multi-tenancy)

**Query Example:**

```typescript
// Get all articles for a specific client
const client = await db.client.findUnique({
  where: { slug: 'techcorp-solutions' },
  include: { articles: true }, // Get all articles
});

// Result: Client with 25 articles
```

---

## 👤 Chapter 2: The Writers - Authors

### What is an Author?

An **Author** is a person who writes articles. They have credentials, expertise, and social profiles (for SEO/E-E-A-T).

```prisma
model Author {
  id   String @id @default(auto()) @map("_id") @db.ObjectId
  name String // "سارة أحمد"
  slug String @unique // "sarah-ahmed"
  // ... bio, credentials, social profiles
  articles Article[] // Articles written by this author
}
```

### Real-World Example

```javascript
// Example Author Document
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  name: "سارة أحمد",
  slug: "sarah-ahmed",
  jobTitle: "مهندسة برمجيات أولى",
  bio: "مهندسة برمجيات متخصصة...",
  credentials: ["بكالوريوس علوم الحاسب", "شهادة AWS"],
  expertiseAreas: ["تطوير الويب", "React", "Node.js"],
  // This author wrote 12 articles
}
```

### How It Works

- **One Author** can write **many Articles** (one-to-many)
- Each article has **exactly one Author**
- Authors are **shared across clients** (same author can write for different clients)

**Query Example:**

```typescript
// Get all articles by an author
const author = await db.author.findUnique({
  where: { slug: 'sarah-ahmed' },
  include: { articles: true },
});

// Result: Author with 12 articles
```

---

## 📁 Chapter 3: Organization - Categories

### What is a Category?

A **Category** organizes articles by topic. Categories can be **hierarchical** (parent-child).

```prisma
model Category {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  name      String  // "تقنية"
  slug      String  @unique // "technology"
  parentId  String? @db.ObjectId // For hierarchical categories
  parent    Category?  // Parent category
  children  Category[] // Child categories
  articles  Article[]  // Articles in this category
}
```

### Real-World Example

```javascript
// Parent Category
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  name: "تقنية",
  slug: "technology",
  parentId: null, // No parent (top-level)
  // Has 25 articles
  // Could have child categories like "Web Development", "Mobile Apps"
}

// Child Category (if hierarchical)
{
  _id: ObjectId("507f1f77bcf86cd799439014"),
  name: "تطوير الويب",
  slug: "web-development",
  parentId: ObjectId("507f1f77bcf86cd799439013"), // Parent is "تقنية"
  // Has 10 articles
}
```

### How It Works

- **One Category** can have **many Articles** (one-to-many)
- Categories can have **parent categories** (self-relation)
- Articles can belong to **one Category** (or none)
- Categories are **shared across clients**

**Query Example:**

```typescript
// Get category with all articles and child categories
const category = await db.category.findUnique({
  where: { slug: 'technology' },
  include: {
    articles: true, // All articles in this category
    children: true, // Child categories
    parent: true, // Parent category (if exists)
  },
});
```

---

## 🏷️ Chapter 4: Labels - Tags

### What is a Tag?

A **Tag** is a simple label for articles. Unlike categories, tags are **flat** (no hierarchy) and articles can have **multiple tags**.

```prisma
model Tag {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String   // "React"
  slug      String   @unique // "react"
  articles  ArticleTag[] // Many-to-many relationship
}
```

### Real-World Example

```javascript
// Example Tag
{
  _id: ObjectId("507f1f77bcf86cd799439015"),
  name: "React",
  slug: "react",
  // This tag is used in 45 articles (via ArticleTag)
}
```

### How It Works

- **Many Articles** can have **many Tags** (many-to-many)
- Uses **ArticleTag** as a **junction table** (join table)
- Each article can have **2-4 tags** typically

**Query Example:**

```typescript
// Get all tags for an article
const article = await db.article.findUnique({
  where: { id: '...' },
  include: {
    tags: {
      include: { tag: true }, // Get the actual Tag objects
    },
  },
});

// Result: Article with tags: ["React", "Next.js", "TypeScript"]
```

---

## 📝 Chapter 5: The Star - Articles

### What is an Article?

An **Article** is the **heart** of the platform. It's a blog post with content, SEO metadata, and relationships to everything else.

```prisma
model Article {
  id          String @id @default(auto()) @map("_id") @db.ObjectId
  title       String // "مستقبل تطوير الويب"
  slug        String // "future-of-web-development"
  content     String // Full article body (markdown/HTML)

  // Relationships
  clientId    String @db.ObjectId
  client      Client  // Which company owns this article

  categoryId  String? @db.ObjectId
  category    Category? // Which category

  authorId    String @db.ObjectId
  author      Author  // Who wrote it

  // Many relationships
  tags        ArticleTag[]     // Tags (via junction table)
  versions    ArticleVersion[] // Version history
  analytics   Analytics[]      // View tracking
  faqs        FAQ[]            // FAQ section
  media       Media[]          // Images in article
  featuredImage Media?         // Main featured image
  relatedFrom RelatedArticle[] // Articles that link to this
  relatedTo   RelatedArticle[] // Articles this links to
}
```

### Real-World Example

```javascript
// Example Article Document
{
  _id: ObjectId("507f1f77bcf86cd799439016"),
  title: "مستقبل تطوير الويب: الاتجاهات التي يجب متابعتها في 2025",
  slug: "future-of-web-development-2025",
  content: "# Heading\n\nLong article content here...",
  contentFormat: "markdown",

  // Relationships (stored as IDs)
  clientId: ObjectId("507f1f77bcf86cd799439011"), // "techcorp-solutions"
  categoryId: ObjectId("507f1f77bcf86cd799439013"), // "technology"
  authorId: ObjectId("507f1f77bcf86cd799439012"), // "sarah-ahmed"
  featuredImageId: ObjectId("507f1f77bcf86cd799439017"),

  // Status
  status: "PUBLISHED",
  datePublished: ISODate("2025-01-15T10:30:00Z"),

  // SEO fields (30+ fields for full SEO optimization)
  seoTitle: "مستقبل تطوير الويب | تقنية",
  seoDescription: "استكشف أحدث الاتجاهات...",
  ogImage: "https://...",
  // ... many more SEO fields
}
```

### How Articles Connect Everything

```
Article (The Hub)
    ↓
    ├─→ Client (Who owns it)
    ├─→ Author (Who wrote it)
    ├─→ Category (What topic)
    ├─→ Tags (Multiple labels via ArticleTag)
    ├─→ Media (Images)
    ├─→ Analytics (View tracking)
    ├─→ FAQs (Questions/Answers)
    ├─→ RelatedArticles (Links to other articles)
    └─→ ArticleVersion (History)
```

**Query Example:**

```typescript
// Get full article with all relationships
const article = await db.article.findUnique({
  where: { slug: 'future-of-web-development-2025' },
  include: {
    client: true, // Company info
    author: true, // Author info
    category: true, // Category info
    tags: { include: { tag: true } }, // All tags
    featuredImage: true, // Featured image
    faqs: true, // FAQ section
    analytics: {
      // View analytics
      orderBy: { timestamp: 'desc' },
      take: 10,
    },
  },
});

// Result: Complete article with all related data
```

---

## 🔗 Chapter 6: The Connectors - Junction Tables

### ArticleTag (Many-to-Many)

**Purpose**: Connects Articles to Tags (many-to-many relationship).

```prisma
model ArticleTag {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  articleId String  @db.ObjectId
  tagId     String  @db.ObjectId
  article   Article @relation(...)
  tag       Tag     @relation(...)

  @@unique([articleId, tagId]) // One article can't have same tag twice
}
```

**Real-World Example:**

```javascript
// Article "Future of Web Development" has tags: React, Next.js, TypeScript
[
  { articleId: 'article-1', tagId: 'react' },
  { articleId: 'article-1', tagId: 'nextjs' },
  { articleId: 'article-1', tagId: 'typescript' },
];
```

**How It Works:**

- One article can have **multiple tags**
- One tag can be on **multiple articles**
- The junction table stores the **pairs**

---

## 📸 Chapter 7: Visual Content - Media

### What is Media?

**Media** represents images, videos, or other files used in articles.

```prisma
model Media {
  id        String @id @default(auto()) @map("_id") @db.ObjectId
  filename  String // "article-image.jpg"
  url       String // "https://cdn.example.com/image.jpg"
  altText   String? // "Screenshot of code"

  // Relationships
  articleId String? @db.ObjectId
  article   Article? // Which article uses this (optional)

  featuredArticles Article[] // Articles that feature this image
}
```

### Real-World Example

```javascript
// Example Media Document
{
  _id: ObjectId("507f1f77bcf86cd799439017"),
  filename: "web-dev-trends-2025.jpg",
  url: "https://cdn.example.com/images/web-dev-trends-2025.jpg",
  altText: "Graph showing web development trends",
  width: 1200,
  height: 630,
  articleId: ObjectId("507f1f77bcf86cd799439016"), // Used in article
  // This image is featured in 3 articles
}
```

### How It Works

- **One Media** can be used in **one Article** (via `articleId`)
- **One Media** can be **featured** in **many Articles** (via `featuredImageId` on Article)
- Media can exist **without an article** (uploaded but not used yet)

**Query Example:**

```typescript
// Get article with all its media
const article = await db.article.findUnique({
  where: { id: '...' },
  include: {
    media: true, // All media in article body
    featuredImage: true, // Featured image
  },
});
```

---

## 📊 Chapter 8: Tracking - Analytics

### What is Analytics?

**Analytics** tracks **every single page view** as an event. Each record = one view.

```prisma
model Analytics {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  articleId String  @db.ObjectId
  article   Article @relation(...)

  // Who viewed it
  sessionId String? // Browser session
  userId    String? @db.ObjectId // If logged in

  // Performance metrics (per view)
  lcp       Float? // Page load speed
  timeOnPage Float? // How long they stayed
  scrollDepth Float? // How far they scrolled
  bounced   Boolean // Did they leave immediately?

  // Traffic source
  source    TrafficSource // ORGANIC, DIRECT, SOCIAL, etc.
  timestamp DateTime // When they viewed it
}
```

### Real-World Example

```javascript
// Every time someone views an article, a new Analytics record is created
[
  {
    _id: ObjectId('507f1f77bcf86cd799439018'),
    articleId: ObjectId('507f1f77bcf86cd799439016'),
    sessionId: 'session-abc123',
    timeOnPage: 120.5, // 2 minutes
    scrollDepth: 85.0, // Scrolled 85%
    bounced: false,
    source: 'ORGANIC',
    timestamp: ISODate('2025-01-20T10:30:00Z'),
  },
  {
    _id: ObjectId('507f1f77bcf86cd799439019'),
    articleId: ObjectId('507f1f77bcf86cd799439016'),
    sessionId: 'session-xyz789',
    timeOnPage: 5.2, // Only 5 seconds
    scrollDepth: 10.0, // Barely scrolled
    bounced: true, // They left immediately
    source: 'SOCIAL',
    timestamp: ISODate('2025-01-20T11:15:00Z'),
  },
  // ... hundreds more view events
];
```

### How It Works

- **Event-based**: Each view = **one Analytics record**
- **Total views** = Count all records for an article
- **Unique visitors** = Count distinct `sessionId`
- **Time-based analysis** = Query by `timestamp` range

**Query Examples:**

```typescript
// Get total views for an article
const totalViews = await db.analytics.count({
  where: { articleId: '...' },
});
// Result: 1,247 views

// Get unique visitors
const uniqueSessions = await db.analytics.groupBy({
  by: ['sessionId'],
  where: { articleId: '...', sessionId: { not: null } },
});
// Result: 892 unique visitors

// Get views in last 7 days
const recentViews = await db.analytics.count({
  where: {
    articleId: '...',
    timestamp: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  },
});
```

---

## ❓ Chapter 9: Questions - FAQs

### What is FAQ?

**FAQ** stores question-answer pairs for articles (for SEO rich snippets).

```prisma
model FAQ {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  articleId String  @db.ObjectId
  article   Article @relation(...)
  question  String  // "What is React?"
  answer    String  // "React is a JavaScript library..."
  position  Int     // Order in FAQ list (1, 2, 3...)
}
```

### Real-World Example

```javascript
// Article about React has 3 FAQs
[
  {
    articleId: 'article-1',
    question: 'What is React?',
    answer: 'React is a JavaScript library for building user interfaces...',
    position: 1,
  },
  {
    articleId: 'article-1',
    question: 'Why use React?',
    answer: 'React offers component reusability, virtual DOM...',
    position: 2,
  },
];
```

**Query Example:**

```typescript
// Get article with FAQs
const article = await db.article.findUnique({
  where: { id: '...' },
  include: {
    faqs: {
      orderBy: { position: 'asc' }, // Ordered FAQ list
    },
  },
});
```

---

## 🔗 Chapter 10: Connections - Related Articles

### What is RelatedArticle?

**RelatedArticle** links articles together (e.g., "You might also like...").

```prisma
model RelatedArticle {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  articleId String  @db.ObjectId
  relatedId String  @db.ObjectId
  article   Article @relation("ArticleRelatedFrom", ...)
  related   Article @relation("ArticleRelatedTo", ...)
  relationshipType String? // "related", "similar", "recommended"
}
```

### Real-World Example

```javascript
// Article A is related to Articles B, C, D
[
  {
    articleId: 'article-A',
    relatedId: 'article-B',
    relationshipType: 'related',
  },
  {
    articleId: 'article-A',
    relatedId: 'article-C',
    relationshipType: 'similar',
  },
];
```

**Query Example:**

```typescript
// Get related articles
const article = await db.article.findUnique({
  where: { id: 'article-A' },
  include: {
    relatedTo: {
      include: { related: true }, // Get the actual related articles
    },
  },
});
// Result: Article A with 3 related articles
```

---

## 📚 Chapter 11: History - Article Versions

### What is ArticleVersion?

**ArticleVersion** stores **snapshots** of article content for version history/audit trail.

```prisma
model ArticleVersion {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  articleId String  @db.ObjectId
  article   Article @relation(...)

  // Snapshot of article at this point in time
  title          String
  content        String
  excerpt        String?
  seoTitle       String?
  seoDescription String?

  createdBy String? @db.ObjectId // Who made this change
  createdAt DateTime // When this version was created
}
```

### Real-World Example

```javascript
// Article was edited 3 times, so we have 3 versions
[
  {
    articleId: 'article-1',
    title: 'Original Title',
    content: 'Original content...',
    createdAt: ISODate('2025-01-10T10:00:00Z'),
  },
  {
    articleId: 'article-1',
    title: 'Updated Title',
    content: 'Updated content...',
    createdAt: ISODate('2025-01-15T14:30:00Z'),
  },
  {
    articleId: 'article-1',
    title: 'Final Title',
    content: 'Final content...',
    createdAt: ISODate('2025-01-20T09:15:00Z'),
  },
];
```

**Query Example:**

```typescript
// Get article with version history
const article = await db.article.findUnique({
  where: { id: '...' },
  include: {
    versions: {
      orderBy: { createdAt: 'desc' }, // Latest first
    },
  },
});
```

---

## 👥 Chapter 12: Users - Authentication

### What is User?

**User** represents people who can log in to the platform (admins, editors, clients).

```prisma
model User {
  id          String @id @default(auto()) @map("_id") @db.ObjectId
  name        String?
  email       String? @unique
  role        UserRole // ADMIN, CLIENT, EDITOR
  clientAccess String[] @db.ObjectId // Which clients this user can access

  accounts Account[]  // OAuth accounts (Google, Facebook)
  sessions Session[]  // Active sessions
}
```

### Real-World Example

```javascript
// Admin user
{
  _id: ObjectId("507f1f77bcf86cd799439020"),
  name: "Admin User",
  email: "admin@modonty.com",
  role: "ADMIN",
  clientAccess: [], // Admin can access all clients
  // Has 2 OAuth accounts (Google, Facebook)
  // Has 1 active session
}

// Client user (can only see their own client's articles)
{
  _id: ObjectId("507f1f77bcf86cd799439021"),
  name: "Client Manager",
  email: "manager@techcorp.com",
  role: "CLIENT",
  clientAccess: [ObjectId("507f1f77bcf86cd799439011")], // Only techcorp
}
```

### How It Works

- **One User** can have **many Accounts** (OAuth providers)
- **One User** can have **many Sessions** (multiple devices)
- Users have **roles** (ADMIN, CLIENT, EDITOR)
- Client users can only access specific clients

---

## 📧 Chapter 13: Subscribers - Newsletter

### What is Subscriber?

**Subscriber** represents people who signed up for a client's newsletter.

```prisma
model Subscriber {
  id       String  @id @default(auto()) @map("_id") @db.ObjectId
  email    String  @unique
  name     String?
  clientId String  @db.ObjectId
  client   Client  @relation(...)

  subscribed     Boolean @default(true)
  subscribedAt   DateTime
  unsubscribedAt DateTime?
  consentGiven   Boolean @default(false) // GDPR
}
```

### Real-World Example

```javascript
// Newsletter subscriber
{
  _id: ObjectId("507f1f77bcf86cd799439022"),
  email: "subscriber@example.com",
  name: "John Doe",
  clientId: ObjectId("507f1f77bcf86cd799439011"), // techcorp newsletter
  subscribed: true,
  subscribedAt: ISODate("2025-01-01T10:00:00Z"),
  consentGiven: true
}
```

---

## 🎯 Complete Data Flow Example

### Scenario: User Views an Article

```
1. User visits: /articles/future-of-web-development-2025

2. System queries:
   - Article by slug
   - Include: client, author, category, tags, featuredImage, faqs

3. User reads article (spends 2 minutes, scrolls 80%)

4. System creates Analytics event:
   {
     articleId: "article-1",
     sessionId: "session-abc123",
     timeOnPage: 120.5,
     scrollDepth: 80.0,
     bounced: false,
     source: "ORGANIC",
     timestamp: now()
   }

5. Display related articles:
   - Query RelatedArticle where articleId = "article-1"
   - Show 3 related articles
```

### Scenario: Creating a New Article

```
1. Author writes article in editor

2. System creates Article:
   {
     title: "New Article",
     content: "...",
     clientId: "techcorp-id",
     authorId: "sarah-id",
     categoryId: "technology-id",
     status: "DRAFT"
   }

3. Author adds tags:
   - Create ArticleTag: { articleId, tagId: "react" }
   - Create ArticleTag: { articleId, tagId: "nextjs" }

4. Author uploads featured image:
   - Create Media: { url: "...", altText: "..." }
   - Update Article: { featuredImageId: "media-id" }

5. Author publishes:
   - Update Article: { status: "PUBLISHED", datePublished: now() }
   - Create ArticleVersion: { snapshot of current content }

6. Article is now live and trackable via Analytics
```

---

## 🔍 Query Patterns

### Pattern 1: Get Article with Everything

```typescript
const article = await db.article.findUnique({
  where: { slug: 'article-slug' },
  include: {
    client: true, // Company info
    author: true, // Author info
    category: true, // Category info
    tags: { include: { tag: true } }, // All tags
    featuredImage: true, // Featured image
    media: true, // All images in article
    faqs: { orderBy: { position: 'asc' } }, // FAQ section
    relatedTo: {
      // Related articles
      include: { related: true },
      take: 5,
    },
    analytics: {
      // Recent views
      orderBy: { timestamp: 'desc' },
      take: 10,
    },
  },
});
```

### Pattern 2: Get Articles List (Infinite Scroll)

```typescript
// Get paginated articles
const articles = await db.article.findMany({
  where: {
    status: 'PUBLISHED',
    datePublished: { lte: new Date() },
  },
  include: {
    client: true,
    author: true,
    category: true,
    featuredImage: true,
  },
  orderBy: { datePublished: 'desc' },
  skip: page * 20, // Pagination
  take: 20, // 20 per page
});
```

### Pattern 3: Get Analytics Summary

```typescript
// Get article with analytics summary
const [article, totalViews, uniqueVisitors, avgTime] = await Promise.all([
  db.article.findUnique({ where: { id } }),
  db.analytics.count({ where: { articleId: id } }),
  db.analytics
    .groupBy({
      by: ['sessionId'],
      where: { articleId: id, sessionId: { not: null } },
    })
    .then((r) => r.length),
  db.analytics
    .aggregate({
      where: { articleId: id, timeOnPage: { not: null } },
      _avg: { timeOnPage: true },
    })
    .then((r) => r._avg.timeOnPage || 0),
]);
```

---

## 📊 Relationship Summary

```
Client (1) ──→ (Many) Article
Author (1) ──→ (Many) Article
Category (1) ──→ (Many) Article
Article (Many) ←→ (Many) Tag (via ArticleTag)
Article (1) ──→ (Many) Media
Article (1) ──→ (Many) Analytics
Article (1) ──→ (Many) FAQ
Article (Many) ←→ (Many) Article (via RelatedArticle)
Article (1) ──→ (Many) ArticleVersion
Client (1) ──→ (Many) Subscriber
Category (1) ──→ (Many) Category (self-relation, hierarchical)
```

---

## 🎓 Key Takeaways

1. **Article is the Hub**: Everything connects to Article
2. **Multi-Tenancy**: Articles are isolated by Client
3. **Event-Based Analytics**: Each view = one record
4. **Many-to-Many**: Articles ↔ Tags via ArticleTag junction table
5. **Self-Relations**: Categories can have parent categories
6. **Version History**: ArticleVersion stores snapshots
7. **SEO-First**: Every model has SEO fields for optimization

---

## 💡 Best Practices Demonstrated

✅ **Denormalization**: Article stores all SEO fields (accessed together)
✅ **Event-Based Tracking**: Analytics = one record per event
✅ **Junction Tables**: ArticleTag for many-to-many relationships
✅ **Indexes**: All query patterns are indexed
✅ **MongoDB-Friendly**: No emulated cascades, proper ObjectId usage

---

This schema is designed for a **multi-client blog platform** with **comprehensive SEO** and **detailed analytics tracking**. Every piece connects logically, and queries are optimized with proper indexes.
