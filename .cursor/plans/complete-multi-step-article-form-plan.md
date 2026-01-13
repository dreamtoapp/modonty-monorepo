# Complete Multi-Step Article Form Plan

## Overview

Transform the article creation form into a clean 5-step stepper flow (4 main steps + 1 temporary indicator step) with all schema fields included following best practices.

## Step Structure

### Step 1: Basic Information (المعلومات الأساسية)
### Step 2: Content (المحتوى)
### Step 3: SEO (تحسين محركات البحث)
### Step 4: Media (الوسائط)
### Step 5: All Fields Indicator (TEMPORARY - For Finalization)

---

## Step 1: Basic Information (المعلومات الأساسية)

### Required Fields
- **Title (العنوان)**
  - Type: Text input
  - Validation: Required, 50-60 characters recommended
  - Auto-fill: Generates slug if slug is empty
  - Character counter: Shows 0-60 characters

- **Client (العميل)**
  - Type: Dropdown select
  - Validation: Required
  - Options: All clients from database
  - Auto-fill: Used for SEO Title generation

### Optional Fields
- **Slug (الرابط المختصر)**
  - Type: Read-only display (Badge) with copy button
  - Auto-generated: From title (when title changes, if slug empty)
  - Format: Slugified version of title
  - Display: Shows generated slug, allows copying to clipboard

- **Excerpt (الملخص)**
  - Type: Textarea (3 rows)
  - Validation: Optional
  - Hint: 150-160 characters recommended
  - Character counter: Shows 0-160 characters
  - Auto-fill: Used for SEO Description generation

- **Category (الفئة)**
  - Type: Dropdown select
  - Validation: Optional
  - Options: All categories from database (includes "لا يوجد" option)
  - Auto-fill: Used for OG Article Section

- **Tags (العلامات)**
  - Type: Multi-select dropdown (TagMultiSelect component)
  - Validation: Optional
  - Options: All tags from database
  - Selection: Multiple tags can be selected
  - Used for: Article tagging, OG Article Tags

- **Featured (مميز)**
  - Type: Checkbox
  - Validation: Optional
  - Default: false
  - Purpose: Mark article as featured (affects sitemap priority)
  - Auto-fill: If checked, sitemapPriority = 0.8, else 0.5

- **Scheduled At (جدولة النشر)**
  - Type: Date/Time picker
  - Validation: Optional
  - Purpose: Schedule article for future publication
  - Format: DateTime
  - Default: null

- **FAQs (الأسئلة الشائعة)**
  - Type: FAQ Builder component (collapsible optional section)
  - Validation: Optional
  - Purpose: Frequently Asked Questions for article
  - Features: Add/remove questions, reorder, edit
  - Stored in: FAQ relation table

### Read-Only Fields
- **Author (المؤلف)**
  - Type: Display only (muted background)
  - Value: Always "Modonty" (singleton pattern)
  - Hidden input: Stores author ID

### Data Flow
- Title → Slug (auto-generate if empty)
- Title + Client → SEO Title (Step 3, auto-fill if empty)
- Excerpt → SEO Description (Step 3, auto-fill if empty)
- Category → OG Article Section (Step 3)
- Tags → OG Article Tags (Step 3)
- Featured → Sitemap Priority (Step 3, auto-calculate)

---

## Step 2: Content (المحتوى)

### Required Fields
- **Content (المحتوى)**
  - Type: Rich text editor (RichTextEditor component)
  - Validation: Required (likely)
  - Features: WYSIWYG editor with formatting options
  - Placeholder: "ابدأ كتابة المحتوى..."

- **Content Format (صيغة المحتوى)**
  - Type: Dropdown select (optional, can be hidden with default)
  - Options: 'markdown', 'html', 'rich_text'
  - Default: 'rich_text'
  - Purpose: Content format type

