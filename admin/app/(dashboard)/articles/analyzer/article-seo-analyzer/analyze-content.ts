import { ArticleSEOCategory } from "../article-seo-types";
import type { NormalizedInput } from "./normalize-input";

export function analyzeContent(data: NormalizedInput): ArticleSEOCategory {
  const maxScore = 25;
  let score = 0;
  const items: { passed: boolean }[] = [];

  if (data.wordCount >= 800) {
    score += 15;
    items.push({ passed: true });
  } else if (data.wordCount >= 300) {
    score += 8;
    items.push({ passed: false });
  } else if (data.wordCount > 0) {
    score += 3;
    items.push({ passed: false });
  } else {
    items.push({ passed: false });
  }

  if (data.contentDepth) {
    score += 5;
    items.push({ passed: true });
  } else {
    items.push({ passed: false });
  }

  if (data.excerpt && data.excerpt.length > 0) {
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
