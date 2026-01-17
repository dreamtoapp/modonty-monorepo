"use server";

import { db } from "@/lib/db";
import type { ClientFormData } from "@/lib/types";
import { getFieldsForGroup } from "../../helpers/group-fields-by-tab";
import { getTierConfigByTier } from "@/app/(dashboard)/subscription-tiers/actions/tier-actions";
import { SubscriptionTier } from "@prisma/client";
import { validateAndNormalizeUrls } from "./validate-and-normalize-urls";

export interface GroupUpdateResult {
  success: boolean;
  error?: string;
  groupName: string;
  fieldsUpdated?: number;
}

/**
 * Helper to compare values (arrays, dates, primitives)
 */
function valuesAreEqual(existing: unknown, newValue: unknown): boolean {
  // Deep comparison for arrays
  if (Array.isArray(existing) && Array.isArray(newValue)) {
    const existingStr = JSON.stringify([...existing].sort());
    const newStr = JSON.stringify([...newValue].sort());
    return existingStr === newStr;
  }
  
  // Date comparison
  if (existing instanceof Date && newValue instanceof Date) {
    return existing.getTime() === newValue.getTime();
  }
  
  // Null/undefined comparison
  return existing === newValue;
}

/**
 * Normalizes date values to Date objects or null
 * Handles serialization from client-side where Date objects become strings
 * 
 * @param value - Date object, string, null, or undefined
 * @returns Date object or null if invalid/missing
 */
