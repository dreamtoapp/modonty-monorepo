"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, MapPin, User, Calendar, CheckCircle2, ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { updateMedia, renameCloudinaryAsset } from "../../actions/media-actions";
import { useToast } from "@/hooks/use-toast";
import NextImage from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { generateSEOFileName, generateCloudinaryPublicId } from "@/lib/utils/image-seo";
import { getClients } from "../../actions/media-actions";

interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  altText: string | null;
  title: string | null;
  description: string | null;
  caption: string | null;
  credit: string | null;
  keywords: string[];
  license: string | null;
  creator: string | null;
  dateCreated: Date | null;
  geoLatitude: number | null;
  geoLongitude: number | null;
  geoLocationName: string | null;
  contentLocation: string | null;
  exifData: Record<string, unknown> | null;
  cloudinaryPublicId: string | null;
  client?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface EditMediaFormProps {
  media: Media;
}

export function EditMediaForm({ media }: EditMediaFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    altText: media.altText || "",
    title: media.title || "",
    description: media.description || "",
    caption: media.caption || "",
    credit: media.credit || "",
    keywords: media.keywords?.join(", ") || "",
    license: media.license || "",
    creator: media.creator || "",
    dateCreated: media.dateCreated
      ? new Date(media.dateCreated).toISOString().split("T")[0]
      : "",
    geoLatitude: media.geoLatitude?.toString() || "",
    geoLongitude: media.geoLongitude?.toString() || "",
    geoLocationName: media.geoLocationName || "",
    contentLocation: media.contentLocation || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Convert comma-separated keywords string to array
      const keywordsArray = formData.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      // Convert dateCreated string to Date object
      const dateCreated = formData.dateCreated
        ? new Date(formData.dateCreated)
        : undefined;

      // Validate and convert GPS coordinates
      let geoLatitude: number | undefined;
      let geoLongitude: number | undefined;

      if (formData.geoLatitude.trim()) {
        const lat = parseFloat(formData.geoLatitude.trim());
        if (isNaN(lat) || lat < -90 || lat > 90) {
          toast({
            title: "Invalid Latitude",
            description: "Latitude must be a number between -90 and 90.",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }
        geoLatitude = lat;
      }

      if (formData.geoLongitude.trim()) {
        const lng = parseFloat(formData.geoLongitude.trim());
        if (isNaN(lng) || lng < -180 || lng > 180) {
          toast({
            title: "Invalid Longitude",
            description: "Longitude must be a number between -180 and 180.",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }
        geoLongitude = lng;
      }

      // Check if alt text or title changed - if so, rename Cloudinary asset
      const originalAltText = media.altText || "";
      const originalTitle = media.title || "";
      const altTextChanged = formData.altText.trim() !== originalAltText;
      const titleChanged = formData.title.trim() !== originalTitle;
      
      let newCloudinaryPublicId = media.cloudinaryPublicId || undefined;
      let newCloudinaryUrl = media.url;

      // If alt text or title changed, and we have a Cloudinary public_id, rename the asset
      if ((altTextChanged || titleChanged) && media.cloudinaryPublicId) {
        // Get client slug for folder organization
        const clientSlug = media.client?.name
          ? media.client.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
          : "default";

        // Extract unique suffix from old public_id if it exists
        // Format: media/client-name/filename-uniquesuffix
        const oldPublicIdParts = media.cloudinaryPublicId.split('/');
        const oldFileName = oldPublicIdParts[oldPublicIdParts.length - 1];
        const oldSuffixMatch = oldFileName.match(/-([a-z0-9]{8,})$/);
        const existingSuffix = oldSuffixMatch ? oldSuffixMatch[1] : null;

        // Generate new SEO-friendly public_id from updated alt text/title
        // Use ensureUnique: false to generate without suffix, then add existing suffix if available
        let seoFileName = generateSEOFileName(
          formData.altText.trim() || "",
          formData.title.trim() || "",
          media.filename,
          clientSlug,
          false // Don't add new unique suffix
        );

        // If we have an existing suffix, reuse it to maintain the same unique identifier
        if (existingSuffix) {
          seoFileName = `${seoFileName}-${existingSuffix}`;
        } else {
          // If no existing suffix, generate a new one
          seoFileName = generateSEOFileName(
            formData.altText.trim() || "",
            formData.title.trim() || "",
            media.filename,
            clientSlug,
            true // Add new unique suffix
          );
        }

        const newPublicId = generateCloudinaryPublicId(seoFileName, "media");

        // Only rename if the new public_id is different
        if (newPublicId !== media.cloudinaryPublicId) {
          const resourceType = media.mimeType.startsWith("image/") ? "image" : "video";
          const renameResult = await renameCloudinaryAsset(
            media.cloudinaryPublicId,
            newPublicId,
            resourceType
          );

          if (renameResult.success && renameResult.newPublicId) {
            newCloudinaryPublicId = renameResult.newPublicId;
            newCloudinaryUrl = renameResult.newUrl || media.url;
            
            toast({
              title: "Cloudinary asset renamed",
              description: `File renamed to: ${renameResult.newPublicId}`,
            });
          } else {
            // If rename fails, continue with database update but show warning
            toast({
              title: "Warning",
              description: renameResult.error || "Could not rename file in Cloudinary, but database was updated.",
              variant: "destructive",
            });
          }
        }
      }

      const result = await updateMedia(media.id, {
        altText: formData.altText.trim(),
        title: formData.title.trim() || undefined,
        description: formData.description.trim() || undefined,
        caption: formData.caption.trim() || undefined,
        credit: formData.credit.trim() || undefined,
        keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
        license: formData.license.trim() || undefined,
        creator: formData.creator.trim() || undefined,
        dateCreated: dateCreated,
        geoLatitude: geoLatitude,
        geoLongitude: geoLongitude,
        geoLocationName: formData.geoLocationName.trim() || undefined,
        contentLocation: formData.contentLocation.trim() || undefined,
        exifData: media.exifData || undefined,
        cloudinaryPublicId: newCloudinaryPublicId,
        // Update URL if it changed
        ...(newCloudinaryUrl !== media.url ? { url: newCloudinaryUrl } : {}),
      });

      if (result.success) {
        toast({
          title: "Media updated",
          description: "Media metadata has been updated successfully.",
        });
        router.push("/media");
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to update media");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update media",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isImage = media.mimeType.startsWith("image/");
  const hasAttributionData = formData.license || formData.creator || formData.dateCreated;
  const hasLocationData = formData.geoLatitude || formData.geoLongitude || formData.geoLocationName || formData.contentLocation;

  return (
    <div className="container mx-auto max-w-[1128px] space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/media")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Media Library
        </Button>
      </div>

      <PageHeader
        title="Edit Media"
        description="Update SEO metadata and advanced fields for this media file"
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Preview and Essential Fields - Two Column Layout on Desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preview - Left Column */}
                {isImage && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="border rounded-lg p-4 bg-muted/50 sticky top-4">
                      <NextImage
                        src={media.url}
                        alt={formData.altText || media.filename}
                        width={media.mimeType.includes("svg") ? 400 : 400}
                        height={media.mimeType.includes("svg") ? 400 : 400}
                        className="max-w-full h-auto max-h-96 mx-auto rounded"
                        unoptimized
                      />
                    </div>
                  </div>
                )}

                {/* Essential Fields - Right Column */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Essential Information</h4>
                  </div>
                  
                  {/* Alt Text - Required */}
                  <div className="space-y-2">
                    <Label htmlFor="altText">
                      Alt Text <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="altText"
                      placeholder="Describe the image for SEO and accessibility..."
                      value={formData.altText}
                      onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                      rows={3}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Required. Describe what the image shows for search engines and screen readers.
                    </p>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Image title (optional)"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description (optional)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Accordion Sections for Additional Fields */}
              <Accordion 
                type="multiple" 
                defaultValue={
                  hasAttributionData && hasLocationData 
                    ? ["basic", "attribution", "location"]
                    : hasAttributionData 
                    ? ["basic", "attribution"]
                    : hasLocationData 
                    ? ["basic", "location"]
                    : ["basic"]
                } 
                className="w-full"
              >
                {/* Basic Information Accordion */}
                <AccordionItem value="basic">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Basic Information</span>
                      {(formData.caption || formData.credit || formData.keywords) && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {/* Caption */}
                      <div className="space-y-2">
                        <Label htmlFor="caption">Caption</Label>
                        <Textarea
                          id="caption"
                          placeholder="Image caption (optional)"
                          value={formData.caption}
                          onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                          rows={2}
                        />
                      </div>

                      {/* Credit */}
                      <div className="space-y-2">
                        <Label htmlFor="credit">Credit</Label>
                        <Input
                          id="credit"
                          placeholder="Photo credit or attribution (optional)"
                          value={formData.credit}
                          onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
                        />
                      </div>

                      {/* Keywords */}
                      <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input
                          id="keywords"
                          placeholder="Enter keywords separated by commas (e.g., nature, landscape, photography)"
                          value={formData.keywords}
                          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Separate multiple keywords with commas
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Attribution & License Accordion */}
                <AccordionItem value="attribution">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Attribution & License</span>
                      {hasAttributionData && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {/* License */}
                      <div className="space-y-2">
                        <Label htmlFor="license">License</Label>
                        <Select
                          value={formData.license}
                          onValueChange={(value) => setFormData({ ...formData, license: value })}
                        >
                          <SelectTrigger id="license">
                            <SelectValue placeholder="Select a license (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CC0">CC0 - Public Domain Dedication</SelectItem>
                            <SelectItem value="CC-BY">CC-BY - Attribution</SelectItem>
                            <SelectItem value="CC-BY-SA">CC-BY-SA - Attribution-ShareAlike</SelectItem>
                            <SelectItem value="CC-BY-NC">CC-BY-NC - Attribution-NonCommercial</SelectItem>
                            <SelectItem value="Commercial">Commercial License</SelectItem>
                            <SelectItem value="All Rights Reserved">All Rights Reserved</SelectItem>
                            <SelectItem value="Public Domain">Public Domain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Creator */}
                      <div className="space-y-2">
                        <Label htmlFor="creator">Creator/Author</Label>
                        <Input
                          id="creator"
                          placeholder="Name of the image creator or author (optional)"
                          value={formData.creator}
                          onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                        />
                      </div>

                      {/* Date Created */}
                      <div className="space-y-2">
                        <Label htmlFor="dateCreated">Date Created</Label>
                        <Input
                          id="dateCreated"
                          type="date"
                          value={formData.dateCreated}
                          onChange={(e) => setFormData({ ...formData, dateCreated: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Date when the image was created.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Location Information Accordion */}
                <AccordionItem value="location">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Location Information</span>
                      {hasLocationData && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {/* Geographic Location */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Geographic Location</Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            GPS coordinates and location name.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="geoLatitude">Latitude</Label>
                            <Input
                              id="geoLatitude"
                              type="number"
                              step="any"
                              min="-90"
                              max="90"
                              placeholder="e.g., 40.7128"
                              value={formData.geoLatitude}
                              onChange={(e) => setFormData({ ...formData, geoLatitude: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="geoLongitude">Longitude</Label>
                            <Input
                              id="geoLongitude"
                              type="number"
                              step="any"
                              min="-180"
                              max="180"
                              placeholder="e.g., -74.0060"
                              value={formData.geoLongitude}
                              onChange={(e) => setFormData({ ...formData, geoLongitude: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="geoLocationName">Location Name</Label>
                          <Input
                            id="geoLocationName"
                            placeholder="e.g., New York City, Central Park"
                            value={formData.geoLocationName}
                            onChange={(e) => setFormData({ ...formData, geoLocationName: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Human-readable location name
                          </p>
                        </div>
                      </div>

                      {/* Content Location */}
                      <div className="space-y-2 border-t pt-4">
                        <Label htmlFor="contentLocation">Content Location</Label>
                        <Input
                          id="contentLocation"
                          placeholder="Where the image was taken or what it shows (optional)"
                          value={formData.contentLocation}
                          onChange={(e) => setFormData({ ...formData, contentLocation: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Describe where the image was taken or what location it depicts
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Save Button */}
              <div className="pt-4 border-t flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={isSaving || !formData.altText.trim()}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/media")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
