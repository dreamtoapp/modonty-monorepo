/**
 * SEO Guidance Analyzer
 * 
 * Analyzes article formData against 2025 SEO best practices.
 * All analysis is based on formData context - no external API calls.
 * 
 * Official Sources:
 * - Google Search Essentials: https://developers.google.com/search/docs/essentials
 * - Google Search Updates 2025: https://developers.google.com/search/updates
 * - Schema.org Article: https://schema.org/Article
 * - Core Web Vitals: https://web.dev/vitals/
 */

import { ArticleFormData } from '@/lib/types/form-types';
import { calculateWordCountImproved } from './seo-helpers';

export interface CategoryScore {
  score: number;
  maxScore: number;
  percentage: number;
  passed: number;
  total: number;
}

export interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  status: 'pass' | 'warning' | 'fail' | 'info';
  currentValue?: string | number;
  targetValue?: string | number;
  recommendation: string;
  field?: keyof ArticleFormData;
  priority: 'critical' | 'high' | 'medium' | 'low';
  officialSource?: string;
}

export interface OffPageRecommendation {
  id: string;
  category: 'link-building' | 'social-signals' | 'content-distribution' | 'authority-building';
  title: string;
  description: string;
  actionable: boolean;
  steps: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface Issue {
  code: string;
  category: string;
  message: string;
  fix?: string;
  field?: keyof ArticleFormData;
  severity: 'critical' | 'warning' | 'suggestion';
}

export interface SEOGuidanceResult {
  overallScore: number;
  categories: {
    metaTags: CategoryScore;
    content: CategoryScore;
    images: CategoryScore;
    structuredData: CategoryScore;
    technical: CategoryScore;
    mobile: CategoryScore;
  };
  inPageChecklist: ChecklistItem[];
  offPageGuidance: OffPageRecommendation[];
  criticalIssues: Issue[];
  warnings: Issue[];
  suggestions: Issue[];
  lastUpdated: string;
}

/**
 * Main analyzer function - analyzes formData against SEO best practices
 */
export async function analyzeSEOGuidance(
  formData: ArticleFormData,
  options?: { validateStructuredData?: boolean },
): Promise<SEOGuidanceResult> {
  // All analysis based on formData
  const metaTags = analyzeMetaTags(formData);
  const content = analyzeContentQuality(formData);
  const images = analyzeImages(formData);
  const structuredData = analyzeStructuredData(formData);
  const technical = analyzeTechnical(formData);
  const mobile = analyzeMobile(formData);

  // Optional async validation (if enabled)
  if (options?.validateStructuredData && formData.jsonLdStructuredData) {
    // Could call external validation API here
    // But for now, just analyze from formData
  }

  const inPageChecklist = [
    ...metaTags,
    ...content,
    ...images,
    ...structuredData,
    ...technical,
    ...mobile,
  ];

  const offPageGuidance = generateOffPageGuidance(formData);

  // Calculate category scores
  const categories = {
    metaTags: calculateCategoryScore(metaTags, 20),
    content: calculateCategoryScore(content, 25),
    images: calculateCategoryScore(images, 15),
    structuredData: calculateCategoryScore(structuredData, 20),
    technical: calculateCategoryScore(technical, 15),
    mobile: calculateCategoryScore(mobile, 5),
  };

  // Calculate overall score
  const totalMaxScore = 100;
  const totalScore = Object.values(categories).reduce((sum, cat) => sum + cat.score, 0);
  const overallScore = Math.round((totalScore / totalMaxScore) * 100);

  // Extract issues
  const criticalIssues = inPageChecklist.filter(
    (item) => item.status === 'fail' && item.priority === 'critical',
  ).map(item => ({
    code: item.id,
    category: item.category,
    message: item.recommendation,
    fix: item.recommendation,
    field: item.field,
    severity: 'critical' as const,
  }));

  const warnings = inPageChecklist.filter((item) => item.status === 'warning').map(item => ({
    code: item.id,
    category: item.category,
    message: item.recommendation,
    fix: item.recommendation,
    field: item.field,
    severity: 'warning' as const,
  }));

  const suggestions = inPageChecklist.filter((item) => item.status === 'info').map(item => ({
    code: item.id,
    category: item.category,
    message: item.recommendation,
    fix: item.recommendation,
    field: item.field,
    severity: 'suggestion' as const,
  }));

  return {
    overallScore,
    categories,
    inPageChecklist,
    offPageGuidance,
    criticalIssues,
    warnings,
    suggestions,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Calculate category score from checklist items
 */
function calculateCategoryScore(items: ChecklistItem[], maxScore: number): CategoryScore {
  const passed = items.filter((item) => item.status === 'pass').length;
  const total = items.length;
  const score = items.reduce((sum, item) => {
    if (item.status === 'pass') return sum + (maxScore / total);
    if (item.status === 'warning') return sum + (maxScore / total) * 0.5;
    return sum;
  }, 0);

  return {
    score: Math.round(score),
    maxScore,
    percentage: total > 0 ? Math.round((passed / total) * 100) : 0,
    passed,
    total,
  };
}

/**
 * Analyze Meta Tags & Titles
 */
function analyzeMetaTags(formData: ArticleFormData): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const seoTitle = formData.seoTitle || formData.title || '';
  const seoDescription = formData.seoDescription || formData.excerpt || '';

  // SEO Title length (30-60 chars optimal, 50-55 best)
  const titleLength = seoTitle.length;
  if (titleLength === 0) {
    items.push({
      id: 'seo-title-missing',
      category: 'metaTags',
      label: 'SEO Title',
      status: 'fail',
      currentValue: 0,
      targetValue: '30-60 characters',
      recommendation: 'Add SEO title (30-60 characters optimal, 50-55 best for search results)',
      field: 'seoTitle',
      priority: 'critical',
      officialSource: 'https://developers.google.com/search/docs/appearance/title-link',
    });
  } else if (titleLength < 30) {
    items.push({
      id: 'seo-title-short',
      category: 'metaTags',
      label: 'SEO Title Length',
      status: 'warning',
      currentValue: titleLength,
      targetValue: '30-60 characters',
      recommendation: `SEO title is short (${titleLength} chars). Aim for 30-60 characters for optimal display in search results.`,
      field: 'seoTitle',
      priority: 'high',
      officialSource: 'https://developers.google.com/search/docs/appearance/title-link',
    });
  } else if (titleLength > 60) {
    items.push({
      id: 'seo-title-long',
      category: 'metaTags',
      label: 'SEO Title Length',
      status: 'warning',
      currentValue: titleLength,
      targetValue: '30-60 characters',
      recommendation: `SEO title is long (${titleLength} chars). Keep it under 60 characters to avoid truncation in search results.`,
      field: 'seoTitle',
      priority: 'medium',
      officialSource: 'https://developers.google.com/search/docs/appearance/title-link',
    });
  } else {
    items.push({
      id: 'seo-title-optimal',
      category: 'metaTags',
      label: 'SEO Title Length',
      status: 'pass',
      currentValue: titleLength,
      targetValue: '30-60 characters',
      recommendation: `SEO title length is optimal (${titleLength} chars)`,
      field: 'seoTitle',
      priority: 'high',
    });
  }

  // SEO Description length (120-160 chars optimal, 150-155 best)
  const descLength = seoDescription.length;
  if (descLength === 0) {
    items.push({
      id: 'seo-description-missing',
      category: 'metaTags',
      label: 'SEO Description',
      status: 'fail',
      currentValue: 0,
      targetValue: '120-160 characters',
      recommendation: 'Add SEO description (120-160 characters optimal, 150-155 best for search snippets)',
      field: 'seoDescription',
      priority: 'critical',
      officialSource: 'https://developers.google.com/search/docs/appearance/snippet',
    });
  } else if (descLength < 120) {
    items.push({
      id: 'seo-description-short',
      category: 'metaTags',
      label: 'SEO Description Length',
      status: 'warning',
      currentValue: descLength,
      targetValue: '120-160 characters',
      recommendation: `SEO description is short (${descLength} chars). Aim for 120-160 characters for optimal display.`,
      field: 'seoDescription',
      priority: 'high',
      officialSource: 'https://developers.google.com/search/docs/appearance/snippet',
    });
  } else if (descLength > 160) {
    items.push({
      id: 'seo-description-long',
      category: 'metaTags',
      label: 'SEO Description Length',
      status: 'warning',
      currentValue: descLength,
      targetValue: '120-160 characters',
      recommendation: `SEO description is long (${descLength} chars). Keep it under 160 characters to avoid truncation.`,
      field: 'seoDescription',
      priority: 'medium',
      officialSource: 'https://developers.google.com/search/docs/appearance/snippet',
    });
  } else {
    items.push({
      id: 'seo-description-optimal',
      category: 'metaTags',
      label: 'SEO Description Length',
      status: 'pass',
      currentValue: descLength,
      targetValue: '120-160 characters',
      recommendation: `SEO description length is optimal (${descLength} chars)`,
      field: 'seoDescription',
      priority: 'high',
    });
  }

  // Meta Robots
  const metaRobots = formData.metaRobots || 'index, follow';
  if (metaRobots.includes('noindex')) {
    items.push({
      id: 'meta-robots-noindex',
      category: 'metaTags',
      label: 'Meta Robots',
      status: 'warning',
      currentValue: metaRobots,
      targetValue: 'index, follow',
      recommendation: 'Article is set to noindex - it will not appear in search results. Use only if intentionally hiding content.',
      field: 'metaRobots',
      priority: 'high',
      officialSource: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag',
    });
  } else {
    items.push({
      id: 'meta-robots-ok',
      category: 'metaTags',
      label: 'Meta Robots',
      status: 'pass',
      currentValue: metaRobots,
      targetValue: 'index, follow',
      recommendation: 'Meta robots configured correctly',
      field: 'metaRobots',
      priority: 'medium',
    });
  }

  return items;
}

/**
 * Analyze Content Quality
 */
function analyzeContentQuality(formData: ArticleFormData): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const content = formData.content || '';
  const wordCount = formData.wordCount || calculateWordCountImproved(content, formData.inLanguage || 'ar');

  // Word count (800+ recommended, 1000-3000 optimal)
  if (wordCount === 0) {
    items.push({
      id: 'content-missing',
      category: 'content',
      label: 'Content',
      status: 'fail',
      currentValue: 0,
      targetValue: '800+ words',
      recommendation: 'Add article content (minimum 300 words, 800+ recommended for SEO)',
      field: 'content',
      priority: 'critical',
      officialSource: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
    });
  } else if (wordCount < 300) {
    items.push({
      id: 'word-count-very-low',
      category: 'content',
      label: 'Word Count',
      status: 'fail',
      currentValue: wordCount,
      targetValue: '800+ words',
      recommendation: `Content is very short (${wordCount} words). Minimum 300 words recommended, 800+ for better SEO.`,
      field: 'content',
      priority: 'critical',
      officialSource: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
    });
  } else if (wordCount < 800) {
    items.push({
      id: 'word-count-low',
      category: 'content',
      label: 'Word Count',
      status: 'warning',
      currentValue: wordCount,
      targetValue: '800+ words',
      recommendation: `Content is short (${wordCount} words). Aim for 800+ words for better SEO performance.`,
      field: 'content',
      priority: 'high',
      officialSource: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
    });
  } else if (wordCount > 3000) {
    items.push({
      id: 'word-count-very-high',
      category: 'content',
      label: 'Word Count',
      status: 'info',
      currentValue: wordCount,
      targetValue: '1000-3000 words',
      recommendation: `Content is very long (${wordCount} words). Consider breaking into multiple articles or adding table of contents.`,
      field: 'content',
      priority: 'low',
    });
  } else {
    items.push({
      id: 'word-count-optimal',
      category: 'content',
      label: 'Word Count',
      status: 'pass',
      currentValue: wordCount,
      targetValue: '800+ words',
      recommendation: `Content length is good (${wordCount} words)`,
      field: 'content',
      priority: 'high',
    });
  }

  // Content depth
  if (formData.contentDepth) {
    items.push({
      id: 'content-depth-set',
      category: 'content',
      label: 'Content Depth',
      status: 'pass',
      currentValue: formData.contentDepth,
      recommendation: 'Content depth indicator is set',
      priority: 'low',
    });
  } else {
    items.push({
      id: 'content-depth-missing',
      category: 'content',
      label: 'Content Depth',
      status: 'info',
      recommendation: 'Content depth indicator helps signal content comprehensiveness',
      priority: 'low',
    });
  }

  return items;
}

/**
 * Analyze Images & Media
 */
function analyzeImages(formData: ArticleFormData): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // Featured image presence
  if (!formData.featuredImageId) {
    items.push({
      id: 'featured-image-missing',
      category: 'images',
      label: 'Featured Image',
      status: 'fail',
      recommendation: 'Add featured image (1200x630px minimum) for better social sharing and SEO',
      field: 'featuredImageId',
      priority: 'critical',
      officialSource: 'https://developers.google.com/search/docs/appearance/google-images',
    });
  } else {
    items.push({
      id: 'featured-image-present',
      category: 'images',
      label: 'Featured Image',
      status: 'pass',
      recommendation: 'Featured image is set',
      field: 'featuredImageId',
      priority: 'high',
    });
  }

