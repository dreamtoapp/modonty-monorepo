# Entity Form Refactoring Guide

## Overview

This guide documents the refactoring pattern used for `category-form.tsx` to separate UI from business logic, making code more maintainable, testable, and reusable.

**Apply this pattern to:** Tags, Industries, Authors, and other entity forms.

---

## 🎯 Goals

1. **Separate Concerns**: UI components render only, logic lives in hooks
2. **DRY Principle**: Share image handling logic across all entities
3. **SOLID Principles**: Single Responsibility for each file
4. **Maintainability**: Easy to update and test

---

## 📋 Refactoring Checklist

### Phase 1: Extract Logic to Custom Hook

- [ ] Create `helpers/hooks/use-[entity]-form.ts`
- [ ] Move all `useState` hooks to custom hook
- [ ] Move all `useEffect` hooks to custom hook
- [ ] Move `handleSubmit` function to custom hook
- [ ] Extract field update handlers (`updateField`, `updateSEOField`)
- [ ] Export hook interface matching component needs

### Phase 2: Update Component to Use Hook

- [ ] Import custom hook
- [ ] Replace state declarations with hook destructuring
- [ ] Remove `handleSubmit` from component
- [ ] Remove `useEffect` from component
- [ ] Update event handlers to use hook methods
- [ ] Keep only JSX rendering logic

### Phase 3: Migrate to Shared Image Helpers

- [ ] Remove entity-specific image cleanup actions (if exists)
- [ ] Replace with `actions/delete-old-image.ts`
- [ ] Replace image upload logic with `actions/upload-image.ts`
- [ ] Use `helpers/prepare-image-data.ts` for data transformation
- [ ] Update imports to use shared helpers

### Phase 4: Clean Up

- [ ] Delete old image helper files (if any)
- [ ] Remove duplicate code
- [ ] Verify TypeScript compilation
- [ ] Test form submission (create & update)
- [ ] Test image upload/delete functionality

---

## 📁 Complete File Structure Pattern

### Before Refactoring

```
[entity]/
├── components/
│   └── [entity]-form.tsx (300+ lines - mixed UI & logic)
├── actions/
│   ├── [entity]-actions.ts
│   └── image-cleanup-actions.ts ❌ (duplicate)
└── helpers/
    └── [entity]-image-helpers.ts ❌ (duplicate)
```

### After Refactoring (Complete Structure)

```
[entity]/
├── [id]/                                    # Dynamic route folder
│   ├── components/
│   │   ├── [entity]-view.tsx               # View component (read-only)
│   │   ├── [entity]-articles.tsx           # Related articles list (optional)
│   │   └── delete-[entity]-button.tsx      # Delete action button
│   ├── edit/
│   │   └── page.tsx                        # Edit page (uses form)
│   └── page.tsx                            # View page (uses view component)
├── new/
│   └── page.tsx                            # Create page (uses form)
├── components/
│   └── [entity]-form.tsx                   # Form component (144 lines - UI only)
├── helpers/
│   ├── hooks/
│   │   └── use-[entity]-form.ts            # Form logic hook (130 lines)
│   └── [entity]-seo-config.ts              # SEO configuration
└── actions/
    └── [entity]-actions.ts                 # Server actions (CRUD)

Shared (used by all entities):
├── actions/
│   ├── delete-old-image.ts ✅
│   └── upload-image.ts ✅
└── helpers/
    └── prepare-image-data.ts ✅
```

**Key Points:**

- **Pages**: Three Next.js pages for create, edit, and view scenarios
- **Components**: Form (editable) and View (read-only) components
- **Hooks**: Logic separated into custom hooks
- **Actions**: Server-side CRUD operations

---

## 🔧 Step-by-Step Implementation

### Step 1: Create Custom Hook

**File:** `helpers/hooks/use-[entity]-form.ts`

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { ImageUploadData } from "@/components/shared/deferred-image-upload";
import { [Entity]WithRelations } from "@/lib/types";
import { create[Entity], update[Entity] } from "../../actions/[entity]-actions";
import { deleteOldImage as deleteOldImageAction } from "../../../actions/delete-old-image";
import { uploadImage } from "../../../actions/upload-image";
import { prepareImageData } from "../../../helpers/prepare-image-data";