### Auto-Calculated Stats (Display Only)
- **Word Count (عدد الكلمات)**
  - Calculated: From content (strips HTML, counts words)
  - Display: Large number with label
  - Hints: 
    - < 300 words: "محتوى قصير (أقل من 300 كلمة)"
    - 300-1000 words: "محتوى متوسط (300-1000 كلمة)"
    - > 1000 words: "محتوى طويل (أكثر من 1000 كلمة)"

- **Reading Time (وقت القراءة)**
  - Calculated: Word count / 200 words per minute (rounded up)
  - Display: Number of minutes
  - Unit: "دقيقة"

- **Content Depth (عمق المحتوى)**
  - Calculated: Based on word count
  - Values: "short" (قصير), "medium" (متوسط), "long" (طويل)
  - Display: Badge with color coding
  - Colors:
    - Short: Yellow
    - Medium: Blue
    - Long: Green
  - Hints:
    - Short: "أضف المزيد من المحتوى"
    - Medium: "محتوى متوازن"
    - Long: "محتوى شامل ومفصل"

### Data Flow
- Content → Word count calculation
- Word count → Reading time calculation
- Word count → Content depth determination
- All stats displayed in real-time as user types

---

## Step 3: SEO (تحسين محركات البحث)

This step consolidates SEO section + Social section + Technical section fields.

### SEO Meta Tags
- **SEO Title (عنوان SEO)**
  - Type: Text input
  - Validation: 50-60 characters recommended
  - Character counter: Shows 0-60 characters
  - Auto-fill: From title + client name (if empty)
  - Placeholder: "سيتم إنشاؤه تلقائياً من العنوان"
  - Validation badge: Shows valid/invalid status
  - Used for: Meta title tag, OG Title (auto-fill), Twitter Title (auto-fill)

- **SEO Description (وصف SEO)**
  - Type: Textarea (3 rows)
  - Validation: 150-160 characters recommended
  - Character counter: Shows 0-160 characters
  - Auto-fill: From excerpt (truncated to 155 chars, if empty)
  - Placeholder: "سيتم إنشاؤه تلقائياً من الملخص"
  - Validation badge: Shows valid/invalid status
  - Used for: Meta description tag, OG Description (auto-fill), Twitter Description (auto-fill)

- **Canonical URL (رابط Canonical)**
  - Type: Text input (editable, auto-generated)
  - Auto-generated: From slug + client slug
  - Format: `https://modonty.com/clients/{clientSlug}/articles/{slug}` or `https://modonty.com/articles/{slug}`
  - Placeholder: "سيتم إنشاؤه تلقائياً"
  - Used for: Canonical link tag, OG URL (auto-fill)

- **Meta Robots**
  - Type: Dropdown select
  - Options:
    - "index, follow" (default)
    - "noindex, follow"
    - "index, nofollow"
    - "noindex, nofollow"
  - Default: "index, follow"

### SEO Preview Card (Display Only)
- Shows how the article appears in search results
- Displays: Title, Description, URL
- Updates in real-time as fields change

### Open Graph (OG) Fields

#### Basic OG Fields
- **OG Title (OG Title)**
  - Type: Text input
  - Auto-fill: From SEO Title (if empty)
  - Placeholder: "سيتم نسخه من عنوان SEO"
  - Used for: `og:title` meta tag

- **OG Description (OG Description)**
  - Type: Textarea (3 rows)
  - Auto-fill: From SEO Description (if empty)
  - Placeholder: "سيتم نسخه من وصف SEO"
  - Used for: `og:description` meta tag

- **OG URL (OG URL)**
  - Type: Text input
  - Auto-generated: Same as canonical URL (if empty)
  - Placeholder: "سيتم إنشاؤه تلقائياً"
  - Used for: `og:url` meta tag

- **OG Site Name (OG Site Name)**
  - Type: Text input
  - Default: "مودونتي"
  - Used for: `og:site_name` meta tag

- **OG Locale (OG Locale)**
  - Type: Text input
  - Default: "ar_SA"
  - Used for: `og:locale` meta tag

