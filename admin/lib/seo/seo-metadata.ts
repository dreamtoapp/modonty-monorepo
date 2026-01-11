import { Metadata } from "next";

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  siteName?: string;
  locale?: string;
  firstName?: string;
  lastName?: string;
  twitterCreator?: string;
}

export interface SEOOptions {
  robots?: "noindex,nofollow" | "index,follow";
}

export function generateMetadataFromSEO(data: SEOData, options?: SEOOptions): Metadata {
  const {
    title,
    description,
    keywords,
    image,
    url,
    type = "website",
    siteName = "مودونتي",
    locale = "ar_SA",
    firstName,
    lastName,
    twitterCreator,
  } = data;

  const fullTitle = title ? `${title} - ${siteName}` : siteName;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com";
  const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = image || `${siteUrl}/og-image.jpg`;

  const openGraph: Metadata["openGraph"] = {
    title: fullTitle,
    description: description || "",
    url: canonicalUrl,
    siteName: siteName,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title || siteName,
      },
    ],
    locale: locale,
    type: type,
  };

  const twitter: Metadata["twitter"] = {
    card: "summary_large_image",
    title: fullTitle,
    description: description || "",
    images: [ogImage],
  };

  if (twitterCreator) {
    const creatorHandle = twitterCreator.replace(/^@/, "");
    twitter.creator = `@${creatorHandle}`;
  }

  const robotsConfig: Metadata["robots"] = options?.robots === "noindex,nofollow"
    ? {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
          "max-video-preview": -1,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
        },
      };

  return {
    title: fullTitle,
    description: description || "منصة مدونات احترافية لإدارة المحتوى عبر عملاء متعددين",
    keywords: keywords || [],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph,
    twitter,
    robots: robotsConfig,
  };
}