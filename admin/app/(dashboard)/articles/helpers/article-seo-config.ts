import { SEODoctorConfig, SEOFieldValidator } from "@/components/shared/seo-doctor";
import {
  validateSlug,
  createValidateSEOTitle,
  createValidateSEODescription,
  createValidateTwitterTitle,
  createValidateTwitterDescription,
  validateOGImage,
  validateOGImageAlt,
  validateOGImageDimensions,
  validateCanonicalUrl,
  validateTwitterImageAlt,
  validateImageAlt,
} from "@/components/shared/seo-doctor/validators";
import type { SEOSettings } from "@/app/(dashboard)/settings/actions/settings-actions";

// Helper type for Media relations in validators
type MediaRelation = {
  url?: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
} | null | undefined;

// Article-specific validators
const validateArticleTitle: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "good",
      message: "Article title is set",
      score: 5,
    };
  }
  return {
    status: "error",
    message: "Article title is required",
    score: 0,
  };
};

const validateArticleContent: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount >= 300) {
      return {
        status: "good",
        message: `Article content has ${wordCount} words - good depth for SEO`,
        score: 10,
      };
    } else if (wordCount >= 200) {
      return {
        status: "warning",
        message: `Article content has ${wordCount} words - aim for 300+ words for better SEO`,
        score: 5,
      };
    }
    return {
      status: "warning",
      message: `Article content too short (${wordCount} words) - minimum 300 words recommended`,
      score: 2,
    };
  }
  return {
    status: "error",
    message: "Article content is required",
    score: 0,
  };
};

// Custom validators for Article that use Media relations
const validateOGImageAltForArticle: SEOFieldValidator = (value, data) => {
  const featuredImage = data.featuredImage as MediaRelation;
  const hasOGImage = featuredImage?.url && typeof featuredImage.url === "string" && featuredImage.url.trim().length > 0;
  if (hasOGImage) {
    if (featuredImage?.altText && typeof featuredImage.altText === "string" && featuredImage.altText.trim().length > 0) {
      return {
        status: "good",
        message: "OG image alt text provided - required for accessibility and SEO",
        score: 5,
      };
    }
    return {
      status: "error",
      message: "OG image alt text required when OG image exists (accessibility + SEO)",
      score: 0,
    };
  }
  return {
    status: "info",
    message: "OG image alt text not needed (no OG image provided)",
    score: 0,
  };
};

const validateOGImageDimensionsForArticle: SEOFieldValidator = (value, data) => {
  const featuredImage = data.featuredImage as MediaRelation;
  const hasOGImage = featuredImage?.url && typeof featuredImage.url === "string" && featuredImage.url.trim().length > 0;
  if (hasOGImage) {
    const hasWidth = featuredImage?.width && typeof featuredImage.width === "number";
    const hasHeight = featuredImage?.height && typeof featuredImage.height === "number";
    
    if (hasWidth && hasHeight) {
      const width = featuredImage.width as number;
      const height = featuredImage.height as number;
      if (width === 1200 && height === 630) {
        return {
          status: "good",
          message: "OG image dimensions optimal (1200x630px) - perfect for social sharing",
          score: 5,
        };
      } else if (width >= 600 && height >= 314) {
        return {
          status: "warning",
          message: `OG image dimensions (${width}x${height}px) - recommend 1200x630px for best results`,
          score: 3,
        };
      } else {
        return {
          status: "warning",
          message: `OG image dimensions (${width}x${height}px) too small - minimum 600x314px, recommend 1200x630px`,
          score: 1,
        };
      }
    } else if (hasWidth || hasHeight) {
      return {
        status: "warning",
        message: "OG image dimensions incomplete - both width and height needed",
        score: 1,
      };
    } else {
      return {
        status: "warning",
        message: "OG image dimensions missing - add width and height (1200x630px recommended)",
        score: 0,
      };
    }
  }
  return {
    status: "info",
    message: "OG image dimensions not needed (no OG image provided)",
    score: 0,
  };
};

