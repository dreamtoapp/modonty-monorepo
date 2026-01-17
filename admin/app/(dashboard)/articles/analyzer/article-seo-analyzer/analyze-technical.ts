import { ArticleSEOCategory } from "../article-seo-types";
import type { NormalizedInput } from "./normalize-input";

export function analyzeTechnical(data: NormalizedInput): ArticleSEOCategory {
  const maxScore = 10;
  let score = 0;
  const items: { passed: boolean }[] = [];

  if (data.canonicalUrl && data.canonicalUrl.startsWith("https://")) {
    score += 5;
    items.push({ passed: true });
  } else if (data.canonicalUrl) {
    score += 3;
    items.push({ passed: false });
  } else {
    items.push({ passed: false });
  }

  if (data.sitemapPriority !== null && data.sitemapChangeFreq) {
    score += 5;
    items.push({ passed: true });
  } else if (data.sitemapPriority !== null || data.sitemapChangeFreq) {
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
