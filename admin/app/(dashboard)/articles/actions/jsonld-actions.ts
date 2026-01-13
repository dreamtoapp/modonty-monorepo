"use server";

import { revalidatePath } from "next/cache";
import {
  generateAndSaveJsonLd,
  getCachedJsonLd,
  rollbackJsonLd,
  batchRegenerateJsonLd,
  getJsonLdStats,
} from "@/lib/seo";
import type { ValidationReport } from "@/lib/seo/jsonld-validator";

/**
 * Regenerate JSON-LD for a single article
 */
export async function regenerateArticleJsonLd(articleId: string): Promise<{
  success: boolean;
  jsonLd?: object;
  validationReport?: ValidationReport;
  error?: string;
}> {
  try {
    const result = await generateAndSaveJsonLd(articleId);

    if (result.success) {
      revalidatePath(`/articles`);
      revalidatePath(`/articles/${articleId}`);
    }

    return {
      success: result.success,
      jsonLd: result.jsonLd,
      validationReport: result.validationReport,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get cached JSON-LD for an article
 */
export async function getArticleJsonLd(articleId: string): Promise<{
  jsonLd: object | null;
  validationReport: ValidationReport | null;
}> {
  return getCachedJsonLd(articleId);
}

/**
 * Rollback JSON-LD to a previous version
 */
export async function rollbackArticleJsonLd(
  articleId: string,
  targetVersion: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await rollbackJsonLd(articleId, targetVersion);

    if (result.success) {
      revalidatePath(`/articles`);
      revalidatePath(`/articles/${articleId}`);
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Batch regenerate JSON-LD for multiple articles
 */
export async function batchRegenerateArticlesJsonLd(
  articleIds: string[]
): Promise<{
  successful: number;
  failed: number;
  errors: Array<{ articleId: string; error: string }>;
}> {
  try {
    const result = await batchRegenerateJsonLd(articleIds);

    revalidatePath("/articles");

    return {
      successful: result.successful,
      failed: result.failed,
      errors: result.results
        .filter((r) => !r.success && r.error)
        .map((r) => ({ articleId: r.articleId, error: r.error! })),
    };
  } catch (error) {
    return {
      successful: 0,
      failed: articleIds.length,
      errors: [
        {
          articleId: "all",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      ],
    };
  }
}

/**
 * Get JSON-LD statistics for the dashboard
 */
export async function getJsonLdStatistics(): Promise<{
  total: number;
  withJsonLd: number;
  withErrors: number;
  withWarnings: number;
}> {
  return getJsonLdStats();
}