#### Article-Specific OG Fields
- **OG Article Author (OG Article Author)**
  - Type: Text input
  - Auto-fill: From author name (Modonty, if empty)
  - Placeholder: "سيتم نسخه من المؤلف"
  - Used for: `og:article:author` meta tag

- **OG Article Section (OG Article Section)**
  - Type: Text input
  - Auto-fill: From category name (from Step 1, if empty)
  - Placeholder: Shows selected category name
  - Used for: `og:article:section` meta tag

- **OG Article Tags (OG Article Tags)**
  - Type: Text input (comma-separated)
  - Auto-fill: From tags (from Step 1, if empty)
  - Format: Comma-separated values
  - Placeholder: "أدخل العلامات مفصولة بفواصل"
  - Used for: `og:article:tag` meta tags (array)

### Twitter Cards Fields

#### Basic Twitter Fields
- **Twitter Card Type (نوع بطاقة Twitter)**
  - Type: Dropdown select
  - Options:
    - "summary_large_image" (default)
    - "summary"
  - Default: "summary_large_image"
  - Used for: `twitter:card` meta tag

- **Twitter Title (Twitter Title)**
  - Type: Text input
  - Auto-fill: From OG Title (if empty)
  - Placeholder: "سيتم نسخه من OG Title"
  - Used for: `twitter:title` meta tag

- **Twitter Description (Twitter Description)**
  - Type: Textarea (3 rows)
  - Auto-fill: From OG Description (if empty)
  - Placeholder: "سيتم نسخه من OG Description"
  - Used for: `twitter:description` meta tag

#### Additional Twitter Fields
- **Twitter Site (Twitter Site)**
  - Type: Text input
  - Format: @username
  - Placeholder: "@username"
  - Used for: `twitter:site` meta tag

- **Twitter Creator (Twitter Creator)**
  - Type: Text input
  - Format: @username
  - Placeholder: "@username"
  - Used for: `twitter:creator` meta tag

- **Twitter Label 1 (Twitter Label 1)**
  - Type: Text input
  - Optional: Yes
  - Placeholder: "Optional label for Twitter card"
  - Used for: `twitter:label1` meta tag

- **Twitter Data 1 (Twitter Data 1)**
  - Type: Text input
  - Optional: Yes
  - Placeholder: "Optional data for Twitter card"
  - Used for: `twitter:data1` meta tag

### Technical SEO Fields

- **Sitemap Priority (أولوية الخريطة)**
  - Type: Number input (slider or input)
  - Range: 0.0 to 1.0
  - Step: 0.1
  - Default: 0.5 (or 0.8 if featured)
  - Auto-calculate: 0.8 if featured (Step 1), 0.5 otherwise
  - Hint: Shows calculated value based on featured status
  - Used for: XML sitemap priority

- **Sitemap Change Frequency (تكرار تحديث الخريطة)**
  - Type: Dropdown select
  - Options: always, hourly, daily, weekly, monthly, yearly, never
  - Default: "weekly"
  - Used for: XML sitemap change frequency

- **Alternate Languages (اللغات البديلة)**
  - Type: Array input (add/remove entries)
  - Format: Array of {hreflang: string, url: string}
  - Optional: Yes
  - Features: Add/remove language entries, edit hreflang and URL
  - Placeholder: "أضف روابط بديلة للمقال بلغات أخرى (hreflang)"
  - Used for: hreflang tags for multilingual SEO

- **License (الترخيص)**
  - Type: Text input (URL)
  - Optional: Yes
  - Placeholder: "Optional license URL"
  - Used for: Content license information

- **Last Reviewed (آخر مراجعة)**
  - Type: Date picker (optional, or auto-set)
  - Optional: Yes
  - Default: null (or auto-set on save)
  - Purpose: Track content freshness for SEO
  - Recommendation: Auto-set on save, or make it optional user input

