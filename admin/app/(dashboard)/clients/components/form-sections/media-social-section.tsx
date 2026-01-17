"use client";

import { UseFormReturn } from "react-hook-form";
import { SocialProfilesInput } from "../social-profiles-input";
import { MediaSection } from "./media-section";
import { TwitterSection } from "./twitter-section";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";
import type { ClientWithRelations } from "@/lib/types";

interface MediaSocialSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
  clientId?: string;
  initialData?: Partial<ClientWithRelations>;
}

export function MediaSocialSection({
  form,
  clientId,
  initialData,
}: MediaSocialSectionProps) {
  const { watch, setValue } = form;

  return (
    <div className="space-y-6">
      <MediaSection
        form={form}
        clientId={clientId}
        initialData={initialData}
      />
      <div className="space-y-2">
        <SocialProfilesInput
          label="Social Profiles"
          value={watch("sameAs") || []}
          onChange={(urls) => setValue("sameAs", urls, { shouldValidate: true })}
          hint="Add social media URLs one at a time. Used in Schema.org for SEO and brand verification."
        />
      </div>
      <TwitterSection
        form={form}
        clientId={clientId}
        initialData={initialData}
      />
    </div>
  );
}
