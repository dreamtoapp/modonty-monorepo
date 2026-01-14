'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analyzeSEOGuidance, type SEOGuidanceResult } from '../../helpers/seo-guidance-analyzer';
import { SEOHealthScore } from '../../components/sections/seo-health-score';
import { InPageSEOChecklist } from '../../components/sections/in-page-seo-checklist';
import { OffPageSEOGuidance } from '../../components/sections/off-page-seo-guidance';
import { BestPracticesReference } from '../../components/sections/seo-best-practices-reference';
import { Loader2 } from 'lucide-react';
import { ArticleFormData } from '@/lib/types/form-types';
import { transformArticleToFormData } from '../../helpers/article-form-helpers';
import { Article } from '../helpers/article-view-types';
import { getArticleById } from '../../actions/articles-actions';

interface ArticleSEOGuidanceProps {
  article: Article;
}

type ArticleFromDb = NonNullable<Awaited<ReturnType<typeof getArticleById>>>;

export function ArticleSEOGuidance({ article }: ArticleSEOGuidanceProps) {
  const [analysisResult, setAnalysisResult] = useState<SEOGuidanceResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Transform article to form data format
  const formData = useMemo<ArticleFormData>(() => {
    const transformed = transformArticleToFormData(article as unknown as ArticleFromDb);
    // Ensure all required fields have defaults
    return {
      title: transformed.title || '',
      slug: transformed.slug || '',
      excerpt: transformed.excerpt || '',
      content: transformed.content || '',
      contentFormat: transformed.contentFormat || 'rich_text',
      clientId: transformed.clientId || '',
      categoryId: transformed.categoryId || '',
      authorId: transformed.authorId || '',
      status: transformed.status || 'WRITING',
      featured: transformed.featured || false,
      scheduledAt: transformed.scheduledAt || null,
      datePublished: transformed.datePublished || null,
      lastReviewed: transformed.lastReviewed || null,
      mainEntityOfPage: transformed.mainEntityOfPage || '',
      wordCount: transformed.wordCount,
      readingTimeMinutes: transformed.readingTimeMinutes,
      contentDepth: transformed.contentDepth || '',
      inLanguage: transformed.inLanguage || 'ar',
      isAccessibleForFree: transformed.isAccessibleForFree ?? true,
      license: transformed.license || '',
      seoTitle: transformed.seoTitle || '',
      seoDescription: transformed.seoDescription || '',
      metaRobots: transformed.metaRobots || 'index, follow',
      ogType: transformed.ogType || 'article',
      ogTitle: transformed.ogTitle || '',
      ogDescription: transformed.ogDescription || '',
      ogUrl: transformed.ogUrl || '',
      ogSiteName: transformed.ogSiteName || 'مودونتي',
      ogLocale: transformed.ogLocale || 'ar_SA',
      ogArticleAuthor: transformed.ogArticleAuthor || '',
      ogArticlePublishedTime: transformed.ogArticlePublishedTime || null,
      ogArticleModifiedTime: transformed.ogArticleModifiedTime || null,
      ogArticleSection: transformed.ogArticleSection || '',
      ogArticleTag: transformed.ogArticleTag || [],
      twitterCard: transformed.twitterCard || 'summary_large_image',
      twitterTitle: transformed.twitterTitle || '',
      twitterDescription: transformed.twitterDescription || '',
      twitterSite: transformed.twitterSite || '',
      twitterCreator: transformed.twitterCreator || '',
      canonicalUrl: transformed.canonicalUrl || '',
      sitemapPriority: transformed.sitemapPriority || 0.5,
      sitemapChangeFreq: transformed.sitemapChangeFreq || 'weekly',
      breadcrumbPath: transformed.breadcrumbPath,
      featuredImageId: transformed.featuredImageId || null,
      gallery: transformed.gallery || [],
      jsonLdStructuredData: transformed.jsonLdStructuredData || '',
      jsonLdLastGenerated: transformed.jsonLdLastGenerated || null,
      jsonLdValidationReport: transformed.jsonLdValidationReport,
      articleBodyText: transformed.articleBodyText || '',
      semanticKeywords: transformed.semanticKeywords,
      citations: transformed.citations || [],
      jsonLdVersion: transformed.jsonLdVersion || 1,
      jsonLdHistory: transformed.jsonLdHistory,
      jsonLdDiffSummary: transformed.jsonLdDiffSummary || '',
      tags: transformed.tags || [],
      faqs: transformed.faqs || [],
      relatedArticles: transformed.relatedArticles || [],
    } as ArticleFormData;
  }, [article]);

  // Analyze SEO guidance when article data changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    setIsAnalyzing(true);

    timeoutId = setTimeout(async () => {
      try {
        const result = await analyzeSEOGuidance(formData);
        setAnalysisResult(result);
      } catch (error) {
        console.error('Error analyzing SEO guidance:', error);
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
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const categoryBreakdown = useMemo(() => {
    if (!analysisResult) return null;
    return analysisResult.categories;
  }, [analysisResult]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical SEO Guidance</CardTitle>
        <CardDescription>
          Analysis of your article against 2025 SEO best practices
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="in-page">In-Page SEO</TabsTrigger>
              <TabsTrigger value="off-page">Off-Page SEO</TabsTrigger>
              <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            </TabsList>

            <TabsContent value="in-page" className="mt-6">
              <InPageSEOChecklist
                items={analysisResult.inPageChecklist}
                onFixIssue={() => {}}
                isLoading={isAnalyzing}
              />
            </TabsContent>

            <TabsContent value="off-page" className="mt-6">
              <OffPageSEOGuidance recommendations={analysisResult.offPageGuidance} />
            </TabsContent>

            <TabsContent value="best-practices" className="mt-6">
              <BestPracticesReference />
            </TabsContent>
          </Tabs>
        )}

        {!isAnalyzing && !analysisResult && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Unable to analyze SEO guidance</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
