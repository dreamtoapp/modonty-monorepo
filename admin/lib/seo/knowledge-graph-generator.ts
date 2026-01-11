/**
 * Knowledge Graph Generator - Phase 2
 *
 * Generates a unified JSON-LD @graph with linked entities:
 * - WebPage (container)
 * - Article (main content)
 * - Person (author)
 * - Organization (publisher/client)
 * - ImageObject (hero + gallery)
 * - BreadcrumbList
 * - FAQPage (if FAQs exist)
 *
 * All entities use stable @id for cross-referencing.
 */

import {
  Article,
  Client,
  Author,
  Category,
  ArticleFAQ,
  Media,
  ArticleMedia,
  Tag,
} from "@prisma/client";

// Type for article with all relations needed for JSON-LD
export interface ArticleWithFullRelations extends Article {
  client: Client & {
    logoMedia?: Media | null;
  };
  author: Author;
  category?: Category | null;
  tags?: Array<{ tag: Tag }>;
  featuredImage?: Media | null;
  gallery?: Array<ArticleMedia & { media: Media }>;
  faqs?: ArticleFAQ[];
}

// JSON-LD Graph structure
export interface JsonLdGraph {
  "@context": "https://schema.org";
  "@graph": JsonLdNode[];
}

// Generic node in the graph
export interface JsonLdNode {
  "@type": string;
  "@id"?: string;
  [key: string]: unknown;
}

/**
 * Generate complete Knowledge Graph for an article
 */
export function generateArticleKnowledgeGraph(
  article: ArticleWithFullRelations
): JsonLdGraph {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com";
  const articleUrl =
    article.canonicalUrl || `${siteUrl}/articles/${article.slug}`;

  // Stable entity IDs (used for cross-referencing)
  const ids = {
    webPage: articleUrl,
    article: `${articleUrl}#article`,
    author: `${siteUrl}/authors/${article.author.slug}#person`,
    publisher: `${siteUrl}/clients/${article.client.slug}#organization`,
    breadcrumb: `${articleUrl}#breadcrumb`,
    faq: `${articleUrl}#faq`,
    primaryImage: `${articleUrl}#primary-image`,
  };

  const graph: JsonLdNode[] = [];

  // 1. WebPage (container for the article)
  graph.push(generateWebPageNode(article, articleUrl, ids));

  // 2. Article (main content)
  graph.push(generateArticleNode(article, articleUrl, ids, siteUrl));

  // 3. Organization (Publisher/Client)
  graph.push(generateOrganizationNode(article.client, ids.publisher, siteUrl));

  // 4. Person (Author)
  graph.push(generatePersonNode(article.author, ids.author, siteUrl));

  // 5. BreadcrumbList
  graph.push(generateBreadcrumbNode(article, articleUrl, ids.breadcrumb, siteUrl));

  // 6. FAQPage (only if FAQs exist)
  if (article.faqs && article.faqs.length > 0) {
    graph.push(generateFAQNode(article.faqs, ids.faq));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Generate WebPage node
 */
function generateWebPageNode(
  article: ArticleWithFullRelations,
  articleUrl: string,
  ids: Record<string, string>
): JsonLdNode {
  return {
    "@type": "WebPage",
    "@id": ids.webPage,
    url: articleUrl,
    name: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || undefined,
    mainEntity: { "@id": ids.article },
    inLanguage: article.inLanguage || "ar",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com"}#website`,
      name: "مودونتي",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com",
    },
    breadcrumb: { "@id": ids.breadcrumb },
    ...(article.datePublished && {
      datePublished: article.datePublished.toISOString(),
    }),
    dateModified: article.dateModified.toISOString(),
  };
}

/**
 * Generate Article node
 */
function generateArticleNode(
  article: ArticleWithFullRelations,
  articleUrl: string,
  ids: Record<string, string>,
  siteUrl: string
): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "Article",
    "@id": ids.article,
    headline: article.title,
    description: article.seoDescription || article.excerpt || undefined,
    author: { "@id": ids.author },
    publisher: { "@id": ids.publisher },
    mainEntityOfPage: { "@id": ids.webPage },
    inLanguage: article.inLanguage || "ar",
    isAccessibleForFree: article.isAccessibleForFree ?? true,
    ...(article.datePublished && {
      datePublished: article.datePublished.toISOString(),
    }),
    dateModified: article.dateModified.toISOString(),
    ...(article.lastReviewed && {
      lastReviewed: article.lastReviewed.toISOString(),
    }),
  };

  // Add articleBody (plain text for AI crawlers)
  if (article.articleBodyText) {
    node.articleBody = article.articleBodyText;
  }

  // Add word count
  if (article.wordCount) {
    node.wordCount = article.wordCount;
  }

  // Add license
  if (article.license) {
    node.license = article.license;
  }

  // Add category as articleSection
  if (article.category) {
    node.articleSection = article.category.name;
    node.about = {
      "@type": "Thing",
      "@id": `${siteUrl}/categories/${article.category.slug}`,
      name: article.category.name,
    };
  }

  // Add tags as keywords
  if (article.tags && article.tags.length > 0) {
    node.keywords = article.tags.map((t) => t.tag.name).join(", ");
  }

  // Add citations (E-E-A-T)
  if (article.citations && article.citations.length > 0) {
    node.citation = article.citations;
  }

  // Add images (hero + gallery)
  const images = buildImageArray(article, articleUrl);
  if (images.length > 0) {
    node.image = images.length === 1 ? images[0] : images;
  }

  return node;
}

/**
 * Build image array for Article
 */
