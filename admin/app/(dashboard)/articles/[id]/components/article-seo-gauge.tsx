"use client";

import { SEOHealthGauge } from "@/components/shared/seo-doctor/seo-health-gauge";
import { articleSEOConfig } from "../../helpers/article-seo-config";
import { Article } from "../helpers/article-view-types";

interface ArticleSeoGaugeProps {
  article: Article;
}

export function ArticleSeoGauge({ article }: ArticleSeoGaugeProps) {
  return <SEOHealthGauge data={article} config={articleSEOConfig} size="md" />;
}
