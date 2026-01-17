"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput, FormTextarea, FormSelect } from "@/components/admin/form-field";
import { SelectItem } from "@/components/ui/select";
import { Info } from "lucide-react";
import { CharacterCounter } from "@/components/shared/character-counter";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";
import type { ClientWithRelations } from "@/lib/types";
import { getSEOSettings, type SEOSettings } from "@/app/(dashboard)/settings/actions/settings-actions";
import { useState, useEffect } from "react";

interface SEOSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
  initialData?: Partial<ClientWithRelations>;
}

export function SEOSection({
  form,
  initialData,
}: SEOSectionProps) {
  const { watch, setValue, formState: { errors } } = form;
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

  return (
      <div className="space-y-3">
        <div>
          <FormInput
            label="SEO Title"
            name="seoTitle"
            value={watch("seoTitle") || ""}
            onChange={(e) => setValue("seoTitle", e.target.value || null, { shouldValidate: true })}
            error={errors.seoTitle?.message}
            placeholder="e.g., Best Services in Saudi Arabia | Company Name"
            hint={`Meta title for search engines (${seoSettings?.seoTitleMin || 30}-${seoSettings?.seoTitleMax || 60} chars optimal)`}
          />
          {seoSettings && (
            <div className="mt-1">
              <CharacterCounter
                current={(watch("seoTitle") || "").length}
                min={seoSettings.seoTitleMin}
                max={seoSettings.seoTitleMax}
                restrict={seoSettings.seoTitleRestrict}
                className="ml-1"
              />
            </div>
          )}
        </div>
        <div>
          <FormTextarea
            label="SEO Description"
            name="seoDescription"
            value={watch("seoDescription") || ""}
            onChange={(e) => setValue("seoDescription", e.target.value || null, { shouldValidate: true })}
            rows={3}
            error={errors.seoDescription?.message}
            placeholder="e.g., Leading provider of professional services in Saudi Arabia. Trusted by thousands of clients..."
            hint={`Meta description shown in search results (${seoSettings?.seoDescriptionMin || 120}-${seoSettings?.seoDescriptionMax || 160} chars)`}
          />
          {seoSettings && (
            <div className="mt-1">
              <CharacterCounter
                current={(watch("seoDescription") || "").length}
                min={seoSettings.seoDescriptionMin}
                max={seoSettings.seoDescriptionMax}
                restrict={seoSettings.seoDescriptionRestrict}
                className="ml-1"
              />
            </div>
          )}
        </div>
        <div>
          <FormTextarea
            label="Organization Description"
            name="description"
            value={watch("description") || ""}
            onChange={(e) => setValue("description", e.target.value || null, { shouldValidate: true })}
            rows={3}
            error={errors.description?.message}
            placeholder="Describe your organization's mission, values, and key achievements..."
            hint="Schema.org Organization description (separate from SEO description)"
          />
          <div className="mt-1">
            <CharacterCounter
              current={(watch("description") || "").length}
              min={100}
              className="ml-1"
            />
          </div>
        </div>
        <FormInput
          label="Canonical URL"
          name="canonicalUrl"
          type="url"
          value={watch("canonicalUrl") || ""}
          onChange={(e) => setValue("canonicalUrl", e.target.value || null, { shouldValidate: true })}
          error={errors.canonicalUrl?.message}
          placeholder="https://example.com/page"
          hint="Canonical URL prevents duplicate content issues"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Meta Robots"
            name="metaRobots"
            value={watch("metaRobots") || undefined}
            onValueChange={(value) => setValue("metaRobots", value ? (value as "index, follow" | "noindex, follow" | "index, nofollow" | "noindex, nofollow") : null, { shouldValidate: true })}
            error={errors.metaRobots?.message}
            hint="Controls how search engines index this client's pages"
            placeholder="Select robots directive"
          >
            <SelectItem value="index, follow">index, follow (Default - Allow indexing)</SelectItem>
            <SelectItem value="noindex, follow">noindex, follow (Don't index, but follow links)</SelectItem>
            <SelectItem value="index, nofollow">index, nofollow (Index, but don't follow links)</SelectItem>
            <SelectItem value="noindex, nofollow">noindex, nofollow (Don't index or follow)</SelectItem>
          </FormSelect>
          <FormInput
            label="Google Tag Manager ID (Optional)"
            name="gtmId"
            value={watch("gtmId") || ""}
            onChange={(e) => setValue("gtmId", e.target.value || null, { shouldValidate: true })}
            error={errors.gtmId?.message}
            placeholder="GTM-XXXXXXX"
            hint="Only needed if client wants their own separate GTM container. Leave empty for automatic tracking via main container."
          />
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Automatic Tracking Enabled
              </p>
              <p className="text-blue-800 dark:text-blue-200">
                This client's articles are automatically tracked via the main GTM container (configured in Settings).
                All analytics include this client's unique identifier (
                <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs font-mono">
                  {initialData?.id || "client_id"}
                </code>
                ) for proper segmentation.
              </p>
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                This field is optional and only needed if the client wants their own separate GTM container.
                Most clients don't need this.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
