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
  validateOGTags,
  validateTwitterCards,
  validateTwitterImageAlt,
  validateCanonicalUrl,
} from "@/components/shared/seo-doctor/validators";
import type { SEOSettings } from "@/app/(dashboard)/settings/actions/settings-actions";

// Helper type for Media relations in validators
type MediaRelation = {
  url?: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
} | null | undefined;

// Client/Organization-specific validators
const validateName: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "good",
      message: "Client name is set",
      score: 5,
    };
  }
  return {
    status: "error",
    message: "Client name is required",
    score: 0,
  };
};

const validateLegalName: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "good",
      message: "Legal name set for Schema.org Organization",
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Legal name recommended for Schema.org structured data",
    score: 0,
  };
};

// Combined validator for URL: checks both URL format and HTTPS
const validateUrl: SEOFieldValidator = (value, data) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    const isValidUrl = /^https?:\/\/.+\..+/.test(value);
    const isHTTPS = value.toLowerCase().startsWith("https://");
    
    if (isValidUrl && isHTTPS) {
      return {
        status: "good",
        message: "Valid HTTPS URL provided - secure and SEO-friendly",
        score: 15, // 10 for URL + 5 for HTTPS
      };
    } else if (isValidUrl) {
      return {
        status: "warning",
        message: "URL format valid but should use HTTPS for security and SEO",
        score: 10, // URL valid but not HTTPS
      };
    }
    return {
      status: "warning",
      message: "URL format should be https://example.com",
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Website URL recommended for Schema.org",
    score: 0,
  };
};

// Combined validator for Logo: checks both logo presence and format
const validateLogo: SEOFieldValidator = (value, data) => {
  const logoMedia = data.logoMedia as MediaRelation;
  const logoUrl = (logoMedia?.url as string) || value || "";
  if (logoUrl && typeof logoUrl === "string" && logoUrl.trim().length > 0) {
    const logoUrlLower = logoUrl.toLowerCase();
    const isValidFormat = /\.(png|svg|jpg|jpeg|webp)$/i.test(logoUrlLower);
    const hasLogoAlt = logoMedia?.altText && typeof logoMedia.altText === "string" && logoMedia.altText.trim().length > 0;
    
    if (isValidFormat && hasLogoAlt) {
      return {
        status: "good",
        message: "Logo provided with valid format (PNG/SVG/JPG) and alt text - recommend min 112x112px for Google",
        score: 13, // 5 for logo + 8 for format with alt
      };
    } else if (isValidFormat) {
      return {
        status: "good",
        message: "Logo provided with valid format (PNG/SVG/JPG) - add alt text for accessibility and SEO, recommend min 112x112px",
        score: 10, // 5 for logo + 5 for format
      };
    } else {
      return {
        status: "warning",
        message: "Logo provided but should be PNG, SVG, or JPG format - recommend min 112x112px for Google rich results",
        score: 7, // 5 for logo + 2 for partial format
      };
    }
  }
  return {
    status: "warning",
    message: "Logo recommended for brand recognition - use PNG/SVG/JPG, min 112x112px for Google",
    score: 0,
  };
};

const validateLogoAlt: SEOFieldValidator = (value, data) => {
  const logoMedia = data.logoMedia as MediaRelation;
  const hasLogo = logoMedia?.url && typeof logoMedia.url === "string" && logoMedia.url.trim().length > 0;
  if (hasLogo) {
    if (logoMedia?.altText && typeof logoMedia.altText === "string" && logoMedia.altText.trim().length > 0) {
      return {
        status: "good",
        message: "Logo alt text provided - required for accessibility and SEO",
        score: 5,
      };
    }
    return {
      status: "error",
      message: "Logo alt text required when logo exists (accessibility + SEO)",
      score: 0,
    };
  }
  return {
    status: "info",
    message: "Logo alt text not needed (no logo provided)",
    score: 0,
  };
};

const validateSocialProfiles: SEOFieldValidator = (value, data) => {
  const sameAsArray = Array.isArray(value) ? value : [];
  if (sameAsArray.length > 0) {
    const socialCount = sameAsArray.length;
    if (socialCount >= 3) {
      return {
        status: "good",
        message: `Excellent! ${socialCount} social profiles added - great for Schema.org`,
        score: 10,
      };
    } else if (socialCount >= 2) {
      return {
        status: "good",
        message: `Good! ${socialCount} social profiles added`,
        score: 8,
      };
    } else {
      return {
        status: "warning",
        message: `Only ${socialCount} social profile - add more for better brand verification`,
        score: 5,
      };
    }
  }
  return {
    status: "warning",
    message: "Social profiles recommended for Schema.org sameAs property",
    score: 0,
  };
};

