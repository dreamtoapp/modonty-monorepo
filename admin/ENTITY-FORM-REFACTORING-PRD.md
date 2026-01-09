# Entity Form Refactoring PRD

## Purpose

Refactor entity forms to separate UI from business logic, following the validated pattern from Categories implementation.

## Scope

Apply refactoring pattern to: Tags, Industries, Authors (and future entities)

**Reference Implementation:** `admin/app/(dashboard)/categories/` (fully implemented)

---

## Pre-Implementation: Folder Structure Validation

### Input

Entity folder name (e.g., `tags`, `industries`, `authors`)

### Required Folder Structure Check

**Base Path:** `admin/app/(dashboard)/[entity]/`

**Required Files/Folders:**

```
[entity]/
├── components/
│   └── [entity]-form.tsx                    ✅ REQUIRED
├── actions/
│   └── [entity]-actions.ts                  ✅ REQUIRED
├── helpers/
│   └── [entity]-seo-config.ts               ✅ REQUIRED
├── new/
│   └── page.tsx                             ✅ REQUIRED
├── [id]/
│   ├── edit/
│   │   └── page.tsx                         ✅ REQUIRED
│   ├── components/
│   │   ├── [entity]-view.tsx                ✅ REQUIRED
│   │   └── delete-[entity]-button.tsx       ✅ REQUIRED
│   └── page.tsx                             ✅ REQUIRED
```

**Validation Checklist:**

```
□ Entity folder exists at: admin/app/(dashboard)/[entity]/
□ components/[entity]-form.tsx exists
□ actions/[entity]-actions.ts exists
□ helpers/[entity]-seo-config.ts exists
□ new/page.tsx exists
□ [id]/edit/page.tsx exists
□ [id]/page.tsx exists
□ [id]/components/[entity]-view.tsx exists
□ [id]/components/delete-[entity]-button.tsx exists
```

### Current State Analysis

**Read and analyze:**

1. `[entity]/components/[entity]-form.tsx`

   - Check if it has useState, useEffect, handleSubmit (should be moved to hook)
   - Count lines (target: < 200 lines, UI-only)
   - Check if it imports and uses a hook (should)

2. Check if hook exists:

   - `[entity]/helpers/hooks/use-[entity]-form.ts`
   - If missing → needs to be created
   - If exists → verify completeness

3. Check pages structure:
   - Verify edit page has `await params` (Next.js 15+)
   - Verify edit page array destructuring is correct
   - Verify view page array destructuring is correct

---

## Implementation: Step-by-Step Checklist

### PHASE 1: Create Custom Hook

**File to Create:** `[entity]/helpers/hooks/use-[entity]-form.ts`

**Exact File Path Pattern:**

- Categories: `admin/app/(dashboard)/categories/helpers/hooks/use-category-form.ts`
- Tags: `admin/app/(dashboard)/tags/helpers/hooks/use-tag-form.ts`
- Industries: `admin/app/(dashboard)/industries/helpers/hooks/use-industry-form.ts`
- Authors: `admin/app/(dashboard)/authors/helpers/hooks/use-author-form.ts`

**Required Imports (Verified from Categories):**

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { ImageUploadData } from "@/components/shared/deferred-image-upload";
import { [Entity]WithRelations } from "@/lib/types";  // REPLACE: [Entity]
import { create[Entity], update[Entity] } from "../../actions/[entity]-actions";  // REPLACE
import { deleteOldImage as deleteOldImageAction } from "../../../actions/delete-old-image";
import { uploadImage } from "../../../actions/upload-image";
import { prepareImageData } from "../../../helpers/prepare-image-data";
```

**Required State (Verified from Categories):**

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [imageUploadData, setImageUploadData] = useState<ImageUploadData | null>(null);
const [imageRemoved, setImageRemoved] = useState(false);
const [formData, setFormData] = useState<[Entity]FormData>({ ... });
```

**Required Functions (Verified from Categories):**

