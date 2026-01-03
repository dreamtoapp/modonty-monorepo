import { SEOFieldConfig, SEODoctorConfig, SEOFieldValidator } from "./seo-doctor";
import { OrganizationStructuredData, ArticleStructuredData, PersonStructuredData } from "@/lib/types";

// Validator functions for Organization/Client fields

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

const validateSlug: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "good",
      message: "URL-friendly slug is set",
      score: 5,
    };
  }
  return {
    status: "error",
    message: "Slug is required (auto-generated from name)",
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

const validateUrl: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    const isValidUrl = /^https?:\/\/.+\..+/.test(value);
    if (isValidUrl) {
      return {
        status: "good",
        message: "Valid website URL provided",
        score: 10,
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

const validateLogo: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "good",
      message: "Logo URL provided",
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Logo recommended for brand recognition",
    score: 0,
  };
};

const validateOGImage: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
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

const validateSEOTitle: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    const titleLength = value.length;
    if (titleLength >= 50 && titleLength <= 60) {
      return {
        status: "good",
        message: `Perfect length (${titleLength} chars) - optimal for search results`,
        score: 15,
      };
    } else if (titleLength >= 30 && titleLength < 50) {
      return {
        status: "warning",
        message: `Too short (${titleLength} chars) - aim for 50-60 chars for better visibility`,
        score: 10,
      };
    } else if (titleLength > 60 && titleLength <= 70) {
      return {
        status: "warning",
        message: `Slightly long (${titleLength} chars) - may be truncated in search results`,
        score: 12,
      };
    } else if (titleLength > 70) {
      return {
        status: "warning",
        message: `Too long (${titleLength} chars) - will be truncated, aim for 50-60 chars`,
        score: 8,
      };
    } else {
      return {
        status: "error",
        message: `Too short (${titleLength} chars) - minimum 30 chars recommended`,
        score: 5,
      };
    }
  }
  return {
    status: "error",
    message: "SEO title is missing - critical for search visibility",
    score: 0,
  };
};

