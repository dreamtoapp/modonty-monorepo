"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface SEOSettings {
  seoTitleMin: number;
  seoTitleMax: number;
  seoTitleRestrict: boolean;
  seoDescriptionMin: number;
  seoDescriptionMax: number;
  seoDescriptionRestrict: boolean;
  twitterTitleMax: number;
  twitterTitleRestrict: boolean;
  twitterDescriptionMax: number;
  twitterDescriptionRestrict: boolean;
  ogTitleMax: number;
  ogTitleRestrict: boolean;
  ogDescriptionMax: number;
  ogDescriptionRestrict: boolean;
}

export interface GTMSettings {
  gtmContainerId: string | null;
  gtmEnabled: boolean;
}

export interface HOTjarSettings {
  hotjarSiteId: string | null;
  hotjarEnabled: boolean;
}

export interface SocialMediaSettings {
  facebookUrl: string | null;
  twitterUrl: string | null;
  linkedInUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  githubUrl: string | null;
  pinterestUrl: string | null;
  snapchatUrl: string | null;
}

export interface AllSettings extends SEOSettings, GTMSettings, HOTjarSettings, SocialMediaSettings {}

const DEFAULT_SETTINGS: AllSettings = {
  seoTitleMin: 30,
  seoTitleMax: 60,
  seoTitleRestrict: false,
  seoDescriptionMin: 120,
  seoDescriptionMax: 160,
  seoDescriptionRestrict: false,
  twitterTitleMax: 70,
  twitterTitleRestrict: true,
  twitterDescriptionMax: 200,
  twitterDescriptionRestrict: true,
  ogTitleMax: 60,
  ogTitleRestrict: false,
  ogDescriptionMax: 200,
  ogDescriptionRestrict: false,
  gtmContainerId: null,
  gtmEnabled: false,
  hotjarSiteId: null,
  hotjarEnabled: false,
  facebookUrl: null,
  twitterUrl: null,
  linkedInUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
  tiktokUrl: null,
  githubUrl: null,
  pinterestUrl: null,
  snapchatUrl: null,
};

export async function getSEOSettings(): Promise<SEOSettings> {
  const all = await getAllSettings();
  return {
    seoTitleMin: all.seoTitleMin,
    seoTitleMax: all.seoTitleMax,
    seoTitleRestrict: all.seoTitleRestrict,
    seoDescriptionMin: all.seoDescriptionMin,
    seoDescriptionMax: all.seoDescriptionMax,
    seoDescriptionRestrict: all.seoDescriptionRestrict,
    twitterTitleMax: all.twitterTitleMax,
    twitterTitleRestrict: all.twitterTitleRestrict,
    twitterDescriptionMax: all.twitterDescriptionMax,
    twitterDescriptionRestrict: all.twitterDescriptionRestrict,
    ogTitleMax: all.ogTitleMax,
    ogTitleRestrict: all.ogTitleRestrict,
    ogDescriptionMax: all.ogDescriptionMax,
    ogDescriptionRestrict: all.ogDescriptionRestrict,
  };
}