1. `useEffect` - Auto-generate slug from name
2. `handleSubmit` - Form submission with image handling
3. `updateField` - Generic field updater
4. `updateSEOField` - SEO field updater

**Required Return Values (Verified from Categories):**

```typescript
return {
  formData,
  loading,
  error,
  imageUploadData,
  imageRemoved,
  setImageUploadData,
  setImageRemoved,
  updateField,
  updateSEOField,
  handleSubmit,
};
```

**Table Name Configuration (Verified):**

- Categories: `"categories"`
- Tags: `"tags"`
- Industries: `"industries"`
- Authors: `"authors"`

**Field Name Configuration (Verified):**

- Categories/Tags/Industries: `urlFieldName: "socialImage"`, `altFieldName: "socialImageAlt"`
- Authors: `urlFieldName: "image"`, `altFieldName: "imageAlt"`

**Route Configuration (Verified):**

- Categories: `router.push("/categories")`
- Tags: `router.push("/tags")`
- Industries: `router.push("/industries")`
- Authors: `router.push("/authors")`

**Validation Checklist:**

```
□ Hook file created at correct path
□ All required imports present
□ All state variables defined
□ useEffect for slug generation implemented
□ handleSubmit function implemented
□ Uses deleteOldImageAction from shared actions
□ Uses uploadImage from shared actions
□ Uses prepareImageData from shared helpers
□ Correct table name used (categories/tags/industries/authors)
□ Correct field names used (socialImage vs image for authors)
□ Correct route path used in router.push
□ updateField function implemented
□ updateSEOField function implemented
□ All required values exported in return statement
□ TypeScript compiles: cd admin && npx tsc --noEmit
```

---

### PHASE 2: Update Form Component

**File to Update:** `[entity]/components/[entity]-form.tsx`

**Current State (Tags Example - Needs Refactoring):**

- Has useState (should be removed)
- Has useEffect (should be removed)
- Has handleSubmit (should be removed)
- Direct state management (should use hook)

**Target State (Categories Example - Correct):**

- No useState
- No useEffect
- No handleSubmit
- Imports and uses hook
- UI-only (JSX rendering)

**Required Changes:**

1. Remove all `useState` declarations
2. Remove all `useEffect` hooks
3. Remove `handleSubmit` function
4. Import hook: `import { use[Entity]Form } from "../helpers/hooks/use-[entity]-form";`
5. Destructure hook: `const { formData, loading, error, ... } = use[Entity]Form({ ... });`
6. Update event handlers to use hook methods:
   - `onChange={(e) => updateField("name", e.target.value)}`
   - `onSeoTitleChange={(value) => updateSEOField("seoTitle", value)}`
7. Remove inline state updates (e.g., `setFormData({ ...formData, name: value })`)

**Validation Checklist:**

```
□ All useState removed
□ All useEffect removed
□ handleSubmit removed
□ Hook imported from correct path
□ Hook destructured with all required values
□ Event handlers use hook methods (updateField, updateSEOField)
□ No inline state updates remain
□ Component is UI-only (JSX rendering only)
□ Line count < 200 (target)
□ Component renders without errors
□ TypeScript compiles: cd admin && npx tsc --noEmit
```

---

### PHASE 3: Verify Image Handling

**Shared Helpers Location (Verified):**

- Delete: `admin/app/(dashboard)/actions/delete-old-image.ts`
- Upload: `admin/app/(dashboard)/actions/upload-image.ts`
- Prepare: `admin/app/(dashboard)/helpers/prepare-image-data.ts`

**Verify delete-old-image.ts supports entity:**

```typescript
type EntityTableName = 'categories' | 'tags' | 'industries' | 'authors';
```

If entity not in type → add it to both files.

**Verify upload-image.ts supports entity:**

```typescript
type EntityTableName = 'categories' | 'tags' | 'industries' | 'authors';
```

**Old Files to Delete (if exist):**

