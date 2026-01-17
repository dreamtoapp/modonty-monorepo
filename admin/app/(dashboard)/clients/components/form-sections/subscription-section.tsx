"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput, FormSelect, FormNativeSelect } from "@/components/admin/form-field";
import { SelectItem } from "@/components/ui/select";
import { SubscriptionTierCards } from "../subscription-tier-cards";
import type { ClientFormSchemaType } from "../../helpers/client-form-schema";
import { SubscriptionTier } from "@prisma/client";

interface SubscriptionSectionProps {
  form: UseFormReturn<ClientFormSchemaType>;
  isEditMode?: boolean;
  tierConfigs?: Array<{
    id: string;
    tier: SubscriptionTier;
    name: string;
    articlesPerMonth: number;
    price: number;
    isPopular: boolean;
  }>;
}

export function SubscriptionSection({
  form,
  isEditMode = false,
  tierConfigs = [],
}: SubscriptionSectionProps) {
  const { watch, setValue, formState: { errors } } = form;
  const subscriptionTier = watch("subscriptionTier");

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1">
              Subscription Tier
              <span className="text-destructive ml-1">*</span>
            </label>
            <p className="text-xs text-muted-foreground">
              Select the subscription plan that determines monthly article allocation and billing structure.
            </p>
          </div>
          <SubscriptionTierCards
            selectedTier={subscriptionTier || ""}
            onSelect={(tier) => setValue("subscriptionTier", tier as SubscriptionTier, { shouldValidate: true })}
            tiers={tierConfigs.map((config) => ({
              value: config.tier,
              name: config.name,
              price: config.price,
              articlesPerMonth: config.articlesPerMonth,
              popular: config.isPopular,
            }))}
          />
          {errors.subscriptionTier && (
            <p className="text-xs text-destructive mt-2">{errors.subscriptionTier.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Subscription Start Date"
            name="subscriptionStartDate"
            type="date"
            value={watch("subscriptionStartDate") ? new Date(watch("subscriptionStartDate")!).toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null;
              setValue("subscriptionStartDate", date, { shouldValidate: true });
            }}
            error={errors.subscriptionStartDate?.message}
            hint="When subscription begins - end date auto-calculated (18 months)"
          />
          <FormInput
            label="Subscription End Date"
            name="subscriptionEndDate"
            type="date"
            value={watch("subscriptionEndDate") ? new Date(watch("subscriptionEndDate")!).toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null;
              setValue("subscriptionEndDate", date, { shouldValidate: true });
            }}
            error={errors.subscriptionEndDate?.message}
            hint="Auto-calculated: 18 months from start"
          />
        </div>
        {isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Subscription Status"
              name="subscriptionStatus"
              value={watch("subscriptionStatus") || "PENDING"}
              onValueChange={(value) => setValue("subscriptionStatus", value as any, { shouldValidate: true })}
              error={errors.subscriptionStatus?.message}
              hint="Current subscription state - Active enables content delivery"
            >
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </FormSelect>
            <FormSelect
              label="Payment Status"
              name="paymentStatus"
              value={watch("paymentStatus") || "PENDING"}
              onValueChange={(value) => setValue("paymentStatus", value as any, { shouldValidate: true })}
              error={errors.paymentStatus?.message}
              hint="Track payment status for billing and subscription management"
            >
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </FormSelect>
          </div>
        )}
      </div>
    </div>
  );
}