### Data Flow
- Title + Client (Step 1) → SEO Title (auto-fill if empty)
- Excerpt (Step 1) → SEO Description (auto-fill if empty)
- Slug + Client (Step 1) → Canonical URL (auto-generate)
- Featured (Step 1) → Sitemap Priority (auto-calculate: 0.8 if featured, 0.5 default)
- SEO Title → OG Title (auto-fill if empty)
- SEO Description → OG Description (auto-fill if empty)
- Author → OG Article Author (auto-fill if empty)
- Category (Step 1) → OG Article Section (auto-fill if empty)
- Tags (Step 1) → OG Article Tags (auto-fill if empty)
- Canonical URL → OG URL (auto-fill if empty)
- OG Title → Twitter Title (auto-fill if empty)
- OG Description → Twitter Description (auto-fill if empty)

---

## Step 4: Media (الوسائط)

### Featured Image
- **Featured Image ID (معرف الصورة الرئيسية)**
  - Type: Text input (monospace font) or Image picker (better UX)
  - Validation: Optional
  - Format: Media ID (ObjectId)
  - Placeholder: "أدخل معرف الصورة الرئيسية"
  - Display: Badge showing "✓ الصورة محددة" when ID is set
  - Preview: Show image preview if URL available
  - Used for: Article featured image, OG Image, Schema.org image

### Image Gallery
- **Image Gallery (معرض الصور)**
  - Type: ImageGalleryManager component
  - Validation: Optional
  - Availability: 
    - **New articles**: Not available (hidden or disabled with message)
    - **Edit mode**: Available only if article ID exists
  - Requirements: Client must be selected (from Step 1)
  - Features:
    - Add/remove images
    - Drag & drop reordering
    - Image captions per article
    - Alt text per article (SEO customization)
  - Display: Warning message if client not selected or in new mode

### Data Flow
- Client (Step 1) → Required for gallery (edit mode only)
- Featured Image → Used in OG tags, Schema.org, article display
- Gallery Images → Article image gallery, Schema.org gallery

---

## Step 5: All Fields Indicator (TEMPORARY - For Finalization)

### Purpose
This temporary step displays ALL Article schema fields as read-only indicators to help verify field coverage and ensure nothing is missing during finalization.

### Implementation
- Read-only display of all schema fields
- Grouped by category (matching schema organization)
- Shows field name, type, current value, and source (which step sets it)
- Visual indicators for:
  - ✅ Field covered in form (shows which step)
  - ⚙️ Auto-set by system (shows when/how)
  - ❓ Field not set (shows default value or null)
- Color coding:
  - Green: Field is set/handled
  - Yellow: Field has default value
  - Gray: Field is null/optional
  - Red: Field missing (should be handled)

### Field Categories

#### Basic Content
- title ✅ (Step 1)
- slug ✅ (Step 1, auto-generated)
- excerpt ✅ (Step 1)
- content ✅ (Step 2)
- contentFormat ✅ (Step 2, default: 'rich_text')

#### Relationships
- clientId ✅ (Step 1, required)
- categoryId ✅ (Step 1, optional)
- authorId ✅ (Step 1, auto-set to Modonty)

#### Status & Workflow
- status ⚙️ (System, default: 'WRITING')
- scheduledAt ✅ (Step 1, optional)
- featured ✅ (Step 1, default: false)

#### Schema.org Article - Required Fields
- datePublished ⚙️ (System, set on publish)
- dateModified ⚙️ (System, @updatedAt)
- lastReviewed ✅ (Step 3, optional or auto-set)
- mainEntityOfPage ✅ (Step 3, same as canonicalUrl)

#### Schema.org Article - Extended Fields
- wordCount ✅ (Step 2, auto-calculated)
- readingTimeMinutes ✅ (Step 2, auto-calculated)
- contentDepth ✅ (Step 2, auto-calculated)
- inLanguage ⚙️ (System, default: 'ar')
- isAccessibleForFree ⚙️ (System, default: true)
- license ✅ (Step 3, optional)
- creativeWorkStatus ⚙️ (System, derived from status)

#### Meta Tags
- seoTitle ✅ (Step 3)
- seoDescription ✅ (Step 3)
- metaRobots ✅ (Step 3, default: 'index, follow')

