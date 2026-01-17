'use client';

import { useMemo } from 'react';
import { useArticleForm } from '../article-form-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analyzeArticleSEO } from '../../analyzer';
import { SEOHealthScore } from './seo-health-score';
import { InPageSEOChecklist } from './in-page-seo-checklist';
import { OffPageSEOGuidance } from './off-page-seo-guidance';
import { BestPracticesReference } from './seo-best-practices-reference';
import { ArticleReviewSummary } from './article-review-summary';
import { StepByStepReview } from './step-by-step-review';

export function TechnicalSEOGuidance() {
  const { formData } = useArticleForm();
  
  // Analyze SEO score synchronously when formData changes
  const scoreResult = useMemo(() => analyzeArticleSEO(formData), [formData]);

  // Convert categories to match SEOHealthScore expected format
  const categoryBreakdown = useMemo(() => {
    if (!scoreResult) return null;
    return {
      metaTags: scoreResult.categories.metaTags,
      content: scoreResult.categories.content,
      images: scoreResult.categories.images,
      structuredData: scoreResult.categories.structuredData,
      technical: scoreResult.categories.technical,
      mobile: {
        ...scoreResult.categories.social,
        // Map social to mobile for compatibility
        maxScore: scoreResult.categories.social.maxScore,
      },
    };
  }, [scoreResult]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical SEO Guidance</CardTitle>
        <CardDescription>
          Real-time analysis of your article against 2025 SEO best practices
        </CardDescription>
        <SEOHealthScore
          score={scoreResult?.percentage ?? 0}
          categories={categoryBreakdown}
          isLoading={false}
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="in-page" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="in-page">In-Page SEO</TabsTrigger>
            <TabsTrigger value="off-page">Off-Page SEO</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="article-review">Article Review</TabsTrigger>
          </TabsList>

          <TabsContent value="in-page" className="mt-6">
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">SEO analysis based on unified analyzer</p>
              <p className="text-xs mt-2">Score: {scoreResult.percentage}%</p>
            </div>
          </TabsContent>

          <TabsContent value="off-page" className="mt-6">
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Off-page SEO guidance coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="best-practices" className="mt-6">
            <BestPracticesReference />
          </TabsContent>

          <TabsContent value="article-review" className="mt-6 space-y-6">
            <ArticleReviewSummary />
            <StepByStepReview />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