interface [Entity]FormData {
  name: string;
  slug: string;
  description: string;
  // ... other fields
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

interface Use[Entity]FormParams {
  initialData?: Partial<[Entity]WithRelations>;
  [entity]Id?: string;
}

export function use[Entity]Form({ initialData, [entity]Id }: Use[Entity]FormParams) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploadData, setImageUploadData] = useState<ImageUploadData | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  const [formData, setFormData] = useState<[Entity]FormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    // ... initialize other fields
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    canonicalUrl: initialData?.canonicalUrl || "",
  });

  // Auto-generate slug from name
  useEffect(() => {
    const newSlug = slugify(formData.name);
    setFormData((prev) => ({ ...prev, slug: newSlug }));
  }, [formData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Delete old image if editing and image changed/removed
    if ([entity]Id && initialData?.id && (imageUploadData?.file || imageRemoved)) {
      await deleteOldImageAction("[entity]s", initialData.id); // Note: plural table name
    }

    // Upload new image (if any)
    const uploadResult = await uploadImage({
      imageData: imageUploadData,
      tableName: "[entity]s", // e.g., "tags", "industries", "authors"
      urlFieldName: "socialImage", // or "image" for authors
      altFieldName: "socialImageAlt", // or "imageAlt" for authors
      slug: formData.slug,
      name: formData.name,
      recordId: [entity]Id,
      initialId: initialData?.id,
    });

    if (!uploadResult.success) {
      setError(uploadResult.error || "Failed to upload image");
      setLoading(false);
      return;
    }

    // Prepare final image data
    const { finalSocialImage, finalSocialImageAlt, finalCloudinaryPublicId } =
      prepareImageData(
        !![entity]Id, // isEdit
        imageRemoved, // isRemoved
        !!imageUploadData?.file, // hasNewFile
        uploadResult.result
      );

    // Create or update entity
    const result = [entity]Id
      ? await update[Entity]([entity]Id, {
          ...formData,
          // Handle optional fields
          ...(finalSocialImage !== undefined ? { socialImage: finalSocialImage } : {}),
          ...(finalSocialImageAlt !== undefined ? { socialImageAlt: finalSocialImageAlt } : {}),
          ...(finalCloudinaryPublicId !== undefined ? { cloudinaryPublicId: finalCloudinaryPublicId } : {}),
        })
      : await create[Entity]({
          ...formData,
          socialImage: finalSocialImage ?? undefined,
          socialImageAlt: finalSocialImageAlt ?? undefined,
          cloudinaryPublicId: finalCloudinaryPublicId ?? undefined,
        });

    if (result.success) {
      router.push(`/[entity]s`); // Update route
      router.refresh();
    } else {
      setError(result.error || `Failed to save [entity]`);
      setLoading(false);
    }
  };

  const updateField = (field: keyof [Entity]FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSEOField = (field: "seoTitle" | "seoDescription" | "canonicalUrl", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
}
```

**Important Notes:**

- Replace `[Entity]` with actual entity name (Tag, Industry, Author)
- Replace `[entity]` with lowercase (tag, industry, author)
- Replace `[entity]s` with plural table name (tags, industries, authors)
- Adjust `urlFieldName` and `altFieldName` based on schema (authors use `image` instead of `socialImage`)
- Update router.push path to match your routes

---

### Step 2: Update Component

**File:** `components/[entity]-form.tsx`

**Before:**

```typescript
"use client";

export function [Entity]Form({ initialData, [entity]Id }: [Entity]FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({...});
  // ... lots of state and logic

  useEffect(() => {
    // slug generation
  }, [formData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    // ... 50+ lines of submission logic
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  );
}
```

**After:**

```typescript
"use client";

import { useRouter } from "next/navigation";
import { use[Entity]Form } from "../helpers/hooks/use-[entity]-form";
// ... other imports

export function [Entity]Form({ initialData, [entity]Id }: [Entity]FormProps) {
  const router = useRouter();
  const {
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
  } = use[Entity]Form({ initialData, [entity]Id });

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      {/* Form fields using hook methods */}
      <FormInput
        value={formData.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <SEOFields
        seoTitle={formData.seoTitle}
        onSeoTitleChange={(value) => updateSEOField("seoTitle", value)}
        // ...
      />

      {/* Submit button */}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : initialData ? "Update [Entity]" : "Create [Entity]"}
      </Button>
    </form>
  );
}
```

**Key Changes:**

1. Remove all `useState` declarations
2. Remove all `useEffect` hooks
3. Remove `handleSubmit` function
4. Import and use custom hook
5. Use hook methods for event handlers (`updateField`, `updateSEOField`)
6. Keep only JSX rendering

---

### Step 3: Update Image Handling

**Remove old code:**

```typescript
// ❌ DELETE these files if they exist:
// - actions/image-cleanup-actions.ts
// - helpers/[entity]-image-helpers.ts
```

**Use shared helpers:**

```typescript
// ✅ Use these imports in hook:
import { deleteOldImage as deleteOldImageAction } from '../../../actions/delete-old-image';
import { uploadImage } from '../../../actions/upload-image';
import { prepareImageData } from '../../../helpers/prepare-image-data';
```

**Image field names by entity:**

| Entity     | urlFieldName  | altFieldName     |
| ---------- | ------------- | ---------------- |
| Categories | `socialImage` | `socialImageAlt` |
| Tags       | `socialImage` | `socialImageAlt` |
| Industries | `socialImage` | `socialImageAlt` |
| Authors    | `image`       | `imageAlt`       |

---

### Step 4: Table Name Mapping

**Update `actions/delete-old-image.ts` if needed:**

Ensure your entity table name is in the type:

```typescript
type EntityTableName = 'categories' | 'tags' | 'industries' | 'authors';
```

**Update `actions/upload-image.ts` if needed:**

Ensure your entity table name is in the type:

```typescript
type EntityTableName = 'categories' | 'tags' | 'industries' | 'authors';
```

If adding new entity, update both files.

---

## 📄 Page Patterns

Entity management requires three page types: **Create**, **Update (Edit)**, and **View**. Each serves a specific purpose in the CRUD workflow.

### Pattern A: Create Page (`new/page.tsx`)

**Purpose:** Allow users to create new entities

**Location:** `[entity]/new/page.tsx`

**Pattern:**

```typescript
import { PageHeader } from "@/components/shared/page-header";
import { [Entity]Form } from "../components/[entity]-form";
import { get[Related]Data } from "../actions/[entity]-actions"; // Optional: for dropdowns

export default async function New[Entity]Page() {
  // Fetch related data if needed (e.g., parent categories, clients)
  const relatedData = await get[Related]Data();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Create [Entity]"
        description="Add a new [entity] to the system"
      />
      <[Entity]Form data={relatedData} />
    </div>
  );
}
```

**Key Points:**

- Server component (async)
- No `initialData` prop (creating new)
- No `[entity]Id` prop (not editing)
- Fetches related data if needed for dropdowns/selects

**Example from codebase:**

- `admin/app/(dashboard)/categories/new/page.tsx`

---

### Pattern B: Edit Page (`[id]/edit/page.tsx`)

**Purpose:** Allow users to edit existing entities

**Location:** `[entity]/[id]/edit/page.tsx`

**Pattern:**

```typescript
import { redirect } from "next/navigation";
import { get[Entity]ById, get[Related]Data } from "../../actions/[entity]-actions";
import { PageHeader } from "@/components/shared/page-header";
import { [Entity]Form } from "../../components/[entity]-form";
import { Delete[Entity]Button } from "../components/delete-[entity]-button";

export default async function Edit[Entity]Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  // Fetch entity and related data in parallel
  const [[entity], relatedData] = await Promise.all([
    get[Entity]ById(id),
    get[Related]Data() // Optional: for dropdowns
  ]);

  // Redirect if entity not found
  if (!entity) {
    redirect("/[entity]s");
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Edit [Entity]"
        description="Update [entity] information"
      />
      <div className="mb-6">
        <Delete[Entity]Button [entity]Id={id} />
      </div>
      <[Entity]Form
        initialData={entity}
        [entity]Id={id}
        data={relatedData}
      />
    </div>
  );
}
```

**Key Points:**

- Server component with async params
- Fetches entity data before rendering
- Redirects if entity not found
- Passes both `initialData` and `[entity]Id` to form
- Includes delete button for convenience

**Example from codebase:**

- `admin/app/(dashboard)/categories/[id]/edit/page.tsx`

---

### Pattern C: View Page (`[id]/page.tsx`)

**Purpose:** Display entity details in read-only mode

**Location:** `[entity]/[id]/page.tsx`

**Pattern:**

```typescript
import { redirect } from "next/navigation";
import { get[Entity]ById, get[Entity]Articles } from "../actions/[entity]-actions";
import { PageHeader } from "@/components/shared/page-header";
import { [Entity]View } from "./components/[entity]-view";
import { [Entity]Articles } from "./components/[entity]-articles";
import { Delete[Entity]Button } from "./components/delete-[entity]-button";

