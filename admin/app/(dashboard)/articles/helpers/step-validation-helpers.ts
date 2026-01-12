import { ArticleFormData } from '@/lib/types/form-types';

export interface StepConfig {
  number: number;
  label: string;
  id: string;
  description: string;
  requiredFields: (keyof ArticleFormData)[];
  optionalFields: (keyof ArticleFormData)[];
}

export interface StepValidation {
  stepNumber: number;
  completedFields: number;
  totalFields: number;
  requiredFields: number;
  completedRequiredFields: number;
  hasErrors: boolean;
  errors: string[];
  completionPercentage: number;
  isValid: boolean;
}

export const STEP_CONFIGS: StepConfig[] = [
  {
    number: 1,
    label: 'Basic',
    id: 'basic',
    description: 'Essential article information: title, slug, client, and author',
    requiredFields: ['title', 'slug', 'clientId', 'authorId'],
    optionalFields: ['categoryId', 'excerpt', 'status', 'featured', 'scheduledAt'],
  },
  {
    number: 2,
    label: 'Content',
    id: 'content',
    description: 'Main article content and formatting options',
    requiredFields: ['content'],
    optionalFields: [
      'contentFormat',
      'wordCount',
      'readingTimeMinutes',
      'contentDepth',
      'articleBodyText',
      'inLanguage',
      'isAccessibleForFree',
    ],
  },
  {
    number: 3,
    label: 'Media',
    id: 'media',
    description: 'Images, featured image, and media gallery',
    requiredFields: [],
    optionalFields: ['featuredImageId', 'gallery'],
  },
  {
    number: 4,
    label: 'FAQs',
    id: 'faqs',
    description: 'Frequently asked questions and article tags',
    requiredFields: [],
    optionalFields: ['faqs', 'tags'],
  },
  {
    number: 5,
    label: 'Settings',
    id: 'settings',
    description: 'Publishing settings, SEO basics, and technical SEO configuration',
    requiredFields: ['seoTitle', 'seoDescription'],
    optionalFields: [
      'canonicalUrl',
      'metaRobots',
      'sitemapPriority',
      'sitemapChangeFreq',
      'alternateLanguages',
      'license',
      'datePublished',
      'lastReviewed',
      'mainEntityOfPage',
      'creativeWorkStatus',
    ],
  },
  {
    number: 6,
    label: 'Related',
    id: 'related',
    description: 'Related articles and content connections',
    requiredFields: [],
    optionalFields: ['relatedArticles'],
  },
  {
    number: 7,
    label: 'Technical SEO',
    id: 'seo',
    description: 'Preview of search results, social sharing, and structured data',
    requiredFields: [],
    optionalFields: [
      'ogType',
      'ogUpdatedTime',
      'ogArticleAuthor',
      'ogArticlePublishedTime',
      'ogArticleModifiedTime',
      'twitterCard',
      'twitterSite',
      'twitterCreator',
      'twitterLabel1',
      'twitterData1',
      'breadcrumbPath',
    ],
  },
  {
    number: 8,
    label: 'Review',
    id: 'review',
    description: 'Comprehensive review with live validation status for all fields',
    requiredFields: [],
    optionalFields: [],
  },
];

function isFieldCompleted(value: any): boolean {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'number') {
    return true;
  }
  if (typeof value === 'boolean') {
    return true;
  }
  if (value instanceof Date) {
    return true;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  return true;
}

export function calculateStepValidation(
  stepNumber: number,
  formData: ArticleFormData,
  errors: Record<string, string[]>
): StepValidation {
  const stepConfig = STEP_CONFIGS.find((s) => s.number === stepNumber);

  if (!stepConfig) {
    return {
      stepNumber,
      completedFields: 0,
      totalFields: 0,
      requiredFields: 0,
      completedRequiredFields: 0,
      hasErrors: false,
      errors: [],
      completionPercentage: 0,
      isValid: false,
    };
  }

  const allFields = [...stepConfig.requiredFields, ...stepConfig.optionalFields];
  const totalFields = allFields.length;

  const completedRequiredFields = stepConfig.requiredFields.filter((field) =>
    isFieldCompleted(formData[field])
  ).length;

  const completedOptionalFields = stepConfig.optionalFields.filter((field) =>
    isFieldCompleted(formData[field])
  ).length;

  const completedFields = completedRequiredFields + completedOptionalFields;

  const stepErrors = Object.entries(errors)
    .filter(([field]) => allFields.includes(field as keyof ArticleFormData))
    .flatMap(([, fieldErrors]) => fieldErrors);

  const hasErrors = stepErrors.length > 0;
  const isValid = completedRequiredFields === stepConfig.requiredFields.length && !hasErrors;

  const completionPercentage =
    totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 100;

  return {
    stepNumber,
    completedFields,
    totalFields,
    requiredFields: stepConfig.requiredFields.length,
    completedRequiredFields,
    hasErrors,
    errors: stepErrors,
    completionPercentage,
    isValid,
  };
}

