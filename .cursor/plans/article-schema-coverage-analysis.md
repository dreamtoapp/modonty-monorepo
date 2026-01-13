# Article Schema Coverage Analysis

## Comparison: Article Schema Fields vs 4-Step Plan

### ✅ COVERED FIELDS (User-Editable)

#### Step 1: Basic Information
- ✅ `title` - Text input
- ✅ `slug` - Auto-generated, read-only display
- ✅ `excerpt` - Textarea
- ✅ `clientId` - Dropdown select
- ✅ `categoryId` - Dropdown select
- ✅ `authorId` - Auto-set to Modonty (read-only)
- ✅ `tags` - Multi-select (stored in ArticleTag relation)

#### Step 2: Content
- ✅ `content` - Rich text editor
- ✅ `contentFormat` - Default 'rich_text' (can be editable)
- ✅ `wordCount` - Auto-calculated, displayed
- ✅ `readingTimeMinutes` - Auto-calculated, displayed
- ✅ `contentDepth` - Auto-calculated, displayed

#### Step 3: SEO
- ✅ `seoTitle` - Text input
- ✅ `seoDescription` - Textarea
- ✅ `canonicalUrl` - Text input (auto-generated)
- ✅ `metaRobots` - Dropdown select
- ✅ `ogTitle` - Text input
- ✅ `ogDescription` - Textarea
- ✅ `ogUrl` - Text input (auto-generated)
- ✅ `ogSiteName` - Text input (default: 'مودونتي')
- ✅ `ogLocale` - Text input (default: 'ar_SA')
- ✅ `ogArticleSection` - Text input (auto-fill from category)
- ✅ `ogArticleTag` - Text input (comma-separated, auto-fill from tags)
- ✅ `twitterCard` - Dropdown select
- ✅ `twitterTitle` - Text input
- ✅ `twitterDescription` - Textarea
- ✅ `twitterSite` - Text input
- ✅ `twitterCreator` - Text input
- ✅ `twitterLabel1` - Text input
- ✅ `twitterData1` - Text input

#### Step 4: Media
- ✅ `featuredImageId` - Text input
- ✅ `gallery` - ImageGalleryManager (ArticleMedia relation)

---

### ❌ MISSING FIELDS (Not in 4-Step Plan)

#### Fields Currently in Codebase but NOT in Simplified Plan:

1. **`scheduledAt`** (DateTime?)
   - **Location**: Currently in MetaSection or BasicSection
   - **Purpose**: Schedule article for future publication
   - **Status**: NOT in plan
   - **Recommendation**: Add to Step 1 (Basic) as optional date picker

2. **`featured`** (Boolean, default: false)
   - **Location**: Currently in MetaSection
   - **Purpose**: Mark article as featured
   - **Status**: NOT in plan
   - **Recommendation**: Add to Step 1 (Basic) as checkbox

3. **`license`** (String?)
   - **Location**: Currently in TechnicalSection
   - **Purpose**: License URL for content
   - **Status**: NOT in plan
   - **Recommendation**: Add to Step 3 (SEO) as optional field, or auto-set default

4. **`lastReviewed`** (DateTime?)
   - **Location**: Currently in TechnicalSection or MetaSection
   - **Purpose**: Track content freshness for SEO
   - **Status**: NOT in plan
   - **Recommendation**: Auto-set on save/update, or add to Step 3 (SEO) as optional

5. **`ogArticleAuthor`** (String?)
   - **Location**: Currently in SocialSection
   - **Purpose**: Open Graph article author
   - **Status**: NOT in plan
   - **Recommendation**: Add to Step 3 (SEO) in OG section, or auto-set from author

6. **`sitemapPriority`** (Float?, default: 0.5)
   - **Location**: Currently in TechnicalSection
   - **Purpose**: Sitemap priority (0.0 to 1.0)
   - **Status**: NOT in plan
   - **Recommendation**: Add to Step 3 (SEO), or auto-calculate (0.8 if featured, 0.5 default)

7. **`sitemapChangeFreq`** (String?, default: 'weekly')
   - **Location**: Currently in TechnicalSection
   - **Purpose**: Sitemap change frequency
   - **Status**: NOT in plan
   - **Recommendation**: Add to Step 3 (SEO), or keep default 'weekly'

8. **`alternateLanguages`** (Json? - Array of {hreflang, url})
   - **Location**: Currently in TechnicalSection
   - **Purpose**: hreflang tags for multilingual SEO
   - **Status**: NOT in plan
   - **Recommendation**: Add to Step 3 (SEO) as optional, or remove from simplified flow

---

### ⚙️ SYSTEM FIELDS (Not User-Editable, Auto-Managed)

These fields are managed by the system and don't need user input:

