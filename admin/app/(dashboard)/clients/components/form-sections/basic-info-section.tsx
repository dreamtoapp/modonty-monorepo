"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput } from "@/components/admin/form-field";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";

interface BasicInfoSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const { register, watch, formState: { errors } } = form;
  const slug = watch("slug");

  return (
    <div className="space-y-3">
      <FormInput
        label="Name"
        name="name"
        value={watch("name") || ""}
        onChange={(e) => form.setValue("name", e.target.value, { shouldValidate: true })}
        error={errors.name?.message}
        required
        placeholder="e.g., Acme Corporation"
        hint="Client name used in articles and Authority Blog. Slug will be auto-generated from this name."
      />
      <FormInput
        label="Slug"
        name="slug"
        value={watch("slug") || ""}
        readOnly
        disabled
        error={errors.slug?.message}
        required
        placeholder="Auto-generated from name..."
        hint="URL-friendly identifier used in URLs and article mentions. Auto-generated from name to be catchy and SEO-friendly."
      />
    </div>
  );
}