function normalizeDate(value: unknown): Date | null {
  // Return null for empty values
  if (value === null || value === undefined || value === "") {
    return null;
  }
  
  // Return Date object if already a Date
  if (value instanceof Date) {
    // Validate the date is not Invalid Date
    return isNaN(value.getTime()) ? null : value;
  }
  
  // Convert strings to Date objects
  if (typeof value === "string") {
    // Handle double-quoted strings (e.g., '"1988-01-14T00:00:00.000Z"')
    const cleanedValue = value.replace(/^["']|["']$/g, "");
    const date = new Date(cleanedValue);
    // Validate the date is valid
    return isNaN(date.getTime()) ? null : date;
  }
  
  // Return null for invalid types
  return null;
}

/**
 * Builds update data object with only changed fields for a specific group
 */
function buildGroupUpdateData(
  groupId: string,
  existingData: Record<string, unknown>,
  newData: Record<string, unknown>
): Record<string, unknown> {
  const fields = getFieldsForGroup(groupId);
  const updateData: Record<string, unknown> = {};
  
  fields.forEach((field) => {
    const existingValue = existingData[field];
    const newValue = newData[field];
    
    if (!valuesAreEqual(existingValue, newValue)) {
      updateData[field] = newValue;
    }
  });
  
  return updateData;
}

/**
 * Updates Required fields group (Basic info, subscription, business brief)
 */
export async function updateRequiredFields(
  clientId: string,
  data: Partial<ClientFormData>
): Promise<GroupUpdateResult> {
  try {
    // Verify client exists (security check)
    const client = await db.client.findUnique({
      where: { id: clientId },
      select: {
        name: true,
        slug: true,
        subscriptionTier: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        subscriptionStatus: true,
        paymentStatus: true,
        businessBrief: true,
        subscriptionTierConfigId: true,
        articlesPerMonth: true,
      },
    });

    if (!client) {
      return { success: false, error: "Client not found", groupName: "required" };
    }

    // Handle subscription tier logic
    let articlesPerMonth = data.articlesPerMonth ?? client.articlesPerMonth;
    let subscriptionTierConfigId = data.subscriptionTierConfigId ?? client.subscriptionTierConfigId;

    const tierChanged = client.subscriptionTier !== data.subscriptionTier;

    if (data.subscriptionTier && tierChanged) {
      const tierConfig = await getTierConfigByTier(data.subscriptionTier as SubscriptionTier);
      
      if (tierConfig) {
        articlesPerMonth = tierConfig.articlesPerMonth;
        subscriptionTierConfigId = tierConfig.id;
        
        if (!tierConfig.isActive) {
          console.warn(`Tier ${tierConfig.name} is deactivated but being assigned to client ${clientId}`);
        }
      } else {
        console.warn(`Tier config not found for tier: ${data.subscriptionTier}, keeping existing articlesPerMonth`);
        articlesPerMonth = client.articlesPerMonth;
      }
    } else if (!data.subscriptionTier) {
      subscriptionTierConfigId = null;
      articlesPerMonth = null;
    }

    const newData: Record<string, unknown> = {
      name: data.name,
      slug: data.slug,
      subscriptionTier: data.subscriptionTier,
      subscriptionStartDate: normalizeDate(data.subscriptionStartDate),
      subscriptionEndDate: normalizeDate(data.subscriptionEndDate),
      subscriptionStatus: data.subscriptionStatus ?? "PENDING",
      paymentStatus: data.paymentStatus ?? "PENDING",
      businessBrief: data.businessBrief,
      subscriptionTierConfigId,
      articlesPerMonth,
    };

    const updateData = buildGroupUpdateData("required", client as Record<string, unknown>, newData);

    if (Object.keys(updateData).length === 0) {
      return { success: true, groupName: "required", fieldsUpdated: 0 };
    }

    await db.client.update({
      where: { id: clientId },
      data: updateData,
    });

    return { success: true, groupName: "required", fieldsUpdated: Object.keys(updateData).length };
  } catch (error) {
    console.error("Error updating required fields:", error);
    const message = error instanceof Error ? error.message : "Failed to update required fields";
    return { success: false, error: message, groupName: "required" };
  }
}

/**
 * Updates Business fields group
 */
export async function updateBusinessFields(
  clientId: string,
  data: Partial<ClientFormData>
): Promise<GroupUpdateResult> {
  try {
    const client = await db.client.findUnique({
      where: { id: clientId },
      select: {
        legalName: true,
        industryId: true,
        targetAudience: true,
        contentPriorities: true,
        foundingDate: true,
        organizationType: true,
      },
    });

    if (!client) {
      return { success: false, error: "Client not found", groupName: "business" };
    }

    const newData: Record<string, unknown> = {
      legalName: data.legalName ?? null,
      industryId: data.industryId ?? null,
      targetAudience: data.targetAudience ?? null,
      contentPriorities: data.contentPriorities ?? [],
      foundingDate: normalizeDate(data.foundingDate),
      organizationType: data.organizationType ?? null,
    };

    const updateData = buildGroupUpdateData("business", client as Record<string, unknown>, newData);

    if (Object.keys(updateData).length === 0) {
      return { success: true, groupName: "business", fieldsUpdated: 0 };
    }

    await db.client.update({
      where: { id: clientId },
      data: updateData,
    });

    return { success: true, groupName: "business", fieldsUpdated: Object.keys(updateData).length };
  } catch (error) {
    console.error("Error updating business fields:", error);
    const message = error instanceof Error ? error.message : "Failed to update business fields";
    return { success: false, error: message, groupName: "business" };
  }
}

/**
 * Updates Contact & SEO fields group
 */
export async function updateContactSEOFields(
  clientId: string,
  data: Partial<ClientFormData>
): Promise<GroupUpdateResult> {
  try {
    const client = await db.client.findUnique({
      where: { id: clientId },
      select: {
        url: true,
        email: true,
        phone: true,
        contactType: true,
        sameAs: true,
        seoTitle: true,
        seoDescription: true,
        description: true,
        canonicalUrl: true,
        metaRobots: true,
        gtmId: true,
      },
    });

    if (!client) {
      return { success: false, error: "Client not found", groupName: "contact-seo" };
    }

    // Normalize sameAs URLs if provided
    const normalizedSameAs = data.sameAs ? validateAndNormalizeUrls(data.sameAs) : [];

    const newData: Record<string, unknown> = {
      url: data.url ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      contactType: data.contactType ?? null,
      sameAs: normalizedSameAs,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      description: data.description ?? null,
      canonicalUrl: data.canonicalUrl ?? null,
      metaRobots: data.metaRobots ?? null,
      gtmId: data.gtmId ?? null,
    };

    const updateData = buildGroupUpdateData("contact-seo", client as Record<string, unknown>, newData);

    if (Object.keys(updateData).length === 0) {
      return { success: true, groupName: "contact-seo", fieldsUpdated: 0 };
    }

    await db.client.update({
      where: { id: clientId },
      data: updateData,
    });

    return { success: true, groupName: "contact-seo", fieldsUpdated: Object.keys(updateData).length };
  } catch (error) {
    console.error("Error updating contact-seo fields:", error);
    const message = error instanceof Error ? error.message : "Failed to update contact-seo fields";
    return { success: false, error: message, groupName: "contact-seo" };
  }
}

/**
 * Updates Legal & Address fields group
 */
export async function updateLegalAddressFields(
  clientId: string,
  data: Partial<ClientFormData>
): Promise<GroupUpdateResult> {
  try {
    const client = await db.client.findUnique({
      where: { id: clientId },
      select: {
        legalForm: true,
        commercialRegistrationNumber: true,
        vatID: true,
        taxID: true,
        licenseNumber: true,
        licenseAuthority: true,
        addressStreet: true,
        addressNeighborhood: true,
        addressBuildingNumber: true,
        addressAdditionalNumber: true,
        addressCity: true,
        addressRegion: true,
        addressPostalCode: true,
        addressCountry: true,
      },
    });

    if (!client) {
      return { success: false, error: "Client not found", groupName: "legal-address" };
    }

    const newData: Record<string, unknown> = {
      legalForm: data.legalForm ?? null,
      commercialRegistrationNumber: data.commercialRegistrationNumber ?? null,
      vatID: data.vatID ?? null,
      taxID: data.taxID ?? null,
      licenseNumber: data.licenseNumber ?? null,
      licenseAuthority: data.licenseAuthority ?? null,
      addressStreet: data.addressStreet ?? null,
      addressNeighborhood: data.addressNeighborhood ?? null,
      addressBuildingNumber: data.addressBuildingNumber ?? null,
      addressAdditionalNumber: data.addressAdditionalNumber ?? null,
      addressCity: data.addressCity ?? null,
      addressRegion: data.addressRegion ?? null,
      addressPostalCode: data.addressPostalCode ?? null,
      addressCountry: data.addressCountry ?? null,
    };

    const updateData = buildGroupUpdateData("legal-address", client as Record<string, unknown>, newData);

    if (Object.keys(updateData).length === 0) {
      return { success: true, groupName: "legal-address", fieldsUpdated: 0 };
    }

    await db.client.update({
      where: { id: clientId },
      data: updateData,
    });

    return { success: true, groupName: "legal-address", fieldsUpdated: Object.keys(updateData).length };
  } catch (error) {
    console.error("Error updating legal-address fields:", error);
    const message = error instanceof Error ? error.message : "Failed to update legal-address fields";
    return { success: false, error: message, groupName: "legal-address" };
  }
}

/**
 * Updates Media & Social fields group
 */
export async function updateMediaSocialFields(
  clientId: string,
  data: Partial<ClientFormData>
): Promise<GroupUpdateResult> {
  try {
    const client = await db.client.findUnique({
      where: { id: clientId },
      select: {
        logoMediaId: true,
        ogImageMediaId: true,
        twitterImageMediaId: true,
        twitterCard: true,
        twitterTitle: true,
        twitterDescription: true,
        twitterSite: true,
      },
    });

    if (!client) {
      return { success: false, error: "Client not found", groupName: "media-social" };
    }

    const newData: Record<string, unknown> = {
      logoMediaId: data.logoMediaId ?? null,
      ogImageMediaId: data.ogImageMediaId ?? null,
      twitterImageMediaId: data.twitterImageMediaId ?? null,
      twitterCard: data.twitterCard ?? null,
      twitterTitle: data.twitterTitle ?? null,
      twitterDescription: data.twitterDescription ?? null,
      twitterSite: data.twitterSite ?? null,
    };

    const updateData = buildGroupUpdateData("media-social", client as Record<string, unknown>, newData);

    if (Object.keys(updateData).length === 0) {
      return { success: true, groupName: "media-social", fieldsUpdated: 0 };
    }

    await db.client.update({
      where: { id: clientId },
      data: updateData,
    });

    return { success: true, groupName: "media-social", fieldsUpdated: Object.keys(updateData).length };
  } catch (error) {
    console.error("Error updating media-social fields:", error);
    const message = error instanceof Error ? error.message : "Failed to update media-social fields";
    return { success: false, error: message, groupName: "media-social" };
  }
}

/**
 * Updates Classification & Additional fields group
 */
export async function updateClassificationFields(
  clientId: string,
  data: Partial<ClientFormData>
): Promise<GroupUpdateResult> {
  try {
    const client = await db.client.findUnique({
      where: { id: clientId },
      select: {
        businessActivityCode: true,
        isicV4: true,
        numberOfEmployees: true,
        parentOrganizationId: true,
        alternateName: true,
        slogan: true,
        keywords: true,
        knowsLanguage: true,
      },
    });

    if (!client) {
      return { success: false, error: "Client not found", groupName: "classification-additional" };
    }

    const newData: Record<string, unknown> = {
      businessActivityCode: data.businessActivityCode ?? null,
      isicV4: data.isicV4 ?? null,
      numberOfEmployees: data.numberOfEmployees ?? null,
      parentOrganizationId: data.parentOrganizationId ?? null,
      alternateName: data.alternateName ?? null,
      slogan: data.slogan ?? null,
      keywords: data.keywords ?? [],
      knowsLanguage: data.knowsLanguage ?? [],
    };

    const updateData = buildGroupUpdateData("classification-additional", client as Record<string, unknown>, newData);

    if (Object.keys(updateData).length === 0) {
      return { success: true, groupName: "classification-additional", fieldsUpdated: 0 };
    }

    await db.client.update({
      where: { id: clientId },
      data: updateData,
    });

    return { success: true, groupName: "classification-additional", fieldsUpdated: Object.keys(updateData).length };
  } catch (error) {
    console.error("Error updating classification-additional fields:", error);
    const message = error instanceof Error ? error.message : "Failed to update classification-additional fields";
    return { success: false, error: message, groupName: "classification-additional" };
  }
}
