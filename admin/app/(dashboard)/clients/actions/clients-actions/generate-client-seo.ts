"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateCompleteOrganizationJsonLd } from "@/lib/seo/generate-complete-organization-jsonld";

interface MetaTagsObject {
  title: string;
  description: string;
  robots: string;
  author: string;
  language: string;
  charset: string;
  viewport: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
    siteName: string;
    locale: string;
    images?: Array<{
      url: string;
      secure_url: string;
      type: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image?: string;
    imageAlt?: string;
    site?: string;
    creator?: string;
  };
  canonical: string;
  themeColor: string;
  formatDetection: {
    telephone: boolean;
    email: boolean;
    address: boolean;
  };
}

export async function generateClientSEO(clientId: string) {
  try {
    const client = await db.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        slug: true,
        legalName: true,
        alternateName: true,
        url: true,
        email: true,
        phone: true,
        seoTitle: true,
        seoDescription: true,
        description: true,
        businessBrief: true,
        targetAudience: true,
        contentPriorities: true,
        contactType: true,
        addressStreet: true,
        addressCity: true,
        addressCountry: true,
        addressPostalCode: true,
        addressRegion: true,
        addressNeighborhood: true,
        addressBuildingNumber: true,
        addressAdditionalNumber: true,
        sameAs: true,
        twitterCard: true,
        twitterTitle: true,
        twitterDescription: true,
        twitterSite: true,
        canonicalUrl: true,
        foundingDate: true,
        createdAt: true,
        updatedAt: true,
        // Saudi Arabia & Gulf Identifiers
        commercialRegistrationNumber: true,
        vatID: true,
        taxID: true,
        legalForm: true,
        // Classification & Business Info
        businessActivityCode: true,
        isicV4: true,
        numberOfEmployees: true,
        licenseNumber: true,
        licenseAuthority: true,
        // Additional Properties
        slogan: true,
        keywords: true,
        knowsLanguage: true,
        organizationType: true,
        // Relationships
        parentOrganizationId: true,
        logoMedia: {
          select: {
            url: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        ogImageMedia: {
          select: {
            url: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        twitterImageMedia: {
          select: {
            url: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        industry: {
          select: {
            id: true,
            name: true,
          },
        },
        parentOrganization: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
      },
    });

    if (!client) {
      return { success: false, error: "Client not found" };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com";
    const clientPageUrl = client.canonicalUrl || `${siteUrl}/clients/${client.slug}`;

    // Ensure URLs are absolute and HTTPS
    const ensureAbsoluteUrl = (url: string | null | undefined): string | undefined => {
      if (!url) return undefined;
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url.replace("http://", "https://");
      }
      if (url.startsWith("/")) {
        return `${siteUrl}${url}`;
      }
      return `https://${url}`;
    };

    const title = client.seoTitle || client.name;
    const description = client.seoDescription || client.description || "";

    // Validate and ensure absolute canonical URL
    const canonicalUrl = ensureAbsoluteUrl(clientPageUrl) || clientPageUrl;

    const metaTags: MetaTagsObject = {
      title: title.length > 60 ? title.substring(0, 57) + "..." : title,
      description: description.length > 160 ? description.substring(0, 157) + "..." : description,
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      author: client.name,
      language: "ar",
      charset: "UTF-8",
      viewport: "width=device-width, initial-scale=1.0",
      openGraph: {
        title: title,
        description: description,
        type: "website",
        url: canonicalUrl,
        siteName: "Modonty",
        locale: "ar_SA",
      },
      twitter: {
        card: client.twitterCard || (client.twitterImageMedia?.url ? "summary_large_image" : "summary"),
        title: client.twitterTitle || title,
        description: client.twitterDescription || description,
      },
      canonical: canonicalUrl,
      themeColor: "#ffffff",
      formatDetection: {
        telephone: !!client.phone,
        email: !!client.email,
        address: !!(client.addressStreet || client.addressCity),
      },
    };

    // Get supported languages from client data
    const supportedLanguages = Array.isArray(client.knowsLanguage) && client.knowsLanguage.length > 0
      ? client.knowsLanguage.map(lang => {
          // Map language names to locale codes
          if (lang.toLowerCase().includes("arabic") || lang.toLowerCase().includes("ar")) return "ar_SA";
          if (lang.toLowerCase().includes("english") || lang.toLowerCase().includes("en")) return "en_US";
          return "ar_SA"; // Default
        })
      : ["ar_SA"];

    // Add language alternates to Open Graph if multiple languages
    if (supportedLanguages.length > 1 && !metaTags.openGraph.images) {
      // Note: Open Graph locale alternates are typically handled in Next.js metadata
      // This is kept for reference in the meta tags object
    }

    // Enhanced Open Graph image with validation
    if (client.ogImageMedia?.url) {
      const ogImageUrl = ensureAbsoluteUrl(client.ogImageMedia.url) || client.ogImageMedia.url;
      const ogWidth = client.ogImageMedia.width && client.ogImageMedia.width >= 1200 ? client.ogImageMedia.width : 1200;
      const ogHeight = client.ogImageMedia.height && client.ogImageMedia.height >= 630 ? client.ogImageMedia.height : 630;
      
      metaTags.openGraph.images = [
        {
          url: ogImageUrl,
          secure_url: ogImageUrl.startsWith("https") ? ogImageUrl : ogImageUrl.replace("http://", "https://"),
          type: "image/jpeg",
          width: ogWidth,
          height: ogHeight,
          alt: client.ogImageMedia.altText || `${client.name} - Organization`,
        },
      ];
    }

    // Enhanced Twitter Card image with validation and alt text
    if (client.twitterImageMedia?.url) {
      const twitterImageUrl = ensureAbsoluteUrl(client.twitterImageMedia.url) || client.twitterImageMedia.url;
      metaTags.twitter.image = twitterImageUrl.startsWith("https") ? twitterImageUrl : twitterImageUrl.replace("http://", "https://");
      metaTags.twitter.imageAlt = client.twitterImageMedia.altText || `${client.name} - Organization`;
      
      // Validate dimensions for summary_large_image (minimum 1200x675)
      if (metaTags.twitter.card === "summary_large_image") {
        const twitterWidth = client.twitterImageMedia.width || 1200;
        const twitterHeight = client.twitterImageMedia.height || 675;
        // Note: Dimensions are validated but not stored in metaTags.twitter object
        // They're handled by the image URL itself
      }
    }

    if (client.twitterSite) {
      metaTags.twitter.site = client.twitterSite;
    }

    const jsonLdGraph = generateCompleteOrganizationJsonLd(client as any, clientPageUrl);
    const jsonLdString = JSON.stringify(jsonLdGraph);

    // Ensure metaTags is properly serialized as JSON to avoid MongoDB pipeline issues
    const metaTagsJson = JSON.parse(JSON.stringify(metaTags)) as Record<string, unknown>;

    await db.client.update({
      where: { id: clientId },
      data: {
        metaRobots: "index, follow",
        metaTags: metaTagsJson as any,
        jsonLdStructuredData: jsonLdString,
        jsonLdLastGenerated: new Date(),
      },
    });

    revalidatePath(`/clients/${clientId}`);
    revalidatePath("/clients");

    return { success: true };
  } catch (error) {
    console.error("Error generating client SEO:", error);
    const message = error instanceof Error ? error.message : "Failed to generate SEO data";
    return { success: false, error: message };
  }
}