export async function getAllSettings(): Promise<AllSettings> {
  try {
    // Use findFirst for singleton pattern (only one settings record)
    const settings = await db.settings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      const newSettings = await db.settings.create({
        data: DEFAULT_SETTINGS,
      });
      return {
        seoTitleMin: newSettings.seoTitleMin,
        seoTitleMax: newSettings.seoTitleMax,
        seoTitleRestrict: newSettings.seoTitleRestrict,
        seoDescriptionMin: newSettings.seoDescriptionMin,
        seoDescriptionMax: newSettings.seoDescriptionMax,
        seoDescriptionRestrict: newSettings.seoDescriptionRestrict,
        twitterTitleMax: newSettings.twitterTitleMax,
        twitterTitleRestrict: newSettings.twitterTitleRestrict,
        twitterDescriptionMax: newSettings.twitterDescriptionMax,
        twitterDescriptionRestrict: newSettings.twitterDescriptionRestrict,
        ogTitleMax: newSettings.ogTitleMax,
        ogTitleRestrict: newSettings.ogTitleRestrict,
        ogDescriptionMax: newSettings.ogDescriptionMax,
        ogDescriptionRestrict: newSettings.ogDescriptionRestrict,
        gtmContainerId: newSettings.gtmContainerId,
        gtmEnabled: newSettings.gtmEnabled,
        hotjarSiteId: newSettings.hotjarSiteId,
        hotjarEnabled: newSettings.hotjarEnabled,
        facebookUrl: newSettings.facebookUrl,
        twitterUrl: newSettings.twitterUrl,
        linkedInUrl: newSettings.linkedInUrl,
        instagramUrl: newSettings.instagramUrl,
        youtubeUrl: newSettings.youtubeUrl,
        tiktokUrl: newSettings.tiktokUrl,
        githubUrl: newSettings.githubUrl,
        pinterestUrl: newSettings.pinterestUrl,
        snapchatUrl: newSettings.snapchatUrl,
      };
    }

    return {
      seoTitleMin: settings.seoTitleMin,
      seoTitleMax: settings.seoTitleMax,
      seoTitleRestrict: settings.seoTitleRestrict,
      seoDescriptionMin: settings.seoDescriptionMin,
      seoDescriptionMax: settings.seoDescriptionMax,
      seoDescriptionRestrict: settings.seoDescriptionRestrict,
      twitterTitleMax: settings.twitterTitleMax,
      twitterTitleRestrict: settings.twitterTitleRestrict,
      twitterDescriptionMax: settings.twitterDescriptionMax,
      twitterDescriptionRestrict: settings.twitterDescriptionRestrict,
      ogTitleMax: settings.ogTitleMax,
      ogTitleRestrict: settings.ogTitleRestrict,
      ogDescriptionMax: settings.ogDescriptionMax,
      ogDescriptionRestrict: settings.ogDescriptionRestrict,
      gtmContainerId: settings.gtmContainerId,
      gtmEnabled: settings.gtmEnabled,
      hotjarSiteId: settings.hotjarSiteId,
      hotjarEnabled: settings.hotjarEnabled,
      facebookUrl: settings.facebookUrl,
      twitterUrl: settings.twitterUrl,
      linkedInUrl: settings.linkedInUrl,
      instagramUrl: settings.instagramUrl,
      youtubeUrl: settings.youtubeUrl,
      tiktokUrl: settings.tiktokUrl,
      githubUrl: settings.githubUrl,
      pinterestUrl: settings.pinterestUrl,
      snapchatUrl: settings.snapchatUrl,
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSEOSettings(data: Partial<SEOSettings>) {
  const all = await getAllSettings();
  return updateAllSettings({ ...all, ...data });
}

export async function updateAllSettings(data: Partial<AllSettings>) {
  try {
    // Check if settings exist
    const existing = await db.settings.findFirst();
    
    let settings;
    if (existing) {
      // Update existing settings
      settings = await db.settings.update({
        where: { id: existing.id },
        data: {
          seoTitleMin: data.seoTitleMin,
          seoTitleMax: data.seoTitleMax,
          seoTitleRestrict: data.seoTitleRestrict,
          seoDescriptionMin: data.seoDescriptionMin,
          seoDescriptionMax: data.seoDescriptionMax,
          seoDescriptionRestrict: data.seoDescriptionRestrict,
          twitterTitleMax: data.twitterTitleMax,
          twitterTitleRestrict: data.twitterTitleRestrict,
          twitterDescriptionMax: data.twitterDescriptionMax,
          twitterDescriptionRestrict: data.twitterDescriptionRestrict,
          ogTitleMax: data.ogTitleMax,
          ogTitleRestrict: data.ogTitleRestrict,
          ogDescriptionMax: data.ogDescriptionMax,
          ogDescriptionRestrict: data.ogDescriptionRestrict,
          gtmContainerId: data.gtmContainerId,
          gtmEnabled: data.gtmEnabled,
          hotjarSiteId: data.hotjarSiteId,
          hotjarEnabled: data.hotjarEnabled,
          facebookUrl: data.facebookUrl,
          twitterUrl: data.twitterUrl,
          linkedInUrl: data.linkedInUrl,
          instagramUrl: data.instagramUrl,
          youtubeUrl: data.youtubeUrl,
          tiktokUrl: data.tiktokUrl,
          githubUrl: data.githubUrl,
          pinterestUrl: data.pinterestUrl,
          snapchatUrl: data.snapchatUrl,
        },
      });
    } else {
      // Create new settings
      settings = await db.settings.create({
        data: {
          ...DEFAULT_SETTINGS,
          ...data,
        },
      });
    }

    revalidatePath("/settings");
    return { success: true, settings };
  } catch (error) {
    console.error("Error updating settings:", error);
    const message = error instanceof Error ? error.message : "Failed to update settings";
    return { success: false, error: message };
  }
}
