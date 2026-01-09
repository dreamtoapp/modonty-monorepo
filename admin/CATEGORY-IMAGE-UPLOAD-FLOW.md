# Category Image Upload Flow - Code Documentation

## Overview

This document traces the complete code flow for uploading Category images to Cloudinary with the folder structure: `categories/{categorySlug}/filename`

---

## Flow Diagram

```
User Action
    ↓
[1] CategoryForm Component
    ↓
[2] DeferredImageUpload Component (Image Selection)
    ↓
[3] useCategoryForm Hook (Form Submission)
    ↓
[4] uploadImage Server Action
    ↓
[5] generateSEOFileName (SEO Filename Generation)
    ↓
[6] generateCloudinaryPublicId (Folder Structure)
    ↓
[7] Cloudinary API Upload
    ↓
[8] Database Update
```

---

## Step-by-Step Code Flow

### Step 1: CategoryForm Component

**File:** `admin/app/(dashboard)/categories/components/category-form.tsx`

**Lines 113-119:**

```tsx
<DeferredImageUpload
  categorySlug={formData.slug} // ← Category slug passed here
  onImageSelected={setImageUploadData}
  onImageRemoved={() => setImageRemoved(true)}
  initialImageUrl={initialData?.socialImage || undefined}
  initialAltText={initialData?.socialImageAlt || undefined}
/>
```

**What happens:**

