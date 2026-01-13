# Final Multi-Step Article Form Plan - Complete Implementation Guide

## Executive Summary

Transform the article creation form from a complex accordion-based interface into a clean, simple 5-step stepper flow with all Article schema fields covered, following best practices for stability, maintainability, and user experience.

**Status**: Ready for Final Approval  
**Last Updated**: 2025-01-27  
**Implementation Approach**: Custom-built stepper (no external dependencies)

---

## Key Decisions

### 1. Stepper Implementation

**Decision**: Build custom stepper using existing shadcn/ui components  
**Reason**: Maximum stability, no dependencies, full control, matches existing architecture  
**Components Used**: Button, Badge, Separator, Progress (from shadcn/ui)  
**Code Estimate**: ~300-400 lines total

### 2. Field Coverage

**Decision**: Include ALL Article schema fields (100% coverage)  
**Total Fields**: ~60+ fields  
**Distribution**: 4 main steps + 1 temporary indicator step

### 3. State Management

**Decision**: Simplify to Context-only (remove Zustand)  
**Reason**: Simpler, less complexity, easier to maintain  
**Implementation**: Add step state to ArticleFormContext

### 4. Step Structure

**Decision**: 5 steps (4 main + 1 temporary indicator)

- Step 1: Basic Information
- Step 2: Content
- Step 3: SEO
- Step 4: Media
- Step 5: All Fields Indicator (TEMPORARY - will be removed after finalization)

---

## Step Structure & Field Distribution

### Step 1: Basic Information (المعلومات الأساسية)

#### Required Fields

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

#### Optional Fields

- **Slug (الرابط المختصر)**

  - Type: Read-only display (Badge) with copy button
  - Auto-generated: From title (when title changes, if slug empty)
  - Format: Slugified version of title

- **Excerpt (الملخص)**

  - Type: Textarea (3 rows)
  - Validation: Optional
  - Hint: 150-160 characters recommended
  - Character counter: Shows 0-160 characters
  - Auto-fill: Used for SEO Description generation

- **Category (الفئة)**

  - Type: Dropdown select
  - Validation: Optional
  - Options: All categories from database
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

#### Read-Only Fields

- **Author (المؤلف)**
  - Type: Display only (muted background)
  - Value: Always "Modonty" (singleton pattern)
  - Hidden input: Stores author ID

**Step 1 Total**: 11 fields (2 required, 7 optional, 2 read-only/auto-set)

---

### Step 2: Content (المحتوى)

#### Required Fields

- **Content (المحتوى)**

  - Type: Rich text editor (RichTextEditor component)
  - Validation: Required
  - Features: WYSIWYG editor with formatting options
  - Placeholder: "ابدأ كتابة المحتوى..."

- **Content Format (صيغة المحتوى)**
  - Type: Hidden or dropdown (default: 'rich_text')
  - Options: 'markdown', 'html', 'rich_text'
  - Default: 'rich_text'
  - Purpose: Content format type

#### Auto-Calculated Stats (Display Only)

- **Word Count (عدد الكلمات)**

  - Calculated: From content (strips HTML, counts words)
  - Display: Large number with label
  - Hints: < 300 (قصير), 300-1000 (متوسط), > 1000 (طويل)

- **Reading Time (وقت القراءة)**

  - Calculated: Word count / 200 words per minute (rounded up)
  - Display: Number of minutes with "دقيقة" unit

- **Content Depth (عمق المحتوى)**
  - Calculated: Based on word count
  - Values: "short" (قصير), "medium" (متوسط), "long" (طويل)
  - Display: Badge with color coding (Yellow/Blue/Green)

**Step 2 Total**: 2 fields + 3 auto-calculated stats

---

### Step 3: SEO (تحسين محركات البحث)

This step consolidates SEO section + Social section + Technical section fields.

#### SEO Meta Tags

- **SEO Title (عنوان SEO)**

  - Type: Text input
  - Validation: 50-60 characters recommended
  - Character counter: Shows 0-60 characters
  - Auto-fill: From title + client name (if empty)
  - Validation badge: Shows valid/invalid status

- **SEO Description (وصف SEO)**

  - Type: Textarea (3 rows)
  - Validation: 150-160 characters recommended
  - Character counter: Shows 0-160 characters
  - Auto-fill: From excerpt (truncated to 155 chars, if empty)
  - Validation badge: Shows valid/invalid status

