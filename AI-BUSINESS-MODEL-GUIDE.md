# AI Business Model Guide - Modonty Platform

> **Purpose**: This document provides comprehensive guidance for AI assistants to understand Modonty's business model, how it's implemented in the codebase, and how to make decisions that align with business objectives.

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Business Model](#core-business-model)
3. [Technical Architecture & Business Alignment](#technical-architecture--business-alignment)
4. [Database Models & Business Logic](#database-models--business-logic)
5. [Subscription Management](#subscription-management)
6. [Authority Blog System](#authority-blog-system)
7. [Key Business Features](#key-business-features)
8. [Customer Journey & Workflows](#customer-journey--workflows)
9. [Development Guidelines](#development-guidelines)
10. [Business Rules & Constraints](#business-rules--constraints)

---

## 🎯 Executive Summary

**Modonty** is a **subscription-based Arabic content platform** that operates on a unique **Authority Blog System**. The platform combines:

1. **Central Authority Blog** (`home/` package) - Public-facing blog that compounds value (Modonty.com)
2. **Multi-Client Content Management** (`admin/` package) - Internal admin dashboard (jbrtechno.com)
3. **Beta Testing Platform** (`beta/` package) - Testing environment for new features before production
4. **Shared Database** (`dataLayer/` package) - Unified data model

**Value Proposition**: "Presence, Not Promises" - Real digital presence through a smart content ecosystem.

**Key Differentiators**:
- Authority Blog that grows stronger with each article (compounding value)
- 18 months of content for 12 months payment
- GTM integration for transparency (clients see real results)
- 90% cost savings vs. traditional agencies
- Manual, high-quality Arabic content

---

## 💼 Core Business Model

### The Two-Article System

**1. Main Article (Authority Blog)**
- Published on Modonty's central blog (`home/` package)
- High-quality, SEO-optimized Arabic content
- Mentions client's business naturally within content
- Strategic backlinks to client's website
- Grows domain authority over time (compounding effect)

**2. Customized Version (Client's Site) - Premium Only**
- Same concept, customized for client
- Mentions client's name, services, products
- Ready to publish on client's website
- Premium tier feature only

### The Compounding Effect

```
New Article → Strengthens Authority Blog → Stronger Backlinks → More Traffic for Clients
```

**Timeline**:
- **Month 1-3**: Foundation Building (blog gains initial authority)
- **Month 4-6**: Momentum Building (traffic increases)
- **Month 7-12**: Acceleration (significant traffic growth)
- **Month 13-18**: Maturity (bonus months, full ROI visible)

**Network Effect**: More clients = More articles = Stronger blog = Better results for all

### Pricing Tiers

| Tier      | Price (SAR/year) | Articles/Month | Target Market              |
|-----------|------------------|----------------|----------------------------|
| **Basic** | 2,499           | 2             | Small businesses, startups |
| **Standard** | 3,999         | 4             | Growing businesses (Most Popular) |
| **Pro**   | 6,999           | 8             | Established businesses     |
| **Premium** | 9,999         | 12            | Large enterprises, agencies |

**Key Features**:
- All tiers: Authority Blog articles + backlinks + GTM tracking
- Premium only: Customized versions for client websites + CMS integration

---

## 🏗️ Technical Architecture & Business Alignment

### Monorepo Structure

```
modonty-monorepo/
├── admin/              # Internal admin dashboard
│   └── Purpose: Content management, client management, article publishing
│   └── Business Role: Operations hub (jbrtechno.com)
│
├── beta/               # Beta testing platform
│   └── Purpose: Testing environment for new features before production
│   └── Business Role: Quality assurance and staging
│
├── home/               # Public Authority Blog platform
│   └── Purpose: Public-facing blog where articles are published
│   └── Business Role: Content system (Modonty.com)
│
└── dataLayer/          # Shared database
    └── Purpose: Unified data model for all platforms
    └── Business Role: Single source of truth
```

### Platform-to-Business Mapping

**1. Admin Dashboard (`admin/`)**
- **Business Purpose**: Internal operations and content management
- **Users**: Modonty staff, content writers, admins
- **Features**: Article creation, client management, publishing, analytics
- **Business Value**: Enables content creation and delivery workflow

**2. Beta Platform (`beta/`)**
- **Business Purpose**: Testing environment for new features before production
- **Users**: Development team, QA testers
- **Features**: Feature testing, quality assurance, staging environment
- **Business Value**: Ensures stability and quality before public release

**3. Home Platform (`home/`)**
- **Business Purpose**: Public Authority Blog where articles are published
- **Users**: Public readers, search engines
- **Features**: Article browsing, reading, SEO optimization
- **Business Value**: The compounding asset that delivers backlinks to clients (Modonty.com)

---

## 📊 Database Models & Business Logic

### Core Business Entities

#### 1. Client Model (`Client`)

**Business Purpose**: Represents subscribing businesses

**Key Business Fields**:
```prisma
model Client {
  // Subscription Management
  subscriptionTier      SubscriptionTier?  // BASIC, STANDARD, PRO, PREMIUM
  subscriptionStartDate DateTime?
  subscriptionEndDate   DateTime?
  articlesPerMonth      Int?              // Calculated from tier
  subscriptionStatus    SubscriptionStatus @default(PENDING)
  paymentStatus         PaymentStatus      @default(PENDING)
  
  // Business Information
  businessBrief         String?           // For content writers
  industryId            String?           // Industry/category
  targetAudience        String?           // For content targeting
  contentPriorities     String[]          // Key topics
  
  // GTM Integration (Transparency)
  gtmId                 String?           // Google Tag Manager ID
  
  // SEO & Branding
  seoTitle              String?
  seoDescription        String?
  logoMediaId           String?           // Centralized media reference
  ogImageMediaId        String?           // Social sharing image
}
```

**Business Rules**:
- Each client has a subscription tier that determines `articlesPerMonth`
- `subscriptionEndDate` should be `subscriptionStartDate + 18 months` (18 months for 12 months payment)
- GTM ID enables clients to see real results in their Analytics

**Implementation Location**: `dataLayer/prisma/schema/schema.prisma`

#### 2. Article Model (`Article`)

**Business Purpose**: Content that serves both Authority Blog and clients

**Key Business Fields**:
```prisma
model Article {
  // Relationships
  clientId   String  @db.ObjectId  // Which client this article serves
  client     Client  @relation(...)
  authorId   String  @db.ObjectId  // Author (E-E-A-T)
  categoryId String? @db.ObjectId  // Content organization
  
  // Workflow
  status      ArticleStatus @default(DRAFT)  // DRAFT, PUBLISHED, ARCHIVED
  scheduledAt DateTime?                      // For scheduled publishing
  featured    Boolean       @default(false)  // Featured on Authority Blog
  
  // SEO (Critical for Authority Blog)
  seoTitle       String?
  seoDescription String?
  datePublished  DateTime?
  canonicalUrl   String?
  
  // Open Graph & Twitter Cards (Social sharing)
  ogTitle         String?
  ogDescription   String?
  ogImage         String?
  twitterCard     String?
  twitterTitle    String?
}
```

**Business Rules**:
- Articles must be `PUBLISHED` to appear on Authority Blog
- `scheduledAt` enables monthly content delivery automation
- SEO fields are critical - Authority Blog's strength depends on SEO quality
- Each article must belong to a client (backlink target)

**Implementation Location**: `dataLayer/prisma/schema/schema.prisma`

**Admin Interface**: `admin/app/(dashboard)/articles/`
**Public Display**: `home/app/articles/[slug]/`

#### 3. Author Model (`Author`)

**Business Purpose**: E-E-A-T (Expertise, Experience, Authoritativeness, Trustworthiness) signals

**Key Business Fields**:
```prisma
model Author {
  // E-E-A-T Signals
  credentials        String[]  // Degrees, certifications
  qualifications     String[]  // Professional qualifications
  expertiseAreas     String[]  // Topics of specialization
  experienceYears    Int?
  verificationStatus Boolean   @default(false)
  memberOf          String[]  // Professional organizations
  
  // Social Profiles (Verification)
  linkedIn String?
  twitter  String?
  facebook String?
  
  // SEO
  seoTitle       String?
  seoDescription String?
}
```

**Business Rules**:
- Authors with higher E-E-A-T signals increase Authority Blog credibility
- Verified authors (`verificationStatus: true`) add trust
- Social profiles provide verification (sameAs schema)

**Business Value**: Higher author credibility = Higher Authority Blog domain authority = More valuable backlinks

#### 4. Analytics Model (`Analytics`)

**Business Purpose**: Track Authority Blog performance and client results

**Key Business Fields**:
```prisma
model Analytics {
  articleId String  @db.ObjectId  // Which article
  clientId  String? @db.ObjectId  // Which client benefits
  
  // Core Web Vitals (2025 Standard)
  lcp  Float?  // Largest Contentful Paint (< 2.5s target)
  cls  Float?  // Cumulative Layout Shift (< 0.1 target)
  inp  Float?  // Interaction to Next Paint (< 200ms target)
  ttfb Float?  // Time to First Byte (< 800ms target)
  
  // Engagement
  timeOnPage  Float?   // Seconds on page
  scrollDepth Float?   // Percentage scrolled
  bounced     Boolean  @default(false)
  
  // Traffic Sources
  source         TrafficSource @default(ORGANIC)
  searchEngine   String?
  referrerDomain String?
}
```

**Business Rules**:
- Analytics data enables transparency (clients see real results)
- Good Core Web Vitals improve Authority Blog rankings
- Traffic source data helps optimize content strategy

**Business Value**: Transparent analytics builds client trust and justifies renewal

---

## 💳 Subscription Management

### Subscription Tiers

**Database Implementation**:
```prisma
enum SubscriptionTier {
  BASIC     // 2 articles/month
  STANDARD  // 4 articles/month
  PRO       // 8 articles/month
  PREMIUM   // 12 articles/month
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PENDING
}
```

### Business Logic Rules

**1. Articles Per Month Calculation**:
```typescript
// Pseudo-code for subscription logic
const ARTICLES_PER_TIER = {
  BASIC: 2,
  STANDARD: 4,
  PRO: 8,
  PREMIUM: 12,
};

const articlesPerMonth = ARTICLES_PER_TIER[client.subscriptionTier];
```

**2. Subscription Duration**:
- Payment: 12 months
- Delivery: 18 months
- Calculation: `subscriptionEndDate = subscriptionStartDate + 18 months`

**3. Content Delivery Workflow**:
1. Client subscribes (tier selected)
2. Monthly quota calculated (`articlesPerMonth`)
3. Articles created by content team (admin dashboard)
4. Articles tested on beta platform (optional QA step)
5. Articles published on Authority Blog (home platform)
6. Customized versions delivered to Premium clients
7. Results tracked via GTM integration

**Implementation Location**:
- Schema: `dataLayer/prisma/schema/schema.prisma` (Client model)
- Admin UI: `admin/app/(dashboard)/clients/` (subscription management)

---

## 🚀 Authority Blog System

### How It Works Technically

**1. Article Publishing Flow**:

```
Admin Dashboard (admin/)
    ↓ [Content team creates article]
Database (dataLayer/)
    ↓ [Article saved with status: PUBLISHED]
Authority Blog (home/)
    ↓ [Article displayed to public]
Search Engines
    ↓ [SEO optimization drives organic traffic]
Backlinks
    ↓ [Links to client websites]
Client Analytics (GTM)
    ↓ [Clients see real results]
```

**2. SEO Implementation**:

**Location**: `home/app/articles/[slug]/page.tsx`

**Key Features**:
- Schema.org structured data (Article, Person, Organization)
- Open Graph meta tags (social sharing)
- Twitter Cards (Twitter sharing)
- Canonical URLs (avoid duplicate content)
- Sitemap generation (`home/app/sitemap.ts`)
- Robots.txt (`home/app/robots.ts`)

**Business Value**: Strong SEO = Higher rankings = More organic traffic = More valuable backlinks

**3. Compounding Effect Implementation**:

**Database Tracking**:
- Each published article increases Authority Blog content library
- Analytics model tracks article performance
- Related articles create internal linking structure
- Author E-E-A-T signals accumulate over time

**Business Logic**:
```typescript
// Concept: Authority Blog strength compounds
const authorityBlogStrength = {
  totalArticles: await db.article.count({ where: { status: 'PUBLISHED' } }),
  totalAuthors: await db.author.count(),
  averageSeoScore: calculateAverageSEOScore(),
  domainAuthority: estimateDomainAuthority(), // Based on content quality
};

// Stronger blog = More valuable backlinks
const backlinkValue = calculateBacklinkValue(authorityBlogStrength);
```

---

## 🎯 Key Business Features

### 1. GTM Integration (Transparency)

**Purpose**: Clients see real results in their own Google Analytics

**Implementation**:
- Client model has `gtmId` field
- GTM container ID injected into client's website
- Article traffic tracked and visible in client's Analytics

**Business Value**: Transparency builds trust and justifies renewal

**Technical Location**: `admin/app/(dashboard)/clients/` (GTM configuration)

### 2. Multi-Client Content Management

**Purpose**: Serve multiple clients from one platform

**Implementation**:
- Client model with subscription management
- Articles belong to clients (`clientId` field)
- Content isolated by client (multi-tenancy)
- Admin dashboard manages all clients

**Business Value**: Scalable operations, shared Authority Blog benefits all clients

**Technical Location**: `admin/app/(dashboard)/clients/`, `admin/app/(dashboard)/articles/`

### 3. Article Versioning

**Purpose**: Track content changes and maintain history

**Implementation**:
- `ArticleVersion` model stores article snapshots
- Version history for audit trail
- Enables content refresh (Premium feature)

**Business Value**: Content quality control, audit compliance

**Technical Location**: `dataLayer/prisma/schema/schema.prisma` (ArticleVersion model)

### 4. Scheduled Publishing

**Purpose**: Monthly content delivery automation

**Implementation**:
- Articles have `scheduledAt` field
- Cron job or scheduled task publishes articles
- Ensures consistent monthly delivery

**Business Value**: Reliable content delivery, reduces manual work

**Technical Location**: `dataLayer/prisma/schema/schema.prisma` (Article.scheduledAt)

### 5. Media Management with SEO

**Purpose**: Optimized images for Authority Blog SEO

**Implementation**:
- `Media` model with Cloudinary integration
- SEO fields: `altText`, `caption`, `title`, `description`
- EXIF data extraction
- Centralized media for clients (logo, OG images)

**Business Value**: Image SEO improves Authority Blog rankings

**Technical Location**: `admin/app/(dashboard)/media/`, `dataLayer/prisma/schema/schema.prisma` (Media model)

---

## 👥 Customer Journey & Workflows

### Customer Journey Map

**1. Discovery**
- **Where**: Marketing campaigns, partnerships, Authority Blog
- **Platform**: Authority Blog (`home/` package - Modonty.com) or sales team
- **Action**: Client learns about Modonty and sees Authority Blog content

**2. Understanding**
- **Where**: Authority Blog, website, sales team
- **Platform**: Authority Blog (`home/` package) showcases Authority Blog concept
- **Action**: Client understands Authority Blog concept and sees real examples

**3. Subscription**
- **Where**: Sales team or admin dashboard (client portal - future feature)
- **Platform**: Manual setup via admin dashboard (`admin/`) or sales team
- **Action**: Client chooses tier and pays annual subscription
- **Database**: Client record created with subscription details

**4. Onboarding**
- **Where**: Admin dashboard or client portal
- **Platform**: `admin/app/(dashboard)/clients/[id]/edit/`
- **Action**: Client provides business info, priorities, GTM access
- **Database**: Client record updated with business details

**5. Content Delivery**
- **Where**: Admin dashboard → Beta testing → Authority Blog
- **Platform**: `admin/app/(dashboard)/articles/` → Optional `beta/` testing → `home/` Authority Blog
- **Action**: Content team creates articles, optionally tests on beta, publishes to Authority Blog
- **Database**: Articles created and published monthly (based on tier quota)
- **Workflow**: Article → (Optional: Beta Testing) → Authority Blog (`home/`) → Backlinks → Client results

**6. Publishing** (Premium Only)
- **Where**: Client's website
- **Platform**: Client receives customized article
- **Action**: Client publishes customized version on their site
- **Business Value**: Client gets ready-to-publish content

**7. Tracking**
- **Where**: Client's Google Analytics
- **Platform**: GTM integration
- **Action**: Client sees article traffic and results
- **Business Value**: Transparency builds trust

**8. Renewal**
- **Where**: Sales team or admin dashboard (client portal - future feature)
- **Platform**: Authority Blog (`home/` package) shows published articles, admin dashboard tracks results
- **Action**: Client renews based on visible results from Authority Blog articles and GTM analytics
- **Business Value**: Results justify renewal

### Key Workflows in Codebase

**1. Article Creation Workflow**:
```
admin/app/(dashboard)/articles/new/
  → Article form with all SEO fields
  → Select client, author, category
  → Set schedule (scheduledAt)
  → Publish or save as draft
  → Article appears on Authority Blog (home/)
  → Optional: Test on beta/ before production
```

**2. Client Onboarding Workflow**:
```
admin/app/(dashboard)/clients/new/
  → Create client record
  → Set subscription tier
  → Calculate articlesPerMonth
  → Set subscription dates (start + 18 months)
  → Configure GTM ID
  → Add business details
```

**3. Content Publishing Workflow**:
```
admin/app/(dashboard)/articles/
  → Filter by status: DRAFT
  → Select articles to publish
  → Optional: Test on beta/ platform first
  → Set status: PUBLISHED
  → Articles appear on Authority Blog (home/app/articles/)
  → SEO meta tags generated
  → Sitemap updated
```

---

## 🛠️ Development Guidelines

### Business Model Considerations

**When Adding Features**:

1. **Consider Authority Blog Impact**
   - Does this strengthen or weaken Authority Blog?
   - Does this improve SEO rankings?
   - Does this increase backlink value?

2. **Consider Subscription Model**
   - Is this feature available to all tiers or Premium only?
   - Does this affect monthly article quotas?
   - Does this impact subscription renewal?

3. **Consider Transparency**
   - Can clients see this data in their Analytics?
   - Does this build trust or add complexity?
   - Is GTM integration needed?

4. **Consider Content Quality**
   - Does this improve content quality?
   - Does this help E-E-A-T signals?
   - Does this streamline content creation?

**Example Decisions**:

✅ **Good**: Adding schema.org structured data (improves Authority Blog SEO)
✅ **Good**: Premium-only CMS integration (tier differentiation)
✅ **Good**: Article versioning (quality control, audit trail)
❌ **Bad**: Removing SEO fields (weakens Authority Blog)
❌ **Bad**: Making all features free (reduces Premium value)
❌ **Bad**: Complex UI that confuses content writers (slows delivery)

### Feature Prioritization Framework

**High Priority** (Strengthens Authority Blog):
- SEO optimizations
- Content quality tools
- Analytics and tracking
- Performance improvements

**Medium Priority** (Improves Operations):
- Admin dashboard enhancements
- Content creation tools
- Client management features

**Low Priority** (Nice to Have):
- UI polish (unless it improves usability significantly)
- Experimental features
- Non-critical integrations

---

## 📐 Business Rules & Constraints

### Critical Business Rules

**1. Subscription Rules**:
- ✅ Clients pay for 12 months, receive 18 months
- ✅ Articles per month based on subscription tier
- ✅ Premium tier gets customized article versions
- ✅ Subscription status must be ACTIVE for content delivery

**2. Authority Blog Rules**:
- ✅ Only PUBLISHED articles appear on Authority Blog
- ✅ All articles must have SEO fields (title, description)
- ✅ Articles must belong to a client (backlink target)
- ✅ Authors must have E-E-A-T signals

**3. Content Delivery Rules**:
- ✅ Monthly articles delivered based on tier quota
- ✅ Articles scheduled via `scheduledAt` field
- ✅ Premium clients receive customized versions
- ✅ All articles include backlinks to client websites

**4. Transparency Rules**:
- ✅ GTM integration for all clients (optional but encouraged)
- ✅ Analytics data tracks Authority Blog performance
- ✅ Client can see article traffic in their Analytics
- ✅ Results must be measurable and visible

### Technical Constraints

**1. Database Constraints**:
- Single schema (`dataLayer/prisma/schema/schema.prisma`) for all apps
- MongoDB ObjectId format for all IDs
- Unique constraints on slugs (client, article, category, etc.)

**2. Platform Constraints**:
- Admin dashboard: Server actions for mutations
- Beta platform: Testing/staging environment for quality assurance
- Home platform (Authority Blog): Server-side rendering for SEO, REST API for mobile compatibility

**3. SEO Constraints**:
- All public pages must have SEO meta tags
- Schema.org structured data required for articles
- Canonical URLs must be set
- Sitemap must be generated

---

## 🎓 AI Assistant Decision Framework

### When Making Code Changes

**Ask These Questions**:

1. **Business Impact**:
   - Does this change support or hinder the Authority Blog system?
   - Does this affect subscription tiers or client value?
   - Does this improve or reduce transparency?

2. **Technical Alignment**:
   - Does this follow monorepo structure rules?
   - Does this maintain database schema integrity?
   - Does this preserve SEO optimization?

3. **User Experience**:
   - Does this improve content creation workflow?
   - Does this enhance Authority Blog reader experience?
   - Does this simplify client onboarding?

4. **Value Delivery**:
   - Does this help deliver monthly content quota?
   - Does this strengthen backlink value?
   - Does this build client trust?

### Decision Matrix

| Change Type | Authority Blog Impact | Subscription Impact | Priority |
|-------------|----------------------|---------------------|----------|
| SEO Optimization | ✅ High | ✅ None | 🔴 High |
| Subscription Feature | ⚠️ Neutral | ✅ High | 🔴 High |
| Content Creation Tool | ✅ High | ⚠️ Medium | 🟡 Medium |
| UI Polish | ⚠️ Low | ⚠️ Low | 🟢 Low |
| Analytics Enhancement | ✅ High | ✅ High | 🔴 High |

---

## 📚 Key Files Reference

### Business Logic Files

**Subscription Management**:
- `dataLayer/prisma/schema/schema.prisma` (Client model)
- `admin/app/(dashboard)/clients/` (Client management UI)

**Article Management**:
- `dataLayer/prisma/schema/schema.prisma` (Article model)
- `admin/app/(dashboard)/articles/` (Article management UI)
- `home/app/articles/[slug]/` (Public article display)

**Authority Blog**:
- `home/app/page.tsx` (Home page with article feed)
- `home/app/articles/[slug]/page.tsx` (Article detail page)
- `home/app/sitemap.ts` (Sitemap generation)
- `home/app/robots.ts` (Robots.txt)

**Beta Testing**:
- `beta/app/articles/[slug]/` (Beta article display for testing)

**SEO Implementation**:
- `admin/lib/seo/structured-data.ts` (Schema.org generation)
- `home/lib/seo.ts` (SEO meta tags)
- `admin/app/(dashboard)/articles/components/article-form-enhanced.tsx` (SEO form fields)

**Analytics**:
- `dataLayer/prisma/schema/schema.prisma` (Analytics model)
- `admin/app/(dashboard)/articles/[id]/components/article-view.tsx` (Article analytics)

---

## 🔍 Quick Reference

### Business Model Summary

```
Subscription Tiers → Monthly Article Quotas → Content Creation → 
Authority Blog Publishing → SEO Optimization → Organic Traffic → 
Backlinks to Clients → GTM Tracking → Client Results → Renewal
```

### Key Metrics

- **Authority Blog Strength**: Total published articles, domain authority, SEO scores
- **Client Satisfaction**: Renewal rate, subscription status, content usage
- **Content Quality**: E-E-A-T signals, article performance, SEO rankings
- **Business Health**: Monthly delivery consistency, subscription revenue, client growth

### Success Indicators

- ✅ High Authority Blog domain authority
- ✅ Strong SEO rankings for target keywords
- ✅ High client renewal rate
- ✅ Consistent monthly content delivery
- ✅ Positive client feedback on results
- ✅ Growing Authority Blog traffic
- ✅ Measurable client results (via GTM)

---

## 📝 Notes for AI Assistants

### Always Remember

1. **Authority Blog is the core asset** - Every change should consider its impact
2. **Transparency builds trust** - GTM integration and analytics are critical
3. **Content quality matters** - E-E-A-T signals and SEO optimization are non-negotiable
4. **Subscription model drives value** - Tier differentiation must be maintained
5. **18 months for 12 months** - This is a key differentiator, must be honored

### Common Patterns

**When adding article features**:
- Always consider SEO impact
- Maintain E-E-A-T requirements
- Ensure Authority Blog display works correctly
- Check subscription tier access

**When modifying client features**:
- Maintain subscription tier structure
- Preserve GTM integration
- Keep business information fields
- Ensure quota calculations are correct

**When changing database schema**:
- Consider impact on Authority Blog SEO
- Maintain subscription logic
- Preserve analytics tracking
- Test on beta platform before deploying to production (home platform)
- Ensure all three platforms (admin, beta, home) remain compatible

---

**Last Updated**: 2025-01-27 (Updated: Platform architecture corrected - beta/ for testing, home/ for Authority Blog)  
**Purpose**: Guide AI assistants in understanding Modonty's business model and making development decisions that align with business objectives  
**Target Audience**: AI coding assistants working on this codebase