export default async function [Entity]ViewPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  // Fetch entity and related data in parallel
  const [[entity], articles] = await Promise.all([
    get[Entity]ById(id),
    get[Entity]Articles(id) // Optional: related data
  ]);

  // Redirect if entity not found
  if (!entity) {
    redirect("/[entity]s");
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="[Entity] Details"
        description="View [entity] information and articles"
      />
      <div className="mb-6">
        <Delete[Entity]Button [entity]Id={id} />
      </div>
      <div className="space-y-6">
        <[Entity]View [entity]={entity} />
        <[Entity]Articles articles={articles} [entity]Id={id} />
      </div>
    </div>
  );
}
```

**Key Points:**

- Server component with async params
- Uses `[Entity]View` component (not form)
- Fetches related data (e.g., articles) if needed
- Redirects if entity not found
- Includes delete button

**Example from codebase:**

- `admin/app/(dashboard)/categories/[id]/page.tsx`

---

## 👁️ View Component Pattern

View components display entity data in **read-only** mode. They differ from forms in that they don't allow editing - they only display information.

### Template: `[entity]-view.tsx`

**Location:** `[entity]/[id]/components/[entity]-view.tsx`

**Full Template:**

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { SEOHealthGauge } from "@/components/shared/seo-doctor/seo-health-gauge";
import { [entity]SEOConfig } from "../../helpers/[entity]-seo-config";

interface [Entity] {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  socialImage: string | null; // or 'image' for authors
  socialImageAlt: string | null; // or 'imageAlt' for authors
  createdAt: Date;
  updatedAt: Date;
  _count: {
    articles: number;
    // ... other counts
  };
  // ... other fields
}

interface [Entity]ViewProps {
  [entity]: [Entity];
}

export function [Entity]View({ [entity] }: [Entity]ViewProps) {
  const [basicOpen, setBasicOpen] = useState(true);
  const [seoOpen, setSeoOpen] = useState(true);

  return (
    <div className="space-y-4">
      {/* Header with title and actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{[entity].name}</h1>
          {/* Optional: Add subtitle here */}
        </div>
        <div className="flex items-center gap-4">
          <SEOHealthGauge
            data={[entity]}
            config={[entity]SEOConfig}
            size="md"
          />
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/[entity]s">Back</Link>
            </Button>
            <Button asChild>
              <Link href={`/[entity]s/${[entity].id}/edit`}>Edit</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Basic Information Section */}
      <Collapsible open={basicOpen} onOpenChange={setBasicOpen}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle>Basic Information</CardTitle>
              {basicOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="text-sm font-medium">{[entity].name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Slug</p>
                <p className="font-mono text-sm">{[entity].slug}</p>
              </div>

              {[entity].description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm whitespace-pre-wrap">{[entity].description}</p>
                </div>
              )}

              {/* Related counts */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Articles</p>
                <Link
                  href={`/articles?[entity]Id=${[entity].id}`}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {[entity]._count.articles} {[entity]._count.articles === 1 ? "article" : "articles"}
                </Link>
              </div>

              {/* Dates */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="text-sm">
                  {format(new Date([entity].createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="text-sm">
                  {format(new Date([entity].updatedAt), "MMM d, yyyy")}
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* SEO Section */}
      <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle>SEO</CardTitle>
              {seoOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              {[entity].seoTitle && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">SEO Title</p>
                  <p className="text-sm">{[entity].seoTitle}</p>
                </div>
              )}

              {[entity].seoDescription && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">SEO Description</p>
                  <p className="text-sm">{[entity].seoDescription}</p>
                </div>
              )}

              {/* Social Image Display */}
              {[entity].socialImage && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Social Image</p>
                  <div className="space-y-2">
                    <div className="relative border rounded-lg overflow-hidden max-w-md">
                      <img
                        src={[entity].socialImage}
                        alt={[entity].socialImageAlt || "Social image"}
                        className="w-full h-auto max-h-64 object-contain"
                      />
                    </div>
                    {[entity].socialImageAlt && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Alt Text</p>
                        <p className="text-sm">{[entity].socialImageAlt}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
```

