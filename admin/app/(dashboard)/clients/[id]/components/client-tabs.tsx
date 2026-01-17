"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, Building2, CreditCard, Search, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BasicInfoTab } from "./tabs/basic-info-tab";
import { SubscriptionTab } from "./tabs/subscription-tab";
import { SEOTab } from "./tabs/seo-tab";
import { GalleryTab } from "./tabs/gallery-tab";
import { ClientAnalytics } from "./client-analytics";
import { ClientArticles } from "./client-articles";
import { ArticleStatus } from "@prisma/client";
import type { MediaType } from "@prisma/client";

type Article = {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  createdAt: Date;
  datePublished: Date | null;
  scheduledAt: Date | null;
  views: number;
  category: { name: string } | null;
  author: { name: string } | null;
};

type Media = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  title: string | null;
  description: string | null;
  type: MediaType;
  createdAt: Date;
  cloudinaryPublicId?: string | null;
  cloudinaryVersion?: string | null;
};

interface ClientTabsProps {
  client: {
    id: string;
    name: string;
    slug: string;
    legalName: string | null;
    alternateName: string | null;
    slogan: string | null;
    organizationType: string | null;
    url: string | null;
    logoMedia: {
      url: string;
      altText: string | null;
    } | null;
    ogImageMedia: {
      url: string;
      altText: string | null;
    } | null;
    twitterImageMedia: {
      url: string;
      altText: string | null;
    } | null;
    email: string | null;
    phone: string | null;
    sameAs: string[];
    seoTitle: string | null;
    seoDescription: string | null;
    description: string | null;
    businessBrief: string | null;
    industry: {
      id: string;
      name: string;
    } | null;
    targetAudience: string | null;
    contentPriorities: string[];
    keywords: string[];
    knowsLanguage: string[];
    numberOfEmployees: string | null;
    subscriptionTier: string | null;
    subscriptionStartDate: Date | null;
    subscriptionEndDate: Date | null;
    articlesPerMonth: number | null;
    subscriptionTierConfig?: {
      id: string;
      tier: string;
      name: string;
      articlesPerMonth: number;
      price: number;
      isPopular: boolean;
    } | null;
    subscriptionStatus: string;
    paymentStatus: string;
    contactType: string | null;
    addressStreet: string | null;
    addressCity: string | null;
    addressCountry: string | null;
    addressPostalCode: string | null;
    addressRegion: string | null;
    addressNeighborhood: string | null;
    addressBuildingNumber: string | null;
    addressAdditionalNumber: string | null;
    canonicalUrl: string | null;
    twitterCard: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterSite: string | null;
    gtmId: string | null;
    metaRobots: string | null;
    metaTags: {
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
    } | null;
    jsonLdStructuredData: string | null;
    jsonLdLastGenerated: Date | null;
    jsonLdValidationReport: {
      adobe?: { valid: boolean; errors?: unknown[]; warnings?: unknown[] };
      custom?: { valid: boolean; errors?: unknown[]; warnings?: unknown[] };
      richResults?: { valid: boolean; errors?: unknown[]; warnings?: unknown[] };
    } | null;
    foundingDate: Date | null;
    commercialRegistrationNumber: string | null;
    vatID: string | null;
    taxID: string | null;
    legalForm: string | null;
    businessActivityCode: string | null;
    isicV4: string | null;
    licenseNumber: string | null;
    licenseAuthority: string | null;
    parentOrganization: {
      id: string;
      name: string;
      url: string | null;
      slug: string;
    } | null;
    _count: {
      articles: number;
    };
  };
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    createdAt: Date;
    datePublished: Date | null;
    scheduledAt: Date | null;
    views: number;
    category: { name: string } | null;
    author: { name: string } | null;
  }>;
  articlesThisMonth: number;
  analytics: {
    totalViews: number;
    uniqueSessions: number;
    avgTimeOnPage: number;
    bounceRate: number;
    avgScrollDepth: number;
    topArticles?: Array<{
      articleId: string;
      title: string;
      client: string;
      views: number;
    }>;
    trafficSources?: Record<string, number>;
    channelSummary?: Record<string, {
      views: number;
      sessions: number;
      avgTimeOnPage: number;
      bounceRate: number;
      avgScrollDepth: number;
    }>;
  };
  media: Array<{
    id: string;
    filename: string;
    url: string;
    mimeType: string;
    fileSize: number | null;
    width: number | null;
    height: number | null;
    altText: string | null;
    title: string | null;
    description: string | null;
    type: string;
    createdAt: Date;
    cloudinaryPublicId?: string | null;
    cloudinaryVersion?: string | null;
  }>;
}

export function ClientTabs({
  client,
  articles,
  articlesThisMonth,
  analytics,
  media,
}: ClientTabsProps) {
  const isSeoCritical = !client.metaRobots || !client.jsonLdStructuredData;

  return (
    <Tabs defaultValue="analytics" className="w-full">
      <div className="w-full overflow-x-auto">
        <TabsList className="inline-flex w-full min-w-max h-auto p-1.5 gap-1.5 bg-muted/50">
          {/* Performance & Analytics */}
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <BarChart3 className="h-4 w-4 flex-shrink-0" />
            <span>Performance</span>
          </TabsTrigger>
          
          {/* Company Information */}
          <TabsTrigger 
            value="basic" 
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span>Company</span>
          </TabsTrigger>
          
          {/* Subscription & Billing */}
          <TabsTrigger 
            value="subscription" 
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <CreditCard className="h-4 w-4 flex-shrink-0" />
            <span>Billing</span>
          </TabsTrigger>
          
          {/* Content & Articles */}
          <TabsTrigger 
            value="content" 
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <FileText className="h-4 w-4 flex-shrink-0" />
            <span>Articles</span>
          </TabsTrigger>
          
          {/* Gallery */}
          <TabsTrigger 
            value="gallery" 
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <ImageIcon className="h-4 w-4 flex-shrink-0" />
            <span>Gallery</span>
          </TabsTrigger>
          
          {/* SEO & Metadata */}
          <TabsTrigger 
            value="seo" 
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm ${
              isSeoCritical ? "relative" : ""
            }`}
          >
            <Search className="h-4 w-4 flex-shrink-0" />
            <span>SEO</span>
            {isSeoCritical && (
              <Badge 
                variant="destructive" 
                className="ml-1 h-4 px-1.5 text-[10px] flex items-center gap-0.5"
              >
                <AlertTriangle className="h-2.5 w-2.5" />
                Critical
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="analytics" className="mt-6">
        <ClientAnalytics
          analytics={analytics}
          clientId={client.id}
          client={client}
          articlesThisMonth={articlesThisMonth}
          totalArticles={articles.length}
        />
      </TabsContent>
      <TabsContent value="basic" className="mt-6">
        <BasicInfoTab client={client} />
      </TabsContent>
      <TabsContent value="subscription" className="mt-6">
        <SubscriptionTab client={client} />
      </TabsContent>
      <TabsContent value="content" className="mt-6">
        <ClientArticles articles={articles.map(a => ({ ...a, status: a.status as ArticleStatus }))} clientId={client.id} />
      </TabsContent>
      <TabsContent value="gallery" className="mt-6">
        <GalleryTab media={media.map(m => ({ ...m, type: m.type as MediaType }))} />
      </TabsContent>
      <TabsContent value="seo" className="mt-6">
        <SEOTab client={client} />
      </TabsContent>
    </Tabs>
  );
}
