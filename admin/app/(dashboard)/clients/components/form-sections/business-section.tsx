"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput, FormTextarea, FormNativeSelect, FormSelect } from "@/components/admin/form-field";
import { SelectItem } from "@/components/ui/select";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";

interface BusinessSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
  industries?: Array<{ id: string; name: string }>;
}

export function BusinessSection({
  form,
  industries = [],
}: BusinessSectionProps) {
  const { watch, setValue, formState: { errors } } = form;

  return (
    <div className="space-y-3">
      <FormInput
        label="Legal Name"
        name="legalName"
        value={watch("legalName") || ""}
        onChange={(e) => setValue("legalName", e.target.value || null, { shouldValidate: true })}
        error={errors.legalName?.message}
        placeholder="e.g., Acme Corporation LLC"
        hint="Official registered business name for Schema.org structured data"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormNativeSelect
          label="Industry"
          name="industryId"
          value={watch("industryId") || ""}
          onChange={(e) => setValue("industryId", e.target.value || null, { shouldValidate: true })}
          error={errors.industryId?.message}
          placeholder="Select an industry"
          hint="Categorizes client for better content targeting"
        >
          {industries.map((industry) => (
            <option key={industry.id} value={industry.id}>
              {industry.name}
            </option>
          ))}
        </FormNativeSelect>
        <FormSelect
          label="Organization Type"
          name="organizationType"
          value={watch("organizationType") || undefined}
          onValueChange={(value) => setValue("organizationType", value ? (value as "Organization" | "Corporation" | "LocalBusiness" | "NonProfit" | "EducationalOrganization" | "GovernmentOrganization" | "SportsOrganization" | "NGO") : null, { shouldValidate: true })}
          error={errors.organizationType?.message}
          hint="Subtype: Organization, Corporation, LocalBusiness, NonProfit, etc."
          placeholder="Select Organization Type"
        >
          <SelectItem value="Organization">Organization</SelectItem>
          <SelectItem value="Corporation">Corporation</SelectItem>
          <SelectItem value="LocalBusiness">LocalBusiness</SelectItem>
          <SelectItem value="NonProfit">NonProfit</SelectItem>
          <SelectItem value="EducationalOrganization">EducationalOrganization</SelectItem>
          <SelectItem value="GovernmentOrganization">GovernmentOrganization</SelectItem>
          <SelectItem value="SportsOrganization">SportsOrganization</SelectItem>
          <SelectItem value="NGO">NGO</SelectItem>
        </FormSelect>
      </div>
      <FormInput
        label="Founding Date"
        name="foundingDate"
        type="date"
        value={watch("foundingDate") ? new Date(watch("foundingDate")!).toISOString().split("T")[0] : ""}
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : null;
          setValue("foundingDate", date, { shouldValidate: true });
        }}
        error={errors.foundingDate?.message}
        hint="Used in Schema.org structured data"
      />
      <FormTextarea
        label="Target Audience"
        name="targetAudience"
        value={watch("targetAudience") || ""}
        onChange={(e) => setValue("targetAudience", e.target.value || null, { shouldValidate: true })}
        rows={3}
        error={errors.targetAudience?.message}
        placeholder="Describe the target audience for this client"
        hint="Helps writers tailor content tone, style, and topics"
      />
      <FormInput
        label="Content Priorities (comma-separated)"
        name="contentPriorities"
        value={Array.isArray(watch("contentPriorities")) ? watch("contentPriorities").join(", ") : ""}
        onChange={(e) => {
          const priorities = e.target.value.split(",").map((p) => p.trim()).filter(Boolean);
          setValue("contentPriorities", priorities, { shouldValidate: true });
        }}
        error={errors.contentPriorities?.message}
        placeholder="keyword1, keyword2, keyword3"
        hint="Key topics/keywords to prioritize in articles"
      />
    </div>
  );
}
