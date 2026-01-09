# Cloudinary Folder Organization Report

## Overview

This report documents how images are organized in Cloudinary folders when uploaded for different entity types (Categories, Industries, Tags, Authors) and Media Library.

## Current Folder Structure Patterns

### 1. Media Library Uploads

**Location:** `admin/app/(dashboard)/media/components/upload-zone/hooks/use-cloudinary-upload.ts`

**Folder Structure:**
```
clients/{clientId}/{seo-filename}
```

**Details:**
- Uses **client ID** (MongoDB ObjectId) for folder organization
- Client ID is immutable and stable (doesn't change if client name/slug changes)
- Example: `clients/507f1f77bcf86cd799439011/sunset-beach-a3f2b1c`
- Uses `asset_folder` parameter for Cloudinary Media Library organization

**Code Reference:**
```typescript
// Line 75 in use-cloudinary-upload.ts
const folderPath = `clients/${clientId}`;
const publicId = generateCloudinaryPublicId(seoFileName, folderPath);
formData.append("asset_folder", folderPath);
```

---

### 2. Category Images

**Location:** `admin/app/(dashboard)/actions/upload-image.ts`

**Folder Structure:**
```
categories/{categorySlug}/{seo-filename}
```

**Fallback:**
```
categories/default/{seo-filename}
```

**Details:**
- Uses **category slug** for folder name
- If slug is missing, uses `default` folder
- Example: `categories/technology/category-image-a3f2b1c`
- Example (fallback): `categories/default/category-image-a3f2b1c`

**Code Reference:**
```typescript
// Line 55-56 in upload-image.ts
const categorySlug = slug || slugify(name);
const folder = categorySlug ? `${tableName}/${categorySlug}` : `${tableName}/default`;
```

**Used For:**
- Category social images (OG images, Twitter cards)
- Uploaded via `DeferredImageUpload` component in category forms

---

### 3. Industry Images

**Location:** `admin/app/(dashboard)/actions/upload-image.ts`

**Folder Structure:**
```
industries/{industrySlug}/{seo-filename}
```

**Fallback:**
```
industries/default/{seo-filename}
```

**Details:**
- Uses **industry slug** for folder name
- If slug is missing, uses `default` folder
- Example: `industries/healthcare/industry-image-a3f2b1c`
- Example (fallback): `industries/default/industry-image-a3f2b1c`

**Code Reference:**
```typescript
// Line 55-56 in upload-image.ts (same logic as categories)
const categorySlug = slug || slugify(name);
const folder = categorySlug ? `${tableName}/${categorySlug}` : `${tableName}/default`;
```

**Used For:**
- Industry social images (OG images, Twitter cards)
- Uploaded via `DeferredImageUpload` component in industry forms

---

### 4. Tag Images

**Location:** `admin/app/(dashboard)/actions/upload-image.ts`

**Folder Structure:**
```
tags/{tagSlug}/{seo-filename}
```

**Fallback:**
```
tags/default/{seo-filename}
```

**Details:**
- Uses **tag slug** for folder name
- If slug is missing, uses `default` folder
- Example: `tags/react/tag-image-a3f2b1c`
- Example (fallback): `tags/default/tag-image-a3f2b1c`

**Code Reference:**
```typescript
// Line 55-56 in upload-image.ts (same logic as categories)
const categorySlug = slug || slugify(name);
const folder = categorySlug ? `${tableName}/${categorySlug}` : `${tableName}/default`;
```

**Used For:**
- Tag social images (OG images, Twitter cards)
- Uploaded via `DeferredImageUpload` component in tag forms

---

### 5. Author Images

**Location:** `admin/app/(dashboard)/actions/upload-image.ts`

**Folder Structure:**
```
authors/{authorSlug}/{seo-filename}
```

**Fallback:**
```
authors/default/{seo-filename}
```

**Details:**
- Uses **author slug** for folder name
- If slug is missing, uses `default` folder
- Example: `authors/john-doe/author-profile-a3f2b1c`
- Example (fallback): `authors/default/author-profile-a3f2b1c`

**Code Reference:**
```typescript
// Line 55-56 in upload-image.ts (same logic as categories)
const categorySlug = slug || slugify(name);
const folder = categorySlug ? `${tableName}/${categorySlug}` : `${tableName}/default`;
```

**Used For:**
- Author profile images
- Uploaded via `DeferredImageUpload` component in author forms

---

## SEO Filename Generation

All uploads use the same SEO filename generation logic from `admin/lib/utils/image-seo.ts`:

**Function:** `generateSEOFileName()`

**Process:**
1. Uses alt text as primary source (required)
2. Falls back to title if alt text is empty
3. Falls back to original filename if both are empty
4. Generates slug from the text
5. Appends unique suffix (timestamp + random) to prevent duplicates
6. Limits length to 100 characters (excluding suffix)

**Example:**
- Alt text: "Sunset over beach"
- Original filename: "IMG1234.jpg"
- Generated: `sunset-over-beach-a3f2b1c`

---

## Complete Folder Structure Example

```
Cloudinary Root
├── clients/
│   ├── 507f1f77bcf86cd799439011/
│   │   ├── sunset-beach-a3f2b1c.jpg
│   │   └── mountain-view-b4c5d6e.jpg
│   └── 507f1f77bcf86cd799439012/
│       └── office-space-c7d8e9f.jpg
│
├── categories/
│   ├── technology/
│   │   └── tech-category-image-d1e2f3a.jpg
│   ├── design/
│   │   └── design-category-image-e2f3a4b.jpg
│   └── default/
│       └── fallback-category-image.jpg
│
├── industries/
│   ├── healthcare/
│   │   └── healthcare-industry-image-f3a4b5c.jpg
│   ├── finance/
│   │   └── finance-industry-image-a4b5c6d.jpg
│   └── default/
│       └── fallback-industry-image.jpg
│
├── tags/
│   ├── react/
│   │   └── react-tag-image-b5c6d7e.jpg
│   ├── nextjs/
│   │   └── nextjs-tag-image-c6d7e8f.jpg
│   └── default/
│       └── fallback-tag-image.jpg
│
└── authors/
    ├── john-doe/
    │   └── john-doe-profile-d7e8f9a.jpg
    ├── jane-smith/
    │   └── jane-smith-profile-e8f9a0b.jpg
    └── default/
        └── fallback-author-image.jpg
```

---

## Key Differences

| Entity Type | Folder Identifier | Stability | Notes |
|------------|-------------------|-----------|-------|
| **Media Library** | Client ID (ObjectId) | ✅ Stable | ID never changes, even if client name/slug changes |
| **Categories** | Category Slug | ⚠️ Can change | Slug may change if category name changes |
| **Industries** | Industry Slug | ⚠️ Can change | Slug may change if industry name changes |
| **Tags** | Tag Slug | ⚠️ Can change | Slug may change if tag name changes |
| **Authors** | Author Slug | ⚠️ Can change | Slug may change if author name changes |

---

## Implementation Files

1. **Media Library Uploads:**
   - `admin/app/(dashboard)/media/components/upload-zone/hooks/use-cloudinary-upload.ts`
   - Uses: `clients/{clientId}` folder structure

2. **Entity Image Uploads (Categories, Industries, Tags, Authors):**
   - `admin/app/(dashboard)/actions/upload-image.ts`
   - Uses: `{tableName}/{slug}` folder structure
   - Shared function for all entity types

3. **SEO Filename Generation:**
   - `admin/lib/utils/image-seo.ts`
   - Functions: `generateSEOFileName()`, `generateCloudinaryPublicId()`

4. **Image Upload Component:**
   - `admin/components/shared/deferred-image-upload.tsx`
   - Used by all entity forms for image selection

---

## Recommendations

### Current Implementation Strengths:
1. ✅ Consistent folder structure across entity types
2. ✅ SEO-friendly filenames with unique suffixes
3. ✅ Stable folder structure for Media Library (uses client ID)
4. ✅ Fallback to `default` folder when slug is missing

### Potential Improvements:
1. ⚠️ **Slug-based folders can break if entity slug changes** - Consider using IDs for entity folders (like Media Library does)
2. ⚠️ **No migration path** - If slug changes, old images remain in old folder
3. ✅ **Media Library already uses stable IDs** - Good pattern to follow

---

## Summary

- **Media Library:** Uses `clients/{clientId}` (stable, ID-based)
- **Categories:** Uses `categories/{categorySlug}` (can change if slug changes)
- **Industries:** Uses `industries/{industrySlug}` (can change if slug changes)
- **Tags:** Uses `tags/{tagSlug}` (can change if slug changes)
- **Authors:** Uses `authors/{authorSlug}` (can change if slug changes)

All uploads generate SEO-friendly filenames with unique suffixes to prevent duplicates.