- `[entity]/actions/image-cleanup-actions.ts`
- `[entity]/helpers/[entity]-image-helpers.ts`

**Validation Checklist:**

```
□ No entity-specific image helper files exist
□ Hook uses deleteOldImageAction from ../../../actions/delete-old-image
□ Hook uses uploadImage from ../../../actions/upload-image
□ Hook uses prepareImageData from ../../../helpers/prepare-image-data
□ Entity table name exists in delete-old-image.ts type
□ Entity table name exists in upload-image.ts type
□ Correct field names used (socialImage vs image for authors)
```

---

### PHASE 4: Verify Pages Structure

#### Page 1: Create Page

**File:** `[entity]/new/page.tsx`

**Verified Pattern (Categories):**

```typescript
import { getCategories } from '../actions/categories-actions';
import { PageHeader } from '@/components/shared/page-header';
import { CategoryForm } from '../components/category-form';

export default async function NewCategoryPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Create Category" description="Add a new category to the system" />
      <CategoryForm categories={categories} />
    </div>
  );
}
```

**Verified Pattern (Tags - No Related Data):**

```typescript
import { PageHeader } from '@/components/shared/page-header';
import { TagForm } from '../components/tag-form';

export default function NewTagPage() {
  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Create Tag" description="Add a new tag to the system" />
      <TagForm />
    </div>
  );
}
```

**Entity-Specific Props (Verified):**

- Categories: Requires `categories={categories}` (has parent dropdown)
- Tags: No props needed
- Industries: Check form component for required props
- Authors: May need `clients={clients}` (check form component)

**Validation Checklist:**

```
□ Server component (async function, no "use client")
□ Fetches related data only if form component requires it
□ Passes correct props to form component
□ No initialData prop (creating new)
□ No [entity]Id prop (not editing)
□ Page renders without errors
```

#### Page 2: Edit Page

**File:** `[entity]/[id]/edit/page.tsx`

**Verified Pattern (Categories):**

```typescript
import { redirect } from 'next/navigation';
import { getCategoryById, getCategories } from '../../actions/categories-actions';
import { PageHeader } from '@/components/shared/page-header';
import { CategoryForm } from '../../components/category-form';
import { DeleteCategoryButton } from '../components/delete-category-button';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, categories] = await Promise.all([getCategoryById(id), getCategories()]);

  if (!category) {
    redirect('/categories');
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Edit Category" description="Update category information" />
      <div className="mb-6">
        <DeleteCategoryButton categoryId={id} />
      </div>
      <CategoryForm initialData={category} categories={categories} categoryId={id} />
    </div>
  );
}
```

**Critical Requirements (Verified):**

1. `params: Promise<{ id: string }>` type (Next.js 15+)
2. `const { id } = await params;` (must await)
3. Single-level array destructuring: `[entity, relatedData]` NOT `[[entity], relatedData]`
4. Parallel fetching with `Promise.all`
5. Redirect if entity not found
6. Pass both `initialData` and `[entity]Id` to form

**Validation Checklist:**

```
□ Server component (async function)
□ params type: Promise<{ id: string }>
□ await params used
□ Single-level array destructuring: [entity, relatedData]
□ NOT double-level: [[entity], relatedData]
□ Promise.all used for parallel fetching
□ Redirects if entity not found
□ Passes initialData to form
□ Passes [entity]Id to form
□ Passes related data if form requires it
□ Delete button component included
□ Page renders without errors
```

#### Page 3: View Page

**File:** `[entity]/[id]/page.tsx`

**Verified Pattern (Categories):**

```typescript
import { redirect } from 'next/navigation';
import { getCategoryById, getCategoryArticles } from '../actions/categories-actions';
import { PageHeader } from '@/components/shared/page-header';
import { CategoryView } from './components/category-view';
import { CategoryArticles } from './components/category-articles';
import { DeleteCategoryButton } from './components/delete-category-button';

export default async function CategoryViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, articles] = await Promise.all([getCategoryById(id), getCategoryArticles(id)]);

  if (!category) {
    redirect('/categories');
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Category Details" description="View category information and articles" />
      <div className="mb-6">
        <DeleteCategoryButton categoryId={id} />
      </div>
      <div className="space-y-6">
        <CategoryView category={category} />
        <CategoryArticles articles={articles} categoryId={id} />
      </div>
    </div>
  );
}
```

