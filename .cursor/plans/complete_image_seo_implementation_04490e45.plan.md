---
name: Complete Image SEO Implementation
overview: ""
todos: []
---

# Complete Image SEO Implementation Plan

## Overview

This plan addresses all missing image SEO features identified in `admin/IMAGE-SEO-RESEARCH-REPORT.md`, organized into 3 phases plus Cloudinary integration.

## Phase 1: Critical SEO Fields (High Priority)

### 1.1 Add Keywords Field to Upload Form

**Files to modify:**

- `admin/app/(dashboard)/media/components/upload-zone.tsx`
- Add `keywords` to `seoForm` state (comma-separated string)
- Add keywords input field in SEO form section
- Convert comma-separated string to array before saving

**Files to modify:**

- `admin/app/(dashboard)/media/actions/media-actions.ts`
- `createMedia` already accepts `keywords?: string[]` - no changes needed
- `updateMedia` already accepts `keywords?: string[]` - no changes needed

### 1.2 Add License Field

**Database Schema:**

- `dataLayer/prisma/schema/media.prisma.txt` - Add `license String?` field
- Update main schema file `dataLayer/prisma/schema/schema.prisma`

**Files to modify:**

- `admin/app/(dashboard)/media/components/upload-zone.tsx`
- Add `license` to `seoForm` state
- Add Select dropdown with license options: CC0, CC-BY, CC-BY-SA, CC-BY-NC, Commercial, All Rights Reserved, Public Domain
- Add license field in SEO form section

**Files to modify:**

- `admin/app/(dashboard)/media/actions/media-actions.ts`
- Add `license?: string` to `createMedia` data parameter
- Add `license?: string` to `updateMedia` data parameter
- Store license in database

### 1.3 Add Creator/Author Field

**Database Schema:**

- `dataLayer/prisma/schema/media.prisma.txt` - Add `creator String?` field
- Update main schema file

**Files to modify:**

- `admin/app/(dashboard)/media/components/upload-zone.tsx`
- Add `creator` to `seoForm` state
- Add creator input field in SEO form section

**Files to modify:**

- `admin/app/(dashboard)/media/actions/media-actions.ts`
- Add `creator?: string` to `createMedia` and `updateMedia`

### 1.4 Add Date Created Field with EXIF Extraction

**Dependencies:**

- Install `exifr` package: `pnpm add exifr` in admin folder

**Database Schema:**

- `dataLayer/prisma/schema/media.prisma.txt` - Add `dateCreated DateTime?` field
- Update main schema file

**New utility file:**

- `admin/lib/utils/exif-extractor.ts`
- Create function to extract EXIF data from File object
- Extract dateCreated, camera model, ISO, aperture, GPS coordinates
- Return structured EXIF data

**Files to modify:**

- `admin/app/(dashboard)/media/components/upload-zone.tsx`
- Add `dateCreated` to `seoForm` state
- Extract EXIF data when file is selected
- Auto-populate dateCreated from EXIF if available
- Add dateCreated date picker field (with EXIF value as default)

**Files to modify:**

- `admin/app/(dashboard)/media/actions/media-actions.ts`
- Add `dateCreated?: Date` to `createMedia` and `updateMedia`

## Phase 2: Schema.org Enhancement (Medium Priority)

### 2.1 Add Geographic Location Fields

**Database Schema:**

- `dataLayer/prisma/schema/media.prisma.txt` - Add:
- `geoLatitude Float?`
- `geoLongitude Float?`
- `geoLocationName String?` (human-readable location name)
- Update main schema file

**Files to modify:**

- `admin/app/(dashboard)/media/components/upload-zone.tsx`
- Add location fields to `seoForm` state
- Add latitude/longitude input fields (with validation)
- Add location name input field
- Auto-populate from EXIF GPS if available

**Files to modify:**

- `admin/app/(dashboard)/media/actions/media-actions.ts`
- Add geo fields to `createMedia` and `updateMedia`

### 2.2 Add Content Location Field

**Database Schema:**

- `dataLayer/prisma/schema/media.prisma.txt` - Add `contentLocation String?` field
- Update main schema file