const validateSEODescription: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    const descLength = value.length;
    if (descLength >= 150 && descLength <= 160) {
      return {
        status: "good",
        message: `Perfect length (${descLength} chars) - optimal for search snippets`,
        score: 15,
      };
    } else if (descLength >= 120 && descLength < 150) {
      return {
        status: "warning",
        message: `Good but could be longer (${descLength} chars) - aim for 150-160 chars`,
        score: 12,
      };
    } else if (descLength > 160 && descLength <= 180) {
      return {
        status: "warning",
        message: `Slightly long (${descLength} chars) - may be truncated, aim for 150-160 chars`,
        score: 10,
      };
    } else if (descLength > 180) {
      return {
        status: "warning",
        message: `Too long (${descLength} chars) - will be truncated, aim for 150-160 chars`,
        score: 8,
      };
    } else {
      return {
        status: "error",
        message: `Too short (${descLength} chars) - minimum 120 chars recommended`,
        score: 5,
      };
    }
  }
  return {
    status: "error",
    message: "SEO description is missing - critical for click-through rate",
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

const validateOGTags: SEOFieldValidator = (value, data) => {
  const hasOGTitle = data.seoTitle && typeof data.seoTitle === "string" && data.seoTitle.trim().length > 0;
  const hasOGDescription = data.seoDescription && typeof data.seoDescription === "string" && data.seoDescription.trim().length > 0;
  const hasOGUrl = data.url && typeof data.url === "string" && data.url.trim().length > 0;
  const hasOGImage = data.ogImage && typeof data.ogImage === "string" && data.ogImage.trim().length > 0;
  const hasOGImageAlt = data.ogImageAlt && typeof data.ogImageAlt === "string" && data.ogImageAlt.trim().length > 0;
  const hasOGImageWidth = data.ogImageWidth && typeof data.ogImageWidth === "number";
  const hasOGImageHeight = data.ogImageHeight && typeof data.ogImageHeight === "number";
  
  if (hasOGTitle && hasOGDescription && hasOGUrl && hasOGImage) {
    let message = "All essential OG tags can be generated (title, description, url, image, type)";
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
  if (!hasOGUrl) missing.push("og:url");
  if (!hasOGImage) missing.push("og:image");
  if (hasOGImage && !hasOGImageAlt) missing.push("og:image:alt");
  if (hasOGImage && !hasOGImageWidth) missing.push("og:image:width");
  if (hasOGImage && !hasOGImageHeight) missing.push("og:image:height");
  
  const partialScore = (hasOGTitle ? 3 : 0) + (hasOGDescription ? 3 : 0) + (hasOGUrl ? 2 : 0) + (hasOGImage ? 2 : 0) + 
                      (hasOGImageAlt ? 2 : 0) + (hasOGImageWidth ? 1 : 0) + (hasOGImageHeight ? 1 : 0);
  return {
    status: "warning",
    message: `Missing OG tags: ${missing.join(", ")} - add missing fields for complete social sharing`,
    score: partialScore,
  };
};

const validateHTTPS: SEOFieldValidator = (value, data) => {
  const url = data.url;
  if (url && typeof url === "string" && url.trim().length > 0) {
    const isHTTPS = url.toLowerCase().startsWith("https://");
    if (isHTTPS) {
      return {
        status: "good",
        message: "Website uses HTTPS - secure and SEO-friendly",
        score: 5,
      };
    }
    return {
      status: "warning",
      message: "Website should use HTTPS for security and SEO - Google prefers secure sites",
      score: 0,
    };
  }
  return {
    status: "info",
    message: "HTTPS validation requires website URL",
    score: 0,
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

const validateLogoFormat: SEOFieldValidator = (value, data) => {
  const logo = data.logo;
  if (logo && typeof logo === "string" && logo.trim().length > 0) {
    const logoUrl = logo.toLowerCase();
    const isValidFormat = /\.(png|svg|jpg|jpeg|webp)$/i.test(logoUrl);
    const hasLogoAlt = data.logoAlt && typeof data.logoAlt === "string" && data.logoAlt.trim().length > 0;
    
    if (isValidFormat) {
      let message = "Logo format valid (PNG/SVG/JPG) - recommend min 112x112px for Google";
      let score = 5;
      
      if (hasLogoAlt) {
        message += " - Includes alt text for accessibility";
        score = 8;
      } else {
        message += " - Add alt text for accessibility and SEO";
      }
      
      return {
        status: "good",
        message,
        score,
      };
    }
    return {
      status: "warning",
      message: "Logo should be PNG, SVG, or JPG format - recommend min 112x112px for Google rich results",
      score: 2,
    };
  }
  return {
    status: "warning",
    message: "Logo recommended - use PNG/SVG/JPG, min 112x112px for Google",
    score: 0,
  };
};

const validateTwitterCards: SEOFieldValidator = (value, data) => {
  const hasTwitterCard = data.twitterCard && typeof data.twitterCard === "string" && data.twitterCard.trim().length > 0;
  const hasTwitterTitle = data.twitterTitle && typeof data.twitterTitle === "string" && data.twitterTitle.trim().length > 0;
  const hasTwitterDesc = data.twitterDescription && typeof data.twitterDescription === "string" && data.twitterDescription.trim().length > 0;
  const hasTwitterImg = data.twitterImage && typeof data.twitterImage === "string" && data.twitterImage.trim().length > 0;
  const hasTwitterImageAlt = data.twitterImageAlt && typeof data.twitterImageAlt === "string" && data.twitterImageAlt.trim().length > 0;
  const canAutoGenerate = data.seoTitle && data.seoDescription && data.ogImage;
  
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

const validateCanonicalUrl: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    const isValidCanonical = /^https?:\/\/.+\..+/.test(value);
    if (isValidCanonical) {
      return {
        status: "good",
        message: "Canonical URL set - prevents duplicate content issues",
        score: 5,
      };
    }
    return {
      status: "warning",
      message: "Canonical URL format invalid - should be full URL (https://example.com/page)",
      score: 0,
    };
  }
  return {
    status: "warning",
    message: "Canonical URL recommended - prevents duplicate content and consolidates ranking signals",
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

// Image Alt Text Validators (New Fields)
const validateLogoAlt: SEOFieldValidator = (value, data) => {
  const hasLogo = data.logo && typeof data.logo === "string" && data.logo.trim().length > 0;
  if (hasLogo) {
    if (value && typeof value === "string" && value.trim().length > 0) {
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

const validateOGImageAlt: SEOFieldValidator = (value, data) => {
  const hasOGImage = data.ogImage && typeof data.ogImage === "string" && data.ogImage.trim().length > 0;
  if (hasOGImage) {
    if (value && typeof value === "string" && value.trim().length > 0) {
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

const validateOGImageDimensions: SEOFieldValidator = (value, data) => {
  const hasOGImage = data.ogImage && typeof data.ogImage === "string" && data.ogImage.trim().length > 0;
  if (hasOGImage) {
    const hasWidth = data.ogImageWidth && typeof data.ogImageWidth === "number";
    const hasHeight = data.ogImageHeight && typeof data.ogImageHeight === "number";
    
    if (hasWidth && hasHeight) {
      const width = data.ogImageWidth as number;
      const height = data.ogImageHeight as number;
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
      }
      return {
        status: "warning",
        message: `OG image dimensions (${width}x${height}px) - recommend 1200x630px minimum`,
        score: 2,
      };
    } else if (hasWidth || hasHeight) {
      return {
        status: "warning",
        message: "OG image dimensions incomplete - add both width and height (recommend 1200x630px)",
        score: 1,
      };
    }
    return {
      status: "warning",
      message: "OG image dimensions recommended (1200x630px) for proper social media rendering",
      score: 0,
    };
  }
  return {
    status: "info",
    message: "OG image dimensions not needed (no OG image provided)",
    score: 0,
  };
};

const validateTwitterImageAlt: SEOFieldValidator = (value, data) => {
  const hasTwitterImage = data.twitterImage && typeof data.twitterImage === "string" && data.twitterImage.trim().length > 0;
  if (hasTwitterImage) {
    if (value && typeof value === "string" && value.trim().length > 0) {
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

const validateImageAlt: SEOFieldValidator = (value, data) => {
  const hasImage = data.image && typeof data.image === "string" && data.image.trim().length > 0;
  if (hasImage) {
    if (value && typeof value === "string" && value.trim().length > 0) {
      return {
        status: "good",
        message: "Image alt text provided - required for accessibility and SEO",
        score: 5,
      };
    }
    return {
      status: "error",
      message: "Image alt text required when image exists (accessibility + SEO)",
      score: 0,
    };
  }
  return {
    status: "info",
    message: "Image alt text not needed (no image provided)",
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
  if (data.logo) {
    structuredData.logo = data.logo as string;
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
export const organizationSEOConfig: SEODoctorConfig = {
  entityType: "Organization",
  maxScore: 200,
  generateStructuredData: generateOrganizationStructuredData,
  fields: [
    { name: "name", label: "Client Name", validator: validateName },
    { name: "slug", label: "Slug", validator: validateSlug },
    { name: "legalName", label: "Legal Name", validator: validateLegalName },
    { name: "url", label: "Website URL", validator: validateUrl },
    { name: "logo", label: "Logo", validator: validateLogo },
    { name: "logoAlt", label: "Logo Alt Text", validator: validateLogoAlt },
    { name: "ogImage", label: "OG Image", validator: validateOGImage },
    { name: "ogImageAlt", label: "OG Image Alt Text", validator: validateOGImageAlt },
    { name: "ogImageWidth", label: "OG Image Dimensions", validator: validateOGImageDimensions },
    { name: "seoTitle", label: "SEO Title", validator: validateSEOTitle },
    { name: "seoDescription", label: "SEO Description", validator: validateSEODescription },
    { name: "sameAs", label: "Social Profiles", validator: validateSocialProfiles },
    { name: "businessBrief", label: "Business Brief", validator: validateBusinessBrief },
    { name: "email", label: "Contact Information", validator: validateContactInfo },
    { name: "gtmId", label: "Google Tag Manager", validator: validateGTMId },
    { name: "foundingDate", label: "Founding Date", validator: validateFoundingDate },
    { name: "description", label: "Organization Description", validator: validateDescription },
    { name: "seoTitle", label: "Open Graph Tags", validator: validateOGTags },
    { name: "url", label: "HTTPS Protocol", validator: validateHTTPS },
    { name: "contactType", label: "ContactPoint Structure", validator: validateContactPoint },
    { name: "logo", label: "Logo Format", validator: validateLogoFormat },
    { name: "twitterCard", label: "Twitter Cards", validator: validateTwitterCards },
    { name: "twitterImageAlt", label: "Twitter Image Alt Text", validator: validateTwitterImageAlt },
    { name: "canonicalUrl", label: "Canonical URL", validator: validateCanonicalUrl },
    { name: "addressStreet", label: "Address (Local SEO)", validator: validateAddress },
  ],
};

// Article Validators
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

const validateFeaturedImage: SEOFieldValidator = (value, data) => {
  const hasImage = (value && typeof value === "string" && value.trim().length > 0) ||
                  (data.featuredImageId && typeof data.featuredImageId === "string");
  if (hasImage) {
    const hasAlt = data.featuredImageAlt && typeof data.featuredImageAlt === "string" && data.featuredImageAlt.trim().length > 0;
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
  const hasOGTitle = data.seoTitle && typeof data.seoTitle === "string" && data.seoTitle.trim().length > 0;
  const hasOGDescription = data.seoDescription && typeof data.seoDescription === "string" && data.seoDescription.trim().length > 0;
  const hasOGImage = (data.ogImage && typeof data.ogImage === "string" && data.ogImage.trim().length > 0) ||
                     (data.featuredImageId && typeof data.featuredImageId === "string");
  const hasOGImageAlt = data.ogImageAlt && typeof data.ogImageAlt === "string" && data.ogImageAlt.trim().length > 0;
  const hasOGImageWidth = data.ogImageWidth && typeof data.ogImageWidth === "number";
  const hasOGImageHeight = data.ogImageHeight && typeof data.ogImageHeight === "number";
  
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

const validateArticleTwitterCards: SEOFieldValidator = (value, data) => {
  const hasTwitterCard = data.twitterCard && typeof data.twitterCard === "string" && data.twitterCard.trim().length > 0;
  const hasTwitterTitle = data.twitterTitle && typeof data.twitterTitle === "string" && data.twitterTitle.trim().length > 0;
  const hasTwitterDesc = data.twitterDescription && typeof data.twitterDescription === "string" && data.twitterDescription.trim().length > 0;
  const hasTwitterImg = data.twitterImage && typeof data.twitterImage === "string" && data.twitterImage.trim().length > 0;
  const hasTwitterImageAlt = data.twitterImageAlt && typeof data.twitterImageAlt === "string" && data.twitterImageAlt.trim().length > 0;
  const canAutoGenerate = data.seoTitle && data.seoDescription && (data.ogImage || data.featuredImageId);
  
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
  if (data.featuredImage || data.ogImage) {
    structuredData.image = (data.featuredImage || data.ogImage) as string;
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
export const articleSEOConfig: SEODoctorConfig = {
  entityType: "Article",
  maxScore: 200,
  generateStructuredData: generateArticleStructuredData,
  fields: [
    { name: "title", label: "Article Title", validator: validateArticleTitle },
    { name: "slug", label: "Slug", validator: validateSlug },
    { name: "content", label: "Content (Word Count)", validator: validateArticleContent },
    { name: "seoTitle", label: "SEO Title", validator: validateSEOTitle },
    { name: "seoDescription", label: "SEO Description", validator: validateSEODescription },
    { name: "featuredImageId", label: "Featured Image", validator: validateFeaturedImage },
    { name: "featuredImageAlt", label: "Featured Image Alt Text", validator: validateImageAlt },
    { name: "ogImage", label: "OG Image", validator: validateOGImage },
    { name: "ogImageAlt", label: "OG Image Alt Text", validator: validateOGImageAlt },
    { name: "ogImageWidth", label: "OG Image Dimensions", validator: validateOGImageDimensions },
    { name: "datePublished", label: "Date Published", validator: validateArticleDatePublished },
    { name: "lastReviewed", label: "Last Reviewed", validator: validateLastReviewed },
    { name: "categoryId", label: "Category", validator: validateArticleCategory },
    { name: "seoTitle", label: "Open Graph Tags", validator: validateArticleOGTags },
    { name: "twitterCard", label: "Twitter Cards", validator: validateArticleTwitterCards },
    { name: "twitterImageAlt", label: "Twitter Image Alt Text", validator: validateTwitterImageAlt },
    { name: "canonicalUrl", label: "Canonical URL", validator: validateCanonicalUrl },
  ],
};

// Author Validators
const validateAuthorName: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "good",
      message: "Author name is set",
      score: 5,
    };
  }
  return {
    status: "error",
    message: "Author name is required",
    score: 0,
  };
};

const validateAuthorBio: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length >= 100) {
    return {
      status: "good",
      message: `Comprehensive author bio (${value.length} chars) for Schema.org Person`,
      score: 10,
    };
  } else if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "warning",
      message: `Author bio too short (${value.length} chars) - minimum 100 chars recommended`,
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Author bio required (minimum 100 chars) for Schema.org Person",
    score: 0,
  };
};

const validateAuthorEETAT: SEOFieldValidator = (value, data) => {
  const hasJobTitle = data.jobTitle && typeof data.jobTitle === "string" && data.jobTitle.trim().length > 0;
  const hasCredentials = Array.isArray(data.credentials) && data.credentials.length > 0;
  const hasQualifications = Array.isArray(data.qualifications) && data.qualifications.length > 0;
  const hasExpertise = Array.isArray(data.expertiseAreas) && data.expertiseAreas.length > 0;
  const isVerified = data.verificationStatus === true;
  
  let score = 0;
  const signals = [];
  
  if (hasJobTitle) {
    score += 2;
    signals.push("job title");
  }
  if (hasCredentials) {
    score += 3;
    signals.push("credentials");
  }
  if (hasQualifications) {
    score += 3;
    signals.push("qualifications");
  }
  if (hasExpertise) {
    score += 2;
    signals.push("expertise areas");
  }
  if (isVerified) {
    score += 5;
    signals.push("verification");
  }
  
  if (signals.length >= 4) {
    return {
      status: "good",
      message: `Strong E-E-A-T signals: ${signals.join(", ")} - excellent for SEO`,
      score: Math.min(score, 15),
    };
  } else if (signals.length >= 2) {
    return {
      status: "warning",
      message: `Partial E-E-A-T signals: ${signals.join(", ")} - add more for better SEO`,
      score: Math.min(score, 10),
    };
  }
  return {
    status: "warning",
    message: "E-E-A-T signals recommended - add job title, credentials, qualifications, expertise areas",
    score: 0,
  };
};

const validateAuthorSocial: SEOFieldValidator = (value, data) => {
  const hasLinkedIn = data.linkedIn && typeof data.linkedIn === "string" && data.linkedIn.trim().length > 0;
  const hasTwitter = data.twitter && typeof data.twitter === "string" && data.twitter.trim().length > 0;
  const hasFacebook = data.facebook && typeof data.facebook === "string" && data.facebook.trim().length > 0;
  const sameAsArray = Array.isArray(data.sameAs) ? data.sameAs : [];
  const totalSocial = (hasLinkedIn ? 1 : 0) + (hasTwitter ? 1 : 0) + (hasFacebook ? 1 : 0) + sameAsArray.length;
  
  if (totalSocial >= 3) {
    return {
      status: "good",
      message: `Excellent! ${totalSocial} social profiles - great for Schema.org sameAs`,
      score: 10,
    };
  } else if (totalSocial >= 2) {
    return {
      status: "good",
      message: `Good! ${totalSocial} social profiles added`,
      score: 8,
    };
  } else if (totalSocial >= 1) {
    return {
      status: "warning",
      message: `Only ${totalSocial} social profile - add more for better verification`,
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Social profiles recommended for Schema.org Person sameAs property",
    score: 0,
  };
};

// Generate Person structured data
function generatePersonStructuredData(data: Record<string, unknown>): Record<string, unknown> {
  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: (data.name as string) || "",
  };

  if (data.bio) structuredData.description = data.bio as string;
  if (data.url) structuredData.url = data.url as string;
  if (data.image) structuredData.image = data.image as string;
  if (data.jobTitle) structuredData.jobTitle = data.jobTitle as string;
  if (data.worksFor) {
    structuredData.worksFor = {
      "@type": "Organization",
      name: data.worksFor as string,
    };
  }
  if (Array.isArray(data.expertiseAreas) && data.expertiseAreas.length > 0) {
    structuredData.knowsAbout = data.expertiseAreas;
  }
  if (Array.isArray(data.sameAs) && data.sameAs.length > 0) {
    structuredData.sameAs = data.sameAs;
  } else {
    const socialProfiles: string[] = [];
    if (data.linkedIn) socialProfiles.push(data.linkedIn as string);
    if (data.twitter) socialProfiles.push(data.twitter as string);
    if (data.facebook) socialProfiles.push(data.facebook as string);
    if (socialProfiles.length > 0) {
      structuredData.sameAs = socialProfiles;
    }
  }

  return structuredData;
}

// Author SEO Configuration
export const authorSEOConfig: SEODoctorConfig = {
  entityType: "Person",
  maxScore: 150,
  generateStructuredData: generatePersonStructuredData,
  fields: [
    { name: "name", label: "Author Name", validator: validateAuthorName },
    { name: "slug", label: "Slug", validator: validateSlug },
    { name: "bio", label: "Author Bio", validator: validateAuthorBio },
    { name: "image", label: "Profile Image", validator: validateOGImage },
    { name: "imageAlt", label: "Profile Image Alt Text", validator: validateImageAlt },
    { name: "jobTitle", label: "E-E-A-T Signals", validator: validateAuthorEETAT },
    { name: "linkedIn", label: "Social Profiles", validator: validateAuthorSocial },
    { name: "seoTitle", label: "SEO Title", validator: validateSEOTitle },
    { name: "seoDescription", label: "SEO Description", validator: validateSEODescription },
    { name: "url", label: "Author URL", validator: validateUrl },
  ],
};

// Category Validators
const validateCategoryName: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "good",
      message: "Category name is set",
      score: 5,
    };
  }
  return {
    status: "error",
    message: "Category name is required",
    score: 0,
  };
};

const validateCategoryDescription: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length >= 100) {
    return {
      status: "good",
      message: `Comprehensive category description (${value.length} chars)`,
      score: 10,
    };
  } else if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "warning",
      message: `Category description too short (${value.length} chars) - minimum 100 chars recommended`,
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Category description required (minimum 100 chars) for SEO",
    score: 0,
  };
};

// Generate Category structured data
function generateCategoryStructuredData(data: Record<string, unknown>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Category",
    name: (data.name as string) || "",
    description: (data.description as string) || undefined,
    url: data.canonicalUrl ? (data.canonicalUrl as string) : undefined,
  };
}

// Category SEO Configuration
export const categorySEOConfig: SEODoctorConfig = {
  entityType: "Category",
  maxScore: 100,
  generateStructuredData: generateCategoryStructuredData,
  fields: [
    { name: "name", label: "Category Name", validator: validateCategoryName },
    { name: "slug", label: "Slug", validator: validateSlug },
    { name: "description", label: "Category Description", validator: validateCategoryDescription },
    { name: "seoTitle", label: "SEO Title", validator: validateSEOTitle },
    { name: "seoDescription", label: "SEO Description", validator: validateSEODescription },
    { name: "seoTitle", label: "Open Graph Tags", validator: validateOGTags },
    { name: "twitterCard", label: "Twitter Cards", validator: validateTwitterCards },
    { name: "canonicalUrl", label: "Canonical URL", validator: validateCanonicalUrl },
  ],
};

// Tag Validators
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

// Generate Tag structured data
function generateTagStructuredData(data: Record<string, unknown>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Tag",
    name: (data.name as string) || "",
    description: (data.description as string) || undefined,
    url: data.canonicalUrl ? (data.canonicalUrl as string) : undefined,
  };
}

// Tag SEO Configuration
export const tagSEOConfig: SEODoctorConfig = {
  entityType: "Tag",
  maxScore: 100,
  generateStructuredData: generateTagStructuredData,
  fields: [
    { name: "name", label: "Tag Name", validator: validateTagName },
    { name: "slug", label: "Slug", validator: validateSlug },
    { name: "description", label: "Tag Description", validator: validateTagDescription },
    { name: "seoTitle", label: "SEO Title", validator: validateSEOTitle },
    { name: "seoDescription", label: "SEO Description", validator: validateSEODescription },
    { name: "ogImage", label: "OG Image", validator: validateOGImage },
    { name: "ogImageAlt", label: "OG Image Alt Text", validator: validateOGImageAlt },
    { name: "ogImageWidth", label: "OG Image Dimensions", validator: validateOGImageDimensions },
    { name: "seoTitle", label: "Open Graph Tags", validator: validateOGTags },
    { name: "twitterCard", label: "Twitter Cards", validator: validateTwitterCards },
    { name: "twitterImageAlt", label: "Twitter Image Alt Text", validator: validateTwitterImageAlt },
    { name: "canonicalUrl", label: "Canonical URL", validator: validateCanonicalUrl },
  ],
};

// Industry Validators
const validateIndustryName: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "good",
      message: "Industry name is set",
      score: 5,
    };
  }
  return {
    status: "error",
    message: "Industry name is required",
    score: 0,
  };
};

const validateIndustryDescription: SEOFieldValidator = (value) => {
  if (value && typeof value === "string" && value.trim().length >= 100) {
    return {
      status: "good",
      message: `Comprehensive industry description (${value.length} chars)`,
      score: 10,
    };
  } else if (value && typeof value === "string" && value.trim().length > 0) {
    return {
      status: "warning",
      message: `Industry description too short (${value.length} chars) - minimum 100 chars recommended`,
      score: 5,
    };
  }
  return {
    status: "warning",
    message: "Industry description recommended (minimum 100 chars) for SEO",
    score: 0,
  };
};

// Generate Industry structured data
function generateIndustryStructuredData(data: Record<string, unknown>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Industry",
    name: (data.name as string) || "",
    description: (data.description as string) || undefined,
    url: data.canonicalUrl ? (data.canonicalUrl as string) : undefined,
  };
}

// Industry SEO Configuration
export const industrySEOConfig: SEODoctorConfig = {
  entityType: "Industry",
  maxScore: 100,
  generateStructuredData: generateIndustryStructuredData,
  fields: [
    { name: "name", label: "Industry Name", validator: validateIndustryName },
    { name: "slug", label: "Slug", validator: validateSlug },
    { name: "description", label: "Industry Description", validator: validateIndustryDescription },
    { name: "seoTitle", label: "SEO Title", validator: validateSEOTitle },
    { name: "seoDescription", label: "SEO Description", validator: validateSEODescription },
    { name: "ogImage", label: "OG Image", validator: validateOGImage },
    { name: "ogImageAlt", label: "OG Image Alt Text", validator: validateOGImageAlt },
    { name: "ogImageWidth", label: "OG Image Dimensions", validator: validateOGImageDimensions },
    { name: "seoTitle", label: "Open Graph Tags", validator: validateOGTags },
    { name: "twitterCard", label: "Twitter Cards", validator: validateTwitterCards },
    { name: "twitterImageAlt", label: "Twitter Image Alt Text", validator: validateTwitterImageAlt },
    { name: "canonicalUrl", label: "Canonical URL", validator: validateCanonicalUrl },
  ],
};
