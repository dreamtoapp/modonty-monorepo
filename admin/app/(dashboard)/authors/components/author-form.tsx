"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea, FormNativeSelect } from "@/components/admin/form-field";
import { slugify } from "@/lib/utils";

interface AuthorFormProps {
  initialData?: any;
  clients: Array<{ id: string; name: string }>;
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function AuthorForm({ initialData, clients, onSubmit }: AuthorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    jobTitle: initialData?.jobTitle || "",
    worksFor: initialData?.worksFor || "",
    bio: initialData?.bio || "",
    image: initialData?.image || "",
    url: initialData?.url || "",
    linkedIn: initialData?.linkedIn || "",
    twitter: initialData?.twitter || "",
    facebook: initialData?.facebook || "",
    credentials: initialData?.credentials?.join("\n") || "",
    qualifications: initialData?.qualifications?.join("\n") || "",
    expertiseAreas: initialData?.expertiseAreas?.join(", ") || "",
    experienceYears: initialData?.experienceYears?.toString() || "",
    verificationStatus: initialData?.verificationStatus || false,
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

    const result = await onSubmit({
      ...formData,
      worksFor: formData.worksFor || undefined,
      experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : undefined,
      credentials: formData.credentials
        ? formData.credentials.split("\n").map((c: string) => c.trim()).filter(Boolean)
        : [],
      qualifications: formData.qualifications
        ? formData.qualifications.split("\n").map((q: string) => q.trim()).filter(Boolean)
        : [],
      expertiseAreas: formData.expertiseAreas
        ? formData.expertiseAreas.split(",").map((e: string) => e.trim()).filter(Boolean)
        : [],
      sameAs: [
        formData.linkedIn,
        formData.twitter,
        formData.facebook,
      ].filter(Boolean) as string[],
    });

    if (result.success) {
      router.push("/authors");
      router.refresh();
    } else {
      setError(result.error || "Failed to save author");
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
              hint={formData.slug ? `Slug: ${formData.slug}` : "Slug will be generated from name"}
              required
            />
            <input type="hidden" name="slug" value={formData.slug} />
            <FormInput
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            />
            <FormNativeSelect
              label="Works For (Client)"
              name="worksFor"
              value={formData.worksFor}
              onChange={(e) => setFormData({ ...formData, worksFor: e.target.value })}
              placeholder="None"
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </FormNativeSelect>
            <FormTextarea
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
            <FormInput
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
            <CardTitle>Social Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="LinkedIn"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
            />
            <FormInput
              label="Twitter"
              name="twitter"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            />
            <FormInput
              label="Facebook"
              name="facebook"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>E-E-A-T Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormTextarea
              label="Credentials (one per line)"
              name="credentials"
              value={formData.credentials}
              onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
              rows={3}
            />
            <FormTextarea
              label="Qualifications (one per line)"
              name="qualifications"
              value={formData.qualifications}
              onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              rows={3}
            />
            <FormInput
              label="Expertise Areas (comma-separated)"
              name="expertiseAreas"
              value={formData.expertiseAreas}
              onChange={(e) => setFormData({ ...formData, expertiseAreas: e.target.value })}
            />
            <FormInput
              label="Experience Years"
              name="experienceYears"
              type="number"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="verificationStatus"
                checked={formData.verificationStatus}
                onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="verificationStatus" className="text-sm font-medium">
                Verification Status
              </label>
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
            />
            <FormTextarea
              label="SEO Description"
              name="seoDescription"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              rows={3}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Author" : "Create Author"}
          </Button>
        </div>
      </div>
    </form>
  );
}
