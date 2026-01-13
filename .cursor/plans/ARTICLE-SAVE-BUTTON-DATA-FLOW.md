# Article Save Button - Complete Data Flow Documentation

## Overview

This document explains what happens when you click the "Save" button on the article creation page (`http://localhost:3000/articles/new`). It covers all the data collected from the 8-step form and what gets saved to the database.

---

## The 8-Step Form Structure

The article creation form is divided into 8 steps:

1. **Basic Information** - Title, client, category, excerpt, tags
2. **Content** - Main article content
3. **Media** - Featured image and gallery
4. **FAQs** - Frequently asked questions
5. **Settings** - Publishing settings and SEO basics
6. **Related Articles** - Links to related content
7. **Technical SEO** - Advanced SEO settings
8. **Review** - Final review before saving

---

## What Happens When You Click Save

### Step 1: Button Click

- You click the "Save" button (visible in the navigation bar or as a sticky button at the bottom)
- The button shows a loading spinner while saving
- The button becomes disabled to prevent double-clicking

### Step 2: Data Collection

- The system collects ALL data you entered across all 8 steps
- This includes both required fields (like title and content) and optional fields (like tags and FAQs)
- All form data is gathered into a single data object

### Step 3: Data Processing

The system automatically calculates and generates some values:

**Content Analysis:**

- **Word Count** - Counts total words in your content
- **Reading Time** - Estimates how long it takes to read (based on ~200-250 words per minute)
- **Content Depth** - Determines if content is "short", "medium", or "long" based on word count

**SEO Auto-Generation:**

- **SEO Title** - Auto-generates from title + client name if you didn't fill it
- **SEO Description** - Auto-generates from excerpt if you didn't fill it (truncated to 155-160 characters)
- **Canonical URL** - Auto-generates from slug and client slug
- **Breadcrumb Path** - Creates navigation path from category name/slug and article title/slug

**Status & Dates:**

- **Status** - Always set to "WRITING" for new articles (cannot be changed during creation)
- **Creative Work Status** - Set to "draft" (since status is WRITING)
- **Meta Robots** - Set to "noindex, follow" (since article is not published)
- **Date Published** - Set to null (no publication date yet)

**Sitemap Settings:**

- **Sitemap Priority** - Set to 0.8 if article is featured, otherwise 0.5
- **Sitemap Change Frequency** - Defaults to "weekly"

**SEO Data Generation (After Article Save):**

- **Next.js Metadata Object** - Complete Next.js Metadata object is generated
  - Includes: title, description, Open Graph, Twitter cards, robots configuration
  - Generated from article data + client + author + category + featured image
  - Stored in database for fast page rendering
- **JSON-LD Structured Data** - Complete JSON-LD knowledge graph is generated
  - Includes: Article, WebPage, Organization, Person, BreadcrumbList entities
  - Validated against Schema.org standards
  - Stored in database for SEO and rich results

**Note:** Metadata and JSON-LD generation happens after the article is saved. If generation fails, the article still saves successfully (generation is non-blocking).

### Step 4: Database Save

The system saves data to multiple database tables (explained in detail below)

### Step 5: Result

- **Success**: You see a success message "تم الحفظ بنجاح" (Saved successfully) with sub-message "تم حفظ المقال بنجاح وهو في انتظار معاينة المدير" (Article saved successfully and is waiting for admin review). You're automatically redirected to the articles list page.
- **Error**: You see an error message explaining what went wrong. The article is NOT saved, and you can fix the issue and try again.

---

## Complete Data Saved to Database

### Main Article Record (Article Table)

This is the primary record that stores all the main article information.

#### Basic Information:

- **Title** - The article headline (required)
- **Slug** - URL-friendly version of title (auto-generated from title if not provided)
- **Excerpt** - Short summary/description (optional, 150-160 characters recommended)
- **Content** - Full article content in HTML/rich text format (required)
- **Content Format** - Type of content format (default: "rich_text")

#### Relationships:

