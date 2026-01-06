import { ArticleStatus, SubscriptionTier, SubscriptionStatus, PaymentStatus, UserRole } from "@prisma/client";

export interface FAQItem {
  question: string;
  answer: string;
  position?: number;
}

export interface ArticleFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  contentFormat?: string;
  clientId: string;
  categoryId?: string;
  authorId: string;
  status: ArticleStatus;
  scheduledAt?: Date | null;
  featured?: boolean;
  featuredImageId?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  metaRobots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogSiteName?: string;
  ogLocale?: string;
  ogType?: string;
  ogArticleAuthor?: string;
  ogArticlePublishedTime?: Date | null;
  ogArticleModifiedTime?: Date | null;
  ogArticleSection?: string;
  ogArticleTag?: string[];
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterSite?: string;
  twitterCreator?: string;
  twitterLabel1?: string;
  twitterData1?: string;
  canonicalUrl?: string;
  robotsMeta?: string;
  sitemapPriority?: number;
  sitemapChangeFreq?: string;
  alternateLanguages?: Array<{ hreflang: string; url: string }>;
  license?: string;
  lastReviewed?: Date | null;
  datePublished?: Date | null;
  wordCount?: number;
  readingTimeMinutes?: number;
  contentDepth?: string;
  tags?: string[];
  faqs?: FAQItem[];
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
  jobTitle?: string;
  worksFor?: string;
  bio?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  sameAs?: string[];
  credentials?: string[];
  qualifications?: string[];
  expertiseAreas?: string[];
  experienceYears?: number;
  verificationStatus?: boolean;
  education?: Array<Record<string, string | number | boolean>>;
  seoTitle?: string;
  seoDescription?: string;
  userId?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface TagFormData {
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  canonicalUrl?: string;
}

export interface IndustryFormData {
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  canonicalUrl?: string;
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
