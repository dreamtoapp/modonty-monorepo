"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput, FormNativeSelect } from "@/components/admin/form-field";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";

interface ClassificationSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
  clients?: Array<{ id: string; name: string; slug: string }>;
}

export function ClassificationSection({
  form,
  clients = [],
}: ClassificationSectionProps) {
  const { watch, setValue, formState: { errors } } = form;

  return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Business Activity Code"
            name="businessActivityCode"
            value={watch("businessActivityCode") || ""}
            onChange={(e) => setValue("businessActivityCode", e.target.value || null, { shouldValidate: true })}
            error={errors.businessActivityCode?.message}
            placeholder="e.g., 62010"
            hint="Local business activity classification code"
          />
          <FormInput
            label="ISIC V4 Code"
            name="isicV4"
            value={watch("isicV4") || ""}
            onChange={(e) => setValue("isicV4", e.target.value || null, { shouldValidate: true })}
            error={errors.isicV4?.message}
            placeholder="e.g., 0111"
            hint="International Standard Industrial Classification (V4) - e.g., 0111"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Number of Employees"
            name="numberOfEmployees"
            value={watch("numberOfEmployees") || ""}
            onChange={(e) => setValue("numberOfEmployees", e.target.value || null, { shouldValidate: true })}
            error={errors.numberOfEmployees?.message}
            placeholder="e.g., 50"
            hint="Employee count (e.g., 50 or 10-50 for range)"
          />
          <FormNativeSelect
            label="Parent Organization"
            name="parentOrganizationId"
            value={watch("parentOrganizationId") || ""}
            onChange={(e) => setValue("parentOrganizationId", e.target.value || null, { shouldValidate: true })}
            error={errors.parentOrganizationId?.message}
            placeholder="Select parent organization (optional)"
            hint="Link this client to a parent company/organization for hierarchical relationships"
          >
            <option value="">None (Independent Organization)</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </FormNativeSelect>
        </div>
        <p className="text-xs text-muted-foreground">
          Parent organization is used in Schema.org structured data to establish organizational hierarchy.
          Only set this if this client is a subsidiary or division of another organization.
        </p>
      </div>
  );
}