- User fills out category form
- `formData.slug` is auto-generated from category name (via `useCategoryForm` hook)
- `DeferredImageUpload` component receives the slug (though it's not used in the component itself)
- User selects an image file

**Key Data:**

- `formData.slug`: Category slug (e.g., "technology")
- `formData.name`: Category name (e.g., "Technology")

---

### Step 2: DeferredImageUpload Component

**File:** `admin/components/shared/deferred-image-upload.tsx`

**Lines 117-154:**

```tsx
const handleFileSelect = useCallback(
  (selectedFile: File) => {
    const error = validateFile(selectedFile);
    if (error) {
      toast({
        /* error */
      });
      return;
    }

    const preview = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(preview);

    const imageData: ImageUploadData = {
      file: selectedFile,
      altText: preservedAltText,
      previewUrl: preview,
    };

    onImageSelected?.(imageData); // ← Passes image data to parent
  },
  [altText, initialAltText, previewUrl, onImageSelected, toast],
);
```

**What happens:**

- User selects/drops an image file
- File is validated (type, size)
- Preview is generated
- `ImageUploadData` object is created with:
  - `file`: The File object
  - `altText`: User-entered alt text
  - `previewUrl`: Blob URL for preview
- Data is passed to parent via `onImageSelected` callback

**Key Data:**

- `ImageUploadData.file`: File object
- `ImageUploadData.altText`: Alt text (required for SEO)

**Note:** The `categorySlug` prop is received but not used in this component. The slug is passed separately in the form submission.

---

### Step 3: useCategoryForm Hook (Form Submission)

**File:** `admin/app/(dashboard)/categories/helpers/hooks/use-category-form.ts`

**Lines 50-68:**

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  // Delete old image if editing
  if (categoryId && initialData?.id && (imageUploadData?.file || imageRemoved)) {
    await deleteOldImageAction("categories", initialData.id);
  }

  // Upload new image
  const uploadResult = await uploadImage({
    imageData: imageUploadData,        // ← Image data from DeferredImageUpload
    tableName: "categories",          // ← Entity type
    urlFieldName: "socialImage",      // ← Database field for URL
    altFieldName: "socialImageAlt",   // ← Database field for alt text
    slug: formData.slug,              // ← Category slug (KEY FOR FOLDER)
    name: formData.name,               // ← Category name (fallback)
    recordId: categoryId,              // ← Category ID (for update)
    initialId: initialData?.id,       // ← Initial ID (for update)
  });
```

**What happens:**

- Form is submitted
- Old image is deleted if editing
- `uploadImage` server action is called with:
  - `imageData`: Contains file, altText, previewUrl
  - `tableName`: "categories"
  - `slug`: Category slug (e.g., "technology") ← **Used for folder structure**
  - `name`: Category name (fallback if slug missing)

**Key Parameters:**

- `slug: formData.slug` → **This becomes the folder name**
- `tableName: "categories"` → **This becomes the parent folder**

---

### Step 4: uploadImage Server Action

**File:** `admin/app/(dashboard)/actions/upload-image.ts`

**Lines 55-59:**

```typescript
const categorySlug = slug || slugify(name);
const folder = categorySlug ? `${tableName}/${categorySlug}` : `${tableName}/default`;

const seoFileName = generateSEOFileName(altText, '', imageData.file.name, undefined, true);
const publicId = generateCloudinaryPublicId(seoFileName, folder);
```

**What happens:**

1. **Line 55:** Extract slug from params or generate from name

   ```typescript
   const categorySlug = slug || slugify(name);
   // Example: "technology" or "technology" (if slug exists)
   ```

2. **Line 56:** Build folder path

   ```typescript
   const folder = categorySlug ? `${tableName}/${categorySlug}` : `${tableName}/default`;
   // Example: "categories/technology" or "categories/default"
   ```

3. **Line 58:** Generate SEO-friendly filename

   ```typescript
   const seoFileName = generateSEOFileName(altText, '', imageData.file.name, undefined, true);
   // Example: "sunset-over-beach-a3f2b1c"
   ```

4. **Line 59:** Combine folder + filename
   ```typescript
   const publicId = generateCloudinaryPublicId(seoFileName, folder);
   // Example: "categories/technology/sunset-over-beach-a3f2b1c"
   ```

**Key Logic:**

- `tableName` = "categories" (from params)
- `categorySlug` = "technology" (from `formData.slug`)
- `folder` = `"categories/technology"`
- Final `publicId` = `"categories/technology/sunset-over-beach-a3f2b1c"`

**Lines 68-71:**

```typescript
const formData = new FormData();
formData.append('file', imageData.file);
formData.append('upload_preset', uploadPreset);
formData.append('public_id', publicId); // ← Full path with folder structure
```

**Cloudinary Upload:**

- `public_id` is set to the full path: `"categories/technology/sunset-over-beach-a3f2b1c"`
- Cloudinary automatically creates the folder structure based on the `public_id`

---

### Step 5: generateSEOFileName Function

**File:** `admin/lib/utils/image-seo.ts`

**Lines 34-79:**

```typescript
export function generateSEOFileName(
  altText: string,
  title?: string,
  originalFilename?: string,
  clientSlug?: string,
  ensureUnique: boolean = true,
): string {
  // Use altText as primary source
  const sourceText = altText?.trim() || title?.trim() || originalFilename || 'image';

  // Generate slug from the text
  let seoSlug = slugify(sourceText);

  // Ensure minimum length
  if (seoSlug.length < 3) {
    seoSlug = `image-${seoSlug}`;
  }

  // Add unique suffix to prevent duplicates
  if (ensureUnique) {
    const uniqueSuffix = generateUniqueSuffix(); // e.g., "a3f2b1c"
    const maxBaseLength = 100 - 9;
    if (seoSlug.length > maxBaseLength) {
      seoSlug = seoSlug.substring(0, maxBaseLength);
      seoSlug = seoSlug.replace(/-+$/, '');
    }
    seoSlug = `${seoSlug}-${uniqueSuffix}`;
  }

  return seoSlug;
}
```

**What happens:**

- Input: `altText = "Sunset over beach"`, `originalFilename = "IMG1234.jpg"`
- Process:
  1. Use alt text: `"Sunset over beach"`
  2. Slugify: `"sunset-over-beach"`
  3. Generate unique suffix: `"a3f2b1c"`
  4. Combine: `"sunset-over-beach-a3f2b1c"`

**Output:** `"sunset-over-beach-a3f2b1c"`

---

### Step 6: generateCloudinaryPublicId Function

**File:** `admin/lib/utils/image-seo.ts`

**Lines 101-130:**

```typescript
export function generateCloudinaryPublicId(seoFileName: string, folder?: string): string {
  if (folder) {
    // If folder contains slashes, it's already a path structure
    if (folder.includes('/')) {
      const pathSegments = folder.split('/');
      const processedSegments = pathSegments.map((segment) => {
        // Don't slugify ObjectIds
        if (isObjectId(segment)) {
          return segment;
        }
        return slugify(segment);
      });
      const folderPath = processedSegments.join('/');
      return `${folderPath}/${seoFileName}`;
    }
    // Single folder name - slugify it
    const folderSlug = slugify(folder);
    return `${folderSlug}/${seoFileName}`;
  }
  return seoFileName;
}
```

**What happens:**

- Input:
  - `seoFileName = "sunset-over-beach-a3f2b1c"`
  - `folder = "categories/technology"`
- Process:
  1. Split folder: `["categories", "technology"]`
  2. Slugify each segment (already slugified, so no change)
  3. Join: `"categories/technology"`
  4. Combine with filename: `"categories/technology/sunset-over-beach-a3f2b1c"`

**Output:** `"categories/technology/sunset-over-beach-a3f2b1c"`

---

### Step 7: Cloudinary API Upload

**File:** `admin/app/(dashboard)/actions/upload-image.ts`

**Lines 73-88:**

```typescript
const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  method: 'POST',
  body: formData,
});

if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  const errorMessage = errorData.error?.message || `Upload failed with status ${response.status}`;
  return { success: false, error: errorMessage };
}

