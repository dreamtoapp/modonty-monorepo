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
  validateTwitterCards,
  validateTwitterImageAlt,
  validateCanonicalUrl,
} from "@/components/shared/seo-doctor/validators";
import type { SEOSettings } from "@/app/(dashboard)/settings/actions/settings-actions";

// Tag-specific validators
const validateTagName: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "good",
      message: "Tag name is set",
      score: 5,
    };
  }
  return {
    status: "error",
    message: "Tag name is required",
    score: 0,
  };
};

const validateTagDescription: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length >= 100) {
    return {
      status: "good",
      message: `Comprehensive tag description (${value.length} chars)`,
      score: 10,
    };
  } else if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "warning",
      message: `Tag description too short (${value.length} chars) - minimum 100 chars recommended`,
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Tag description recommended (minimum 100 chars) for SEO",
    score: 0,
  };
};

// Combined validator factory for Tag SEO Title: checks both SEO title quality and OG tags completeness
const createValidateTagSEOTitleAndOG = (settings?: SEOSettings): SEOFieldValidator => {
  return (value, data) => {
    // First check SEO title quality
    const seoTitleValidator = createValidateSEOTitle(settings);
    const seoTitleResult = seoTitleValidator(value, data);
    
    // Then check OG tags completeness
    const hasOGTitle = data.seoTitle && typeof data.seoTitle === "string" && data.seoTitle.trim().length > 0;
    const hasOGDescription = data.seoDescription && typeof data.seoDescription === "string" && data.seoDescription.trim().length > 0;
    const hasOGUrl = data.canonicalUrl && typeof data.canonicalUrl === "string" && data.canonicalUrl.trim().length > 0;
    const hasOGImage = data.ogImage && typeof data.ogImage === "string" && data.ogImage.trim().length > 0;
    const hasOGImageAlt = data.ogImageAlt && typeof data.ogImageAlt === "string" && data.ogImageAlt.trim().length > 0;
    const hasOGImageWidth = data.ogImageWidth && typeof data.ogImageWidth === "number";
    const hasOGImageHeight = data.ogImageHeight && typeof data.ogImageHeight === "number";
    
    let ogScore = 0;
    let ogMessage = "";
    
    if (hasOGTitle && hasOGDescription && hasOGUrl && hasOGImage) {
      ogMessage = "All essential OG tags can be generated (title, description, url, image, type)";
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
      if (!hasOGUrl) missing.push("og:url");
      if (!hasOGImage) missing.push("og:image");
      if (hasOGImage && !hasOGImageAlt) missing.push("og:image:alt");
      if (hasOGImage && !hasOGImageWidth) missing.push("og:image:width");
      if (hasOGImage && !hasOGImageHeight) missing.push("og:image:height");
      
      ogScore = (hasOGTitle ? 3 : 0) + (hasOGDescription ? 3 : 0) + (hasOGUrl ? 2 : 0) + (hasOGImage ? 2 : 0) + 
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

// Generate Tag structured data
function generateTagStructuredData(data: Record<string, unknown>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: (data.name as string) || "",
    description: (data.description as string) || undefined,
    url: data.canonicalUrl ? (data.canonicalUrl as string) : undefined,
    about: {
      "@type": "DefinedTerm",
      name: (data.name as string) || "",
      description: (data.description as string) || undefined,
    },
  };
}

// Tag SEO Configuration
export const createTagSEOConfig = (settings?: SEOSettings): SEODoctorConfig => ({
  entityType: "Tag",
  maxScore: 100,
  generateStructuredData: generateTagStructuredData,
  fields: [
    { name: "name", label: "Tag Name", validator: validateTagName },
    { name: "slug", label: "Slug", validator: validateSlug },
    { name: "description", label: "Tag Description", validator: validateTagDescription },
    { name: "seoTitle", label: "SEO Title & Open Graph", validator: createValidateTagSEOTitleAndOG(settings) },
    { name: "seoDescription", label: "SEO Description", validator: createValidateSEODescription(settings) },
    { name: "ogImage", label: "OG Image", validator: validateOGImage },
    { name: "ogImageAlt", label: "OG Image Alt Text", validator: validateOGImageAlt },
    { name: "ogImageWidth", label: "OG Image Dimensions", validator: validateOGImageDimensions },
    { name: "twitterCard", label: "Twitter Cards", validator: validateTwitterCards },
    { name: "twitterTitle", label: "Twitter Title", validator: createValidateTwitterTitle(settings) },
    { name: "twitterDescription", label: "Twitter Description", validator: createValidateTwitterDescription(settings) },
    { name: "twitterImageAlt", label: "Twitter Image Alt Text", validator: validateTwitterImageAlt },
    { name: "canonicalUrl", label: "Canonical URL", validator: validateCanonicalUrl },
  ],
});

// Backward compatibility - default config without settings
export const tagSEOConfig: SEODoctorConfig = createTagSEOConfig();