#### Open Graph (Complete)
- ogTitle ✅ (Step 3)
- ogDescription ✅ (Step 3)
- ogType ⚙️ (System, default: 'article')
- ogUrl ✅ (Step 3)
- ogSiteName ✅ (Step 3, default: 'مودونتي')
- ogLocale ✅ (Step 3, default: 'ar_SA')
- ogUpdatedTime ⚙️ (System, auto-set on update)
- ogArticleAuthor ✅ (Step 3, optional)
- ogArticlePublishedTime ⚙️ (System, set on publish)
- ogArticleModifiedTime ⚙️ (System, auto-set on update)
- ogArticleSection ✅ (Step 3)
- ogArticleTag ✅ (Step 3)

#### Twitter Cards (Complete)
- twitterCard ✅ (Step 3, default: 'summary_large_image')
- twitterTitle ✅ (Step 3)
- twitterDescription ✅ (Step 3)
- twitterSite ✅ (Step 3, optional)
- twitterCreator ✅ (Step 3, optional)
- twitterLabel1 ✅ (Step 3, optional)
- twitterData1 ✅ (Step 3, optional)

#### Technical SEO
- canonicalUrl ✅ (Step 3)
- alternateLanguages ✅ (Step 3, optional)
- robotsMeta ✅ (Step 3, same as metaRobots)
- sitemapPriority ✅ (Step 3, auto-calculated)
- sitemapChangeFreq ✅ (Step 3, default: 'weekly')

#### Breadcrumb Support
- breadcrumbPath ⚙️ (System, auto-generated from category + article)

#### Featured Media
- featuredImageId ✅ (Step 4)

#### JSON-LD Knowledge Graph
- jsonLdStructuredData ⚙️ (System, generated server-side)
- jsonLdLastGenerated ⚙️ (System, auto-set on generation)
- jsonLdValidationReport ⚙️ (System, generated server-side)
- articleBodyText ⚙️ (System, extracted from content)
- semanticKeywords ⚙️ (Advanced, not in basic flow)
- citations ⚙️ (Advanced, not in basic flow)
- jsonLdVersion ⚙️ (System, default: 1)
- jsonLdHistory ⚙️ (System, version history)
- jsonLdDiffSummary ⚙️ (System, change log)
- jsonLdGenerationTimeMs ⚙️ (System, performance tracking)
- performanceBudgetMet ⚙️ (System, default: true)

#### Timestamps
- createdAt ⚙️ (System, @default(now()))
- updatedAt ⚙️ (System, @updatedAt)

#### Relations
- tags ✅ (Step 1, ArticleTag relation)
- faqs ✅ (Step 1, FAQ relation)
- gallery ✅ (Step 4, ArticleMedia relation)
- versions ⚙️ (System, ArticleVersion relation - audit trail)
- analytics ⚙️ (System, Analytics relation - system-tracked)
- relatedFrom ⚙️ (Advanced, RelatedArticle relation)
- relatedTo ⚙️ (Advanced, RelatedArticle relation)

### Display Format

