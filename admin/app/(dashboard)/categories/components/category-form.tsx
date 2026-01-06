"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea, FormNativeSelect } from "@/components/admin/form-field";
import { slugify } from "@/lib/utils";
import { SEODoctor } from "@/components/shared/seo-doctor";
import { categorySEOConfig } from "../helpers/category-seo-config";
import { CharacterCounter } from "@/components/shared/character-counter";
import { createCategory, updateCategory } from "../actions/categories-actions";
import { CategoryFormData, CategoryWithRelations, FormSubmitResult } from "@/lib/types";

interface CategoryFormProps {
  initialData?: Partial<CategoryWithRelations>;
  categories: Array<{ id: string; name: string }>;
  categoryId?: string;
}

export function CategoryForm({ initialData, categories, categoryId }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    parentId: initialData?.parentId || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
  });

  useEffect(() => {
    const newSlug = slugify(formData.name);
    setFormData((prev) => ({ ...prev, slug: newSlug }));
  }, [formData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = categoryId
      ? await updateCategory(categoryId, {
          ...formData,
          parentId: formData.parentId || undefined,
        })
      : await createCategory({
          ...formData,
          parentId: formData.parentId || undefined,
        });

    if (result.success) {
      router.push("/categories");
      router.refresh();
    } else {
      setError(result.error || "Failed to save category");
      setLoading(false);
    }
  };

  const availableParents = categories.filter((c) => c.id !== initialData?.id);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              hint={formData.slug ? `Slug: ${formData.slug}` : "Slug will be generated from name"}
              required
            />
            <input type="hidden" name="slug" value={formData.slug} />
            <div>
              <FormTextarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                hint="Category description used for context and SEO (minimum 50 characters recommended)"
              />
              <div className="mt-1">
                <CharacterCounter
                  current={formData.description.length}
                  min={50}
                  className="ml-1"
                />
              </div>
            </div>
            <FormNativeSelect
              label="Parent Category"
              name="parentId"
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              placeholder="None"
            >
              {availableParents.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </FormNativeSelect>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="SEO Title"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              hint="Meta title for search engines (50-60 chars optimal) - improves search visibility"
            />
            <div>
              <FormTextarea
                label="SEO Description"
                name="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                rows={3}
                hint="Meta description shown in search results (150-160 chars) - influences click-through rate"
              />
              <div className="mt-1">
                <CharacterCounter
                  current={formData.seoDescription.length}
                  max={160}
                  className="ml-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Category" : "Create Category"}
          </Button>
        </div>
        </div>

        {/* Right Column - SEO Doctor (Always Visible) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <SEODoctor data={formData} config={categorySEOConfig} />
          </div>
        </div>
      </div>
    </form>
  );
}