**Key Features:**

1. **Client Component** - Uses `"use client"` for interactivity (collapsible sections)
2. **Read-Only** - No form inputs, only displays data
3. **Collapsible Sections** - Basic Info and SEO sections can be collapsed
4. **SEO Health Gauge** - Shows SEO score at top
5. **Action Buttons** - Back and Edit buttons in header
6. **Image Display** - Shows social image if available
7. **Date Formatting** - Uses `date-fns` for readable dates
8. **Conditional Rendering** - Only shows fields that have values

**Example from codebase:**

- `admin/app/(dashboard)/categories/[id]/components/category-view.tsx`

---

## 🔄 Complete Workflow

### Three Scenarios Coverage

This guide covers all three CRUD scenarios:

#### 1. CREATE Scenario

```
User clicks "New [Entity]"
  → Navigates to /[entity]s/new
  → Renders New[Entity]Page
  → Shows [Entity]Form (no initialData)
  → User fills form and submits
  → Hook calls create[Entity]()
  → Redirects to /[entity]s
```

**Files involved:**

- `new/page.tsx` - Create page
- `components/[entity]-form.tsx` - Form component
- `helpers/hooks/use-[entity]-form.ts` - Form logic

#### 2. UPDATE Scenario

```
User clicks "Edit" on entity
  → Navigates to /[entity]s/[id]/edit
  → Renders Edit[Entity]Page
  → Fetches entity data
  → Shows [Entity]Form (with initialData & [entity]Id)
  → User modifies form and submits
  → Hook calls update[Entity]()
  → Redirects to /[entity]s
```

