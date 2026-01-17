"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput, FormTextarea, FormSelect } from "@/components/admin/form-field";
import { SelectItem } from "@/components/ui/select";
import { MediaPicker } from "@/components/shared/media-picker";
import { CharacterCounter } from "@/components/shared/character-counter";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";
import type { ClientWithRelations } from "@/lib/types";
import { updateMedia } from "../../../media/actions/media-actions";
import { useToast } from "@/hooks/use-toast";
import { getSEOSettings, type SEOSettings } from "@/app/(dashboard)/settings/actions/settings-actions";
import { useState, useEffect } from "react";

interface TwitterSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
  clientId?: string;
  initialData?: Partial<ClientWithRelations>;
}

export function TwitterSection({
  form,
  clientId,
  initialData,
}: TwitterSectionProps) {
  const { watch, setValue, formState: { errors } } = form;
  const { toast } = useToast();
  const [seoSettings, setSeoSettings] = useState<SEOSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSEOSettings();
        setSeoSettings(settings);
      } catch (error) {
        console.error("Failed to load SEO settings:", error);
      }
    }
    loadSettings();
  }, []);

  const handleTwitterImageAltTextUpdate = async (newAltText: string) => {
    const twitterImageMediaId = watch("twitterImageMediaId");
    if (!twitterImageMediaId) return;
    const result = await updateMedia(twitterImageMediaId, { altText: newAltText });
    if (result.success) {
      toast({
        title: "Alt text updated",
        description: "Twitter image alt text has been updated in the media library.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update alt text",
        variant: "destructive",
      });
    }
  };

  return (
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Twitter Cards (for Social SEO)</p>
          <FormSelect
            label="Twitter Card Type"
            name="twitterCard"
            value={watch("twitterCard") || "auto"}
            onValueChange={(value) => setValue("twitterCard", value === "auto" ? null : (value as "summary" | "summary_large_image"), { shouldValidate: true })}
            error={errors.twitterCard?.message}
            hint="Card type for Twitter/X sharing"
          >
            <SelectItem value="auto">Auto-generate from OG tags</SelectItem>
            <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
            <SelectItem value="summary">Summary</SelectItem>
          </FormSelect>
          <FormInput
            label="Twitter Title"
            name="twitterTitle"
            value={watch("twitterTitle") || ""}
            onChange={(e) => setValue("twitterTitle", e.target.value || null, { shouldValidate: true })}
            error={errors.twitterTitle?.message}
            hint={`Twitter-specific title (max ${seoSettings?.twitterTitleMax || 70} chars)`}
          />
          {seoSettings && (
            <div className="mt-1">
              <CharacterCounter
                current={(watch("twitterTitle") || "").length}
                max={seoSettings.twitterTitleMax}
                restrict={seoSettings.twitterTitleRestrict}
                className="ml-1"
              />
            </div>
          )}
          <FormTextarea
            label="Twitter Description"
            name="twitterDescription"
            value={watch("twitterDescription") || ""}
            onChange={(e) => setValue("twitterDescription", e.target.value || null, { shouldValidate: true })}
            rows={2}
            error={errors.twitterDescription?.message}
            hint={`Twitter-specific description (max ${seoSettings?.twitterDescriptionMax || 200} chars)`}
          />
          {seoSettings && (
            <div className="mt-1">
              <CharacterCounter
                current={(watch("twitterDescription") || "").length}
                max={seoSettings.twitterDescriptionMax}
                restrict={seoSettings.twitterDescriptionRestrict}
                className="ml-1"
              />
            </div>
          )}
          <MediaPicker
            clientId={clientId || initialData?.id || null}
            value={(initialData as any)?.twitterImageMedia?.url || ""}
            altText={(initialData as any)?.twitterImageMedia?.altText || ""}
            mediaId={watch("twitterImageMediaId") || undefined}
            showUrlField={false}
            showAltOverlay
            onSelect={(media) => {
              setValue("twitterImageMediaId", media.mediaId || null, { shouldValidate: true });
            }}
            onClear={() => {
              setValue("twitterImageMediaId", null, { shouldValidate: true });
            }}
            onAltTextUpdate={handleTwitterImageAltTextUpdate}
            label="Twitter Image"
            hint="Twitter-specific image (auto-generated from OG image if not provided). Click the edit icon on the image to update alt text."
          />
          <FormInput
            label="Twitter Site"
            name="twitterSite"
            value={watch("twitterSite") || ""}
            onChange={(e) => setValue("twitterSite", e.target.value || null, { shouldValidate: true })}
            error={errors.twitterSite?.message}
            placeholder="@username"
            hint="Twitter/X username (e.g., @company) for attribution"
          />
          <p className="text-xs text-muted-foreground">
            Twitter Cards improve social SEO signals and engagement. Fields auto-generate from existing SEO data if not provided.
          </p>
        </div>
      </div>
  );
}
