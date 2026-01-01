import { SEODoctorConfig } from "@/components/shared/seo-doctor";

export interface SEOScoreResult {
  score: number;
  maxScore: number;
  percentage: number;
}

/**
 * Calculate SEO score from entity data and SEO configuration
 * @param data - Entity data object
 * @param config - SEO configuration with validators
 * @returns SEO score result with score, maxScore, and percentage
 */
export function calculateSEOScore(
  data: Record<string, any>,
  config: SEODoctorConfig
): SEOScoreResult {
  let totalScore = 0;

  for (const fieldConfig of config.fields) {
    const value = data[fieldConfig.name];
    const result = fieldConfig.validator(value, data);
    totalScore += result.score;
  }

  const percentage = Math.round((totalScore / config.maxScore) * 100);

  return {
    score: totalScore,
    maxScore: config.maxScore,
    percentage: Math.min(100, Math.max(0, percentage)),
  };
}
