"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea } from "@/components/admin/form-field";
import { createMedia, getClients } from "../actions/media-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MediaType } from "@prisma/client";

export function UploadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [clientId, setClientId] = useState<string>("");

  useEffect(() => {
    const loadClients = async () => {
      const clientsList = await getClients();
      setClients(clientsList);
      if (clientsList.length > 0) {
        setClientId(clientsList[0].id);
      }
    };
    loadClients();
  }, []);

  const [formData, setFormData] = useState({
    url: "",
    filename: "",
    mimeType: "",
    type: "GENERAL" as MediaType,
    altText: "",
    caption: "",
    credit: "",
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!clientId) {
      setError("Please select a client");
      setLoading(false);
      return;
    }

    const result = await createMedia({
      ...formData,
      clientId,
      type: formData.type,
    });

    if (result.success) {
      router.push("/media");
      router.refresh();
    } else {
      setError(result.error || "Failed to upload media");
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
            <CardTitle>Media Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select value={clientId} onValueChange={setClientId} required>
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormInput
              label="URL"
              name="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
            <FormInput
              label="Filename"
              name="filename"
              value={formData.filename}
              onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
              required
            />
            <FormInput
              label="MIME Type"
              name="mimeType"
              value={formData.mimeType}
              onChange={(e) => setFormData({ ...formData, mimeType: e.target.value })}
              placeholder="image/jpeg, image/png, etc."
              required
            />
            <div className="space-y-2">
              <Label htmlFor="type">Media Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as MediaType })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="LOGO">Logo</SelectItem>
                  <SelectItem value="POST">Post (Article Featured Image)</SelectItem>
                  <SelectItem value="OGIMAGE">OG Image (Open Graph)</SelectItem>
                  <SelectItem value="TWITTER_IMAGE">Twitter Image</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Categorize this media for better organization and filtering
              </p>
            </div>
            <FormInput
              label="Alt Text"
              name="altText"
              value={formData.altText}
              onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
            />
            <FormInput
              label="Caption"
              name="caption"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            />
            <FormInput
              label="Credit"
              name="credit"
              value={formData.credit}
              onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
            />
            <FormInput
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <FormTextarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Media"}
          </Button>
        </div>
      </div>
    </form>
  );
}
