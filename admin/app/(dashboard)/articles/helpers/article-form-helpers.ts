import { ArticleFormData, FAQItem, GalleryFormItem } from "@/lib/types/form-types";
import { getArticleById } from "../actions/articles-actions";

type ArticleFromDb = NonNullable<Awaited<ReturnType<typeof getArticleById>>>;

export function transformArticleToFormData(article: ArticleFromDb): Partial<ArticleFormData> {
  return {
    // Basic Content
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || undefined,
    content: article.content,
    contentFormat: article.contentFormat || undefined,

    // Relationships
    clientId: article.clientId,
    categoryId: article.categoryId || undefined,
    authorId: article.authorId,

    // Status & Workflow
    status: article.status,
    scheduledAt: article.scheduledAt || null,
    featured: article.featured || false,

    // Schema.org Article - Core Fields
    datePublished: article.datePublished || null,
    lastReviewed: article.lastReviewed || null,
    mainEntityOfPage: article.mainEntityOfPage || undefined,

    // Schema.org Article - Extended Fields
    wordCount: article.wordCount || undefined,
    readingTimeMinutes: article.readingTimeMinutes || undefined,
    contentDepth: article.contentDepth || undefined,
    inLanguage: article.inLanguage || undefined,
    isAccessibleForFree: article.isAccessibleForFree ?? true,
    license: article.license || undefined,

    // SEO Meta Tags
    seoTitle: article.seoTitle || undefined,
    seoDescription: article.seoDescription || undefined,
    metaRobots: article.metaRobots || undefined,

    // Open Graph
    ogType: article.ogType || undefined,
    ogArticleAuthor: article.ogArticleAuthor || undefined,
    ogArticlePublishedTime: article.ogArticlePublishedTime || null,
    ogArticleModifiedTime: article.ogArticleModifiedTime || null,
    ogArticleSection: article.category?.name || undefined,
    ogArticleTag: article.tags?.map((t) => t.tag.name) || [],

    // Twitter Cards
    twitterCard: article.twitterCard || undefined,
    twitterSite: article.twitterSite || undefined,
    twitterCreator: article.twitterCreator || undefined,

    // Technical SEO
    canonicalUrl: article.canonicalUrl || undefined,
    sitemapPriority: article.sitemapPriority || undefined,
    sitemapChangeFreq: article.sitemapChangeFreq || undefined,

    // Breadcrumb Support
    breadcrumbPath: article.breadcrumbPath || undefined,

    // Featured Media
    featuredImageId: article.featuredImageId || null,
    gallery:
      article.gallery?.map(
        (item): GalleryFormItem => ({
          mediaId: item.mediaId,
          position: item.position,
          caption: item.caption || null,
          altText: item.altText || null,
          media: item.media
            ? {
                id: item.media.id,
                url: item.media.url,
                altText: item.media.altText || null,
                width: item.media.width || null,
                height: item.media.height || null,
                filename: item.media.filename,
              }
            : undefined,
        })
      ) || [],

    // JSON-LD Structured Data
    jsonLdStructuredData: article.jsonLdStructuredData || undefined,
    jsonLdLastGenerated: article.jsonLdLastGenerated || null,
    jsonLdValidationReport: article.jsonLdValidationReport || undefined,

    // Content for Structured Data
    articleBodyText: article.articleBodyText || undefined,

    // Semantic Enhancement
    semanticKeywords: article.semanticKeywords || undefined,

    // E-E-A-T Enhancement
    citations: article.citations || [],

    // Schema Versioning
    jsonLdVersion: article.jsonLdVersion || undefined,
    jsonLdHistory: article.jsonLdHistory || undefined,
    jsonLdDiffSummary: article.jsonLdDiffSummary || undefined,

    // Tags & FAQs
    tags: article.tags?.map((t) => t.tag.id) || [],
    faqs:
      article.faqs?.map(
        (faq): FAQItem => ({
          question: faq.question,
          answer: faq.answer,
          position: faq.position,
        })
      ) || [],

    // Related Articles
    relatedArticles:
      article.relatedTo?.map((rel) => ({
        relatedId: rel.relatedId,
        relationshipType: (rel.relationshipType as "related" | "similar" | "recommended") || undefined,
      })) || [],
  };
}