const validateFeaturedImage: SEOFieldValidator = (value, data) => {
  const featuredImage = data.featuredImage as MediaRelation;
  const hasImage = featuredImage?.url && typeof featuredImage.url === "string" && featuredImage.url.trim().length > 0;
  if (hasImage) {
    const hasAlt = featuredImage?.altText && typeof featuredImage.altText === "string" && featuredImage.altText.trim().length > 0;
    if (hasAlt) {
      return {
        status: "good",
        message: "Featured image with alt text provided - required for SEO",
        score: 10,
      };
    }
    return {
      status: "error",
      message: "Featured image alt text required when image exists (accessibility + SEO)",
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Featured image recommended (1200x630px) for social sharing and SEO",
    score: 0,
  };
};

const validateArticleDatePublished: SEOFieldValidator = (value, data) => {
  if (data.status === "PUBLISHED") {
    if (value) {
      return {
        status: "good",
        message: "Publication date set - required for published articles",
        score: 10,
      };
    }
    return {
      status: "error",
      message: "Publication date required for published articles",
      score: 0,
    };
  }
  return {
    status: "info",
    message: "Publication date will be set when article is published",
    score: 0,
  };
};

const validateArticleCategory: SEOFieldValidator = (value, data) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "good",
      message: "Category assigned - improves organization and SEO",
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Category recommended - improves organization and SEO",
    score: 0,
  };
};

const validateArticleOGTags: SEOFieldValidator = (value, data) => {
  const featuredImage = data.featuredImage as MediaRelation;
  const hasOGTitle = data.seoTitle && typeof data.seoTitle === "string" && data.seoTitle.trim().length > 0;
  const hasOGDescription = data.seoDescription && typeof data.seoDescription === "string" && data.seoDescription.trim().length > 0;
  const hasOGImage = featuredImage?.url && typeof featuredImage.url === "string" && featuredImage.url.trim().length > 0;
  const hasOGImageAlt = featuredImage?.altText && typeof featuredImage.altText === "string" && featuredImage.altText.trim().length > 0;
  const hasOGImageWidth = featuredImage?.width && typeof featuredImage.width === "number";
  const hasOGImageHeight = featuredImage?.height && typeof featuredImage.height === "number";
  
  if (hasOGTitle && hasOGDescription && hasOGImage) {
    let message = "All essential OG tags can be generated";
    let score = 10;
    
    if (hasOGImageAlt && hasOGImageWidth && hasOGImageHeight) {
      message += " - Complete with alt text and dimensions";
      score = 15;
    } else if (hasOGImageAlt) {
      message += " - Add image dimensions (1200x630px recommended)";
      score = 12;
    } else if (hasOGImageWidth && hasOGImageHeight) {
      message += " - Add image alt text for accessibility";
      score = 12;
    } else {
      message += " - Add image alt text and dimensions for complete coverage";
    }
    
    return {
      status: "good",
      message,
      score,
    };
  }
  
  const missing = [];
  if (!hasOGTitle) missing.push("og:title");
  if (!hasOGDescription) missing.push("og:description");
  if (!hasOGImage) missing.push("og:image");
  if (hasOGImage && !hasOGImageAlt) missing.push("og:image:alt");
  if (hasOGImage && !hasOGImageWidth) missing.push("og:image:width");
  if (hasOGImage && !hasOGImageHeight) missing.push("og:image:height");
  
  const partialScore = (hasOGTitle ? 3 : 0) + (hasOGDescription ? 3 : 0) + (hasOGImage ? 2 : 0) + 
                      (hasOGImageAlt ? 2 : 0) + (hasOGImageWidth ? 1 : 0) + (hasOGImageHeight ? 1 : 0);
  return {
    status: "warning",
    message: `Missing OG tags: ${missing.join(", ")} - add missing fields for complete social sharing`,
    score: partialScore,
  };
};

