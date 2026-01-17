"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput, FormSelect } from "@/components/admin/form-field";
import { SelectItem } from "@/components/ui/select";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";

interface AddressSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
}

export function AddressSection({ form }: AddressSectionProps) {
  const { watch, setValue, formState: { errors } } = form;

  return (
      <div className="space-y-3">
        <FormInput
          label="Street Address"
          name="addressStreet"
          value={watch("addressStreet") || ""}
          onChange={(e) => setValue("addressStreet", e.target.value || null, { shouldValidate: true })}
          error={errors.addressStreet?.message}
          placeholder="King Fahd Road, Building 123"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Neighborhood"
            name="addressNeighborhood"
            value={watch("addressNeighborhood") || ""}
            onChange={(e) => setValue("addressNeighborhood", e.target.value || null, { shouldValidate: true })}
            error={errors.addressNeighborhood?.message}
            placeholder="e.g., Al Olaya"
            hint="Neighborhood/district (National Address)"
          />
          <FormInput
            label="City"
            name="addressCity"
            value={watch("addressCity") || ""}
            onChange={(e) => setValue("addressCity", e.target.value || null, { shouldValidate: true })}
            error={errors.addressCity?.message}
            placeholder="e.g., Riyadh"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Building Number"
            name="addressBuildingNumber"
            value={watch("addressBuildingNumber") || ""}
            onChange={(e) => setValue("addressBuildingNumber", e.target.value || null, { shouldValidate: true })}
            error={errors.addressBuildingNumber?.message}
            hint="Building number (National Address)"
          />
          <FormInput
            label="Additional Number"
            name="addressAdditionalNumber"
            value={watch("addressAdditionalNumber") || ""}
            onChange={(e) => setValue("addressAdditionalNumber", e.target.value || null, { shouldValidate: true })}
            error={errors.addressAdditionalNumber?.message}
            hint="Additional number (National Address)"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Region/Province"
            name="addressRegion"
            value={watch("addressRegion") || undefined}
            onValueChange={(value) => setValue("addressRegion", value ? (value as "" | "Riyadh" | "Makkah" | "Al Madinah" | "Eastern Province" | "Al Qassim" | "Asir" | "Tabuk" | "Hail" | "Northern Borders" | "Jazan" | "Najran" | "Al Bahah" | "Al Jawf") : null, { shouldValidate: true })}
            error={errors.addressRegion?.message}
            hint="Saudi Arabia has 13 regions/provinces"
            placeholder="Select Region"
          >
            <SelectItem value="Riyadh">Riyadh</SelectItem>
            <SelectItem value="Makkah">Makkah</SelectItem>
            <SelectItem value="Al Madinah">Al Madinah</SelectItem>
            <SelectItem value="Eastern Province">Eastern Province</SelectItem>
            <SelectItem value="Al Qassim">Al Qassim</SelectItem>
            <SelectItem value="Asir">Asir</SelectItem>
            <SelectItem value="Tabuk">Tabuk</SelectItem>
            <SelectItem value="Hail">Hail</SelectItem>
            <SelectItem value="Northern Borders">Northern Borders</SelectItem>
            <SelectItem value="Jazan">Jazan</SelectItem>
            <SelectItem value="Najran">Najran</SelectItem>
            <SelectItem value="Al Bahah">Al Bahah</SelectItem>
            <SelectItem value="Al Jawf">Al Jawf</SelectItem>
          </FormSelect>
          <FormInput
            label="Postal Code"
            name="addressPostalCode"
            value={watch("addressPostalCode") || ""}
            onChange={(e) => setValue("addressPostalCode", e.target.value || null, { shouldValidate: true })}
            error={errors.addressPostalCode?.message}
            placeholder="12345-6789"
            hint="9-digit postal code for National Address format (mandatory from 2026)"
          />
        </div>
        <FormInput
          label="Country"
          name="addressCountry"
          value={watch("addressCountry") || "SA"}
          onChange={(e) => setValue("addressCountry", e.target.value || null, { shouldValidate: true })}
          error={errors.addressCountry?.message}
          placeholder="SA (Saudi Arabia)"
          hint="Default: SA (Saudi Arabia)"
        />
      </div>
  );
}