- **Canonical URL (رابط Canonical)**

  - Type: Text input (editable, auto-generated)
  - Auto-generated: From slug + client slug
  - Format: `https://modonty.com/clients/{clientSlug}/articles/{slug}`

- **Meta Robots**
  - Type: Dropdown select
  - Options: "index, follow" (default), "noindex, follow", "index, nofollow", "noindex, nofollow"
  - Default: "index, follow"

#### SEO Preview Card (Display Only)

- Shows how the article appears in search results
- Displays: Title, Description, URL
- Updates in real-time

#### Open Graph (OG) Fields

- **OG Title** - Text input, auto-fill from SEO Title
- **OG Description** - Textarea, auto-fill from SEO Description
- **OG URL** - Text input, auto-generated from canonical URL
- **OG Site Name** - Text input, default: "مودونتي"
- **OG Locale** - Text input, default: "ar_SA"
- **OG Article Author** - Text input, auto-fill from author name
- **OG Article Section** - Text input, auto-fill from category
- **OG Article Tags** - Text input (comma-separated), auto-fill from tags

#### Twitter Cards Fields

- **Twitter Card Type** - Dropdown, default: "summary_large_image"
- **Twitter Title** - Text input, auto-fill from OG Title
- **Twitter Description** - Textarea, auto-fill from OG Description
- **Twitter Site** - Text input, optional, format: @username
- **Twitter Creator** - Text input, optional, format: @username
- **Twitter Label 1** - Text input, optional
- **Twitter Data 1** - Text input, optional

#### Technical SEO Fields

- **Sitemap Priority (أولوية الخريطة)**

  - Type: Number input (slider or input)
  - Range: 0.0 to 1.0, Step: 0.1
  - Default: 0.5 (or 0.8 if featured)
  - Auto-calculate: 0.8 if featured (Step 1), 0.5 otherwise

- **Sitemap Change Frequency (تكرار تحديث الخريطة)**

  - Type: Dropdown select
  - Options: always, hourly, daily, weekly, monthly, yearly, never
  - Default: "weekly"

- **Alternate Languages (اللغات البديلة)**

  - Type: Array input (add/remove entries)
  - Format: Array of {hreflang: string, url: string}
  - Optional: Yes
  - Features: Add/remove language entries

- **License (الترخيص)**

  - Type: Text input (URL)
  - Optional: Yes
  - Placeholder: "Optional license URL"

- **Last Reviewed (آخر مراجعة)**
  - Type: Date picker (optional, or auto-set on save)
  - Optional: Yes
  - Default: null (or auto-set on save)
  - Recommendation: Auto-set on save (no user input needed)

**Step 3 Total**: 25+ fields

---

### Step 4: Media (الوسائط)

#### Featured Image

- **Featured Image ID (معرف الصورة الرئيسية)**
  - Type: Text input (monospace font) or Image picker (better UX)
  - Validation: Optional
  - Format: Media ID (ObjectId)
  - Display: Badge showing "✓ الصورة محددة" when ID is set
  - Preview: Show image preview if URL available
  - Used for: Article featured image, OG Image, Schema.org image

#### Image Gallery

- **Image Gallery (معرض الصور)**
  - Type: ImageGalleryManager component
  - Validation: Optional
  - Availability:
    - **New articles**: Not available (hidden or disabled with message)
    - **Edit mode**: Available only if article ID exists
  - Requirements: Client must be selected (from Step 1)
  - Features: Add/remove images, drag & drop reordering, captions, alt text

**Step 4 Total**: 2 fields

---

### Step 5: All Fields Indicator (TEMPORARY - For Finalization)

#### Purpose

Temporary read-only display of ALL Article schema fields to verify 100% coverage during finalization.

#### Implementation

- Read-only display of all schema fields
- Grouped by category (matching schema organization)
- Shows field name, type, current value, and source (which step sets it)
- Visual indicators:
  - ✅ Field covered in form (shows which step)
  - ⚙️ Auto-set by system (shows when/how)
  - ❓ Field not set (shows default value or null)
- Color coding: Green (set/handled), Yellow (default), Gray (null/optional)

#### Removal

