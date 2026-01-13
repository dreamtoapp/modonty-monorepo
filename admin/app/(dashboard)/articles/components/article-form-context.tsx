'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ArticleFormData, FormSubmitResult } from '@/lib/types/form-types';
import { slugify, generateSEOTitle, generateSEODescription, generateCanonicalUrl } from '../helpers/seo-helpers';
import {
  FileText,
  Edit,
  Search,
  Image,
  Tag,
  CheckCircle,
  Code,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { calculateStepValidation, calculateOverallProgress, type StepValidation } from '../helpers/step-validation-helpers';

export interface SectionConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

interface ArticleFormContextType {
  // Mode (always 'new' for article creation)
  mode: 'new';

  // Form Data
  formData: ArticleFormData;
  updateField: (field: keyof ArticleFormData, value: any) => void;
  updateFields: (fields: Partial<ArticleFormData>) => void;

  // Actions
  save: () => Promise<FormSubmitResult>;
  isSaving: boolean;
  isDirty: boolean;

  // Validation
  errors: Record<string, string[]>;
  setErrors: (errors: Record<string, string[]>) => void;

  // Step Navigation
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;

  // Navigation (legacy - for backward compatibility)
  sections: SectionConfig[];
  getSectionHref: (section: string) => string;

  // Data
  clients: Array<{ id: string; name: string; slug?: string }>;
  categories: Array<{ id: string; name: string; slug?: string }>;
  authors: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string; slug: string }>;

  // Validation
  getStepValidation: (stepNumber: number) => StepValidation;
  overallProgress: number;
}

const ArticleFormContext = createContext<ArticleFormContextType | undefined>(undefined);

interface ArticleFormProviderProps {
  children: ReactNode;
  initialData?: Partial<ArticleFormData>;
  onSubmit: (data: ArticleFormData) => Promise<FormSubmitResult>;
  clients: Array<{ id: string; name: string; slug?: string }>;
  categories: Array<{ id: string; name: string; slug?: string }>;
  authors: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string; slug: string }>;
}

const initialFormData: ArticleFormData = {
  // Basic Content
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  contentFormat: 'rich_text',
  
  // Relationships
  clientId: '',
  categoryId: '',
  authorId: '',
  
  // Status & Workflow
  status: 'WRITING',
  featured: false,
  scheduledAt: null,
  
  // Schema.org Article - Core Fields
  datePublished: null,
  lastReviewed: null,
  mainEntityOfPage: '',
  
  // Schema.org Article - Extended Fields
  wordCount: undefined,
  readingTimeMinutes: undefined,
  contentDepth: '',
  inLanguage: 'ar',
  isAccessibleForFree: true,
  license: '',
  creativeWorkStatus: '',
  
  // SEO Meta Tags
  seoTitle: '',
  seoDescription: '',
  metaRobots: 'index, follow',
  
  // Open Graph (Complete)
  ogTitle: '',
  ogDescription: '',
  ogType: 'article',
  ogUrl: '',
  ogSiteName: 'مودونتي',
  ogLocale: 'ar_SA',
  ogUpdatedTime: null,
  ogArticleAuthor: '',
  ogArticlePublishedTime: null,
  ogArticleModifiedTime: null,
  ogArticleSection: '',
  ogArticleTag: [],
  
  // Twitter Cards (Complete)
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterSite: '',
  twitterCreator: '',
  twitterLabel1: '',
  twitterData1: '',
  
  // Technical SEO
  canonicalUrl: '',
  alternateLanguages: [],
  robotsMeta: '',
  sitemapPriority: 0.5,
  sitemapChangeFreq: 'weekly',
  
  // Breadcrumb Support
  breadcrumbPath: undefined,
  
  // Featured Media
  featuredImageId: null,
  gallery: [],
  
  // JSON-LD Structured Data
  jsonLdStructuredData: '',
  jsonLdLastGenerated: null,
  jsonLdValidationReport: undefined,
  
  // Content for Structured Data
  articleBodyText: '',
  
  // Semantic Enhancement
  semanticKeywords: undefined,
  
  // E-E-A-T Enhancement
  citations: [],
  
  // Schema Versioning
  jsonLdVersion: 1,
  jsonLdHistory: undefined,
  jsonLdDiffSummary: '',
  // Tags & FAQs
  tags: [],
  faqs: [],
  
  // Related Articles
  relatedArticles: [],
};

