'use client';

import { useEffect, useState, useMemo } from 'react';
import { useArticleForm } from '../article-form-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analyzeSEOGuidance, type SEOGuidanceResult } from '../../helpers/seo-guidance-analyzer';
import { SEOHealthScore } from './seo-health-score';
import { InPageSEOChecklist } from './in-page-seo-checklist';
import { OffPageSEOGuidance } from './off-page-seo-guidance';
import { BestPracticesReference } from './seo-best-practices-reference';
import { ArticleReviewSummary } from './article-review-summary';
import { StepByStepReview } from './step-by-step-review';
import { Loader2 } from 'lucide-react';

export function TechnicalSEOGuidance() {
  const { formData, updateField } = useArticleForm();
  const [analysisResult, setAnalysisResult] = useState<SEOGuidanceResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Debounced async analysis - updates when formData changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    setIsAnalyzing(true);

    timeoutId = setTimeout(async () => {
      try {
        const result = await analyzeSEOGuidance(formData);
        setAnalysisResult(result);
      } catch (error) {
        console.error('Error analyzing SEO guidance:', error);
        // Set a minimal result to show something even if analysis fails
        setAnalysisResult({
          overallScore: 0,
          categories: {
            metaTags: { score: 0, maxScore: 20, percentage: 0, passed: 0, total: 0 },
            content: { score: 0, maxScore: 25, percentage: 0, passed: 0, total: 0 },
            images: { score: 0, maxScore: 15, percentage: 0, passed: 0, total: 0 },
            structuredData: { score: 0, maxScore: 20, percentage: 0, passed: 0, total: 0 },
            technical: { score: 0, maxScore: 15, percentage: 0, passed: 0, total: 0 },
            mobile: { score: 0, maxScore: 5, percentage: 0, passed: 0, total: 0 },
          },
          inPageChecklist: [],
          offPageGuidance: [],
          criticalIssues: [],
          warnings: [],
          suggestions: [],
          lastUpdated: new Date().toISOString(),
        });
      } finally {
        setIsAnalyzing(false);
      }
    }, 300); // Debounce 300ms for performance

    return () => clearTimeout(timeoutId);
  }, [formData]); // Re-analyze when formData changes

  // Memoized category breakdown
  const categoryBreakdown = useMemo(() => {
    if (!analysisResult) return null;
    return analysisResult.categories;
  }, [analysisResult]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical SEO Guidance</CardTitle>
        <CardDescription>
          Real-time analysis of your article against 2025 SEO best practices
        </CardDescription>
        <SEOHealthScore
          score={analysisResult?.overallScore ?? 0}
          categories={categoryBreakdown}
          isLoading={isAnalyzing}
        />
      </CardHeader>
      <CardContent>
        {isAnalyzing && !analysisResult && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Analyzing SEO...</span>
          </div>
        )}

        {analysisResult && (
          <Tabs defaultValue="in-page" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="in-page">In-Page SEO</TabsTrigger>
              <TabsTrigger value="off-page">Off-Page SEO</TabsTrigger>
              <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
              <TabsTrigger value="article-review">Article Review</TabsTrigger>
            </TabsList>

            <TabsContent value="in-page" className="mt-6">
              <InPageSEOChecklist
                items={analysisResult.inPageChecklist}
                onFixIssue={(field, value) => updateField(field, value)}
                isLoading={isAnalyzing}
              />
            </TabsContent>

            <TabsContent value="off-page" className="mt-6">
              <OffPageSEOGuidance recommendations={analysisResult.offPageGuidance} />
            </TabsContent>

            <TabsContent value="best-practices" className="mt-6">
              <BestPracticesReference />
            </TabsContent>

            <TabsContent value="article-review" className="mt-6 space-y-6">
              <ArticleReviewSummary />
              <StepByStepReview />
            </TabsContent>
          </Tabs>
        )}

        {!isAnalyzing && !analysisResult && (
          <Tabs defaultValue="article-review" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="in-page">In-Page SEO</TabsTrigger>
              <TabsTrigger value="off-page">Off-Page SEO</TabsTrigger>
              <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
              <TabsTrigger value="article-review">Article Review</TabsTrigger>
            </TabsList>

            <TabsContent value="article-review" className="mt-6 space-y-6">
              <ArticleReviewSummary />
              <StepByStepReview />
            </TabsContent>

            <TabsContent value="in-page" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Start editing your article to see SEO guidance</p>
              </div>
            </TabsContent>

            <TabsContent value="off-page" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Start editing your article to see SEO guidance</p>
              </div>
            </TabsContent>

            <TabsContent value="best-practices" className="mt-6">
              <BestPracticesReference />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
