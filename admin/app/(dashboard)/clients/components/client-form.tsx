"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea } from "@/components/admin/form-field";

interface ClientFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function ClientForm({ initialData, onSubmit }: ClientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    legalName: initialData?.legalName || "",
    url: initialData?.url || "",
    logo: initialData?.logo || "",
    favicon: initialData?.favicon || "",
    ogImage: initialData?.ogImage || "",
    primaryColor: initialData?.primaryColor || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    seoKeywords: initialData?.seoKeywords?.join(", ") || "",
    sameAs: initialData?.sameAs?.join("\n") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await onSubmit({
      ...formData,
      seoKeywords: formData.seoKeywords
        ? formData.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
        : [],
      sameAs: formData.sameAs
        ? formData.sameAs.split("\n").map((s: string) => s.trim()).filter(Boolean)
        : [],
    });

    if (result.success) {
      router.push("/clients");
      router.refresh();
    } else {
      setError(result.error || "Failed to save client");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
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
              required
            />
            <FormInput
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <FormInput
              label="Legal Name"
              name="legalName"
              value={formData.legalName}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
            />
            <FormInput
              label="URL"
              name="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="Logo URL"
              name="logo"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            />
            <FormInput
              label="Favicon URL"
              name="favicon"
              value={formData.favicon}
              onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
            />
            <FormInput
              label="OG Image URL"
              name="ogImage"
              value={formData.ogImage}
              onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
            />
            <FormInput
              label="Primary Color"
              name="primaryColor"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              placeholder="#0a66c2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FormInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <FormTextarea
              label="Social Profiles (one per line)"
              name="sameAs"
              value={formData.sameAs}
              onChange={(e) => setFormData({ ...formData, sameAs: e.target.value })}
              rows={4}
              placeholder="https://linkedin.com/company/example&#10;https://twitter.com/example"
            />
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
            />
            <FormTextarea
              label="SEO Description"
              name="seoDescription"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              rows={3}
            />
            <FormInput
              label="SEO Keywords (comma-separated)"
              name="seoKeywords"
              value={formData.seoKeywords}
              onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
              placeholder="keyword1, keyword2, keyword3"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Client" : "Create Client"}
          </Button>
        </div>
      </div>
    </form>
  );
}
