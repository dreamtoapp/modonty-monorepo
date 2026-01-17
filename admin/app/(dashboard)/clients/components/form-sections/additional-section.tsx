"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput, FormTextarea } from "@/components/admin/form-field";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";

interface AdditionalSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
}

export function AdditionalSection({ form }: AdditionalSectionProps) {
  const { watch, setValue, formState: { errors } } = form;

  return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Alternate Name"
            name="alternateName"
            value={watch("alternateName") || ""}
            onChange={(e) => setValue("alternateName", e.target.value || null, { shouldValidate: true })}
            error={errors.alternateName?.message}
            placeholder="e.g., الشركة الأكاديمية"
            hint="Alternative names (Arabic name, trade name, etc.)"
          />
          <FormInput
            label="Slogan"
            name="slogan"
            value={watch("slogan") || ""}
            onChange={(e) => setValue("slogan", e.target.value || null, { shouldValidate: true })}
            error={errors.slogan?.message}
            placeholder="e.g., Innovation Beyond Boundaries"
            hint="Company slogan/motto"
          />
        </div>
        <FormTextarea
          label="Keywords"
          name="keywords"
          value={Array.isArray(watch("keywords")) ? watch("keywords").join(", ") : (typeof watch("keywords") === "string" ? watch("keywords") : "") as string}
          onChange={(e) => {
            const keywords = e.target.value.split(",").map((k) => k.trim()).filter(Boolean);
            setValue("keywords", keywords, { shouldValidate: true });
          }}
          rows={2}
          error={errors.keywords?.message}
          placeholder="e.g., technology, innovation, consulting, digital transformation"
          hint="Keywords for classification (comma-separated)"
        />
        <FormTextarea
          label="Knows Language"
          name="knowsLanguage"
          value={Array.isArray(watch("knowsLanguage")) ? watch("knowsLanguage").join(", ") : (typeof watch("knowsLanguage") === "string" ? watch("knowsLanguage") : "") as string}
          onChange={(e) => {
            const languages = e.target.value.split(",").map((l) => l.trim()).filter(Boolean);
            setValue("knowsLanguage", languages, { shouldValidate: true });
          }}
          rows={2}
          error={errors.knowsLanguage?.message}
          placeholder="e.g., Arabic, English"
          hint="Languages supported (e.g., Arabic, English) - comma-separated"
        />
      </div>
  );
}