function buildImageArray(
  article: ArticleWithFullRelations,
  articleUrl: string
): JsonLdNode[] {
  const images: JsonLdNode[] = [];

  // Hero image (featuredImage)
  if (article.featuredImage) {
    images.push({
      "@type": "ImageObject",
      "@id": `${articleUrl}#primary-image`,
      url: article.featuredImage.url,
      contentUrl: article.featuredImage.url,
      ...(article.featuredImage.width && { width: article.featuredImage.width }),
      ...(article.featuredImage.height && { height: article.featuredImage.height }),
      ...(article.featuredImage.caption && { caption: article.featuredImage.caption }),
      ...(article.featuredImage.altText && { name: article.featuredImage.altText }),
      ...(article.featuredImage.license && { license: article.featuredImage.license }),
      ...(article.featuredImage.creator && {
        creator: {
          "@type": "Person",
          name: article.featuredImage.creator,
        },
      }),
      representativeOfPage: true,
    });
  }

  // Gallery images
  if (article.gallery && article.gallery.length > 0) {
    article.gallery
      .sort((a, b) => a.position - b.position)
      .forEach((item, index) => {
        images.push({
          "@type": "ImageObject",
          "@id": `${articleUrl}#image-${index + 2}`,
          url: item.media.url,
          contentUrl: item.media.url,
          ...(item.media.width && { width: item.media.width }),
          ...(item.media.height && { height: item.media.height }),
          // Use article-specific caption/altText if available, otherwise fall back to media
          caption: item.caption || item.media.caption || undefined,
          name: item.altText || item.media.altText || undefined,
          ...(item.media.license && { license: item.media.license }),
        });
      });
  }

  return images;
}

/**
 * Generate Organization node (Publisher)
 */
function generateOrganizationNode(
  client: Client & { logoMedia?: Media | null },
  id: string,
  siteUrl: string
): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "Organization",
    "@id": id,
    name: client.name,
    ...(client.legalName && { legalName: client.legalName }),
    ...(client.url && { url: client.url }),
    ...(client.description && { description: client.description }),
  };

  // Logo (required for Article rich results)
  if (client.logoMedia) {
    node.logo = {
      "@type": "ImageObject",
      url: client.logoMedia.url,
      ...(client.logoMedia.width && { width: client.logoMedia.width }),
      ...(client.logoMedia.height && { height: client.logoMedia.height }),
    };
  }

  // Contact point
  if (client.email || client.phone) {
    node.contactPoint = {
      "@type": "ContactPoint",
      ...(client.contactType && { contactType: client.contactType }),
      ...(client.email && { email: client.email }),
      ...(client.phone && { telephone: client.phone }),
    };
  }

  // Address
  if (client.addressStreet || client.addressCity || client.addressCountry) {
    node.address = {
      "@type": "PostalAddress",
      ...(client.addressStreet && { streetAddress: client.addressStreet }),
      ...(client.addressCity && { addressLocality: client.addressCity }),
      ...(client.addressCountry && { addressCountry: client.addressCountry }),
      ...(client.addressPostalCode && { postalCode: client.addressPostalCode }),
    };
  }

  // Social profiles (sameAs)
  if (client.sameAs && client.sameAs.length > 0) {
    node.sameAs = client.sameAs;
  }

  // Founding date
  if (client.foundingDate) {
    node.foundingDate = client.foundingDate.toISOString().split("T")[0];
  }

  return node;
}

/**
 * Generate Person node (Author)
 */
function generatePersonNode(
  author: Author,
  id: string,
  siteUrl: string
): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "Person",
    "@id": id,
    name: author.name,
    ...(author.bio && { description: author.bio }),
    ...(author.image && { image: author.image }),
    ...(author.url && { url: author.url }),
    ...(author.jobTitle && { jobTitle: author.jobTitle }),
  };

  // Expertise areas (E-E-A-T)
  if (author.expertiseAreas && author.expertiseAreas.length > 0) {
    node.knowsAbout = author.expertiseAreas;
  }

  // Credentials (E-E-A-T)
  if (author.credentials && author.credentials.length > 0) {
    node.hasCredential = author.credentials;
  }

  // Professional memberships
  if (author.memberOf && author.memberOf.length > 0) {
    node.memberOf = author.memberOf.map((org) => ({
      "@type": "Organization",
      name: org,
    }));
  }

  // Social profiles (sameAs)
  const sameAs: string[] = [];
  if (author.linkedIn) sameAs.push(author.linkedIn);
  if (author.twitter) sameAs.push(author.twitter);
  if (author.facebook) sameAs.push(author.facebook);
  if (author.sameAs && author.sameAs.length > 0) {
    sameAs.push(...author.sameAs);
  }
  if (sameAs.length > 0) {
    node.sameAs = sameAs;
  }

  return node;
}

/**
 * Generate BreadcrumbList node
 */
function generateBreadcrumbNode(
  article: ArticleWithFullRelations,
  articleUrl: string,
  id: string,
  siteUrl: string
): JsonLdNode {
  const items: Array<{ "@type": string; position: number; name: string; item: string }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "الرئيسية",
      item: siteUrl,
    },
  ];

  // Add category if exists
  if (article.category) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: article.category.name,
      item: `${siteUrl}/categories/${article.category.slug}`,
    });
  }

  // Add article
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: article.title,
    item: articleUrl,
  });

  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items,
  };
}

/**
 * Generate FAQPage node
 */
function generateFAQNode(faqs: ArticleFAQ[], id: string): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: faqs
      .sort((a, b) => a.position - b.position)
      .map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
  };
}

/**
 * Convert Knowledge Graph to minified JSON string (for production)
 */
export function stringifyKnowledgeGraph(graph: JsonLdGraph): string {
  return JSON.stringify(graph);
}

/**
 * Convert Knowledge Graph to formatted JSON string (for preview)
 */
export function stringifyKnowledgeGraphPretty(graph: JsonLdGraph): string {
  return JSON.stringify(graph, null, 2);
}
