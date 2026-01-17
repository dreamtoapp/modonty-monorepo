"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput } from "@/components/admin/form-field";
import { SocialProfilesInput } from "../social-profiles-input";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";

interface ContactSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
}

export function ContactSection({ form }: ContactSectionProps) {
  const { watch, setValue, formState: { errors } } = form;

  return (
    <div className="space-y-3">
      <FormInput
        label="Website URL"
        name="url"
        type="url"
        value={watch("url") || ""}
        onChange={(e) => setValue("url", e.target.value || null, { shouldValidate: true })}
        error={errors.url?.message}
        placeholder="https://www.example.com"
        hint="Client's main website URL - used for backlinks and Schema.org"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={watch("email") || ""}
          onChange={(e) => setValue("email", e.target.value || null, { shouldValidate: true })}
          error={errors.email?.message}
          placeholder="contact@example.com"
          hint="Contact email for notifications and communication"
        />
        <FormInput
          label="Phone"
          name="phone"
          value={watch("phone") || ""}
          onChange={(e) => setValue("phone", e.target.value || null, { shouldValidate: true })}
          error={errors.phone?.message}
          placeholder="+966 11 123 4567"
          hint="Contact phone number for business inquiries"
        />
      </div>
      <FormInput
        label="Contact Type"
        name="contactType"
        value={watch("contactType") || ""}
        onChange={(e) => setValue("contactType", e.target.value || null, { shouldValidate: true })}
        error={errors.contactType?.message}
        placeholder="e.g., customer service, technical support, sales"
        hint="Contact type for Schema.org ContactPoint structure"
      />
      <SocialProfilesInput
        label="Social Profiles"
        value={watch("sameAs") || []}
        onChange={(urls) => setValue("sameAs", urls, { shouldValidate: true })}
        hint="Add social media URLs one at a time. Used in Schema.org for SEO and brand verification."
      />
    </div>
  );
}