- Will be removed after finalization
- All fields should be properly distributed across Steps 1-4
- Use to verify 100% coverage before removal

**Step 5 Total**: Display only (~60+ fields)

---

## Auto-Fill Logic

### Step 1 Auto-Fills

```
Title → Slug (if empty)
Title + Client → SEO Title (Step 3, if empty)
Excerpt → SEO Description (Step 3, if empty)
Category → OG Article Section (Step 3, if empty)
Tags → OG Article Tags (Step 3, if empty)
Featured → Sitemap Priority (Step 3, 0.8 if true, 0.5 default)
```

### Step 2 Auto-Fills

```
Content → Word Count, Reading Time, Content Depth (calculated)
```

### Step 3 Auto-Fills

```
Slug + Client → Canonical URL (auto-generate)
Canonical URL → OG URL (if empty)
SEO Title → OG Title (if empty)
SEO Description → OG Description (if empty)
Author → OG Article Author (if empty)
OG Title → Twitter Title (if empty)
OG Description → Twitter Description (if empty)
```

### Step 4 Auto-Fills

```
None (media fields are manual)
```

---

## Implementation Architecture

### Custom Stepper Components

#### 1. ArticleFormStepper Component

**File**: `admin/app/(dashboard)/articles/components/article-form-stepper.tsx`

**Purpose**: Horizontal navigation bar showing all steps

**Features**:

- Horizontal layout with step indicators
- Clickable step indicators (jump to any step)
- Visual states: active, completed, inactive
- Step numbers (1, 2, 3, 4, 5)
- Step labels (Basic, Content, SEO, Media, All Fields)
- Optional: Progress bar showing completion

**Implementation**:

- Uses: Button, Badge, Separator from shadcn/ui
- State: `currentStep` from ArticleFormContext
- Methods: `goToStep(step: number)` from context
- ~150 lines of code

#### 2. ArticleFormStep Component

**File**: `admin/app/(dashboard)/articles/components/article-form-step.tsx`

**Purpose**: Wrapper for step content, handles visibility

**Features**:

- Conditional rendering based on `currentStep`
- Simple wrapper component
- Handles step visibility

**Implementation**:

- Props: `step: number`, `children: ReactNode`
- Conditional: `{currentStep === step && children}`
- ~50 lines of code

#### 3. ArticleFormNavigation Component

**File**: `admin/app/(dashboard)/articles/components/article-form-navigation.tsx`

**Purpose**: Previous/Next/Save buttons with step counter

**Features**:

- Previous button (disabled on step 1)
- Next button (validates current step, disabled on last step)
- Save button (always visible, primary action)
- Step counter (Step X of 5)
- Sticky positioning (bottom of viewport)

**Implementation**:

- Uses: Button from shadcn/ui
- State: `currentStep`, `totalSteps` from context
- Methods: `previousStep()`, `nextStep()`, `save()` from context
- ~100 lines of code

### State Management

#### ArticleFormContext Updates

**File**: `admin/app/(dashboard)/articles/components/article-form-context.tsx`

**Changes**:

1. **Remove Zustand dependency**

   - Remove: `useArticleFormStore` import and usage
   - Remove: Zustand store synchronization logic
   - Remove: `article-form-store.ts` file (optional, can keep for reference)

2. **Add Step State**

   ```typescript
   // Add to state
   const [currentStep, setCurrentStep] = useState<number>(1);

   // Add to context interface
   currentStep: number;
   totalSteps: number;
   goToStep: (step: number) => void;
   nextStep: () => void;
   previousStep: () => void;
   canGoNext: boolean;
   canGoPrevious: boolean;
   ```

3. **Add Step Methods**

   ```typescript
   const goToStep = useCallback((step: number) => {
     if (step >= 1 && step <= 5) {
       setCurrentStep(step);
     }
   }, []);

   const nextStep = useCallback(() => {
     setCurrentStep((prev) => Math.min(prev + 1, 5));
   }, []);

   const previousStep = useCallback(() => {
     setCurrentStep((prev) => Math.max(prev - 1, 1));
   }, []);
   ```

### Step Components

#### Step 1: BasicStep Component

**File**: `admin/app/(dashboard)/articles/components/steps/basic-step.tsx`

**Based on**: `basic-section.tsx` (consolidate and enhance)

**Fields**:

