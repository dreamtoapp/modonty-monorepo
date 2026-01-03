"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea } from "@/components/admin/form-field";
import { slugify } from "@/lib/utils";
import { SEODoctor } from "@/components/shared/seo-doctor";
import { tagSEOConfig } from "@/components/shared/seo-doctor/seo-configs";
import { CharacterCounter } from "@/components/shared/character-counter";
import { TagFormData, FormSubmitResult } from "@/lib/types";
import { Tag } from "@prisma/client";

interface TagFormProps {
  initialData?: Partial<Tag>;
  onSubmit: (data: TagFormData) => Promise<FormSubmitResult>;
}

export function TagForm({ initialData, onSubmit }: TagFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    ogImage: initialData?.ogImage || "",
    ogImageAlt: initialData?.ogImageAlt || "",
    ogImageWidth: initialData?.ogImageWidth?.toString() || "",
    ogImageHeight: initialData?.ogImageHeight?.toString() || "",
    twitterCard: initialData?.twitterCard || "",
    twitterTitle: initialData?.twitterTitle || "",
    twitterDescription: initialData?.twitterDescription || "",
    twitterImage: initialData?.twitterImage || "",
    twitterImageAlt: initialData?.twitterImageAlt || "",
    canonicalUrl: initialData?.canonicalUrl || "",
  });

  useEffect(() => {
    const newSlug = slugify(formData.name);
    setFormData((prev) => ({ ...prev, slug: newSlug }));
  }, [formData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submitData = {
      ...formData,
      ogImageWidth: formData.ogImageWidth ? parseInt(formData.ogImageWidth) : undefined,
      ogImageHeight: formData.ogImageHeight ? parseInt(formData.ogImageHeight) : undefined,
    };

    const result = await onSubmit(submitData);

    if (result.success) {
      router.push("/tags");
      router.refresh();
    } else {
      setError(result.error || "Failed to save tag");
      setLoading(false);
    }
  };

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
            <CardTitle>Tag Information</CardTitle>
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
                hint="Tag description used for context and SEO (minimum 50 characters recommended)"
              />
              <div className="mt-1">
                <CharacterCounter
                  current={formData.description.length}
                  min={50}
                  className="ml-1"
                />
              </div>
            </div>
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
            <FormInput
              label="Canonical URL"
              name="canonicalUrl"
              value={formData.canonicalUrl}
              onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
              placeholder="https://example.com/tags/tag-slug"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Graph</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="OG Image URL"
              name="ogImage"
              value={formData.ogImage}
              onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <FormInput
              label="OG Image Alt Text"
              name="ogImageAlt"
              value={formData.ogImageAlt}
              onChange={(e) => setFormData({ ...formData, ogImageAlt: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="OG Image Width"
                name="ogImageWidth"
                type="number"
                value={formData.ogImageWidth}
                onChange={(e) => setFormData({ ...formData, ogImageWidth: e.target.value })}
                placeholder="1200"
              />
              <FormInput
                label="OG Image Height"
                name="ogImageHeight"
                type="number"
                value={formData.ogImageHeight}
                onChange={(e) => setFormData({ ...formData, ogImageHeight: e.target.value })}
                placeholder="630"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Twitter Cards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="Twitter Card Type"
              name="twitterCard"
              value={formData.twitterCard}
              onChange={(e) => setFormData({ ...formData, twitterCard: e.target.value })}
              placeholder="summary_large_image or summary"
            />
            <FormInput
              label="Twitter Title"
              name="twitterTitle"
              value={formData.twitterTitle}
              onChange={(e) => setFormData({ ...formData, twitterTitle: e.target.value })}
            />
            <FormTextarea
              label="Twitter Description"
              name="twitterDescription"
              value={formData.twitterDescription}
              onChange={(e) => setFormData({ ...formData, twitterDescription: e.target.value })}
              rows={2}
            />
            <FormInput
              label="Twitter Image URL"
              name="twitterImage"
              value={formData.twitterImage}
              onChange={(e) => setFormData({ ...formData, twitterImage: e.target.value })}
            />
            <FormInput
              label="Twitter Image Alt Text"
              name="twitterImageAlt"
              value={formData.twitterImageAlt}
              onChange={(e) => setFormData({ ...formData, twitterImageAlt: e.target.value })}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Tag" : "Create Tag"}
          </Button>
        </div>
        </div>

        {/* Right Column - SEO Doctor (Always Visible) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <SEODoctor data={formData} config={tagSEOConfig} />
          </div>
        </div>
      </div>
    </form>
  );
}