**Files involved:**

- `[id]/edit/page.tsx` - Edit page
- `components/[entity]-form.tsx` - Form component (same as create)
- `helpers/hooks/use-[entity]-form.ts` - Form logic (handles both create & update)

#### 3. VIEW Scenario

```
User clicks on entity in list
  → Navigates to /[entity]s/[id]
  → Renders [Entity]ViewPage
  → Fetches entity data
  → Shows [Entity]View (read-only)
  → User can click "Edit" to go to edit page
  → User can view related data (e.g., articles)
```

**Files involved:**

- `[id]/page.tsx` - View page
- `[id]/components/[entity]-view.tsx` - View component
- `[id]/components/[entity]-articles.tsx` - Related data component (optional)

---

## 🧪 Testing Checklist

### Form Testing (Create & Update)

- [ ] **Create new entity** - Form submits successfully
- [ ] **Update existing entity** - Changes save correctly
- [ ] **Form validation** - Required fields are enforced
- [ ] **Image upload** - New image uploads and saves
- [ ] **Image replacement** - Old image deleted, new one saved
- [ ] **Image removal** - Image removed from entity
- [ ] **Slug generation** - Auto-generates from name
- [ ] **SEO fields** - Save and update correctly
- [ ] **Error handling** - Errors display properly
- [ ] **Loading states** - Button shows loading state during submission
- [ ] **Navigation** - Redirects to list page after successful save
- [ ] **Cancel button** - Returns to previous page