- Title, Slug (read-only), Excerpt
- Client, Category, Tags
- Featured, Scheduled At
- Author (read-only)
- FAQs (collapsible section)

**Consolidates**:

- `basic-section.tsx`
- `tags-faq-section.tsx` (FAQs part)
- `meta-section.tsx` (Featured, Scheduled At)

#### Step 2: ContentStep Component

**File**: `admin/app/(dashboard)/articles/components/steps/content-step.tsx`

**Based on**: `content-section.tsx`

**Fields**:

- Content (rich text editor)
- Content Format (default: 'rich_text')
- Word Count, Reading Time, Content Depth (display)

**No changes needed** (already good)

#### Step 3: SEOStep Component

**File**: `admin/app/(dashboard)/articles/components/steps/seo-step.tsx`

**Based on**: Consolidate multiple sections

**Fields**:

- SEO Meta (Title, Description, Canonical URL, Meta Robots)
- Open Graph (all OG fields including OG Article Author)
- Twitter Cards (all Twitter fields)
- Technical SEO (Sitemap Priority, Change Freq, Alternate Languages, License, Last Reviewed)
- SEO Preview Card (display)

**Consolidates**:

- `seo-section.tsx`
- `social-section.tsx`
- `technical-section.tsx`

#### Step 4: MediaStep Component

**File**: `admin/app/(dashboard)/articles/components/steps/media-step.tsx`

**Based on**: `media-section.tsx`

**Fields**:

- Featured Image ID
- Image Gallery (edit mode only)

**Minor enhancements** (add image preview)

#### Step 5: AllFieldsIndicatorStep Component

**File**: `admin/app/(dashboard)/articles/components/steps/all-fields-indicator-step.tsx`

**Purpose**: Temporary indicator showing all schema fields

**Features**:

- Read-only display
- Grouped by category
- Visual indicators (✅ ⚙️ ❓)
- Color coding
- Shows which step handles each field

**Implementation**: ~200-300 lines (will be removed later)

---

## Implementation Steps

### Phase 1: Core Infrastructure (Day 1)

1. ✅ Update ArticleFormContext (remove Zustand, add step state)
2. ✅ Create ArticleFormStepper component
3. ✅ Create ArticleFormStep component
4. ✅ Create ArticleFormNavigation component

### Phase 2: Step Components (Day 2)

5. ✅ Create BasicStep component (consolidate sections)
6. ✅ Update ContentStep component (minimal changes)
7. ✅ Create SEOStep component (consolidate sections)
8. ✅ Update MediaStep component (minor enhancements)
9. ✅ Create AllFieldsIndicatorStep component (temporary)

### Phase 3: Integration (Day 3)

10. ✅ Update new article page (use stepper instead of accordion)
11. ✅ Test step navigation
12. ✅ Test auto-fill logic
13. ✅ Test save functionality
14. ✅ Verify all fields coverage (using Step 5)

### Phase 4: Cleanup (Day 4)

15. ✅ Remove Step 5 (after verification)
16. ✅ Remove unused files (old sections, Zustand store)
17. ✅ Update documentation
18. ✅ Final testing

**Total Time Estimate**: 3-4 days

---

## File Structure

```
admin/app/(dashboard)/articles/
├── components/
│   ├── article-form-context.tsx          (MODIFY - add step state)
│   ├── article-form-stepper.tsx          (CREATE - navigation)
│   ├── article-form-step.tsx             (CREATE - container)
│   ├── article-form-navigation.tsx       (CREATE - buttons)
│   ├── sticky-save-button.tsx            (MODIFY - integrate with navigation)
│   ├── article-form-header.tsx           (KEEP - minimal changes)
│   ├── steps/
│   │   ├── basic-step.tsx                (CREATE - consolidate sections)
│   │   ├── content-step.tsx              (CREATE - from content-section.tsx)
│   │   ├── seo-step.tsx                  (CREATE - consolidate sections)
│   │   ├── media-step.tsx                (CREATE - from media-section.tsx)
│   │   └── all-fields-indicator-step.tsx (CREATE - temporary)
│   └── sections/                         (KEEP for reference, or DELETE after migration)
│       ├── basic-section.tsx             (REFERENCE - consolidate into basic-step.tsx)
│       ├── content-section.tsx           (REFERENCE - use for content-step.tsx)
│       ├── seo-section.tsx               (REFERENCE - consolidate into seo-step.tsx)
│       ├── social-section.tsx            (REFERENCE - consolidate into seo-step.tsx)
│       ├── technical-section.tsx         (REFERENCE - consolidate into seo-step.tsx)
│       ├── media-section.tsx             (REFERENCE - use for media-step.tsx)
│       └── tags-faq-section.tsx          (REFERENCE - consolidate into basic-step.tsx)
├── new/
│   └── page.tsx                          (MODIFY - use stepper instead of accordion)
└── article-form-store.ts                 (DELETE or KEEP for reference - Zustand removed)
```

