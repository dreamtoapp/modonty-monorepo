import { ArticleSEOCategory } from "../article-seo-types";
import type { NormalizedInput } from "./normalize-input";

export function analyzeMetaTags(data: NormalizedInput): ArticleSEOCategory {
  const maxScore = 25;
  let score = 0;
  const items: { passed: boolean }[] = [];

  const titleLength = data.seoTitle.length;
  if (titleLength >= 30 && titleLength <= 60) {
    score += 10;
    items.push({ passed: true });
  } else if (titleLength > 0 && titleLength < 30) {
    score += 5;
    items.push({ passed: false });
  } else if (titleLength > 60) {
    score += 5;
    items.push({ passed: false });
  } else {
    items.push({ passed: false });
  }

  const descLength = data.seoDescription.length;
  if (descLength >= 120 && descLength <= 160) {
    score += 10;
    items.push({ passed: true });
  } else if (descLength > 0 && descLength < 120) {
    score += 5;
    items.push({ passed: false });
  } else if (descLength > 160) {
    score += 5;
    items.push({ passed: false });
  } else {
    items.push({ passed: false });
  }

  if (data.metaRobots && !data.metaRobots.includes("noindex")) {
    score += 5;
    items.push({ passed: true });
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