const validateBusinessBrief: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length >= 100) {
    return {
      status: "good",
      message: `Comprehensive business brief (${value.length} chars)`,
      score: 10,
    };
  } else if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "warning",
      message: `Business brief too short (${value.length} chars) - minimum 100 chars required`,
      score: 0,
    };
  }
  return {
    status: "error",
    message: "Business brief is required (minimum 100 chars) for content writers",
    score: 0,
  };
};

const validateContactInfo: SEOFieldValidator = (value, data) => {
  const hasEmail = data.email && typeof data.email === "string" && data.email.trim().length > 0;
  const hasPhone = data.phone && typeof data.phone === "string" && data.phone.trim().length > 0;
  if (hasEmail && hasPhone) {
    return {
      status: "good",
      message: "Email and phone provided - complete contact info",
      score: 10,
    };
  } else if (hasEmail || hasPhone) {
    return {
      status: "warning",
      message: "Partial contact info - add both email and phone for Schema.org",
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Contact information recommended for Schema.org Organization",
    score: 0,
  };
};

const validateGTMId: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    const isValidGTM = /^GTM-[A-Z0-9]+$/.test(value);
    if (isValidGTM) {
      return {
        status: "good",
        message: "Valid GTM ID - enables analytics tracking",
        score: 5,
      };
    }
    return {
      status: "warning",
      message: "GTM ID format should be GTM-XXXXXXX",
      score: 0,
    };
  }
  return {
    status: "info",
    message: "GTM ID optional - enables client to see article performance",
    score: 0,
  };
};

const validateFoundingDate: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "good",
      message: "Founding date set - improves Schema.org Organization data",
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Founding date recommended for Schema.org Organization",
    score: 0,
  };
};

const validateDescription: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length >= 100) {
    return {
      status: "good",
      message: `Comprehensive description (${value.length} chars) for Schema.org`,
      score: 10,
    };
  } else if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "warning",
      message: `Description too short (${value.length} chars) - minimum 100 chars recommended`,
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Organization description recommended (separate from SEO description) for Schema.org",
    score: 0,
  };
};