- ✅ `id` - System-generated ObjectId
- ✅ `status` - Auto-set to 'WRITING' for new articles (workflow)
- ✅ `datePublished` - Set on publish (not during creation)
- ✅ `dateModified` - Auto-updated on save (@updatedAt)
- ✅ `createdAt` - Auto-set on creation
- ✅ `updatedAt` - Auto-updated on save
- ✅ `ogType` - Default 'article' (constant)
- ✅ `ogUpdatedTime` - Auto-set on update
- ✅ `ogArticlePublishedTime` - Set on publish
- ✅ `ogArticleModifiedTime` - Auto-set on update
- ✅ `robotsMeta` - Same as metaRobots
- ✅ `inLanguage` - Default 'ar' (constant)
- ✅ `isAccessibleForFree` - Default true (constant)
- ✅ `creativeWorkStatus` - Derived from status
- ✅ `mainEntityOfPage` - Same as canonicalUrl
- ✅ `breadcrumbPath` - Auto-generated from category + article
- ✅ `jsonLdStructuredData` - Generated server-side
- ✅ `jsonLdLastGenerated` - Auto-set on generation
- ✅ `jsonLdValidationReport` - Generated server-side
- ✅ `articleBodyText` - Extracted from content server-side
- ✅ `semanticKeywords` - Advanced feature (not in basic flow)
- ✅ `citations` - Advanced feature (not in basic flow)
- ✅ `jsonLdVersion` - System-managed
- ✅ `jsonLdHistory` - System-managed
- ✅ `jsonLdDiffSummary` - System-managed
- ✅ `jsonLdGenerationTimeMs` - Performance tracking
- ✅ `performanceBudgetMet` - Performance tracking

---

### 📋 RELATION FIELDS (Stored in Separate Tables)

These are handled through relations, not direct fields:

- ✅ `tags` → ArticleTag relation (handled in Step 1)
- ✅ `faqs` → FAQ relation (NOT in 4-step plan - needs decision)
- ✅ `gallery` → ArticleMedia relation (handled in Step 4)
- ✅ `versions` → ArticleVersion relation (audit trail, system-managed)
- ✅ `analytics` → Analytics relation (system-tracked)
- ✅ `relatedFrom` → RelatedArticle relation (advanced feature)
- ✅ `relatedTo` → RelatedArticle relation (advanced feature)

---

## SUMMARY

### Total Article Schema Fields: ~60+ fields

### Covered in 4-Step Plan: ~30 fields (user-editable)

### Missing from Plan: 8 fields
1. `scheduledAt`
2. `featured`
3. `license`
4. `lastReviewed`
5. `ogArticleAuthor`
6. `sitemapPriority`
7. `sitemapChangeFreq`
8. `alternateLanguages`

### System-Managed: ~25 fields (auto-set, not user-editable)

### Relations: ~7 relations (handled separately)

---

## RECOMMENDATIONS

### Option A: Add Missing Fields to Steps

**Step 1 (Basic)** - Add:
- `featured` - Checkbox
- `scheduledAt` - Date picker (optional)

**Step 3 (SEO)** - Add:
- `ogArticleAuthor` - Text input (or auto-set from author)
- `sitemapPriority` - Number input (0.0-1.0, or auto: 0.8 if featured, 0.5 default)
- `sitemapChangeFreq` - Dropdown (default: 'weekly')
- `alternateLanguages` - Optional array (or remove from simplified flow)
- `license` - Text input (optional, or auto-set default)

**Step 3 (SEO)** - Auto-set:
- `lastReviewed` - Auto-set on save (no user input needed)

### Option B: Keep Simplified (Recommended for MVP)

**Step 1 (Basic)** - Add only essential:
- `featured` - Checkbox (affects sitemap priority)

**Step 3 (SEO)** - Add only essential:
- `ogArticleAuthor` - Text input (or auto-set from author)

**Auto-set with defaults** (no user input):
- `scheduledAt` - null (can be added later)
- `license` - null or default
- `lastReviewed` - Auto-set on save
- `sitemapPriority` - Auto: 0.8 if featured, 0.5 default
- `sitemapChangeFreq` - Default 'weekly'
- `alternateLanguages` - Empty array (can be added in advanced settings later)

### Option C: Minimal (Current Plan)

Keep current 4-step plan as-is. Missing fields are:
- Set to defaults/null
- Can be edited later in edit mode
- Not critical for article creation flow

---

## FAQ HANDLING

**Current Status**: FAQs are NOT in the 4-step plan.

**Options**:
1. Add to Step 1 (Basic) - Simple FAQ builder
2. Add to Step 2 (Content) - After content is written
3. Remove from simplified flow - Add in edit mode only
4. Make optional in Step 1 - Collapsible section

**Recommendation**: Option 1 or 4 - Add simple FAQ builder to Step 1 (Basic Information) as optional section.

---

## CONCLUSION

**Current Plan Coverage**: ~85% of user-editable fields

**Missing Critical Fields**: 
- `featured` - Should be added (affects priority)
- `ogArticleAuthor` - Should be added (or auto-set)

**Missing Optional Fields**:
- `scheduledAt` - Can be null for now
- `license` - Can be null
- `lastReviewed` - Can be auto-set
- `sitemapPriority` - Can be auto-calculated
- `sitemapChangeFreq` - Can use default
- `alternateLanguages` - Can be empty array

**Recommendation**: 
- Add `featured` to Step 1
- Add `ogArticleAuthor` to Step 3 (or auto-set)
- Keep other fields as defaults/null (can be edited later)
- Add FAQs to Step 1 as optional section