```
┌─────────────────────────────────────────────────────────────┐
│ All Fields Indicator (Temporary - For Finalization)        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Basic Content                                               │
│   ✅ title: "Article Title" (Step 1)                       │
│   ✅ slug: "article-title" (Step 1, auto-generated)        │
│   ✅ excerpt: "Article excerpt..." (Step 1)                │
│   ✅ content: "Full content..." (Step 2)                   │
│   ✅ contentFormat: "rich_text" (Step 2, default)          │
│                                                             │
│ Relationships                                               │
│   ✅ clientId: "client-id-123" (Step 1)                    │
│   ✅ categoryId: "category-id-456" (Step 1)                │
│   ✅ authorId: "author-id-789" (Step 1, auto-set)          │
│                                                             │
│ Status & Workflow                                           │
│   ⚙️ status: "WRITING" (System, default)                   │
│   ✅ scheduledAt: null (Step 1, optional)                  │
│   ✅ featured: false (Step 1, default)                     │
│                                                             │
│ ... (all other fields)                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Removal
- This step will be removed after finalization
- All fields should be properly distributed across Steps 1-4
- Use this step to verify 100% coverage before removal

---

## Complete Field Distribution Summary

### Step 1: Basic Information (11 fields + FAQs)
- Title (required)
- Slug (auto-generated, read-only)
- Excerpt (optional)
- Client (required)
- Category (optional)
- Tags (optional, multi-select)
- Author (read-only, auto-set)
- Featured (optional, checkbox)
- Scheduled At (optional, date picker)
- FAQs (optional, FAQ builder)

### Step 2: Content (2 fields + 3 auto-calculated stats)
- Content (required, rich text editor)
- Content Format (default: 'rich_text', can be hidden)
- Word Count (calculated, displayed)
- Reading Time (calculated, displayed)
- Content Depth (calculated, displayed)

### Step 3: SEO (25+ fields)
- SEO Title
- SEO Description
- Canonical URL
- Meta Robots
- OG Title
- OG Description
- OG URL
- OG Site Name
- OG Locale
- OG Article Author
- OG Article Section
- OG Article Tags
- Twitter Card Type
- Twitter Title
- Twitter Description
- Twitter Site
- Twitter Creator
- Twitter Label 1
- Twitter Data 1
- Sitemap Priority
- Sitemap Change Frequency
- Alternate Languages
- License
- Last Reviewed (optional or auto-set)
- SEO Preview Card (display only)

### Step 4: Media (2 fields)
- Featured Image ID
- Image Gallery (edit mode only)

### Step 5: All Fields Indicator (TEMPORARY)
- Read-only display of all schema fields
- Grouped by category
- Shows field coverage status
- Will be removed after finalization

---

## Implementation Notes

### Best Practices Applied

1. **Field Grouping**: Related fields grouped together (SEO, OG, Twitter)
2. **Auto-Fill Chain**: Smart auto-fill from basic → SEO → OG → Twitter
3. **Optional vs Required**: Clear distinction with validation
4. **User Experience**: Logical flow from basic info → content → SEO → media
5. **Default Values**: Sensible defaults for all optional fields
6. **System Fields**: Auto-managed fields clearly marked as system-only
7. **Relations**: Handled through appropriate UI components (TagMultiSelect, FAQBuilder, ImageGalleryManager)

### Auto-Fill Logic Summary

```
Step 1 Fields:
  - Title → Slug (if empty)
  - Title + Client → SEO Title (Step 3, if empty)
  - Featured → Sitemap Priority (Step 3, 0.8 if true, 0.5 default)
  - Excerpt → SEO Description (Step 3, if empty)
  - Category → OG Article Section (Step 3, if empty)
  - Tags → OG Article Tags (Step 3, if empty)

Step 2 Fields:
  - Content → Word Count, Reading Time, Content Depth (calculated)

Step 3 Fields:
  - Slug + Client → Canonical URL (auto-generate)
  - Canonical URL → OG URL (if empty)
  - SEO Title → OG Title (if empty)
  - SEO Description → OG Description (if empty)
  - Author → OG Article Author (if empty)
  - OG Title → Twitter Title (if empty)
  - OG Description → Twitter Description (if empty)

Step 4 Fields:
  - None (media fields are manual)
```

### Temporary Step Notes

- Step 5 (All Fields Indicator) is TEMPORARY
- Use it to verify all fields are covered
- Remove it after finalization
- Should show all ~60+ fields from Article schema
- Helps ensure nothing is missed during development

---

## Next Steps

1. Implement Step 1-4 with all fields
2. Implement Step 5 (temporary indicator)
3. Verify all fields are properly handled
4. Test auto-fill logic
5. Test save functionality
6. Finalize field placement
7. Remove Step 5 after verification
8. Clean up and optimize

---

**Status**: Plan Complete - Ready for Implementation
**Last Updated**: 2025-01-27
**Total Fields Covered**: ~60+ fields (100% coverage)