const result = await response.json();
const cloudinaryUrl = result.secure_url || result.url;
const cloudinaryPublicId = result.public_id; // ← "categories/technology/sunset-over-beach-a3f2b1c"
```

**What happens:**

- FormData is sent to Cloudinary with `public_id = "categories/technology/sunset-over-beach-a3f2b1c"`
- Cloudinary creates the folder structure automatically:
  ```
  categories/
    └── technology/
        └── sunset-over-beach-a3f2b1c.jpg
  ```
- Response contains the `public_id` and `secure_url`

**Result:**

- `cloudinaryPublicId`: `"categories/technology/sunset-over-beach-a3f2b1c"`
- `cloudinaryUrl`: `"https://res.cloudinary.com/.../categories/technology/sunset-over-beach-a3f2b1c.jpg"`

---

### Step 8: Database Update

**File:** `admin/app/(dashboard)/actions/upload-image.ts`

**Lines 101-114:**

```typescript
const updateData: Record<string, string> = {
  [urlFieldName]: optimizedUrl,           // "socialImage"
  [altFieldName]: altText.trim(),         // "socialImageAlt"
  cloudinaryPublicId: cloudinaryPublicId, // "categories/technology/sunset-over-beach-a3f2b1c"
};

if (recordId || initialId) {
  try {
    switch (tableName) {
      case "categories":
        await db.category.update({
          where: { id: recordId || initialId },
          data: updateData,
        });
        break;
```

**What happens:**

- Category record is updated with:
  - `socialImage`: Optimized Cloudinary URL
  - `socialImageAlt`: Alt text
  - `cloudinaryPublicId`: Full path `"categories/technology/sunset-over-beach-a3f2b1c"`

---

## Complete Example Flow

### Input Data:

- **Category Name:** "Technology"
- **Category Slug:** "technology" (auto-generated)
- **Image File:** `sunset.jpg`
- **Alt Text:** "Sunset over beach"

### Step-by-Step Transformation:

1. **CategoryForm** → `formData.slug = "technology"`

2. **DeferredImageUpload** → `imageData = { file, altText: "Sunset over beach", previewUrl }`

3. **useCategoryForm** → Calls `uploadImage({ slug: "technology", ... })`

4. **uploadImage** →

   - `categorySlug = "technology"`
   - `folder = "categories/technology"`

5. **generateSEOFileName** →

   - Input: `altText = "Sunset over beach"`
   - Output: `"sunset-over-beach-a3f2b1c"`

6. **generateCloudinaryPublicId** →

   - Input: `seoFileName = "sunset-over-beach-a3f2b1c"`, `folder = "categories/technology"`
   - Output: `"categories/technology/sunset-over-beach-a3f2b1c"`

7. **Cloudinary Upload** →

   - `public_id = "categories/technology/sunset-over-beach-a3f2b1c"`
   - Creates folder structure automatically

8. **Database Update** →
   - `cloudinaryPublicId = "categories/technology/sunset-over-beach-a3f2b1c"`

### Final Result:

```
Cloudinary Folder Structure:
categories/
  └── technology/
      └── sunset-over-beach-a3f2b1c.jpg

Database Fields:
- socialImage: "https://res.cloudinary.com/.../categories/technology/sunset-over-beach-a3f2b1c.jpg"
- socialImageAlt: "Sunset over beach"
- cloudinaryPublicId: "categories/technology/sunset-over-beach-a3f2b1c"
```

---

## Key Points

1. **Folder Structure is Built in `upload-image.ts`:**

   - Line 56: `const folder = categorySlug ? `${tableName}/${categorySlug}`:`${tableName}/default`;`
   - Uses `tableName` ("categories") + `categorySlug` ("technology")

2. **Slug Comes from Form:**

   - `formData.slug` is auto-generated from category name in `useCategoryForm` hook
   - Passed to `uploadImage` as the `slug` parameter

3. **SEO Filename is Generated Separately:**

   - Uses alt text to create SEO-friendly filename
   - Adds unique suffix to prevent duplicates

4. **Final Path is Combined:**

   - `generateCloudinaryPublicId()` combines folder + filename
   - Result: `"categories/technology/sunset-over-beach-a3f2b1c"`

5. **Cloudinary Creates Folders Automatically:**
   - No need to create folders manually
   - Folder structure is inferred from `public_id` path

---

## Files Involved

1. **`admin/app/(dashboard)/categories/components/category-form.tsx`**

   - Form component with DeferredImageUpload

2. **`admin/components/shared/deferred-image-upload.tsx`**

   - Image selection and preview component

3. **`admin/app/(dashboard)/categories/helpers/hooks/use-category-form.ts`**

   - Form state management and submission logic

4. **`admin/app/(dashboard)/actions/upload-image.ts`**

   - Server action that handles upload and folder structure

5. **`admin/lib/utils/image-seo.ts`**
   - SEO filename generation and Cloudinary public_id generation

---

## Potential Issues

⚠️ **Slug Can Change:**

- If category name changes, slug changes
- Old images remain in old folder: `categories/old-slug/...`
- New images go to new folder: `categories/new-slug/...`
- No automatic migration of old images

**Solution Consideration:**

- Use category ID instead of slug (like Media Library uses client ID)
- Would require changing line 56 in `upload-image.ts`:

  ```typescript
  // Current (unstable):
  const folder = categorySlug ? `${tableName}/${categorySlug}` : `${tableName}/default`;

  // Proposed (stable):
  const folder = recordId ? `${tableName}/${recordId}` : `${tableName}/default`;
  ```
