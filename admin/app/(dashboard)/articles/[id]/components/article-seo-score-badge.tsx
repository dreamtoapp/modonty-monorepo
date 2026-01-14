'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyzeSEOGuidance, type SEOGuidanceResult } from '../../helpers/seo-guidance-analyzer';
import { ArticleFormData } from '@/lib/types/form-types';
import { transformArticleToFormData } from '../../helpers/article-form-helpers';
import { Article } from '../helpers/article-view-types';
import { getArticleById } from '../../actions/articles-actions';

interface ArticleSEOScoreBadgeProps {
  article: Article;
}

type ArticleFromDb = NonNullable<Awaited<ReturnType<typeof getArticleById>>>;

export function ArticleSEOScoreBadge({ article }: ArticleSEOScoreBadgeProps) {
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const analyze = async () => {
      try {
        setIsLoading(true);
        const transformed = transformArticleToFormData(article as unknown as ArticleFromDb);
        const formData: ArticleFormData = {
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

        const result = await analyzeSEOGuidance(formData);
        setScore(result.overallScore);
      } catch (error) {
        console.error('Error analyzing SEO score:', error);
        setScore(null);
      } finally {
        setIsLoading(false);
      }
    };

    timeoutId = setTimeout(analyze, 300);
    return () => clearTimeout(timeoutId);
  }, [article]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500 hover:bg-green-600';
    if (score >= 60) return 'bg-yellow-500 hover:bg-yellow-600';
    return 'bg-red-500 hover:bg-red-600';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-50';
    if (score >= 60) return 'text-yellow-50';
    return 'text-red-50';
  };

  const handleClick = () => {
    const element = document.querySelector('[data-section="section-seo-guidance"]');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return (
      <Badge
        variant="outline"
        className="px-3 py-1.5 cursor-pointer"
        onClick={handleClick}
      >
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span>Analyzing...</span>
      </Badge>
    );
  }

  if (score === null) {
    return null;
  }

  return (
    <Badge
      className={cn(
        'px-4 py-2 text-base font-semibold cursor-pointer transition-colors',
        getScoreColor(score),
        getScoreTextColor(score)
      )}
      onClick={handleClick}
      title="Click to view full SEO guidance"
    >
      {score}%
    </Badge>
  );
}