export function calculateOverallProgress(
  formData: ArticleFormData,
  errors: Record<string, string[]>
): number {
  const validations = STEP_CONFIGS.slice(0, 7).map((step) =>
    calculateStepValidation(step.number, formData, errors)
  );

  const totalCompletion = validations.reduce((sum, v) => sum + v.completionPercentage, 0);
  return Math.round(totalCompletion / validations.length);
}

export function getStepStatus(
  stepNumber: number,
  currentStep: number,
  validation: StepValidation
): 'active' | 'completed' | 'error' | 'warning' | 'pending' {
  if (stepNumber === currentStep) {
    return 'active';
  }

  if (stepNumber < currentStep) {
    if (validation.hasErrors) {
      return 'error';
    }
    if (validation.completedRequiredFields < validation.requiredFields) {
      return 'warning';
    }
    return 'completed';
  }

  return 'pending';
}

export function getMissingRequiredFields(
  stepNumber: number,
  formData: ArticleFormData
): Array<{ field: string; label: string }> {
  const stepConfig = STEP_CONFIGS.find((s) => s.number === stepNumber);
  if (!stepConfig) return [];

  const fieldLabels: Record<string, string> = {
    // Basic Info
    title: 'Title',
    slug: 'Slug',
    clientId: 'Client',
    authorId: 'Author',
    categoryId: 'Category',
    excerpt: 'Excerpt',
    status: 'Status',
    featured: 'Featured',
    scheduledAt: 'Scheduled Date',
    
    // Content
    content: 'Content',
    contentFormat: 'Content Format',
    wordCount: 'Word Count',
    readingTimeMinutes: 'Reading Time',
    contentDepth: 'Content Depth',
    articleBodyText: 'Article Body Text (Plain)',
    inLanguage: 'Language',
    isAccessibleForFree: 'Accessible For Free',
    
    // SEO Meta
    seoTitle: 'SEO Title',
    seoDescription: 'SEO Description',
    metaRobots: 'Meta Robots',
    canonicalUrl: 'Canonical URL',
    robotsMeta: 'Robots Meta',
    sitemapPriority: 'Sitemap Priority',
    sitemapChangeFreq: 'Sitemap Change Frequency',
    alternateLanguages: 'Alternate Languages',
    breadcrumbPath: 'Breadcrumb Path',
    
    // Open Graph
    ogTitle: 'Open Graph Title',
    ogDescription: 'Open Graph Description',
    ogUrl: 'Open Graph URL',
    ogSiteName: 'Open Graph Site Name',
    ogLocale: 'Open Graph Locale',
    ogType: 'Open Graph Type',
    ogUpdatedTime: 'Open Graph Updated Time',
    ogArticleAuthor: 'OG Article Author',
    ogArticlePublishedTime: 'OG Article Published Time',
    ogArticleModifiedTime: 'OG Article Modified Time',
    ogArticleSection: 'OG Article Section',
    ogArticleTag: 'OG Article Tags',
    
    // Twitter Cards
    twitterCard: 'Twitter Card Type',
    twitterTitle: 'Twitter Title',
    twitterDescription: 'Twitter Description',
    twitterSite: 'Twitter Site',
    twitterCreator: 'Twitter Creator',
    twitterLabel1: 'Twitter Label 1',
    twitterData1: 'Twitter Data 1',
    
    // Media
    featuredImageId: 'Featured Image',
    gallery: 'Gallery',
    
    // Tags & FAQs
    tags: 'Tags',
    faqs: 'FAQs',
    
    // Settings & Advanced
    datePublished: 'Date Published',
    lastReviewed: 'Last Reviewed',
    mainEntityOfPage: 'Main Entity Of Page',
    license: 'License',
    creativeWorkStatus: 'Creative Work Status',
    semanticKeywords: 'Semantic Keywords',
    citations: 'Citations',
    
    // JSON-LD / Structured Data
    jsonLdStructuredData: 'JSON-LD Structured Data',
    jsonLdLastGenerated: 'JSON-LD Last Generated',
    jsonLdValidationReport: 'JSON-LD Validation Report',
    jsonLdVersion: 'JSON-LD Version',
    jsonLdHistory: 'JSON-LD History',
    jsonLdDiffSummary: 'JSON-LD Diff Summary',
    jsonLdGenerationTimeMs: 'JSON-LD Generation Time (ms)',
    performanceBudgetMet: 'Performance Budget Met',
    
    // Related
    relatedArticles: 'Related Articles',
  };

  return stepConfig.requiredFields
    .filter((field) => !isFieldCompleted(formData[field]))
    .map((field) => ({
      field,
      label: fieldLabels[field] || field,
    }));
}