**Critical Requirements (Verified):**

1. `params: Promise<{ id: string }>` type
2. `const { id } = await params;` (must await)
3. Single-level array destructuring: `[entity, articles]` NOT `[[entity], articles]`
4. Uses view component (not form)
5. Redirect if entity not found

**Validation Checklist:**

```
□ Server component (async function)
□ params type: Promise<{ id: string }>
□ await params used
□ Single-level array destructuring: [entity, articles]
□ NOT double-level: [[entity], articles]
□ Promise.all used for parallel fetching
□ Redirects if entity not found
□ Uses view component (not form)
□ View component receives correct prop name
□ Delete button component included
□ Related data component included (if applicable)
□ Page renders without errors
```

---

### PHASE 5: Type Safety Verification

**Required Types (Verified from Categories):**

1. **FormData Interface:**

```typescript
interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  parentId: string; // Optional: only if entity has parent
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}
```

2. **WithRelations Type:**

- Must exist in `@/lib/types`
- Categories: `CategoryWithRelations`
- Tags: `TagWithRelations` (check if exists)
- Industries: `IndustryWithRelations` (check if exists)
- Authors: `AuthorWithRelations` (check if exists)

3. **Server Action Signatures (Verified from Categories):**

```typescript
// Create
export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  socialImage?: string;
  socialImageAlt?: string;
  cloudinaryPublicId?: string;
}): Promise<{ success: boolean; category?: Category; error?: string }>;

// Update
export async function updateCategory(
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;
    socialImage?: string | null;
    socialImageAlt?: string | null;
    cloudinaryPublicId?: string | null;
  },
): Promise<{ success: boolean; category?: Category; error?: string }>;
```

**Validation Checklist:**

```
□ FormData interface matches server action signature
□ [Entity]WithRelations type exists in @/lib/types
□ Server action create[Entity] exists and matches signature
□ Server action update[Entity] exists and matches signature
□ All imports resolve correctly
□ TypeScript compiles: cd admin && npx tsc --noEmit
□ No type errors related to FormData
□ No type errors related to WithRelations
□ No type errors related to server actions
```

---

### PHASE 6: Runtime Testing

**Test Scenarios (Verified from Working Categories):**

1. **Create Flow:**

   - Navigate to `/[entity]s/new`
   - Fill form fields
   - Upload image (optional)
   - Submit form
   - Should redirect to `/[entity]s`
   - Entity should appear in list

2. **Edit Flow:**

   - Navigate to `/[entity]s/[id]`
   - Click "Edit" button
   - Modify form fields
   - Replace image (optional)
   - Submit form
   - Should redirect to `/[entity]s`
   - Changes should be saved

3. **View Flow:**

   - Navigate to `/[entity]s/[id]`
   - Should display all entity data
   - SEO Health Gauge should display
   - Collapsible sections should work
   - Edit button should navigate to edit page

4. **Image Handling:**
   - Upload new image → should save
   - Replace existing image → old should be deleted, new saved
   - Remove image → should be deleted from Cloudinary and DB

**Validation Checklist:**

```
□ Create flow works end-to-end
□ Edit flow works end-to-end
□ View page displays correctly
□ Image upload works
□ Image replacement works (old deleted, new saved)
□ Image removal works
□ Navigation links work
□ Error handling displays correctly
□ Loading states work
□ Form validation works
```

---

## Entity-Specific Configurations

### Tags

**Verified from codebase:**

- Table: `"tags"`
- Fields: `socialImage`, `socialImageAlt`
- Route: `"/tags"`
- Form props: None required
- Related data: No categories dropdown
- Status: ❌ Needs refactoring (has logic in form)

