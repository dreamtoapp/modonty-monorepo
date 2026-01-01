# SEO Perfect Coverage - Quick Guideline

## Core Principles for 100% SEO Coverage

### 1. Schema.org Structured Data
**Required for all entities:**
- ✅ **Name** - Always required
- ✅ **Description** - Separate from SEO description (100+ chars)
- ✅ **URL** - Canonical URL (HTTPS preferred)
- ✅ **Image/Logo** - PNG/SVG/JPG, min 112x112px
- ✅ **Date fields** - foundingDate, datePublished, dateModified (ISO format)
- ✅ **ContactPoint** - Structure email/phone with contactType
- ✅ **Address** - For local businesses (street, city, country, postalCode)
- ✅ **sameAs** - Social profiles array

### 2. Meta Tags
**Title Tag:**
- Length: 50-60 chars (optimal)
- Include brand/keyword
- Unique per page

**Meta Description:**
- Length: 150-160 chars (optimal)
- Compelling, action-oriented
- Include primary keyword naturally

### 3. Open Graph Tags (All Required)
- `og:title` - Can use SEO title
- `og:description` - Can use SEO description
- `og:url` - Canonical URL
- `og:type` - website, article, profile, etc.
- `og:image` - 1200x630px recommended

### 4. Twitter Cards (Social SEO)
- `twitter:card` - summary_large_image or summary
- `twitter:title` - Auto-generate from SEO title if not provided
- `twitter:description` - Auto-generate from SEO description
- `twitter:image` - Auto-generate from OG image
- `twitter:site` - @username for attribution

### 5. Technical SEO
- ✅ **HTTPS** - Always use secure protocol
- ✅ **Canonical URL** - Prevent duplicate content
- ✅ **Structured Data** - Use conditional spreading: `...(field && { field })`
- ✅ **All fields optional** - Backward compatible

---

## Entity-Specific Checklist

### For Articles
- [ ] Title (50-60 chars)
- [ ] Meta description (150-160 chars)
- [ ] Featured image (1200x630px)
- [ ] Date published & modified
- [ ] Author structured data
- [ ] Organization publisher
- [ ] Category/articleSection
- [ ] OG tags (all 5)
- [ ] Twitter Cards
- [ ] Canonical URL
- [ ] FAQ structured data (if applicable)

### For Authors
- [ ] Name
- [ ] Bio/description (100+ chars)
- [ ] Profile image
- [ ] Job title
- [ ] Works for (Organization)
- [ ] Social profiles (sameAs)
- [ ] Credentials/qualifications
- [ ] Expertise areas (knowsAbout)
- [ ] OG tags
- [ ] Twitter Cards

### For Categories
- [ ] Name
- [ ] Description (100+ chars)
- [ ] SEO title (50-60 chars)
- [ ] SEO description (150-160 chars)
- [ ] OG tags
- [ ] Canonical URL
- [ ] Breadcrumb structured data

### For Clients/Organizations
- [ ] Name & legal name
- [ ] Description (separate from SEO description)
- [ ] URL (HTTPS)
- [ ] Logo (PNG/SVG/JPG, 112x112px min)
- [ ] Founding date
- [ ] ContactPoint (email, phone, contactType)
- [ ] Address (for local SEO)
- [ ] Social profiles (sameAs)
- [ ] All OG tags
- [ ] Twitter Cards
- [ ] Canonical URL

---

## Quick Reference: Field Lengths

| Field | Optimal Length | Purpose |
|-------|---------------|---------|
| SEO Title | 50-60 chars | Search results display |
| Meta Description | 150-160 chars | Search snippet |
| Organization Description | 100+ chars | Schema.org structured data |
| OG Image | 1200x630px | Social sharing |
| Logo | 112x112px min | Google rich results |

---

## Implementation Pattern

```typescript
// Structured Data Pattern
const structuredData = {
  "@context": "https://schema.org",
  "@type": "EntityType",
  name: entity.name,
  ...(entity.description && { description: entity.description }),
  ...(entity.url && { url: entity.url }),
  ...(entity.image && { image: { "@type": "ImageObject", url: entity.image } }),
  ...(entity.datePublished && { datePublished: entity.datePublished.toISOString().split("T")[0] }),
};
```

---

## SEO Doctor Scoring (150 points max)

**Critical (Must Have):**
- Name: 5 points
- Slug: 5 points
- SEO Title: 15 points (50-60 chars)
- SEO Description: 15 points (150-160 chars)
- URL: 10 points (HTTPS preferred)

**Important (Should Have):**
- Description: 10 points (Schema.org)
- OG Tags: 10 points (all 5 tags)
- Social Profiles: 10 points
- Contact Info: 10 points
- Founding Date: 5 points

**Enhancements (Nice to Have):**
- ContactPoint: 5 points
- HTTPS: 5 points
- Logo Format: 5 points
- Twitter Cards: 10 points
- Canonical URL: 5 points
- Address: 5 points (local SEO)

**Target: 80%+ (120+ points) for optimal SEO**

---

## Best Practices

1. **Always use HTTPS** - Google prefers secure sites
2. **Separate descriptions** - SEO description ≠ Schema.org description
3. **Auto-generate when possible** - OG tags, Twitter Cards from existing data
4. **Validate formats** - URLs, images, dates
5. **Backward compatible** - All new fields optional
6. **Conditional spreading** - Only include fields that exist
7. **Real-time feedback** - SEO Doctor shows issues immediately

---

## Common Mistakes to Avoid

❌ Using same text for SEO description and Schema.org description
❌ Missing OG tags (especially og:type)
❌ HTTP instead of HTTPS
❌ Missing canonical URL (duplicate content risk)
❌ Logo too small (< 112x112px)
❌ Title/description too long (gets truncated)
❌ Missing Twitter Cards (lose social SEO signals)

---

**Remember:** All fields are optional for backward compatibility, but filling them improves SEO score and search visibility.