// Combined validator factory for Article SEO Title: checks both SEO title quality and OG tags completeness
const createValidateArticleSEOTitleAndOG = (settings?: SEOSettings): SEOFieldValidator => {
  return (value, data) => {
    // First check SEO title quality
    const seoTitleValidator = createValidateSEOTitle(settings);
    const seoTitleResult = seoTitleValidator(value, data);
    
    // Then check OG tags completeness
    const featuredImage = data.featuredImage as MediaRelation;
    const hasOGTitle = data.seoTitle && typeof data.seoTitle === "string" && data.seoTitle.trim().length > 0;
    const hasOGDescription = data.seoDescription && typeof data.seoDescription === "string" && data.seoDescription.trim().length > 0;
    const hasOGImage = featuredImage?.url && typeof featuredImage.url === "string" && featuredImage.url.trim().length > 0;
    const hasOGImageAlt = featuredImage?.altText && typeof featuredImage.altText === "string" && featuredImage.altText.trim().length > 0;
    const hasOGImageWidth = featuredImage?.width && typeof featuredImage.width === "number";
    const hasOGImageHeight = featuredImage?.height && typeof featuredImage.height === "number";
    
    let ogScore = 0;
    let ogMessage = "";
    
    if (hasOGTitle && hasOGDescription && hasOGImage) {
      ogMessage = "All essential OG tags can be generated";
      ogScore = 10;
      
      if (hasOGImageAlt && hasOGImageWidth && hasOGImageHeight) {
        ogMessage += " - Complete with alt text and dimensions";
        ogScore = 15;
      } else if (hasOGImageAlt) {
        ogMessage += " - Add image dimensions (1200x630px recommended)";
        ogScore = 12;
      } else if (hasOGImageWidth && hasOGImageHeight) {
        ogMessage += " - Add image alt text for accessibility";
        ogScore = 12;
      } else {
        ogMessage += " - Add image alt text and dimensions for complete coverage";
      }
    } else {
      const missing = [];
      if (!hasOGTitle) missing.push("og:title");
      if (!hasOGDescription) missing.push("og:description");
      if (!hasOGImage) missing.push("og:image");
      if (hasOGImage && !hasOGImageAlt) missing.push("og:image:alt");
      if (hasOGImage && !hasOGImageWidth) missing.push("og:image:width");
      if (hasOGImage && !hasOGImageHeight) missing.push("og:image:height");
      
      ogScore = (hasOGTitle ? 3 : 0) + (hasOGDescription ? 3 : 0) + (hasOGImage ? 2 : 0) + 
                (hasOGImageAlt ? 2 : 0) + (hasOGImageWidth ? 1 : 0) + (hasOGImageHeight ? 1 : 0);
      ogMessage = `Missing OG tags: ${missing.join(", ")} - add missing fields for complete social sharing`;
    }
    
    // Combine scores (SEO title is primary, OG tags are bonus)
    const totalScore = seoTitleResult.score + ogScore;
    
    // Determine overall status
    let status: "good" | "warning" | "error" = "good";
    if (seoTitleResult.status === "error" || totalScore < 10) {
      status = "error";
    } else if (seoTitleResult.status === "warning" || totalScore < 20) {
      status = "warning";
    }
    
    return {
      status,
      message: `${seoTitleResult.message}. ${ogMessage}`,
      score: totalScore,
    };
  };
};