  // Note: Image dimensions and alt text would need media data
  // For now, we check if featuredImageId exists
  // In the component, we can fetch media details if needed

  return items;
}

/**
 * Analyze Structured Data (Schema.org Article - 2025)
 * Based on official Schema.org: flexible requirements, no strict mandatory fields
 */
function analyzeStructuredData(formData: ArticleFormData): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // JSON-LD presence
  if (!formData.jsonLdStructuredData) {
    items.push({
      id: 'jsonld-missing',
      category: 'structuredData',
      label: 'JSON-LD Structured Data',
      status: 'warning',
      recommendation: 'Generate JSON-LD structured data for better search visibility (will be auto-generated on publish)',
      priority: 'high',
      officialSource: 'https://developers.google.com/search/docs/appearance/structured-data',
    });
  } else {
    items.push({
      id: 'jsonld-present',
      category: 'structuredData',
      label: 'JSON-LD Structured Data',
      status: 'pass',
      recommendation: 'JSON-LD structured data is present',
      priority: 'high',
    });
  }

  // Schema.org Article key properties (flexible - no strict requirements per 2025)
  const hasHeadline = !!(formData.title || formData.seoTitle);
  const hasAuthor = !!formData.authorId;
  const hasDatePublished = !!formData.datePublished;
  const hasDateModified = !!formData.ogArticleModifiedTime || !!formData.datePublished;
  const hasMainEntity = !!formData.mainEntityOfPage || !!formData.canonicalUrl;
  const hasImage = !!formData.featuredImageId;
  const hasDescription = !!(formData.seoDescription || formData.excerpt);

  if (hasHeadline) {
    items.push({
      id: 'schema-headline',
      category: 'structuredData',
      label: 'Schema: Headline',
      status: 'pass',
      recommendation: 'Article headline (title) is present',
      priority: 'high',
      officialSource: 'https://schema.org/Article',
    });
  }

  if (hasAuthor) {
    items.push({
      id: 'schema-author',
      category: 'structuredData',
      label: 'Schema: Author',
      status: 'pass',
      recommendation: 'Article author is set',
      priority: 'high',
      officialSource: 'https://schema.org/Article',
    });
  }

  if (hasDatePublished) {
    items.push({
      id: 'schema-date-published',
      category: 'structuredData',
      label: 'Schema: Date Published',
      status: 'pass',
      recommendation: 'Publication date is set',
      priority: 'high',
      officialSource: 'https://schema.org/Article',
    });
  } else {
    items.push({
      id: 'schema-date-published-missing',
      category: 'structuredData',
      label: 'Schema: Date Published',
      status: 'info',
      recommendation: 'Publication date will be set automatically when article is published',
      priority: 'medium',
      officialSource: 'https://schema.org/Article',
    });
  }

  // FAQ Schema (3+ questions recommended)
  const faqCount = formData.faqs?.length || 0;
  if (faqCount === 0) {
    items.push({
      id: 'faq-schema-missing',
      category: 'structuredData',
      label: 'FAQ Schema',
      status: 'info',
      currentValue: 0,
      targetValue: '3+ questions',
      recommendation: 'Add 3+ FAQs to enable FAQ rich results in search',
      field: 'faqs',
      priority: 'medium',
      officialSource: 'https://developers.google.com/search/docs/appearance/structured-data/faqpage',
    });
  } else if (faqCount < 3) {
    items.push({
      id: 'faq-schema-few',
      category: 'structuredData',
      label: 'FAQ Schema',
      status: 'warning',
      currentValue: faqCount,
      targetValue: '3+ questions',
      recommendation: `Only ${faqCount} FAQ(s). Add more (3+ recommended) for FAQ rich results.`,
      field: 'faqs',
      priority: 'medium',
      officialSource: 'https://developers.google.com/search/docs/appearance/structured-data/faqpage',
    });
  } else {
    items.push({
      id: 'faq-schema-optimal',
      category: 'structuredData',
      label: 'FAQ Schema',
      status: 'pass',
      currentValue: faqCount,
      targetValue: '3+ questions',
      recommendation: `FAQ schema is optimal (${faqCount} questions)`,
      field: 'faqs',
      priority: 'medium',
    });
  }

  return items;
}

