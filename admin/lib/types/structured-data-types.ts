export interface StructuredDataBase {
  "@context": string;
  "@type": string;
}

export interface ArticleStructuredData extends StructuredDataBase {
  "@type": "Article";
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified: string;
  author: {
    "@type": "Person";
    name: string;
    url?: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
  articleSection?: string;
  keywords?: string[];
  wordCount?: number;
  inLanguage?: string;
  isAccessibleForFree?: boolean;
  license?: string;
  mainEntity?: {
    "@type": "FAQPage";
    mainEntity: Array<{
      "@type": "Question";
      name: string;
      acceptedAnswer: {
        "@type": "Answer";
        text: string;
      };
    }>;
  };
}

export interface OrganizationStructuredData extends StructuredDataBase {
  "@type": "Organization";
  name: string;
  legalName?: string;
  url?: string;
  logo?: string | {
    "@type": "ImageObject";
    url: string;
  };
  image?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    telephone?: string;
    email?: string;
    contactType?: string;
  };
  address?: {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality?: string;
    addressCountry?: string;
    postalCode?: string;
  };
  foundingDate?: string;
}

export interface PersonStructuredData extends StructuredDataBase {
  "@type": "Person";
  name: string;
  jobTitle?: string;
  worksFor?: {
    "@type": "Organization";
    name: string;
  };
  image?: string;
  url?: string;
  sameAs?: string[];
  description?: string;
  knowsAbout?: string[];
}

export interface BreadcrumbStructuredData extends StructuredDataBase {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

export type StructuredData =
  | ArticleStructuredData
  | OrganizationStructuredData
  | PersonStructuredData
  | BreadcrumbStructuredData;
