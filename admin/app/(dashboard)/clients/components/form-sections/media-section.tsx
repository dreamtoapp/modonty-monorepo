"use client";

import { UseFormReturn } from "react-hook-form";
import { MediaPicker } from "@/components/shared/media-picker";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";
import type { ClientWithRelations } from "@/lib/types";
import { updateMedia } from "../../../media/actions/media-actions";
import { useToast } from "@/hooks/use-toast";

interface MediaSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
  clientId?: string;
  initialData?: Partial<ClientWithRelations>;
}

export function MediaSection({
  form,
  clientId,
  initialData,
}: MediaSectionProps) {
  const { watch, setValue } = form;
  const { toast } = useToast();

  const handleLogoAltTextUpdate = async (newAltText: string) => {
    const logoMediaId = watch("logoMediaId");
    if (!logoMediaId) return;
    const result = await updateMedia(logoMediaId, { altText: newAltText });
    if (result.success) {
      toast({
        title: "Alt text updated",
        description: "Logo alt text has been updated in the media library.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update alt text",
        variant: "destructive",
      });
    }
  };

  const handleOGImageAltTextUpdate = async (newAltText: string) => {
    const ogImageMediaId = watch("ogImageMediaId");
    if (!ogImageMediaId) return;
    const result = await updateMedia(ogImageMediaId, { altText: newAltText });
    if (result.success) {
      toast({
        title: "Alt text updated",
        description: "OG image alt text has been updated in the media library.",
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
          <MediaPicker
            clientId={clientId || initialData?.id || null}
            value={(initialData as any)?.logoMedia?.url || ""}
            altText={(initialData as any)?.logoMedia?.altText || ""}
            mediaId={watch("logoMediaId") || undefined}
            showUrlField={false}
            showAltOverlay
            onSelect={(media) => {
              setValue("logoMediaId", media.mediaId || null, { shouldValidate: true });
            }}
            onClear={() => {
              setValue("logoMediaId", null, { shouldValidate: true });
            }}
            onAltTextUpdate={handleLogoAltTextUpdate}
            label="Logo"
            hint="Logo image displayed in client profile and articles. Click the edit icon on the image to update alt text."
          />
        </div>
        <div className="space-y-2">
          <MediaPicker
            clientId={clientId || initialData?.id || null}
            value={(initialData as any)?.ogImageMedia?.url || ""}
            altText={(initialData as any)?.ogImageMedia?.altText || ""}
            mediaId={watch("ogImageMediaId") || undefined}
            showUrlField={false}
            showAltOverlay
            onSelect={(media) => {
              setValue("ogImageMediaId", media.mediaId || null, { shouldValidate: true });
            }}
            onClear={() => {
              setValue("ogImageMediaId", null, { shouldValidate: true });
            }}
            onAltTextUpdate={handleOGImageAltTextUpdate}
            label="OG Image"
            hint="Default Open Graph image for social media shares (1200x630px recommended). Click the edit icon on the image to update alt text."
          />
        </div>
      </div>
  );
}
