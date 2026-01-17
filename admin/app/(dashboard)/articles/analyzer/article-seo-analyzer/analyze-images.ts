import { ArticleSEOCategory } from "../article-seo-types";
import type { NormalizedInput } from "./normalize-input";

export function analyzeImages(data: NormalizedInput): ArticleSEOCategory {
  const maxScore = 15;
  let score = 0;
  const items: { passed: boolean }[] = [];

  if (data.featuredImageId) {
    score += 10;
    items.push({ passed: true });
  } else {
    items.push({ passed: false });
  }

  if (
    data.featuredImageId &&
    data.featuredImageAlt &&
    data.featuredImageAlt.length > 0
  ) {
    score += 5;
    items.push({ passed: true });
  } else if (data.featuredImageId) {
    items.push({ passed: false });
  } else {
    items.push({ passed: true });
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