export function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    // Basic Info
    title: 'Title',
    slug: 'Slug',
    clientId: 'Client',
    categoryId: 'Category',
    authorId: 'Author',
    excerpt: 'Excerpt',
    status: 'Status',
    featured: 'Featured',
    scheduledAt: 'Scheduled At',
    
    // Content
    content: 'Content',
    contentFormat: 'Content Format',
    wordCount: 'Word Count',
    readingTimeMinutes: 'Reading Time (minutes)',
    contentDepth: 'Content Depth',
    articleBodyText: 'Article Body (Plain Text)',
    inLanguage: 'Language',
    isAccessibleForFree: 'Accessible For Free',
    
    // SEO Meta
    seoTitle: 'SEO Title',
    seoDescription: 'SEO Description',
    metaRobots: 'Meta Robots',
    canonicalUrl: 'Canonical URL',
    robotsMeta: 'Robots Meta',
    sitemapPriority: 'Sitemap Priority',
    sitemapChangeFreq: 'Sitemap Change Frequency',
    alternateLanguages: 'Alternate Languages',
    breadcrumbPath: 'Breadcrumb Path',
    
    // Open Graph
    ogTitle: 'OG Title',
    ogDescription: 'OG Description',
    ogUrl: 'OG URL',
    ogSiteName: 'OG Site Name',
    ogLocale: 'OG Locale',
    ogType: 'OG Type',
    ogUpdatedTime: 'OG Updated Time',
    ogArticleAuthor: 'OG Article Author',
    ogArticlePublishedTime: 'OG Published Time',
    ogArticleModifiedTime: 'OG Modified Time',
    ogArticleSection: 'OG Article Section',
    ogArticleTag: 'OG Article Tags',
    
    // Twitter Cards
    twitterCard: 'Twitter Card Type',
    twitterTitle: 'Twitter Title',
    twitterDescription: 'Twitter Description',
    twitterSite: 'Twitter Site',
    twitterCreator: 'Twitter Creator',
    twitterLabel1: 'Twitter Label 1',
    twitterData1: 'Twitter Data 1',
    
    // Media
    featuredImageId: 'Featured Image',
    gallery: 'Gallery',
    
    // Tags & FAQs
    tags: 'Tags',
    faqs: 'FAQs',
    
    // Settings & Advanced
    datePublished: 'Date Published',
    lastReviewed: 'Last Reviewed',
    mainEntityOfPage: 'Main Entity Of Page',
    license: 'License',
    creativeWorkStatus: 'Creative Work Status',
    semanticKeywords: 'Semantic Keywords',
    citations: 'Citations',
    
    // JSON-LD / Structured Data
    jsonLdStructuredData: 'JSON-LD Data',
    jsonLdLastGenerated: 'JSON-LD Generated',
    jsonLdValidationReport: 'Validation Report',
    jsonLdVersion: 'JSON-LD Version',
    jsonLdHistory: 'JSON-LD History',
    jsonLdDiffSummary: 'JSON-LD Changes',
    jsonLdGenerationTimeMs: 'Generation Time (ms)',
    performanceBudgetMet: 'Performance OK',
    
    // Related
    relatedArticles: 'Related Articles',
  };

  return labels[field] || field;
}