/**
 * Analyze Technical SEO Elements
 */
function analyzeTechnical(formData: ArticleFormData): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // Canonical URL
  if (!formData.canonicalUrl) {
    items.push({
      id: 'canonical-missing',
      category: 'technical',
      label: 'Canonical URL',
      status: 'warning',
      recommendation: 'Canonical URL will be auto-generated from slug (recommended for duplicate content prevention)',
      field: 'canonicalUrl',
      priority: 'high',
      officialSource: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
    });
  } else {
    const isHttps = formData.canonicalUrl.startsWith('https://');
    if (!isHttps) {
      items.push({
        id: 'canonical-not-https',
        category: 'technical',
        label: 'Canonical URL (HTTPS)',
        status: 'warning',
        currentValue: 'HTTP',
        targetValue: 'HTTPS',
        recommendation: 'Use HTTPS for canonical URL (required by Google)',
        field: 'canonicalUrl',
        priority: 'high',
        officialSource: 'https://developers.google.com/search/docs/essentials',
      });
    } else {
      items.push({
        id: 'canonical-ok',
        category: 'technical',
        label: 'Canonical URL',
        status: 'pass',
        recommendation: 'Canonical URL is set and uses HTTPS',
        field: 'canonicalUrl',
        priority: 'high',
      });
    }
  }

  // Sitemap configuration
  if (formData.sitemapPriority !== undefined) {
    items.push({
      id: 'sitemap-priority-set',
      category: 'technical',
      label: 'Sitemap Priority',
      status: 'pass',
      currentValue: formData.sitemapPriority,
      recommendation: 'Sitemap priority is configured',
      field: 'sitemapPriority',
      priority: 'low',
    });
  }

  if (formData.sitemapChangeFreq) {
    items.push({
      id: 'sitemap-changefreq-set',
      category: 'technical',
      label: 'Sitemap Change Frequency',
      status: 'pass',
      currentValue: formData.sitemapChangeFreq,
      recommendation: 'Sitemap change frequency is configured',
      field: 'sitemapChangeFreq',
      priority: 'low',
    });
  }

  return items;
}

