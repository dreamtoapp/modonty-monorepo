"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { FormTextarea } from "@/components/admin/form-field";
import { CharacterCounter } from "@/components/shared/character-counter";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";

interface BusinessBriefSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
}

export function BusinessBriefSection({ form }: BusinessBriefSectionProps) {
  const { setValue, formState: { errors } } = form;
  const businessBrief = useWatch({ control: form.control, name: "businessBrief" }) || "";

  return (
    <div className="space-y-4">
      <div>
        <FormTextarea
          label="Business Brief"
          name="businessBrief"
          value={businessBrief}
          onChange={(e) => setValue("businessBrief", e.target.value || "", { shouldValidate: false })}
          onBlur={(e) => form.trigger("businessBrief")}
          rows={6}
          required
          error={errors.businessBrief?.message}
          placeholder="Describe the client's business, products/services, target audience, and unique selling points. (Minimum 100 characters)"
          hint="Essential for content writers to create relevant, customized articles."
        />
        <div className="mt-1">
          <CharacterCounter current={businessBrief.length} min={100} className="ml-1" />
        </div>
      </div>
    </div>
  );
}
