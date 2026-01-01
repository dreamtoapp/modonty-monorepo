import { SEOFieldConfig, SEODoctorConfig, SEOFieldValidator } from "./seo-doctor";

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
  
  if (hasOGTitle && hasOGDescription && hasOGUrl && hasOGImage) {
    return {
      status: "good",
      message: "All OG tags can be generated (title, description, url, image, type)",
      score: 10,
    };
  }
  
  const missing = [];
  if (!hasOGTitle) missing.push("og:title");
  if (!hasOGDescription) missing.push("og:description");
  if (!hasOGUrl) missing.push("og:url");
  if (!hasOGImage) missing.push("og:image");
  
  const partialScore = (hasOGTitle ? 3 : 0) + (hasOGDescription ? 3 : 0) + (hasOGUrl ? 2 : 0) + (hasOGImage ? 2 : 0);
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
    if (isValidFormat) {
      return {
        status: "good",
        message: "Logo format valid (PNG/SVG/JPG) - recommend min 112x112px for Google",
        score: 5,
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
  const canAutoGenerate = data.seoTitle && data.seoDescription && data.ogImage;
  
  if (hasTwitterCard && hasTwitterTitle && hasTwitterDesc && hasTwitterImg) {
    return {
      status: "good",
      message: "Complete Twitter Cards configured - optimal for social SEO",
      score: 10,
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

// Generate Organization structured data
function generateOrganizationStructuredData(data: Record<string, any>) {
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name || undefined,
  };

  if (data.legalName) structuredData.legalName = data.legalName;
  if (data.url) structuredData.url = data.url;
  if (data.logo) {
    structuredData.logo = {
      "@type": "ImageObject",
      url: data.logo,
    };
  }
  if (data.description) {
    structuredData.description = data.description;
  } else if (data.seoDescription) {
    structuredData.description = data.seoDescription;
  }
  if (data.foundingDate) {
    structuredData.foundingDate = typeof data.foundingDate === "string" 
      ? data.foundingDate.split("T")[0] 
      : data.foundingDate;
  }

  // ContactPoint
  if (data.email || data.phone) {
    const contactPoint: any = {
      "@type": "ContactPoint",
    };
    if (data.contactType) contactPoint.contactType = data.contactType;
    if (data.email) contactPoint.email = data.email;
    if (data.phone) contactPoint.telephone = data.phone;
    structuredData.contactPoint = contactPoint;
  }

  // Address
  if (data.addressStreet || data.addressCity || data.addressCountry) {
    const address: any = {
      "@type": "PostalAddress",
    };
    if (data.addressStreet) address.streetAddress = data.addressStreet;
    if (data.addressCity) address.addressLocality = data.addressCity;
    if (data.addressCountry) address.addressCountry = data.addressCountry;
    if (data.addressPostalCode) address.postalCode = data.addressPostalCode;
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
  maxScore: 150,
  generateStructuredData: generateOrganizationStructuredData,
  fields: [
    { name: "name", label: "Client Name", validator: validateName },
    { name: "slug", label: "Slug", validator: validateSlug },
    { name: "legalName", label: "Legal Name", validator: validateLegalName },
    { name: "url", label: "Website URL", validator: validateUrl },
    { name: "logo", label: "Logo", validator: validateLogo },
    { name: "ogImage", label: "OG Image", validator: validateOGImage },
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
    { name: "canonicalUrl", label: "Canonical URL", validator: validateCanonicalUrl },
    { name: "addressStreet", label: "Address (Local SEO)", validator: validateAddress },
  ],
};
