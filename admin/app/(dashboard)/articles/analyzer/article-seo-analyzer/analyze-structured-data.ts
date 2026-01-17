import { ArticleSEOCategory } from "../article-seo-types";
import type { NormalizedInput } from "./normalize-input";

export function analyzeStructuredData(
  data: NormalizedInput
): ArticleSEOCategory {
  const maxScore = 20;
  let score = 0;
  const items: { passed: boolean }[] = [];

  if (data.jsonLdStructuredData && data.jsonLdStructuredData.length > 0) {
    score += 5;
    items.push({ passed: true });
  } else {
    items.push({ passed: false });
  }

  let schemaScore = 0;
  if (data.title && data.title.length > 0) schemaScore += 2;
  if (data.authorId) schemaScore += 2;
  if (data.datePublished) schemaScore += 2;
  if (data.canonicalUrl) schemaScore += 2;
  if (data.seoDescription && data.seoDescription.length > 0)
    schemaScore += 2;

  score += schemaScore;
  items.push({ passed: schemaScore >= 8 });

  if (data.faqCount >= 3) {
    score += 5;
    items.push({ passed: true });
  } else if (data.faqCount > 0) {
    score += 2;
    items.push({ passed: false });
  } else {
    items.push({ passed: false });
  }

  const passed = items.filter((item) => item.passed).length;
  const total = items.length;

  return {
    score: Math.round(score),
    maxScore,
    percentage: total > 0 ? Math.round((passed / total) * 100) : 0,
    passed,
    total,
  };
}
