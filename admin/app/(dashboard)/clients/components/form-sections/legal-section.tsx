"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput, FormSelect } from "@/components/admin/form-field";
import { SelectItem } from "@/components/ui/select";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";

interface LegalSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
}

export function LegalSection({ form }: LegalSectionProps) {
  const { watch, setValue, formState: { errors } } = form;

  return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Commercial Registration Number (CR)"
            name="commercialRegistrationNumber"
            value={watch("commercialRegistrationNumber") || ""}
            onChange={(e) => setValue("commercialRegistrationNumber", e.target.value || null, { shouldValidate: true })}
            error={errors.commercialRegistrationNumber?.message}
            placeholder="e.g., 1010123456"
            hint="CR Number is mandatory in Saudi Arabia - critical for business registration"
          />
          <FormSelect
            label="Legal Form"
            name="legalForm"
            value={watch("legalForm") || undefined}
            onValueChange={(value) => setValue("legalForm", value ? (value as "LLC" | "JSC" | "Sole Proprietorship" | "Partnership" | "Limited Partnership" | "Simplified Joint Stock Company") : null, { shouldValidate: true })}
            error={errors.legalForm?.message}
            hint="Entity type: LLC, JSC, Sole Proprietorship, etc."
            placeholder="Select Legal Form"
          >
            <SelectItem value="LLC">LLC (Limited Liability Company)</SelectItem>
            <SelectItem value="JSC">JSC (Joint Stock Company)</SelectItem>
            <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
            <SelectItem value="Partnership">Partnership</SelectItem>
            <SelectItem value="Limited Partnership">Limited Partnership</SelectItem>
            <SelectItem value="Simplified Joint Stock Company">Simplified Joint Stock Company</SelectItem>
          </FormSelect>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="VAT ID (ZATCA)"
            name="vatID"
            value={watch("vatID") || ""}
            onChange={(e) => setValue("vatID", e.target.value || null, { shouldValidate: true })}
            error={errors.vatID?.message}
            placeholder="e.g., 300012345600003"
            hint="VAT registration number from ZATCA (typically 15 digits)"
          />
          <FormInput
            label="Tax ID"
            name="taxID"
            value={watch("taxID") || ""}
            onChange={(e) => setValue("taxID", e.target.value || null, { shouldValidate: true })}
            error={errors.taxID?.message}
            placeholder="e.g., 300-123-456-600-003"
            hint="Tax identification number (ZATCA/Zakat)"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="License Number"
            name="licenseNumber"
            value={watch("licenseNumber") || ""}
            onChange={(e) => setValue("licenseNumber", e.target.value || null, { shouldValidate: true })}
            error={errors.licenseNumber?.message}
            placeholder="e.g., HC-2024-001234"
            hint="License number for regulated sectors (healthcare, finance, education, etc.)"
          />
          <FormInput
            label="License Authority"
            name="licenseAuthority"
            value={watch("licenseAuthority") || ""}
            onChange={(e) => setValue("licenseAuthority", e.target.value || null, { shouldValidate: true })}
            error={errors.licenseAuthority?.message}
            placeholder="e.g., Ministry of Health"
            hint="Regulatory authority that issued the license"
          />
        </div>
      </div>
  );
}