/**
 * Analyze Mobile & Performance
 */
function analyzeMobile(formData: ArticleFormData): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // Mobile-friendly is assumed (Next.js handles this)
  items.push({
    id: 'mobile-friendly',
    category: 'mobile',
    label: 'Mobile-Friendly',
    status: 'info',
    recommendation: 'Mobile-friendly design is handled by Next.js responsive framework',
    priority: 'low',
    officialSource: 'https://developers.google.com/search/docs/essentials/mobile-friendly',
  });

  // Core Web Vitals targets (2025)
  items.push({
    id: 'core-web-vitals',
    category: 'mobile',
    label: 'Core Web Vitals',
    status: 'info',
    recommendation: 'Target: LCP < 2.5s, INP < 200ms, CLS < 0.1 (test with PageSpeed Insights)',
    priority: 'medium',
    officialSource: 'https://web.dev/vitals/',
  });

  return items;
}

/**
 * Generate Off-Page SEO Guidance
 */
function generateOffPageGuidance(formData: ArticleFormData): OffPageRecommendation[] {
  const recommendations: OffPageRecommendation[] = [];

  // Link Building
  if (formData.relatedArticles && formData.relatedArticles.length > 0) {
    recommendations.push({
      id: 'internal-linking-opportunities',
      category: 'link-building',
      title: 'Internal Linking Opportunities',
      description: `You have ${formData.relatedArticles.length} related article(s). Consider adding more internal links within the content.`,
      actionable: true,
      steps: [
        'Review related articles and identify natural linking opportunities',
        'Add contextual internal links within the article content',
        'Link to related articles in the conclusion or related sections',
      ],
      priority: 'high',
    });
  } else {
    recommendations.push({
      id: 'add-related-articles',
      category: 'link-building',
      title: 'Add Related Articles',
      description: 'No related articles set. Adding related articles helps with internal linking and user engagement.',
      actionable: true,
      steps: [
        'Go to Related step and select 3-5 related articles',
        'Use relationship types: related, similar, or recommended',
        'This helps with internal linking and keeps users on your site',
      ],
      priority: 'medium',
    });
  }

  // Social Signals
  if (formData.ogArticleAuthor) {
    recommendations.push({
      id: 'social-author-signal',
      category: 'social-signals',
      title: 'Author Social Profile',
      description: 'Article author is set. Consider linking to author social profiles in structured data.',
      actionable: true,
      steps: [
        'Ensure author has social profiles (Twitter, LinkedIn)',
        'Add social profile URLs to author schema',
        'This helps with E-E-A-T signals',
      ],
      priority: 'medium',
    });
  }

  // Content Distribution
  recommendations.push({
    id: 'content-distribution',
    category: 'content-distribution',
    title: 'Content Distribution Strategy',
    description: 'Plan content distribution across multiple channels for maximum reach.',
    actionable: true,
    steps: [
      'Share on social media platforms (Twitter, LinkedIn, Facebook)',
      'Include in email newsletter if applicable',
      'Submit to relevant industry publications',
      'Engage with community forums and discussions',
    ],
    priority: 'high',
  });

  // Authority Building
  if (formData.citations && formData.citations.length > 0) {
    recommendations.push({
      id: 'citations-present',
      category: 'authority-building',
      title: 'Citations & Sources',
      description: `Article has ${formData.citations.length} citation(s). Citations help build authority and trust.`,
      actionable: false,
      steps: [],
      priority: 'low',
    });
  } else {
    recommendations.push({
      id: 'add-citations',
      category: 'authority-building',
      title: 'Add Citations & Sources',
      description: 'Adding citations and sources helps build E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).',
      actionable: true,
      steps: [
        'Add citations to authoritative sources',
        'Link to original research or studies',
        'Cite industry experts and publications',
        'This helps Google understand content credibility',
      ],
      priority: 'medium',
    });
  }

  return recommendations;
}
