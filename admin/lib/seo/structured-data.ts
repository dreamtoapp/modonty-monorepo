import { Article, Client, Author, Category, FAQ } from "@prisma/client";
import { ArticleStructuredData } from "@/lib/types";

interface ArticleWithRelations extends Article {
  client: Client & {
    logoMedia?: { url: string } | null;
  };
  author: Author;
  category?: Category | null;
  faqs?: FAQ[];
  featuredImage?: { url: string; altText?: string | null } | null;
}

export function generateArticleStructuredData(article: ArticleWithRelations): ArticleStructuredData {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com";
  const articleUrl = article.canonicalUrl || `${siteUrl}/articles/${article.slug}`;

  const structuredData: ArticleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription || article.excerpt || "",
    image: article.featuredImage?.url || undefined,
    datePublished: article.datePublished?.toISOString(),
    dateModified: article.dateModified.toISOString(),
    author: {
      "@type": "Person",
      name: article.author.name || "Modonty",
      ...(article.author.url && { url: article.author.url }),
      ...(article.author.image && { image: article.author.image }),
    },
    publisher: {
      "@type": "Organization",
      name: article.client.name,
      ...(article.client.logoMedia?.url && { logo: { "@type": "ImageObject", url: article.client.logoMedia.url } }),
      ...(article.client.url && { url: article.client.url }),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(article.category && {
      articleSection: article.category.name,
    }),
    ...(article.wordCount && { wordCount: article.wordCount }),
    inLanguage: article.inLanguage || "ar",
    isAccessibleForFree: article.isAccessibleForFree ?? true,
    ...(article.license && { license: article.license }),
  };

  if (article.faqs && article.faqs.length > 0) {
    structuredData.mainEntity = {
      "@type": "FAQPage",
      mainEntity: article.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  }

  return structuredData;
}

export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

import { PersonStructuredData } from "@/lib/types";

export function generateAuthorStructuredData(author: Author): PersonStructuredData {
  const structuredData: PersonStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    ...(author.bio && { description: author.bio }),
    ...(author.image && { image: author.image }),
    ...(author.url && { url: author.url }),
    ...(author.jobTitle && { jobTitle: author.jobTitle }),
    ...(author.expertiseAreas && author.expertiseAreas.length > 0 && {
      knowsAbout: author.expertiseAreas,
    }),
    ...(author.credentials && author.credentials.length > 0 && {
      hasCredential: author.credentials,
    }),
  };

  const sameAs: string[] = [];
  if (author.linkedIn) sameAs.push(author.linkedIn);
  if (author.twitter) sameAs.push(author.twitter);
  if (author.facebook) sameAs.push(author.facebook);
  if (author.sameAs && author.sameAs.length > 0) {
    sameAs.push(...author.sameAs);
  }
  if (sameAs.length > 0) {
    structuredData.sameAs = sameAs;
  }

  return structuredData;
}

import { OrganizationStructuredData } from "@/lib/types";

export function generateOrganizationStructuredData(client: Client & {
  logoMedia?: { url: string } | null;
}): OrganizationStructuredData {
  const structuredData: OrganizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: client.name,
    ...(client.legalName && { legalName: client.legalName }),
    ...(client.url && { url: client.url }),
    ...(client.logoMedia?.url && { logo: { "@type": "ImageObject", url: client.logoMedia.url } }),
    ...(client.description && { description: client.description }),
    ...(!client.description && client.seoDescription && { description: client.seoDescription }),
    ...(client.foundingDate && { foundingDate: client.foundingDate.toISOString().split("T")[0] }),
  };

  // ContactPoint structure
  if (client.email || client.phone) {
    const contactPoint: {
      "@type": "ContactPoint";
      contactType?: string;
      email?: string;
      telephone?: string;
    } = {
      "@type": "ContactPoint",
    };
    if (client.contactType) {
      contactPoint.contactType = client.contactType;
    }
    if (client.email) {
      contactPoint.email = client.email;
    }
    if (client.phone) {
      contactPoint.telephone = client.phone;
    }
    structuredData.contactPoint = contactPoint;
  }

  // Address structure (for LocalBusiness)
  if (client.addressStreet || client.addressCity || client.addressCountry) {
    const address: {
      "@type": "PostalAddress";
      streetAddress?: string;
      addressLocality?: string;
      addressCountry?: string;
      postalCode?: string;
    } = {
      "@type": "PostalAddress",
    };
    if (client.addressStreet) address.streetAddress = client.addressStreet;
    if (client.addressCity) address.addressLocality = client.addressCity;
    if (client.addressCountry) address.addressCountry = client.addressCountry;
    if (client.addressPostalCode) address.postalCode = client.addressPostalCode;
    structuredData.address = address;
  }

  if (client.sameAs && client.sameAs.length > 0) {
    structuredData.sameAs = client.sameAs;
  }

  return structuredData;
}

export function generateFAQPageStructuredData(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
