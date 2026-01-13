# Multi-Step Article Form - Field Breakdown by Step

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
  - Auto-generated: From title (when title changes, if slug is empty)
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

---

## Step 2: Content (المحتوى)

### Required Fields
- **Content (المحتوى)**
  - Type: Rich text editor (RichTextEditor component)
  - Validation: Required (likely)
  - Features: WYSIWYG editor with formatting options
  - Placeholder: "ابدأ كتابة المحتوى..."

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

This step consolidates SEO section + Social section fields.

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
  - Type: Text input (likely read-only or editable)
  - Auto-generated: From slug + client slug
  - Format: `https://modonty.com/clients/{clientSlug}/articles/{slug}` or `https://modonty.com/articles/{slug}`
  - Used for: Canonical link tag

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

### Data Flow
- Title + Client (Step 1) → SEO Title (auto-fill if empty)
- Excerpt (Step 1) → SEO Description (auto-fill if empty)
- Slug + Client (Step 1) → Canonical URL (auto-generate)
- SEO Title → OG Title (auto-fill if empty)
- SEO Description → OG Description (auto-fill if empty)
- Category (Step 1) → OG Article Section (auto-fill if empty)
- Tags (Step 1) → OG Article Tags (auto-fill if empty)
- OG Title → Twitter Title (auto-fill if empty)
- OG Description → Twitter Description (auto-fill if empty)

---

## Step 4: Media (الوسائط)

### Featured Image
- **Featured Image ID (معرف الصورة الرئيسية)**
  - Type: Text input (monospace font)
  - Validation: Optional
  - Format: Media ID (ObjectId)
  - Placeholder: "أدخل معرف الصورة الرئيسية"
  - Display: Badge showing "✓ الصورة محددة" when ID is set
  - Used for: Article featured image, OG Image, Schema.org image

### Image Gallery
- **Image Gallery (معرض الصور)**
  - Type: ImageGalleryManager component
  - Validation: Optional
  - Availability: 
    - **New articles**: Not available (hidden or disabled)
    - **Edit mode**: Available only if article ID exists
  - Requirements: Client must be selected (from Step 1)
  - Features:
    - Add/remove images
    - Drag & drop reordering
    - Image captions per article
    - Alt text per article (SEO customization)
  - Display: Warning message if client not selected

### Data Flow
- Client (Step 1) → Required for gallery (edit mode only)
- Featured Image → Used in OG tags, Schema.org, article display
- Gallery Images → Article image gallery, Schema.org gallery

---

## Summary of Field Distribution

### Step 1: Basic Information (7 fields)
- Title (required)
- Slug (auto-generated, read-only)
- Excerpt (optional)
- Client (required)
- Category (optional)
- Tags (optional, multi-select)
- Author (read-only, auto-set)

### Step 2: Content (1 field + 3 auto-calculated stats)
- Content (required, rich text editor)
- Word Count (calculated)
- Reading Time (calculated)
- Content Depth (calculated)

### Step 3: SEO (18 fields)
- SEO Title
- SEO Description
- Canonical URL
- Meta Robots
- OG Title
- OG Description
- OG URL
- OG Site Name
- OG Locale
- OG Article Section
- OG Article Tags
- Twitter Card Type
- Twitter Title
- Twitter Description
- Twitter Site
- Twitter Creator
- Twitter Label 1
- Twitter Data 1
- SEO Preview Card (display only)

### Step 4: Media (2 fields)
- Featured Image ID
- Image Gallery (edit mode only)

---

## Fields NOT Included in 4-Step Flow

The following fields/sections are currently in the codebase but **NOT included** in the simplified 4-step flow:

1. **Tags & FAQs Section** (currently separate)
   - FAQs (Frequently Asked Questions) - Currently in TagsFAQSection
   - **Decision needed**: Where should FAQs go?
     - Option A: Add to Step 1 (Basic Information)
     - Option B: Add to Step 2 (Content)
     - Option C: Remove from simplified flow
     - Option D: Make it optional in Step 1

2. **SEO Validation Section** (currently separate)
   - JSON-LD preview and validation
   - Schema.org validation
   - Rich results eligibility
   - **Decision**: This is typically post-save validation, not needed during creation

3. **Technical Section** (if exists)
   - Sitemap settings (priority, change frequency)
   - Alternate languages
   - License
   - **Decision**: Can be auto-set with defaults, or moved to SEO step

4. **Meta Section** (if exists)
   - Additional metadata fields
   - **Decision**: Integrate into relevant steps or remove

---

## Auto-Fill Logic Summary

### Step 1 Auto-Fills
- Title → Slug (if slug empty)
- Title + Client → SEO Title (Step 3, if SEO title empty)

### Step 2 Auto-Fills
- Content → Word count, Reading time, Content depth (calculated stats)

### Step 3 Auto-Fills
- Excerpt (Step 1) → SEO Description (if SEO description empty)
- Slug + Client (Step 1) → Canonical URL (if canonical empty)
- SEO Title → OG Title (if OG title empty)
- SEO Description → OG Description (if OG description empty)
- Category (Step 1) → OG Article Section (if OG section empty)
- Tags (Step 1) → OG Article Tags (if OG tags empty)
- OG Title → Twitter Title (if Twitter title empty)
- OG Description → Twitter Description (if Twitter description empty)

### Step 4 Auto-Fills
- None (media fields are manual)