### Industries

**Expected (verify):**

- Table: `"industries"`
- Fields: `socialImage`, `socialImageAlt`
- Route: `"/industries"`
- Form props: Check form component
- Related data: May need industries list
- Status: Check current state

### Authors

**Expected (verify):**

- Table: `"authors"`
- Fields: `image`, `imageAlt` (different!)
- Route: `"/authors"`
- Form props: May need `clients={clients}`
- Related data: Check form component
- Status: Check current state

---

## Success Criteria

**Refactoring Complete When ALL Are True:**

```
□ Hook file exists and contains all logic
□ Form component is UI-only (< 200 lines)
□ Form component imports and uses hook
□ No useState in form component
□ No useEffect in form component
□ No handleSubmit in form component
□ Create page works correctly
□ Edit page works correctly (single-level destructuring)
□ View page works correctly (single-level destructuring)
□ All three pages use await params
□ TypeScript compiles without errors
□ All runtime tests pass
□ Follows Categories pattern exactly
□ Uses shared image helpers
□ No duplicate code
□ No old image helper files exist
```

---

## Reference Implementation

**Perfect Example (Verified Working):**

- Folder: `admin/app/(dashboard)/categories/`
- Form: `categories/components/category-form.tsx` (144 lines, UI-only)
- Hook: `categories/helpers/hooks/use-category-form.ts` (130 lines, all logic)
- Create: `categories/new/page.tsx`
- Edit: `categories/[id]/edit/page.tsx`
- View: `categories/[id]/page.tsx`

**Shared Helpers (Verified):**

- Delete: `admin/app/(dashboard)/actions/delete-old-image.ts`
- Upload: `admin/app/(dashboard)/actions/upload-image.ts`
- Prepare: `admin/app/(dashboard)/helpers/prepare-image-data.ts`

---

## Critical Bugs to Avoid

### Bug 1: Array Destructuring (CRITICAL)

- ❌ Wrong: `const [[entity], relatedData] = await Promise.all([...]);`
- ✅ Correct: `const [entity, relatedData] = await Promise.all([...]);`
- **Location:** Edit page and View page

### Bug 2: Placeholder Not Replaced

- ❌ Wrong: Leaving `[Entity]`, `[entity]`, `[entity]s` in code
- ✅ Correct: Replace with actual names (e.g., `Category`, `category`, `categories`)

### Bug 3: Props Mismatch

- ❌ Wrong: Generic `data={relatedData}` prop
- ✅ Correct: Specific prop name (e.g., `categories={categories}`)

### Bug 4: Missing await params

- ❌ Wrong: `const { id } = params;`
- ✅ Correct: `const { id } = await params;` (Next.js 15+)

---

## Verification Commands

**TypeScript Check:**

```bash
cd admin && npx tsc --noEmit
```

**Expected:** No errors

**File Existence Check:**

```bash
# Verify hook exists
ls admin/app/\(dashboard\)/[entity]/helpers/hooks/use-[entity]-form.ts

# Verify form is updated
# Check that form component has no useState, useEffect, handleSubmit
```

---

## Implementation Order

1. **Phase 1:** Create hook (must be done first)
2. **Phase 2:** Update form component (requires hook)
3. **Phase 3:** Verify image handling (check existing code)
4. **Phase 4:** Verify pages (check structure, fix if needed)
5. **Phase 5:** Type safety (verify types exist)
6. **Phase 6:** Runtime testing (test all flows)

---

## Notes

- All file paths are relative to `admin/app/(dashboard)/`
- All imports use `@/` alias for absolute paths
- Categories is the reference - match its pattern exactly
- Verify each step before proceeding
- Test after each phase
- If TypeScript errors → fix before continuing

---

**Status:** Ready for implementation
**Last Verified:** Against Categories implementation (working codebase)
**Next Entity:** Tags, Industries, Authors