// Custom validators for Client that use Media relations
const validateOGImageForClient: SEOFieldValidator = (value, data) => {
  const ogImageMedia = data.ogImageMedia as MediaRelation;
  const ogImageUrl = (ogImageMedia?.url as string) || value || "";
  if (ogImageUrl && typeof ogImageUrl === "string" && ogImageUrl.trim().length > 0) {
    return {
      status: "good",
      message: "Open Graph image set for social sharing",
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "OG image recommended (1200x630px) for social media",
    score: 0,
  };
};

const validateOGImageAltForClient: SEOFieldValidator = (value, data) => {
  const ogImageMedia = data.ogImageMedia as MediaRelation;
  const hasOGImage = ogImageMedia?.url && typeof ogImageMedia.url === "string" && ogImageMedia.url.trim().length > 0;
  if (hasOGImage) {
    if (ogImageMedia?.altText && typeof ogImageMedia.altText === "string" && ogImageMedia.altText.trim().length > 0) {
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

const validateOGImageDimensionsForClient: SEOFieldValidator = (value, data) => {
  const ogImageMedia = data.ogImageMedia as MediaRelation;
  const hasOGImage = ogImageMedia?.url && typeof ogImageMedia.url === "string" && ogImageMedia.url.trim().length > 0;
  if (hasOGImage) {
    const hasWidth = ogImageMedia?.width && typeof ogImageMedia.width === "number";
    const hasHeight = ogImageMedia?.height && typeof ogImageMedia.height === "number";
    
    if (hasWidth && hasHeight) {
      const width = ogImageMedia.width as number;
      const height = ogImageMedia.height as number;
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

const validateTwitterImageAltForClient: SEOFieldValidator = (value, data) => {
  const twitterImageMedia = data.twitterImageMedia as MediaRelation;
  const hasTwitterImage = twitterImageMedia?.url && typeof twitterImageMedia.url === "string" && twitterImageMedia.url.trim().length > 0;
  if (hasTwitterImage) {
    if (twitterImageMedia?.altText && typeof twitterImageMedia.altText === "string" && twitterImageMedia.altText.trim().length > 0) {
      return {
        status: "good",
        message: "Twitter image alt text provided - required for accessibility and SEO",
        score: 5,
      };
    }
    return {
      status: "error",
      message: "Twitter image alt text required when Twitter image exists (accessibility + SEO)",
      score: 0,
    };
  }
  return {
    status: "info",
    message: "Twitter image alt text not needed (no Twitter image provided)",
    score: 0,
  };
};

// Combined validator factory for SEO Title: checks both SEO title quality and OG tags completeness
const createValidateSEOTitleAndOG = (settings?: SEOSettings): SEOFieldValidator => {
  return (value, data) => {
    // First check SEO title quality
    const seoTitleValidator = createValidateSEOTitle(settings);
    const seoTitleResult = seoTitleValidator(value, data);
    
    // Then check OG tags completeness
    const ogImageMedia = data.ogImageMedia as MediaRelation;
    const hasOGTitle = data.seoTitle && typeof data.seoTitle === "string" && data.seoTitle.trim().length > 0;
    const hasOGDescription = data.seoDescription && typeof data.seoDescription === "string" && data.seoDescription.trim().length > 0;
    const hasOGUrl = data.url && typeof data.url === "string" && data.url.trim().length > 0;
    const hasOGImage = ogImageMedia?.url && typeof ogImageMedia.url === "string" && ogImageMedia.url.trim().length > 0;
    const hasOGImageAlt = ogImageMedia?.altText && typeof ogImageMedia.altText === "string" && ogImageMedia.altText.trim().length > 0;
    const hasOGImageWidth = ogImageMedia?.width && typeof ogImageMedia.width === "number";
    const hasOGImageHeight = ogImageMedia?.height && typeof ogImageMedia.height === "number";
    
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

const validateContactPoint: SEOFieldValidator = (value, data) => {
  const hasContactType = data.contactType && typeof data.contactType === "string" && data.contactType.trim().length > 0;
  const hasContactInfo = (data.email && typeof data.email === "string" && data.email.trim().length > 0) || 
                         (data.phone && typeof data.phone === "string" && data.phone.trim().length > 0);
  
  if (hasContactType && hasContactInfo) {
    return {
      status: "good",
      message: "ContactPoint structured with contactType - better Schema.org compliance",
      score: 5,
    };
  } else if (hasContactInfo) {
    return {
      status: "warning",
      message: "Add contactType (e.g., customer service) for better Schema.org ContactPoint structure",
      score: 2,
    };
  }
  return {
    status: "warning",
    message: "ContactPoint structure recommended - add contactType and contact info",
    score: 0,
  };
};


const validateAddress: SEOFieldValidator = (value, data) => {
  const hasAddress = (data.addressStreet && typeof data.addressStreet === "string" && data.addressStreet.trim().length > 0) ||
                     (data.addressCity && typeof data.addressCity === "string" && data.addressCity.trim().length > 0) ||
                     (data.addressCountry && typeof data.addressCountry === "string" && data.addressCountry.trim().length > 0);
  
  if (hasAddress) {
    const addressComplete = data.addressStreet && data.addressCity && data.addressCountry;
    if (addressComplete) {
      return {
        status: "good",
        message: "Complete address provided - enables LocalBusiness schema for local SEO",
        score: 5,
      };
    }
    return {
      status: "warning",
      message: "Partial address - add street, city, and country for complete LocalBusiness schema",
      score: 2,
    };
  }
  return {
    status: "info",
    message: "Address optional - only needed for local businesses (enables LocalBusiness schema)",
    score: 0,
  };
};

// Generate Organization structured data
function generateOrganizationStructuredData(data: Record<string, unknown>): Record<string, unknown> {
  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: (data.name as string) || undefined,
  };

  if (data.legalName) structuredData.legalName = data.legalName as string;
  if (data.url) structuredData.url = data.url as string;
  const logoMedia = data.logoMedia as MediaRelation;
  const ogImageMedia = data.ogImageMedia as MediaRelation;
  if (logoMedia?.url) {
    structuredData.logo = logoMedia.url as string;
  }
  if (data.description) {
    structuredData.description = data.description as string;
  } else if (data.seoDescription) {
    structuredData.description = data.seoDescription as string;
  }
  if (data.foundingDate) {
    const dateValue = data.foundingDate;
    structuredData.foundingDate = typeof dateValue === "string" 
      ? dateValue.split("T")[0] 
      : (dateValue instanceof Date ? dateValue.toISOString().split("T")[0] : undefined);
  }

  // ContactPoint
  if (data.email || data.phone) {
    const contactPoint: Record<string, unknown> = {
      "@type": "ContactPoint",
    };
    if (data.contactType) contactPoint.contactType = data.contactType as string;
    if (data.email) contactPoint.email = data.email as string;
    if (data.phone) contactPoint.telephone = data.phone as string;
    structuredData.contactPoint = contactPoint;
  }

  // Address
  if (data.addressStreet || data.addressCity || data.addressCountry) {
    const address: Record<string, unknown> = {
      "@type": "PostalAddress",
    };
    if (data.addressStreet) address.streetAddress = data.addressStreet as string;
    if (data.addressCity) address.addressLocality = data.addressCity as string;
    if (data.addressCountry) address.addressCountry = data.addressCountry as string;
    if (data.addressPostalCode) address.postalCode = data.addressPostalCode as string;
    structuredData.address = address;
  }

  // Social profiles
  const sameAsArray = Array.isArray(data.sameAs) ? data.sameAs : [];
  if (sameAsArray.length > 0) {
    structuredData.sameAs = sameAsArray;
  }

  // Remove undefined values
  Object.keys(structuredData).forEach((key) => {
    if (structuredData[key] === undefined) delete structuredData[key];
  });

  return structuredData;
}

// Organization/Client SEO Configuration
export const createOrganizationSEOConfig = (settings?: SEOSettings): SEODoctorConfig => ({
  entityType: "Organization",
  maxScore: 200,
  generateStructuredData: generateOrganizationStructuredData,
  fields: [
    { name: "name", label: "Client Name", validator: validateName },
    { name: "slug", label: "Slug", validator: validateSlug },
    { name: "legalName", label: "Legal Name", validator: validateLegalName },
    { name: "url", label: "Website URL & HTTPS", validator: validateUrl },
    { name: "logo", label: "Logo & Format", validator: validateLogo },
    { name: "logoAlt", label: "Logo Alt Text", validator: validateLogoAlt },
    { name: "ogImage", label: "OG Image", validator: validateOGImageForClient },
    { name: "ogImageAlt", label: "OG Image Alt Text", validator: validateOGImageAltForClient },
    { name: "ogImageWidth", label: "OG Image Dimensions", validator: validateOGImageDimensionsForClient },
    { name: "seoTitle", label: "SEO Title & Open Graph", validator: createValidateSEOTitleAndOG(settings) },
    { name: "seoDescription", label: "SEO Description", validator: createValidateSEODescription(settings) },
    { name: "sameAs", label: "Social Profiles", validator: validateSocialProfiles },
    { name: "businessBrief", label: "Business Brief", validator: validateBusinessBrief },
    { name: "email", label: "Contact Information", validator: validateContactInfo },
    { name: "gtmId", label: "Google Tag Manager", validator: validateGTMId },
    { name: "foundingDate", label: "Founding Date", validator: validateFoundingDate },
    { name: "description", label: "Organization Description", validator: validateDescription },
    { name: "contactType", label: "ContactPoint Structure", validator: validateContactPoint },
    { name: "twitterCard", label: "Twitter Cards", validator: validateTwitterCards },
    { name: "twitterTitle", label: "Twitter Title", validator: createValidateTwitterTitle(settings) },
    { name: "twitterDescription", label: "Twitter Description", validator: createValidateTwitterDescription(settings) },
    { name: "twitterImageAlt", label: "Twitter Image Alt Text", validator: validateTwitterImageAltForClient },
    { name: "canonicalUrl", label: "Canonical URL", validator: validateCanonicalUrl },
    { name: "addressStreet", label: "Address (Local SEO)", validator: validateAddress },
  ],
});

// Backward compatibility - default config without settings
export const organizationSEOConfig: SEODoctorConfig = createOrganizationSEOConfig();
