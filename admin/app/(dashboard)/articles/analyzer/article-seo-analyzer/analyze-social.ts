import { ArticleSEOCategory } from "../article-seo-types";
import type { NormalizedInput } from "./normalize-input";

export function analyzeSocial(data: NormalizedInput): ArticleSEOCategory {
  const maxScore = 5;
  let score = 0;
  const items: { passed: boolean }[] = [];

  const hasOG =
    data.ogTitle ||
    data.ogDescription ||
    (data.featuredImageId && data.ogTitle);
  if (hasOG) {
    score += 3;
    items.push({ passed: true });
  } else {
    items.push({ passed: false });
  }

  if (data.twitterCard) {
    score += 2;
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