- **Client ID** - Which client this article belongs to (required - must select a client)
- **Category ID** - Article category (optional - can be left empty)
- **Author ID** - Always automatically set to "Modonty" author ID (you don't choose this)

#### Status & Publishing:

- **Status** - Always set to "WRITING" for new articles (this means the article is being written and is not published yet. An admin must review and publish it later)
- **Featured** - Whether article is featured/starred (true/false checkbox)
- **Scheduled At** - Future publication date/time if you want to schedule it (optional, can be null)
- **Date Published** - Actual publication date (always null for new articles since they're not published yet)

#### Content Analysis (Auto-Calculated):

- **Word Count** - Total number of words in your content (automatically counted)
- **Reading Time Minutes** - Estimated reading time in minutes (calculated from word count, assuming ~200-250 words per minute)
- **Content Depth** - Classification: "short", "medium", or "long" (based on word count thresholds)
- **In Language** - Language code (default: "ar" for Arabic)
- **Is Accessible For Free** - Always set to true
- **License** - Content license type (optional, can be null)

#### SEO Meta Tags:

- **SEO Title** - Title for search engines (30-60 characters recommended, auto-generated if empty)
- **SEO Description** - Description for search engines (120-160 characters recommended, auto-generated if empty)
- **Meta Robots** - Search engine instructions (default: "noindex, follow" for WRITING status)
- **Canonical URL** - Preferred URL for this content (auto-generated from slug and client)
- **Robots Meta** - Combined robots directive (same as metaRobots)
- **Sitemap Priority** - Importance for search engines (0.0 to 1.0, default: 0.5, or 0.8 if featured)
- **Sitemap Change Frequency** - How often content changes (default: "weekly", options: always, hourly, daily, weekly, monthly, yearly, never)
- **Alternate Languages** - Other language versions of this article (optional array, can be empty)

#### Open Graph (Social Media Sharing):

These fields control how your article appears when shared on Facebook, LinkedIn, etc.

- **OG Type** - Type of content (default: "article")
- **OG Article Author** - Author name for social sharing (auto-filled from author if empty)
- **OG Article Published Time** - Publication date for social sharing (null for new articles)
- **OG Article Modified Time** - Last modification date (set to current time when saved)
- **OG Updated Time** - Last update timestamp (null for new articles)

#### Twitter Cards:

These fields control how your article appears when shared on Twitter/X.

- **Twitter Card** - Card type (default: "summary_large_image")
- **Twitter Site** - Twitter handle for the site (optional)
- **Twitter Creator** - Author Twitter handle (optional)
- **Twitter Label 1** - Custom label for Twitter card (optional)
- **Twitter Data 1** - Custom data for Twitter card (optional)

#### Technical SEO:

- **Main Entity Of Page** - Canonical URL (same as canonicalUrl field)
- **Creative Work Status** - Status in schema.org format ("draft" for WRITING status)
- **Breadcrumb Path** - Navigation path in JSON format (auto-generated from category and article info)
- **Last Reviewed** - Content review date (optional, can be null)

#### Media:

- **Featured Image ID** - Reference to the featured image you selected (optional, can be null)

#### Timestamps (Auto-Set):

- **Created At** - When article was created (automatically set to current date/time)
- **Updated At** - When article was last modified (automatically updates every time you save)

#### Next.js Metadata Cache (Auto-Generated):

- **Next.js Metadata** - Pre-generated Next.js Metadata object (JSON format)
  - Contains: title, description, Open Graph tags, Twitter cards, robots configuration
  - Generated automatically during article save
  - Used for fast page rendering (no computation needed)
  - Size: ~1-2KB per article
- **Next.js Metadata Last Generated** - Timestamp when metadata was last generated

#### JSON-LD Structured Data (Auto-Generated):

- **JSON-LD Structured Data** - Pre-generated JSON-LD knowledge graph (string format)
  - Contains: Article, WebPage, Organization, Person, BreadcrumbList, FAQPage entities
  - Generated automatically during article save
  - Used for SEO and rich results
  - Size: ~3-5KB per article
- **JSON-LD Last Generated** - Timestamp when JSON-LD was last generated
- **JSON-LD Validation Report** - Validation results from Adobe and custom validators
- **Article Body Text** - Plain text extracted from content (for schema.org articleBody)

**Note:** Both Next.js Metadata and JSON-LD are generated automatically when you save an article. If generation fails, the article still saves successfully (generation is non-blocking).

---

### Tags (ArticleTag Table)

**When this is saved:** If you selected any tags in Step 1 or Step 4

**What gets saved:**

- Each selected tag creates a separate record linking the article to that tag
- **Article ID** - Links to your article
- **Tag ID** - Links to each selected tag

**Example:** If you selected 3 tags (Technology, SEO, Marketing), 3 separate records are created - one for each tag.

---

### FAQs (ArticleFAQ Table)

**When this is saved:** If you added any FAQs in Step 4

**What gets saved:**

- Each FAQ question/answer pair creates a separate record
- **Article ID** - Links to your article
- **Question** - The FAQ question text
- **Answer** - The FAQ answer text
- **Position** - Order in the FAQ list (0 for first, 1 for second, 2 for third, etc.)

**Example:** If you added 2 FAQs, 2 separate records are created with positions 0 and 1.

---

### Gallery Images (ArticleMedia Table)

**When this is saved:** If you added any images to the gallery in Step 3

**What gets saved:**

- Each gallery image creates a separate record
- **Article ID** - Links to your article
- **Media ID** - Links to the uploaded image file
- **Position** - Display order in gallery (0 for first image, 1 for second, etc.)
- **Caption** - Image caption you entered (optional, can be null)
- **Alt Text** - Image description for accessibility and SEO (optional, can be null)

**Example:** If you added 5 images to the gallery, 5 separate records are created with positions 0, 1, 2, 3, and 4.

---

### Related Articles (RelatedArticle Table)

**When this is saved:** If you linked any related articles in Step 6

**What gets saved:**

- Each related article creates a separate record
- **Article ID** - Links to your article
- **Related ID** - Links to the related article you selected
- **Relationship Type** - Type of relationship: "related", "similar", or "recommended" (default: "related")
- **Weight** - Relationship strength (default: 1.0, can be adjusted)

**Example:** If you linked 2 related articles, 2 separate records are created.

---

## Data Flow Summary

```
┌─────────────────────────────────────┐
│  User Input (8 Steps)               │
│  - Step 1: Basic Info               │
│  - Step 2: Content                 │
│  - Step 3: Media                    │
│  - Step 4: FAQs                     │
│  - Step 5: Settings                 │
│  - Step 6: Related Articles         │
│  - Step 7: Technical SEO            │
│  - Step 8: Review                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Form Data Collection               │
│  - Gathers all fields from form     │
│  - Validates required fields        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Auto-Calculations                  │
│  - Word count from content          │
│  - Reading time from word count      │
│  - Content depth classification     │
│  - SEO title generation             │
│  - SEO description generation       │
│  - Canonical URL generation         │
│  - Breadcrumb path generation        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Database Save (Transaction)        │
│                                     │
│  ├── Article Table                  │
│  │   └── Main article record        │
│  │                                   │
│  ├── ArticleTag Table (if tags)     │
│  │   └── One record per tag         │
│  │                                   │
│  ├── ArticleFAQ Table (if FAQs)     │
│  │   └── One record per FAQ         │
│  │                                   │
│  ├── ArticleMedia Table (if gallery) │
│  │   └── One record per image       │
│  │                                   │
│  └── RelatedArticle Table (if any)   │
│      └── One record per related      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  SEO Data Generation (Non-Blocking)  │
│                                     │
│  ├── Generate Next.js Metadata     │
│  │   └── Store in Article.nextjsMetadata │
│  │                                   │
│  └── Generate JSON-LD               │
│      └── Store in Article.jsonLdStructuredData │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Success/Error Response             │
│  - Success: Redirect to articles    │
│  - Error: Show error message        │
│  - Note: Article saves even if      │
│    metadata generation fails        │
└─────────────────────────────────────┘
```

---

## Important Notes

### 1. Status is Always "WRITING"

- New articles are **always** saved with status "WRITING"
- This means the article is in progress and **not published yet**
- An admin must review and publish the article later
- You cannot publish directly from the creation form

### 2. Auto-Generated Fields

Many fields are automatically generated if you don't fill them:

- **Slug** - Generated from title (URL-friendly format)
- **SEO Title** - Generated from title + client name
- **SEO Description** - Generated from excerpt (truncated to optimal length)
- **Canonical URL** - Generated from slug and client slug
- **Word Count** - Calculated from content
- **Reading Time** - Calculated from word count
- **Content Depth** - Determined from word count
- **Breadcrumb Path** - Generated from category and article info

### 3. Author is Auto-Set

- The author is **always** set to "Modonty"
- You don't choose the author - it's automatically assigned
- This is a system requirement (singleton pattern)

### 4. Optional Fields

- Many fields are optional (tags, FAQs, gallery, related articles, etc.)
- If you don't fill them, they're saved as null/empty
- The article still saves successfully even if optional fields are empty
- Only **title**, **content**, and **client** are required

### 5. Multiple Database Tables

The article data is spread across multiple database tables for better organization:

- **Article table** - Main article data (one record)
- **ArticleTag table** - Tags (one record per tag)
- **ArticleFAQ table** - FAQs (one record per FAQ)
- **ArticleMedia table** - Gallery images (one record per image)
- **RelatedArticle table** - Related articles (one record per related article)
- All tables are linked together by the article ID

### 6. Data Validation

Before saving, the system validates:

- **Title** must be provided (required)
- **Content** must be provided (required)
- **Client** must be selected (required)
- **Slug** must be unique for the selected client (if another article with the same slug exists for that client, you'll get an error)

### 7. Transaction Safety

- All database saves happen in a transaction
- If any part fails, nothing is saved (all or nothing)
- This prevents partial saves and data corruption

---

## What You See After Saving

### Success Scenario:

1. **Loading State**: Save button shows spinner and becomes disabled
2. **Success Toast**: Green success message appears:
   - Title: "تم الحفظ بنجاح" (Saved successfully)
   - Description: "تم حفظ المقال بنجاح وهو في انتظار معاينة المدير" (Article saved successfully and is waiting for admin review)
3. **Redirect**: You're automatically taken to the articles list page (`/articles`)
4. **Article Status**: The article appears in the list with status "WRITING" (in progress)

### Error Scenario:

1. **Loading State**: Save button shows spinner
2. **Error Toast**: Red error message appears with explanation
3. **No Redirect**: You stay on the form page
4. **Article Not Saved**: Nothing is saved to the database
5. **Fix and Retry**: You can fix the issue and try saving again

---

## Error Handling

### Common Errors:

1. **Missing Required Fields**

   - Error: "Title is required" or "Content is required" or "Client must be selected"
   - Solution: Fill in the required fields

2. **Duplicate Slug**

   - Error: "An article with this slug already exists for this client"
   - Solution: Change the title (which auto-generates a new slug) or manually edit the slug

3. **Invalid Data Format**

   - Error: "Invalid date format" or similar
   - Solution: Check the format of dates or other fields

4. **Database Connection Issues**

   - Error: "Failed to connect to database" or "Database error"
   - Solution: Check your database connection (technical issue)

5. **Author Not Found**
   - Error: "Modonty author not found. Please ensure the author is set up."
   - Solution: This is a system configuration issue (technical)

### Error Display:

- Errors are shown in a red toast notification at the top/bottom of the screen
- The error message explains what went wrong
- You can dismiss the error and try again after fixing the issue

---

## Field-by-Field Breakdown

### Step 1: Basic Information

| Field    | Required | Saved To           | Auto-Generated?      |
| -------- | -------- | ------------------ | -------------------- |
| Title    | Yes      | Article.title      | No                   |
| Slug     | Yes      | Article.slug       | Yes (from title)     |
| Client   | Yes      | Article.clientId   | No                   |
| Category | No       | Article.categoryId | No                   |
| Excerpt  | No       | Article.excerpt    | No                   |
| Tags     | No       | ArticleTag table   | No                   |
| Featured | No       | Article.featured   | No                   |
| Author   | N/A      | Article.authorId   | Yes (always Modonty) |

### Step 2: Content

| Field         | Required | Saved To                   | Auto-Generated?  |
| ------------- | -------- | -------------------------- | ---------------- |
| Content       | Yes      | Article.content            | No               |
| Word Count    | N/A      | Article.wordCount          | Yes (calculated) |
| Reading Time  | N/A      | Article.readingTimeMinutes | Yes (calculated) |
| Content Depth | N/A      | Article.contentDepth       | Yes (calculated) |

### Step 3: Media

| Field          | Required | Saved To                | Auto-Generated? |
| -------------- | -------- | ----------------------- | --------------- |
| Featured Image | No       | Article.featuredImageId | No              |
| Gallery Images | No       | ArticleMedia table      | No              |

### Step 4: FAQs

| Field | Required | Saved To         | Auto-Generated? |
| ----- | -------- | ---------------- | --------------- |
| FAQs  | No       | ArticleFAQ table | No              |

### Step 5: Settings

| Field               | Required | Saved To                  | Auto-Generated?     |
| ------------------- | -------- | ------------------------- | ------------------- |
| Scheduled At        | No       | Article.scheduledAt       | No                  |
| SEO Title           | Yes      | Article.seoTitle          | Yes (if empty)      |
| SEO Description     | Yes      | Article.seoDescription    | Yes (if empty)      |
| Canonical URL       | No       | Article.canonicalUrl      | Yes (if empty)      |
| Meta Robots         | No       | Article.metaRobots        | Yes (default)       |
| Sitemap Priority    | No       | Article.sitemapPriority   | Yes (from featured) |
| Sitemap Change Freq | No       | Article.sitemapChangeFreq | Yes (default)       |

### Step 6: Related Articles

| Field            | Required | Saved To             | Auto-Generated? |
| ---------------- | -------- | -------------------- | --------------- |
| Related Articles | No       | RelatedArticle table | No              |

### Step 7: Technical SEO

| Field               | Required | Saved To                   | Auto-Generated?            |
| ------------------- | -------- | -------------------------- | -------------------------- |
| OG Title            | No       | Article.ogTitle            | Yes (from SEO title)       |
| OG Description      | No       | Article.ogDescription      | Yes (from SEO description) |
| OG Type             | No       | Article.ogType             | Yes (default: "article")   |
| OG Article Author   | No       | Article.ogArticleAuthor    | Yes (from author)          |
| Twitter Card        | No       | Article.twitterCard        | Yes (default)              |
| Twitter Site        | No       | Article.twitterSite        | No                         |
| Twitter Creator     | No       | Article.twitterCreator     | No                         |
| Alternate Languages | No       | Article.alternateLanguages | No                         |
| Next.js Metadata    | N/A      | Article.nextjsMetadata     | Yes (generated on save)    |
| JSON-LD Data        | N/A      | Article.jsonLdStructuredData | Yes (generated on save)  |

### Step 8: Review

| Field                     | Required | Saved To | Auto-Generated? |
| ------------------------- | -------- | -------- | --------------- |
| (Review only - no fields) | N/A      | N/A      | N/A             |

---

## Summary

When you click the Save button on the article creation page:

1. **All form data is collected** from all 8 steps
2. **Automatic calculations** are performed (word count, reading time, SEO fields, etc.)
3. **Data is saved** to the database across multiple tables:
   - Main article record in Article table
   - Tags in ArticleTag table (if any)
   - FAQs in ArticleFAQ table (if any)
   - Gallery images in ArticleMedia table (if any)
   - Related articles in RelatedArticle table (if any)
4. **SEO data is generated and stored** (non-blocking):
   - Next.js Metadata object is generated and stored in `Article.nextjsMetadata`
   - JSON-LD structured data is generated and stored in `Article.jsonLdStructuredData`
   - Both are used for fast page rendering (no computation needed on page load)
   - If generation fails, article still saves successfully
5. **Status is set to "WRITING"** (article is not published, waiting for admin review)
6. **Success message** is shown and you're redirected to the articles list

The article is now saved in the database with pre-generated SEO data and can be edited, reviewed, and published later by an admin. When the article page is rendered, it uses the pre-generated metadata and JSON-LD for fast, consistent SEO output.

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-27  
**Page:** `/articles/new`  
**Save Button Location:** Navigation bar (top) and Sticky button (bottom)