---

## Benefits of This Approach

### Stability

- ✅ No external dependencies for stepper logic
- ✅ Full control over behavior and styling
- ✅ No breaking changes from package updates
- ✅ Easy to maintain (code in your repo)

### Consistency

- ✅ Uses existing shadcn/ui components
- ✅ Follows existing patterns (ArticleFormContext)
- ✅ Matches codebase style
- ✅ No new patterns to learn

### Performance

- ✅ Lightweight (~300-400 lines total)
- ✅ Only code you need
- ✅ No unused features
- ✅ Fast performance

### Flexibility

- ✅ Easy to customize
- ✅ Easy to extend
- ✅ Easy to modify
- ✅ Full TypeScript support

---

## Testing Checklist

### Step Navigation

- [ ] Click step indicator → jumps to step
- [ ] Previous button → goes to previous step (disabled on step 1)
- [ ] Next button → goes to next step (disabled on last step)
- [ ] Save button → always visible, saves form data

### Auto-Fill Logic

- [ ] Title → Slug (if empty)
- [ ] Title + Client → SEO Title (if empty)
- [ ] Excerpt → SEO Description (if empty)
- [ ] Featured → Sitemap Priority (0.8 if true, 0.5 default)
- [ ] All other auto-fills work correctly

### Field Coverage

- [ ] Step 1: All basic fields present
- [ ] Step 2: Content fields present
- [ ] Step 3: All SEO fields present
- [ ] Step 4: Media fields present
- [ ] Step 5: All schema fields displayed (temporary)

### Save Functionality

- [ ] Save button saves all form data
- [ ] Validation works correctly
- [ ] Redirect works after save
- [ ] Errors display correctly

### User Experience

- [ ] Stepper UI is clear and intuitive
- [ ] Progress indication is visible
- [ ] Navigation is smooth
- [ ] Form fields are organized logically

---

## Migration Notes

### Breaking Changes

- **None** - This is a UI refactor, not a data model change
- Form data structure remains the same
- Save functionality remains the same

### Backward Compatibility

- Old accordion code can be kept for reference
- Can revert easily if needed
- No database changes required

### Rollback Plan

- Keep old sections in `sections/` folder initially
- Can switch back to accordion if needed
- Gradual migration possible (one step at a time)

---

## Success Criteria

### Functional

- ✅ All Article schema fields are covered (100%)
- ✅ Step navigation works smoothly
- ✅ Auto-fill logic works correctly
- ✅ Save functionality works correctly
- ✅ Form validation works correctly

### Technical

- ✅ No external dependencies added
- ✅ Code follows existing patterns
- ✅ TypeScript types are correct
- ✅ No linter errors
- ✅ Performance is acceptable

### User Experience

- ✅ Stepper UI is intuitive
- ✅ Progress is clear
- ✅ Navigation is easy
- ✅ Form is easy to complete
- ✅ Error messages are helpful

---

## Final Checklist Before Implementation

- [x] Plan includes all fields (100% coverage)
- [x] Stepper implementation approach decided (custom)
- [x] State management approach decided (Context-only)
- [x] Step structure finalized (5 steps)
- [x] Auto-fill logic documented
- [x] File structure planned
- [x] Implementation steps defined
- [x] Testing checklist created
- [x] Success criteria defined

---

## Approval

**Plan Status**: ✅ Ready for Approval

**Next Steps**:

1. Review this plan
2. Approve or request changes
3. Begin implementation after approval

**Estimated Implementation Time**: 3-4 days

**Risk Level**: Low (UI refactor, no data model changes)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Status**: Final - Ready for Approval