**Files to modify:**

- `admin/app/(dashboard)/media/components/upload-zone.tsx`
- Add `contentLocation` to `seoForm` state
- Add contentLocation input field

**Files to modify:**

- `admin/app/(dashboard)/media/actions/media-actions.ts`
- Add `contentLocation?: string` to `createMedia` and `updateMedia`

### 2.3 Store EXIF Metadata

**Database Schema:**

- `dataLayer/prisma/schema/media.prisma.txt` - Add `exifData Json?` field (store full EXIF as JSON)
- Update main schema file

**Files to modify:**

- `admin/app/(dashboard)/media/components/upload-zone.tsx`
- Extract and store full EXIF data when file is selected
- Store in state for submission

**Files to modify:**

- `admin/app/(dashboard)/media/actions/media-actions.ts`
- Add `exifData?: object` to `createMedia` and `updateMedia`
- Store EXIF data as JSON in database

## Phase 3: Output & Schema.org Markup (Low Priority)

### 3.1 Generate Schema.org JSON-LD for Images

**New utility file:**

- `admin/lib/utils/schema-org-generator.ts`
- Create function to generate ImageObject schema.org JSON-LD
- Include all SEO fields: title, description, keywords, license, creator, dateCreated, geoLocation, etc.
- Return valid JSON-LD structure

**Files to modify:**

- `admin/app/(dashboard)/media/components/media-detail.tsx` (if exists)
- Add Schema.org JSON-LD output in media detail view
- Display structured data for SEO

### 3.2 Add Open Graph Meta Tags for Images

**Files to modify:**

- `admin/app/(dashboard)/media/components/media-detail.tsx` (if exists)
- Generate Open Graph meta tags for images
- Include og:image, og:image:alt, og:image:width, og:image:height
- Include og:image:type, og:image:secure_url

## Phase 4: Cloudinary Integration (Enhancement)

### 4.1 Store Cloudinary Metadata

**Database Schema:**

- `dataLayer/prisma/schema/media.prisma.txt` - Add:
- `cloudinaryPublicId String?` (Cloudinary public ID)
- `cloudinaryVersion String?` (Cloudinary version)
- `cloudinarySignature String?` (Cloudinary signature)
- Update main schema file

**Files to modify:**

- `admin/app/(dashboard)/media/actions/media-actions.ts`
- Store Cloudinary metadata when uploading
- Add fields to `createMedia` function

### 4.2 Cloudinary Transformations & Optimization

**Files to modify:**

- `admin/app/(dashboard)/media/components/upload-zone.tsx`
- Add options for Cloudinary transformations (resize, format, quality)
- Store transformation preferences

**New utility file:**

- `admin/lib/utils/cloudinary-utils.ts`
- Helper functions for Cloudinary URL generation
- Transformation presets
- Optimization utilities

## Implementation Order

1. **Phase 1** - Critical SEO fields (Keywords, License, Creator, Date Created with EXIF)
2. **Phase 2** - Schema.org enhancements (Geographic location, Content location, EXIF storage)
3. **Phase 3** - Output & Schema.org markup (JSON-LD generation, Open Graph)
4. **Phase 4** - Cloudinary integration enhancements

## Testing Checklist

- [ ] Keywords field saves and displays correctly
- [ ] License dropdown works and saves value
- [ ] Creator field saves and displays correctly
- [ ] EXIF extraction works for dateCreated
- [ ] Date picker shows EXIF date as default
- [ ] Geographic location fields validate coordinates
- [ ] EXIF GPS data auto-populates location fields
- [ ] Full EXIF data stores as JSON
- [ ] Schema.org JSON-LD generates correctly
- [ ] All fields persist in database
- [ ] All fields display in media detail/edit views
- [ ] Migration runs successfully
- [ ] No breaking changes to existing functionality

## Notes

- All database changes require migration: `pnpm prisma migrate dev --name add_image_seo_fields`
- After schema changes, run: `pnpm prisma generate` from root
- Test with various image formats (JPEG, PNG, WebP) that contain EXIF data
- Ensure backward compatibility - all new fields are optional