export function ArticleFormProvider({
  children,
  initialData,
  onSubmit,
  clients,
  categories,
  authors,
  tags,
}: ArticleFormProviderProps) {
  const mode: 'new' = 'new';
  const [formData, setFormData] = useState<ArticleFormData>(() => ({
    ...initialFormData,
    ...initialData,
  }));
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  const totalSteps = 8;

  const getStepValidation = useCallback(
    (stepNumber: number) => calculateStepValidation(stepNumber, formData, errors),
    [formData, errors]
  );

  const overallProgress = calculateOverallProgress(formData, errors);

  // Get section href (always new article route)
  const getSectionHref = useCallback(
    (section: string) => {
      return `/articles/new/${section}`;
    },
    [],
  );

  // Sections configuration
  const sections: SectionConfig[] = [
    { id: 'basic', label: 'Basic Info', icon: FileText, href: getSectionHref('basic') },
    { id: 'content', label: 'Content', icon: Edit, href: getSectionHref('content') },
    { id: 'media', label: 'Media', icon: Image, href: getSectionHref('media') },
    { id: 'tags', label: 'Tags & FAQs', icon: Tag, href: getSectionHref('tags') },
    { id: 'seo', label: 'Technical SEO', icon: Search, href: getSectionHref('seo') },
    { id: 'seo-validation', label: 'SEO & Validation', icon: CheckCircle, href: getSectionHref('seo-validation') },
  ];

  const updateField = useCallback((field: keyof ArticleFormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from title
      if (field === 'title' && !prev.slug) {
        const newSlug = slugify(value);
        if (newSlug) {
          updated.slug = newSlug;
        }
      }
      return updated;
    });
    setIsDirty(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    // Note: Store sync happens via debounced useEffect below
  }, []);

  const updateFields = useCallback((fields: Partial<ArticleFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    setIsDirty(true);
    // Note: Store sync happens via debounced useEffect below
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const result = await onSubmit(formData);
      if (result.success) {
        setIsDirty(false);
        setErrors({});
      } else {
        const errorObj: Record<string, string[]> = result.error ? { _general: [result.error] } : {};
        setErrors(errorObj);
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save article';
      setErrors({ _general: [errorMessage] });
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSubmit]);

  // Step navigation methods
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const canGoNext = currentStep < totalSteps;
  const canGoPrevious = currentStep > 1;
  
  // Auto-fill logic
  useEffect(() => {
    const newSlug = slugify(formData.title);
    if (newSlug && newSlug !== formData.slug && !formData.slug) {
      setFormData((prev) => ({ ...prev, slug: newSlug }));
      setIsDirty(true);
    }
  }, [formData.title, formData.slug]);

  // Auto-fill SEO title from title (if empty)
  useEffect(() => {
    if (formData.title && !formData.seoTitle) {
      const selectedClient = clients.find((c) => c.id === formData.clientId);
      const clientName = selectedClient?.name;
      const seoTitle = generateSEOTitle(formData.title, clientName);
      if (seoTitle) {
        setFormData((prev) => ({ ...prev, seoTitle }));
        setIsDirty(true);
      }
    }
  }, [formData.title, formData.seoTitle, formData.clientId, clients]);

  // Auto-fill SEO description from excerpt (if empty)
  useEffect(() => {
    if (formData.excerpt && !formData.seoDescription) {
      const seoDescription = generateSEODescription(formData.excerpt);
      if (seoDescription) {
        setFormData((prev) => ({ ...prev, seoDescription }));
        setIsDirty(true);
      }
    }
  }, [formData.excerpt, formData.seoDescription]);

  // Auto-fill canonical URL from slug (if empty)
  useEffect(() => {
    if (formData.slug && !formData.canonicalUrl) {
      const selectedClient = clients.find((c) => c.id === formData.clientId);
      const clientSlug = selectedClient?.slug;
      const canonicalUrl = generateCanonicalUrl(formData.slug, undefined, clientSlug);
      if (canonicalUrl) {
        setFormData((prev) => ({ ...prev, canonicalUrl }));
        setIsDirty(true);
      }
    }
  }, [formData.slug, formData.canonicalUrl, formData.clientId, clients]);

  // Auto-fill OG Title from SEO Title (if empty)
  useEffect(() => {
    if (formData.seoTitle && !formData.ogTitle) {
      setFormData((prev) => ({ ...prev, ogTitle: formData.seoTitle }));
      setIsDirty(true);
    }
  }, [formData.seoTitle, formData.ogTitle]);

  // Auto-fill OG Description from SEO Description (if empty)
  useEffect(() => {
    if (formData.seoDescription && !formData.ogDescription) {
      setFormData((prev) => ({ ...prev, ogDescription: formData.seoDescription }));
      setIsDirty(true);
    }
  }, [formData.seoDescription, formData.ogDescription]);

  // Auto-fill Twitter Title from OG Title (if empty)
  useEffect(() => {
    if (formData.ogTitle && !formData.twitterTitle) {
      setFormData((prev) => ({ ...prev, twitterTitle: formData.ogTitle }));
      setIsDirty(true);
    }
  }, [formData.ogTitle, formData.twitterTitle]);

  // Auto-fill Twitter Description from OG Description (if empty)
  useEffect(() => {
    if (formData.ogDescription && !formData.twitterDescription) {
      setFormData((prev) => ({ ...prev, twitterDescription: formData.ogDescription }));
      setIsDirty(true);
    }
  }, [formData.ogDescription, formData.twitterDescription]);

  // Auto-fill Sitemap Priority from Featured (if empty)
  useEffect(() => {
    if (formData.featured !== undefined) {
      const newPriority = formData.featured ? 0.8 : 0.5;
      if (formData.sitemapPriority !== newPriority) {
        setFormData((prev) => ({ ...prev, sitemapPriority: newPriority }));
        setIsDirty(true);
      }
    }
  }, [formData.featured, formData.sitemapPriority]);

  // Auto-fill OG Article Section from Category (if empty)
  useEffect(() => {
    if (formData.categoryId && !formData.ogArticleSection) {
      const selectedCategory = categories.find((c) => c.id === formData.categoryId);
      if (selectedCategory?.name) {
        setFormData((prev) => ({ ...prev, ogArticleSection: selectedCategory.name }));
        setIsDirty(true);
      }
    }
  }, [formData.categoryId, formData.ogArticleSection, categories]);

  // Auto-fill OG Article Tags from Tags (if empty)
  useEffect(() => {
    if (formData.tags && formData.tags.length > 0 && (!formData.ogArticleTag || formData.ogArticleTag.length === 0)) {
      const selectedTags = tags.filter((t) => formData.tags?.includes(t.id)).map((t) => t.name);
      if (selectedTags.length > 0) {
        setFormData((prev) => ({ ...prev, ogArticleTag: selectedTags }));
        setIsDirty(true);
      }
    }
  }, [formData.tags, formData.ogArticleTag, tags]);

  // Auto-fill OG Article Author from Author (if empty)
  useEffect(() => {
    if (formData.authorId && !formData.ogArticleAuthor) {
      const selectedAuthor = authors.find((a) => a.id === formData.authorId);
      if (selectedAuthor?.name) {
        setFormData((prev) => ({ ...prev, ogArticleAuthor: selectedAuthor.name }));
        setIsDirty(true);
      }
    }
  }, [formData.authorId, formData.ogArticleAuthor, authors]);

  // Auto-fill OG URL from Canonical URL (if empty)
  useEffect(() => {
    if (formData.canonicalUrl && !formData.ogUrl) {
      setFormData((prev) => ({ ...prev, ogUrl: formData.canonicalUrl }));
      setIsDirty(true);
    }
  }, [formData.canonicalUrl, formData.ogUrl]);

  // Auto-fill articleBodyText from content (extract plain text from TipTap HTML)
  useEffect(() => {
    if (formData.content) {
      // Extract plain text from HTML content (TipTap outputs HTML via editor.getHTML())
      // Use browser's DOMParser for client-side extraction
      if (typeof window !== 'undefined') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formData.content;
        const plainText = (tempDiv.textContent || tempDiv.innerText || '').trim();
        
        // Update articleBodyText with extracted plain text
        if (plainText && (!formData.articleBodyText || formData.articleBodyText !== plainText)) {
          setFormData((prev) => ({ ...prev, articleBodyText: plainText }));
          setIsDirty(true);
        }
      }
    }
  }, [formData.content]);

  const value: ArticleFormContextType = {
    mode,
    formData,
    updateField,
    updateFields,
    save,
    isSaving,
    isDirty,
    errors,
    setErrors,
    currentStep,
    totalSteps,
    goToStep,
    nextStep,
    previousStep,
    canGoNext,
    canGoPrevious,
    sections,
    getSectionHref,
    clients,
    categories,
    authors,
    tags,
    getStepValidation,
    overallProgress,
  };

  return <ArticleFormContext.Provider value={value}>{children}</ArticleFormContext.Provider>;
}

export function useArticleForm() {
  const context = useContext(ArticleFormContext);
  if (!context) {
    throw new Error('useArticleForm must be used within ArticleFormProvider');
  }
  return context;
}