### View Page Testing

- [ ] **View page loads** - Displays entity data correctly
- [ ] **All fields display** - All entity properties are shown
- [ ] **Collapsible sections** - Basic Info and SEO sections toggle
- [ ] **SEO Health Gauge** - Displays correct SEO score
- [ ] **Image display** - Social image shows if available
- [ ] **Date formatting** - Dates display in readable format
- [ ] **Related data** - Articles/related items display correctly
- [ ] **Edit button** - Navigates to edit page
- [ ] **Back button** - Returns to list page
- [ ] **Empty states** - Handles missing/null values gracefully

### Page Navigation Testing

- [ ] **Create flow** - List → New → Form → Submit → List
- [ ] **Edit flow** - List → View → Edit → Form → Submit → List
- [ ] **View flow** - List → View → Display → Edit (if needed)
- [ ] **Delete flow** - View/Edit → Delete → Confirm → List
- [ ] **Not found handling** - Invalid IDs redirect to list

### TypeScript & Code Quality

- [ ] **TypeScript** - No compilation errors (`npx tsc --noEmit`)
- [ ] **No console errors** - Browser console is clean
- [ ] **Linting** - No linting errors
- [ ] **Accessibility** - Proper labels and ARIA attributes

---

## 📊 Entity-Specific Notes

### Tags

```typescript
// Table name: "tags"
tableName: 'tags';
urlFieldName: 'socialImage';
altFieldName: 'socialImageAlt';
route: '/tags';
```

### Industries

```typescript
// Table name: "industries"
tableName: 'industries';
urlFieldName: 'socialImage';
altFieldName: 'socialImageAlt';
route: '/industries';
```

### Authors

```typescript
// Table name: "authors"
tableName: 'authors';
urlFieldName: 'image'; // ⚠️ Different field name
altFieldName: 'imageAlt'; // ⚠️ Different field name
route: '/authors';
```

**Special case for Authors:**

- Uses `image` and `imageAlt` instead of `socialImage` and `socialImageAlt`
- May have additional fields (e.g., `clients` relationship)

---

## ✅ Complete Implementation Checklist

### Phase 1: Form Refactoring

- [ ] Hook created (`helpers/hooks/use-[entity]-form.ts`)
- [ ] Hook tested with both create and update scenarios
- [ ] Form component updated to use hook
- [ ] All state moved to hook
- [ ] All logic moved to hook
- [ ] Component only contains JSX

### Phase 2: Image Handling

- [ ] Old image helpers deleted
- [ ] Using shared `actions/delete-old-image.ts`
- [ ] Using shared `actions/upload-image.ts`
- [ ] Using shared `helpers/prepare-image-data.ts`
- [ ] Image upload works for create
- [ ] Image replacement works for update
- [ ] Image removal works for update

### Phase 3: Pages Implementation

- [ ] Create page implemented (`new/page.tsx`)
- [ ] Edit page implemented (`[id]/edit/page.tsx`)
- [ ] View page implemented (`[id]/page.tsx`)
- [ ] All pages fetch data correctly
- [ ] Redirects work for invalid IDs

### Phase 4: View Components

- [ ] View component created (`[id]/components/[entity]-view.tsx`)
- [ ] View component displays all fields
- [ ] Collapsible sections work
- [ ] SEO Health Gauge displays
- [ ] Social image displays if available
- [ ] Related data component created (e.g., `[entity]-articles.tsx`)
- [ ] Delete button component created (`delete-[entity]-button.tsx`)

### Phase 5: Code Quality

- [ ] TypeScript compiles without errors
- [ ] No duplicate code
- [ ] No dead code
- [ ] Follows same pattern as category-form
- [ ] All tests pass (form, view, navigation)
- [ ] Error handling in place

---

## 🎯 Expected Results