const validateArticleTwitterCards: SEOFieldValidator = (value, data) => {
  const hasTwitterCard = data.twitterCard && typeof data.twitterCard === "string" && data.twitterCard.trim().length > 0;
  const hasTwitterTitle = data.twitterTitle && typeof data.twitterTitle === "string" && data.twitterTitle.trim().length > 0;
  const hasTwitterDesc = data.twitterDescription && typeof data.twitterDescription === "string" && data.twitterDescription.trim().length > 0;
  const hasTwitterImg = data.twitterImage && typeof data.twitterImage === "string" && data.twitterImage.trim().length > 0;
  const hasTwitterImageAlt = data.twitterImageAlt && typeof data.twitterImageAlt === "string" && data.twitterImageAlt.trim().length > 0;
  const featuredImage = data.featuredImage as MediaRelation;
  const canAutoGenerate = data.seoTitle && data.seoDescription && featuredImage?.url;
  
  if (hasTwitterCard && hasTwitterTitle && hasTwitterDesc && hasTwitterImg) {
    let message = "Complete Twitter Cards configured - optimal for social SEO";
    let score = 10;
    
    if (hasTwitterImageAlt) {
      message += " - Includes alt text for accessibility";
      score = 15;
    } else {
      message += " - Add image alt text for accessibility and SEO";
    }
    
    return {
      status: "good",
      message,
      score,
    };
  } else if (canAutoGenerate) {
    return {
      status: "warning",
      message: "Twitter Cards can be auto-generated from existing fields - add for better social SEO",
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Twitter Cards recommended for social SEO signals - improves engagement and CTR",
    score: 0,
  };
};

const validateLastReviewed: SEOFieldValidator = (value) => {
  if (value) {
    return {
      status: "good",
      message: "Last reviewed date set - shows content freshness for SEO",
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Last reviewed date recommended - update when content is reviewed/updated",
    score: 0,
  };
};

// Generate Article structured data
function generateArticleStructuredData(data: Record<string, unknown>): Record<string, unknown> {
  const getDateString = (dateValue: unknown): string | undefined => {
    if (!dateValue) return undefined;
    if (typeof dateValue === "string") return dateValue.split("T")[0];
    if (dateValue instanceof Date) return dateValue.toISOString().split("T")[0];
    return undefined;
  };

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: (data.title as string) || "",
    dateModified: getDateString(data.dateModified) || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: (data.authorName as string) || "",
      url: (data.authorUrl as string) || undefined,
    },
    publisher: {
      "@type": "Organization",
      name: (data.publisherName as string) || "",
      logo: data.publisherLogo ? {
        "@type": "ImageObject",
        url: data.publisherLogo as string,
      } : undefined,
    },
  };

  if (data.excerpt || data.description) {
    structuredData.description = (data.excerpt || data.description) as string;
  }
  const featuredImage = data.featuredImage as MediaRelation;
  if (featuredImage?.url) {
    structuredData.image = featuredImage.url as string;
  }
  if (data.datePublished) {
    structuredData.datePublished = getDateString(data.datePublished);
  }
  if (data.canonicalUrl) {
    structuredData.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": data.canonicalUrl as string,
    };
  }
  if (data.categoryName) {
    structuredData.articleSection = data.categoryName as string;
  }
  if (data.wordCount) {
    structuredData.wordCount = data.wordCount as number;
  }
  if (data.inLanguage) {
    structuredData.inLanguage = data.inLanguage as string;
  }

  return structuredData;
}

// Article SEO Configuration
export const createArticleSEOConfig = (settings?: SEOSettings): SEODoctorConfig => ({
  entityType: "Article",
  maxScore: 200,
  generateStructuredData: generateArticleStructuredData,
  fields: [
    { name: "title", label: "Article Title", validator: validateArticleTitle },
    { name: "slug", label: "Slug", validator: validateSlug },
    { name: "content", label: "Content (Word Count)", validator: validateArticleContent },
    { name: "seoTitle", label: "SEO Title & Open Graph", validator: createValidateArticleSEOTitleAndOG(settings) },
    { name: "seoDescription", label: "SEO Description", validator: createValidateSEODescription(settings) },
    { name: "featuredImageId", label: "Featured Image", validator: validateFeaturedImage },
    { name: "ogImageAlt", label: "OG Image Alt Text", validator: validateOGImageAltForArticle },
    { name: "ogImageWidth", label: "OG Image Dimensions", validator: validateOGImageDimensionsForArticle },
    { name: "datePublished", label: "Date Published", validator: validateArticleDatePublished },
    { name: "lastReviewed", label: "Last Reviewed", validator: validateLastReviewed },
    { name: "categoryId", label: "Category", validator: validateArticleCategory },
    { name: "twitterCard", label: "Twitter Cards", validator: validateArticleTwitterCards },
    { name: "twitterTitle", label: "Twitter Title", validator: createValidateTwitterTitle(settings) },
    { name: "twitterDescription", label: "Twitter Description", validator: createValidateTwitterDescription(settings) },
    { name: "twitterImageAlt", label: "Twitter Image Alt Text", validator: validateTwitterImageAlt },
    { name: "canonicalUrl", label: "Canonical URL", validator: validateCanonicalUrl },
  ],
});

// Backward compatibility - default config without settings
export const articleSEOConfig: SEODoctorConfig = createArticleSEOConfig();
