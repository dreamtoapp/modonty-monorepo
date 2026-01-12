import { ArticleStatus, SubscriptionTier, SubscriptionStatus, PaymentStatus, UserRole } from "@prisma/client";

export interface FAQItem {
  question: string;
  answer: string;
  position?: number;
}

export interface GalleryFormItem {
  mediaId: string;
  position: number;
  caption?: string | null;
  altText?: string | null;
  // Temporary: For display purposes (loaded from Media table, not saved to DB)
  media?: {
    id: string;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
    filename: string;
  };
}

export interface ArticleFormData {
  // Basic Content
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  contentFormat?: string;
  
  // Relationships
  clientId: string;
  categoryId?: string;
  authorId: string;
  
  // Status & Workflow
  status: ArticleStatus;
  scheduledAt?: Date | null;
  featured?: boolean;
  
  // Schema.org Article - Core Fields
  datePublished?: Date | null;
  lastReviewed?: Date | null;
  mainEntityOfPage?: string;
  
  // Schema.org Article - Extended Fields
  wordCount?: number;
  readingTimeMinutes?: number;
  contentDepth?: string;
  inLanguage?: string;
  isAccessibleForFree?: boolean;
  license?: string;
  creativeWorkStatus?: string;
  
  // SEO Meta Tags
  seoTitle?: string;
  seoDescription?: string;
  metaRobots?: string;
  
  // Open Graph (Complete)
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogSiteName?: string;
  ogLocale?: string;
  ogType?: string;
  ogUpdatedTime?: Date | null;
  ogArticleAuthor?: string;
  ogArticlePublishedTime?: Date | null;
  ogArticleModifiedTime?: Date | null;
  ogArticleSection?: string;
  ogArticleTag?: string[];
  
  // Twitter Cards (Complete)
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterSite?: string;
  twitterCreator?: string;
  twitterLabel1?: string;
  twitterData1?: string;
  
  // Technical SEO
  canonicalUrl?: string;
  alternateLanguages?: Array<{ hreflang: string; url: string }>;
  robotsMeta?: string;
  sitemapPriority?: number;
  sitemapChangeFreq?: string;
  
  // Breadcrumb Support
  breadcrumbPath?: any;
  
  // Featured Media
  featuredImageId?: string | null;
  gallery?: GalleryFormItem[];
  
  // JSON-LD Structured Data
  jsonLdStructuredData?: string;
  jsonLdLastGenerated?: Date | null;
  jsonLdValidationReport?: any;
  
  // Content for Structured Data
  articleBodyText?: string;
  
  // Semantic Enhancement
  semanticKeywords?: any;
  
  // E-E-A-T Enhancement
  citations?: string[];
  
  // Schema Versioning
  jsonLdVersion?: number;
  jsonLdHistory?: any;
  jsonLdDiffSummary?: string;
  
  // Performance Tracking
  jsonLdGenerationTimeMs?: number;
  performanceBudgetMet?: boolean;
  
  // Tags & FAQs
  tags?: string[];
  faqs?: FAQItem[];
  
  // Related Articles
  relatedArticles?: Array<{
    relatedId: string;
    relationshipType?: 'related' | 'similar' | 'recommended';
    weight?: number;
  }>;
}

export interface ClientFormData {
  name: string;
  slug: string;
  legalName?: string;
  url?: string;
  // Centralized media references
  logoMediaId?: string | null;
  ogImageMediaId?: string | null;
  twitterImageMediaId?: string | null;
  sameAs?: string[];
  email?: string;
  phone?: string;
  seoTitle?: string;
  seoDescription?: string;
  description?: string | null;
  businessBrief?: string;
  industryId?: string | null;
  targetAudience?: string;
  contentPriorities?: string[];
  foundingDate?: Date | null;
  contactType?: string | null;
  addressStreet?: string | null;
  addressCity?: string | null;
  addressCountry?: string | null;
  addressPostalCode?: string | null;
  twitterCard?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterSite?: string | null;
  canonicalUrl?: string | null;
  gtmId?: string;
  subscriptionTier?: SubscriptionTier | null;
  subscriptionStartDate?: Date | null;
  subscriptionEndDate?: Date | null;
  articlesPerMonth?: number;
  subscriptionStatus?: SubscriptionStatus;
  paymentStatus?: PaymentStatus;
}

export interface AuthorFormData {
  name: string;
  slug: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  worksFor?: string;
  bio?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  email?: string;
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  sameAs?: string[];
  credentials?: string[];
  qualifications?: string[];
  expertiseAreas?: string[];
  experienceYears?: number;
  verificationStatus?: boolean;
  memberOf?: string[];
  education?: Array<Record<string, string | number | boolean>>;
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string | null;
  socialImageAlt?: string | null;
  cloudinaryPublicId?: string | null;
  canonicalUrl?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  socialImage?: string | null;
  socialImageAlt?: string | null;
  cloudinaryPublicId?: string | null;
}

export interface TagFormData {
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  socialImage?: string | null;
  socialImageAlt?: string | null;
  cloudinaryPublicId?: string | null;
}

export interface TagFormDataOld {
  name: string;
  slug: string;
}

export interface IndustryFormData {
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  socialImage?: string | null;
  socialImageAlt?: string | null;
  cloudinaryPublicId?: string | null;
}

export interface UserFormData {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  avatar?: string;
  image?: string;
  clientAccess?: string[];
}

export interface FormSubmitResult {
  success: boolean;
  error?: string;
}
