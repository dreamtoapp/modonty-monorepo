"use server";

import { runFullSeed, type SeedSummary } from "./seed-core";
import { generateArticleWithOpenAI } from "@/lib/openai-seed";

interface RunSeedInput {
  articleCount: number;
  useOpenAI: boolean;
}

interface RunSeedResult {
  success: boolean;
  message?: string;
  error?: string;
  summary?: SeedSummary;
}

interface TestOpenAIResult {
  success: boolean;
  error?: string;
}

export async function testOpenAI(): Promise<TestOpenAIResult> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: "OPENAI_API_KEY is not configured on the server.",
    };
  }

  try {
    await generateArticleWithOpenAI({
      title: "اختبار اتصال OpenAI",
      category: "technical-seo",
      length: "short",
      language: "ar",
    });
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error while calling OpenAI.";
    console.error("Error in testOpenAI server action:", error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function runSeed(input: RunSeedInput): Promise<RunSeedResult> {
  if (process.env.NODE_ENV !== "development") {
    return {
      success: false,
      error: "Seeding can only be triggered in the development environment.",
    };
  }

  const safeCount = Math.max(10, Math.min(input.articleCount, 300));

  if (input.useOpenAI && !process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: "OPENAI_API_KEY is not configured on the server.",
    };
  }

  try {
    const summary = await runFullSeed({
      articleCount: safeCount,
      useOpenAI: input.useOpenAI,
    });

    return {
      success: true,
      summary,
      message: `Database cleared and seeded with ${summary.articles.total} articles (${summary.articles.published} published, ${summary.articles.draft} draft).`,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error while running the seed pipeline.";
    console.error("Error in runSeed server action:", error);
    return {
      success: false,
      error: message,
    };
  }
}