After refactoring each entity form:

| Metric             | Before | After |
| ------------------ | ------ | ----- |
| Component Lines    | ~300+  | ~144  |
| Logic in Component | ~150   | 0     |
| Duplicate Code     | High   | None  |
| Testability        | Low    | High  |
| Maintainability    | Low    | High  |

---

## 📚 Reference Implementation

### Form Implementation

**Working examples:**

- `admin/app/(dashboard)/categories/components/category-form.tsx` - Form component
- `admin/app/(dashboard)/categories/helpers/hooks/use-category-form.ts` - Form hook

### Page Implementation

**Working examples:**

- `admin/app/(dashboard)/categories/new/page.tsx` - Create page
- `admin/app/(dashboard)/categories/[id]/edit/page.tsx` - Edit page
- `admin/app/(dashboard)/categories/[id]/page.tsx` - View page

### View Component Implementation

**Working examples:**

- `admin/app/(dashboard)/categories/[id]/components/category-view.tsx` - View component
- `admin/app/(dashboard)/categories/[id]/components/category-articles.tsx` - Related data component
- `admin/app/(dashboard)/categories/[id]/components/delete-category-button.tsx` - Delete button

### Shared Helpers

**Used by all entities:**

- `admin/app/(dashboard)/actions/delete-old-image.ts` - Generic image deletion
- `admin/app/(dashboard)/actions/upload-image.ts` - Generic image upload
- `admin/app/(dashboard)/helpers/prepare-image-data.ts` - Image data preparation

---

## 🚨 Common Pitfalls

### Form Refactoring

1. **Wrong table name**: Make sure plural form matches Prisma schema
2. **Wrong field names**: Authors use `image` not `socialImage`
3. **Missing imports**: Import all shared helpers in hook
4. **Route mismatch**: Update `router.push()` path correctly
5. **Optional fields**: Handle `undefined` vs `null` correctly (use `?? undefined`)
6. **Type errors**: Ensure `FormData` interface matches server action signature

### Page Implementation

7. **Async params**: Next.js 15+ requires `await params` - don't forget
8. **Missing redirect**: Always redirect if entity not found in edit/view pages
9. **Parallel fetching**: Use `Promise.all()` for multiple data fetches
10. **Props mismatch**: Ensure page passes correct props to components

### View Components

11. **Client component**: View components need `"use client"` for interactivity
12. **Date formatting**: Always format dates - don't display raw Date objects
13. **Conditional rendering**: Check for null/undefined before displaying fields
14. **Image alt text**: Always provide fallback alt text for images
15. **Link paths**: Ensure all navigation links use correct routes

---

## 💡 Tips

- Start with one entity (e.g., Tags) to validate the pattern
- Copy category-form structure and adapt
- Test thoroughly after each step
- Use TypeScript errors as guidance
- Keep component simple - move complex logic to hook
- One function per file for helpers

---

## 📝 Summary

This refactoring:

1. ✅ Separates UI from logic (SOLID)
2. ✅ Eliminates code duplication (DRY)
3. ✅ Makes code testable and maintainable
4. ✅ Uses shared image helpers
5. ✅ Follows consistent pattern across entities

## 🎯 Coverage Summary

| Scenario   | Component           | Page                 | Status     |
| ---------- | ------------------- | -------------------- | ---------- |
| **CREATE** | `[entity]-form.tsx` | `new/page.tsx`       | ✅ Covered |
| **UPDATE** | `[entity]-form.tsx` | `[id]/edit/page.tsx` | ✅ Covered |
| **VIEW**   | `[entity]-view.tsx` | `[id]/page.tsx`      | ✅ Covered |

**This guide now covers:**

- ✅ Form refactoring (create & update)
- ✅ View component pattern
- ✅ All three page types
- ✅ Complete file structure
- ✅ Full workflow documentation

**Next Steps:**

1. Apply form refactoring to Tags
2. Apply form refactoring to Industries
3. Apply form refactoring to Authors (note field name differences)
4. Implement view components for Tags, Industries, Authors
5. Ensure all three pages exist for each entity
