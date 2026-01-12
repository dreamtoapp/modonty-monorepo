'use client';

import { useState, useEffect, useMemo } from 'react';
import { useArticleForm } from '../article-form-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  ImageIcon,
  Globe,
  Twitter,
  Search,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getMediaById } from '@/app/(dashboard)/media/actions/get-media-by-id';
import { generateBreadcrumbStructuredData } from '@/lib/seo';

interface FeaturedMedia {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export function SEOStep() {
  const { formData, clients, categories, tags, authors } = useArticleForm();
  const { toast } = useToast();
  const [featuredMedia, setFeaturedMedia] = useState<FeaturedMedia | null>(null);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Collapsible states
  const [metaTagsOpen, setMetaTagsOpen] = useState(true);
  const [technicalMetaOpen, setTechnicalMetaOpen] = useState(false);
  const [previewsOpen, setPreviewsOpen] = useState(true);
  const [ogOpen, setOgOpen] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(false);
  const [jsonLdOpen, setJsonLdOpen] = useState(false);

  // Fetch featured image metadata
  useEffect(() => {
    const fetchMedia = async () => {
      if (!formData.featuredImageId || !formData.clientId) {
        setFeaturedMedia(null);
        return;
      }
      setLoadingMedia(true);
      try {
        const media = await getMediaById(formData.featuredImageId, formData.clientId);
        if (media) {
          setFeaturedMedia({
            url: media.url,
            altText: media.altText,
            width: media.width,
            height: media.height,
          });
        } else {
          setFeaturedMedia(null);
        }
      } catch (error) {
        console.error('Error fetching featured media:', error);
        setFeaturedMedia(null);
      } finally {
        setLoadingMedia(false);
      }
    };
    fetchMedia();
  }, [formData.featuredImageId, formData.clientId]);

  // Resolve effective values
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modonty.com';

  const normalizeUrl = (url: string | undefined, fallback: string): string => {
    if (!url) return `${siteUrl}${fallback}`;
    if (url.startsWith(siteUrl)) return url;
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname + urlObj.search + urlObj.hash;
      return `${siteUrl}${path}`;
    } catch {
      const cleanPath = url.startsWith('/') ? url : `/${url}`;
      return `${siteUrl}${cleanPath}`;
    }
  };

  const effectiveTitle = formData.seoTitle || formData.title || '';
  const effectiveDescription = formData.seoDescription || formData.excerpt || '';
  const effectiveCanonical = normalizeUrl(formData.canonicalUrl, `/articles/${formData.slug}`);
  const selectedClient = clients.find((c) => c.id === formData.clientId);
  const selectedCategory = categories.find((c) => c.id === formData.categoryId);
  const selectedAuthor = authors.find((a) => a.id === formData.authorId);
  const selectedTagNames = useMemo(() => {
    if (!formData.tags || formData.tags.length === 0) return [];
    return tags.filter((t) => formData.tags?.includes(t.id)).map((t) => t.name);
  }, [formData.tags, tags]);

  // Build Open Graph metadata
  const openGraphMeta = useMemo(() => {
    const ogUrl = normalizeUrl(formData.ogUrl || formData.canonicalUrl, `/articles/${formData.slug}`);
    const og: Record<string, unknown> = {
      type: formData.ogType || 'article',
      title: formData.ogTitle || effectiveTitle,
      description: formData.ogDescription || effectiveDescription,
      url: ogUrl,
      siteName: formData.ogSiteName || selectedClient?.name || 'مودونتي',
      locale: formData.ogLocale || formData.inLanguage || 'ar_SA',
    };

    if (og.type === 'article') {
      if (formData.ogArticlePublishedTime) {
        og.publishedTime = new Date(formData.ogArticlePublishedTime).toISOString();
      } else if (formData.datePublished) {
        og.publishedTime = new Date(formData.datePublished).toISOString();
      } else if (formData.scheduledAt) {
        og.publishedTime = new Date(formData.scheduledAt).toISOString();
      }

      if (formData.ogArticleModifiedTime) {
        og.modifiedTime = new Date(formData.ogArticleModifiedTime).toISOString();
      } else {
        og.modifiedTime = new Date().toISOString();
      }

      if (formData.ogArticleAuthor || selectedAuthor?.name) {
        og.authors = [formData.ogArticleAuthor || selectedAuthor?.name || ''];
      }

      if (formData.ogArticleSection || selectedCategory?.name) {
        og.section = formData.ogArticleSection || selectedCategory?.name || '';
      }

      if (formData.ogArticleTag && formData.ogArticleTag.length > 0) {
        og.tags = formData.ogArticleTag;
      } else if (selectedTagNames.length > 0) {
        og.tags = selectedTagNames;
      }
    }

    if (featuredMedia?.url) {
      og.images = [{
        url: featuredMedia.url,
        width: featuredMedia.width || 1200,
        height: featuredMedia.height || 630,
        alt: featuredMedia.altText || effectiveTitle,
      }];
    }

    return og;
  }, [formData, effectiveTitle, effectiveDescription, selectedClient, selectedCategory, selectedAuthor, selectedTagNames, featuredMedia]);

  // Build Twitter metadata
  const twitterMeta = useMemo(() => ({
    card: formData.twitterCard || 'summary_large_image',
    title: formData.twitterTitle || formData.ogTitle || effectiveTitle,
    description: formData.twitterDescription || formData.ogDescription || effectiveDescription,
    site: formData.twitterSite || undefined,
    creator: formData.twitterCreator || selectedAuthor?.name || undefined,
    images: featuredMedia?.url ? [featuredMedia.url] : undefined,
    label1: formData.twitterLabel1 || undefined,
    data1: formData.twitterData1 || undefined,
  }), [formData, effectiveTitle, effectiveDescription, selectedAuthor, featuredMedia]);

  // Build JSON-LD preview
  const jsonLdPreview = useMemo(() => {
    const articleUrl = effectiveCanonical;
    const graph: Record<string, unknown>[] = [];

    const article: Record<string, unknown> = {
      '@type': 'Article',
      '@id': `${articleUrl}#article`,
      headline: effectiveTitle,
      description: effectiveDescription,
      datePublished: formData.datePublished
        ? new Date(formData.datePublished).toISOString()
        : formData.scheduledAt
          ? new Date(formData.scheduledAt).toISOString()
          : new Date().toISOString(),
      dateModified: formData.ogArticleModifiedTime
        ? new Date(formData.ogArticleModifiedTime).toISOString()
        : new Date().toISOString(),
      author: { '@type': 'Person', name: selectedAuthor?.name || formData.ogArticleAuthor || 'Modonty' },
      publisher: { '@type': 'Organization', name: selectedClient?.name || 'مودونتي' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
      inLanguage: formData.inLanguage || 'ar',
      isAccessibleForFree: formData.isAccessibleForFree ?? true,
    };

    if (selectedCategory?.name) article.articleSection = selectedCategory.name;
    if (selectedTagNames.length > 0) article.keywords = selectedTagNames;
    if (featuredMedia?.url) {
      article.image = {
        '@type': 'ImageObject',
        url: featuredMedia.url,
        width: featuredMedia.width || 1200,
        height: featuredMedia.height || 630,
      };
    }
    if (formData.wordCount) article.wordCount = formData.wordCount;
    if (formData.license) article.license = formData.license;

    graph.push(article);

    graph.push({
      '@type': 'WebPage',
      '@id': articleUrl,
      url: articleUrl,
      name: effectiveTitle,
      description: effectiveDescription,
      isPartOf: { '@type': 'WebSite', name: selectedClient?.name || 'مودونتي', url: siteUrl },
      breadcrumb: { '@id': `${articleUrl}#breadcrumb` },
    });

    const breadcrumbItems = [
      { name: 'الرئيسية', url: '/' },
      ...(selectedCategory ? [{ name: selectedCategory.name, url: `/categories/${selectedCategory.slug}` }] : []),
      { name: effectiveTitle, url: effectiveCanonical },
    ];
    const breadcrumb = generateBreadcrumbStructuredData(breadcrumbItems) as Record<string, unknown>;
    breadcrumb['@id'] = `${articleUrl}#breadcrumb`;
    graph.push(breadcrumb);

    if (selectedClient) {
      graph.push({
        '@type': 'Organization',
        '@id': `${siteUrl}#organization`,
        name: selectedClient.name,
        url: siteUrl,
      });
    }

    return { '@context': 'https://schema.org', '@graph': graph };
  }, [formData, effectiveTitle, effectiveDescription, effectiveCanonical, selectedClient, selectedCategory, selectedAuthor, selectedTagNames, featuredMedia, siteUrl]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'تم النسخ', description: `تم نسخ ${label} بنجاح` });
    } catch {
      toast({ title: 'فشل النسخ', description: 'فشل في نسخ المحتوى', variant: 'destructive' });
    }
  };

  const hasRequiredData = effectiveTitle && effectiveDescription;

  // Generate HTML meta tags for preview
  const htmlMetaTags = useMemo(() => {
    const siteName = selectedClient?.name || 'مودونتي';
    const fullTitle = `${effectiveTitle} - ${siteName}`;
    const ogImage = featuredMedia?.url || '';
    
    const tags: string[] = [
      `<title>${fullTitle}</title>`,
      `<meta name="description" content="${effectiveDescription}" />`,
      `<link rel="canonical" href="${effectiveCanonical}" />`,
      `<meta name="robots" content="${formData.metaRobots || 'index, follow'}" />`,
      '',
      '<!-- Open Graph -->',
      `<meta property="og:title" content="${effectiveTitle}" />`,
      `<meta property="og:description" content="${effectiveDescription}" />`,
      `<meta property="og:url" content="${effectiveCanonical}" />`,
      `<meta property="og:type" content="${openGraphMeta.type}" />`,
      `<meta property="og:site_name" content="${openGraphMeta.siteName}" />`,
      `<meta property="og:locale" content="${openGraphMeta.locale}" />`,
    ];

    if (ogImage) {
      tags.push(`<meta property="og:image" content="${ogImage}" />`);
      tags.push(`<meta property="og:image:width" content="${featuredMedia?.width || 1200}" />`);
      tags.push(`<meta property="og:image:height" content="${featuredMedia?.height || 630}" />`);
    }

    if (openGraphMeta.publishedTime) {
      tags.push(`<meta property="article:published_time" content="${openGraphMeta.publishedTime}" />`);
    }
    if (openGraphMeta.modifiedTime) {
      tags.push(`<meta property="article:modified_time" content="${openGraphMeta.modifiedTime}" />`);
    }
    if (openGraphMeta.section) {
      tags.push(`<meta property="article:section" content="${openGraphMeta.section}" />`);
    }

    tags.push('');
    tags.push('<!-- Twitter Card -->');
    tags.push(`<meta name="twitter:card" content="${twitterMeta.card}" />`);
    tags.push(`<meta name="twitter:title" content="${twitterMeta.title}" />`);
    tags.push(`<meta name="twitter:description" content="${twitterMeta.description}" />`);
    
    if (twitterMeta.site) {
      tags.push(`<meta name="twitter:site" content="${twitterMeta.site}" />`);
    }
    if (twitterMeta.creator) {
      tags.push(`<meta name="twitter:creator" content="${twitterMeta.creator}" />`);
    }
    if (ogImage) {
      tags.push(`<meta name="twitter:image" content="${ogImage}" />`);
    }

    return tags.join('\n');
  }, [effectiveTitle, effectiveDescription, effectiveCanonical, formData.metaRobots, openGraphMeta, twitterMeta, featuredMedia, selectedClient]);

  // Generate Next.js Metadata object (like generateMetadata returns)
  const nextjsMetadataObject = useMemo(() => {
    const siteName = selectedClient?.name || 'مودونتي';
    const fullTitle = `${effectiveTitle} - ${siteName}`;
    const ogImage = featuredMedia?.url || `${siteUrl}/og-image.jpg`;

    const metadata: Record<string, unknown> = {
      title: fullTitle,
      description: effectiveDescription,
      alternates: {
        canonical: effectiveCanonical,
      },
      openGraph: {
        title: fullTitle,
        description: effectiveDescription,
        url: effectiveCanonical,
        siteName: siteName,
        images: [{
          url: ogImage,
          width: featuredMedia?.width || 1200,
          height: featuredMedia?.height || 630,
          alt: effectiveTitle || siteName,
        }],
        locale: openGraphMeta.locale,
        type: openGraphMeta.type,
      },
      twitter: {
        card: twitterMeta.card,
        title: fullTitle,
        description: effectiveDescription,
        images: [ogImage],
        ...(twitterMeta.creator && { creator: twitterMeta.creator }),
      },
      robots: {
        index: !formData.metaRobots?.includes('noindex'),
        follow: !formData.metaRobots?.includes('nofollow'),
        googleBot: {
          index: !formData.metaRobots?.includes('noindex'),
          follow: !formData.metaRobots?.includes('nofollow'),
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };

    return metadata;
  }, [effectiveTitle, effectiveDescription, effectiveCanonical, formData.metaRobots, openGraphMeta, twitterMeta, featuredMedia, selectedClient, siteUrl]);

  return (
    <div className="space-y-4">
      {/* Card 1: Meta Tags Preview (HTML Head) */}
      <Collapsible open={metaTagsOpen} onOpenChange={setMetaTagsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Meta Tags (HTML Head)
                </CardTitle>
                <ChevronDown className={cn("h-5 w-5 transition-transform", metaTagsOpen && "rotate-180")} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {!hasRequiredData ? (
                <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-amber-900 dark:text-amber-100">
                    Add SEO title and description in Settings step to see meta tags
                  </span>
                </div>
              ) : (
                <>
                  {/* Key-Value Summary */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Summary</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Title</span>
                        <div className="flex items-center gap-2">
                          <span className="max-w-xs truncate font-medium">{effectiveTitle}</span>
                          <Badge variant={effectiveTitle.length > 60 ? 'destructive' : 'secondary'}>
                            {effectiveTitle.length}/60
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Description</span>
                        <Badge variant={effectiveDescription.length < 120 || effectiveDescription.length > 160 ? 'destructive' : 'secondary'}>
                          {effectiveDescription.length}/160
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Canonical URL</span>
                        <code className="text-xs bg-background px-2 py-1 rounded max-w-xs truncate">
                          {effectiveCanonical}
                        </code>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Robots</span>
                        <Badge variant="outline">{formData.metaRobots || 'index, follow'}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Copyable HTML Code */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold">HTML Meta Tags</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(htmlMetaTags, 'HTML Meta Tags')}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <pre className="p-3 bg-muted rounded-md overflow-auto max-h-64 text-xs">
                      <code>{htmlMetaTags}</code>
                    </pre>
                  </div>
                </>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Card 2: Technical Meta Tag (Next.js Metadata Object) */}
      <Collapsible open={technicalMetaOpen} onOpenChange={setTechnicalMetaOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Code className="h-4 w-4" />
                  Technical Meta Tag (Next.js Object)
                </CardTitle>
                <ChevronDown className={cn("h-5 w-5 transition-transform", technicalMetaOpen && "rotate-180")} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {!hasRequiredData ? (
                <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-amber-900 dark:text-amber-100">
                    Add SEO title and description in Settings step to see metadata object
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-900 dark:text-blue-100">
                      This is the Next.js Metadata object format (like <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">generateMetadata()</code> returns)
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold">Next.js Metadata JSON</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(nextjsMetadataObject, null, 2), 'Next.js Metadata')}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <pre className="p-3 bg-muted rounded-md overflow-auto max-h-96 text-xs">
                      <code>{JSON.stringify(nextjsMetadataObject, null, 2)}</code>
                    </pre>
                  </div>
                </>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Card 3: Search & Social Previews */}
      <Collapsible open={previewsOpen} onOpenChange={setPreviewsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Social Previews
                </CardTitle>
                <ChevronDown className={cn("h-5 w-5 transition-transform", previewsOpen && "rotate-180")} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {!hasRequiredData ? (
                <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-amber-900 dark:text-amber-100">
                    Add SEO title and description in Settings step to see previews
                  </span>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Google Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Google
                    </h4>
                    <div className="border rounded-lg p-3 space-y-1">
                      <div className="text-xs text-green-700 dark:text-green-400 truncate">{effectiveCanonical}</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium line-clamp-1 hover:underline cursor-pointer">
                        {effectiveTitle}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{effectiveDescription}</div>
                    </div>
                  </div>

                  {/* Facebook Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Facebook
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      {featuredMedia?.url ? (
                        <img src={featuredMedia.url} alt={effectiveTitle} className="w-full aspect-video object-cover" />
                      ) : (
                        <div className="w-full aspect-video bg-muted/50 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="p-2 space-y-1">
                        <div className="text-[10px] text-muted-foreground uppercase">{openGraphMeta.siteName as string}</div>
                        <div className="text-xs font-semibold line-clamp-1">{effectiveTitle}</div>
                        <div className="text-[10px] text-muted-foreground line-clamp-1">{effectiveDescription}</div>
                      </div>
                    </div>
                  </div>

                  {/* Twitter Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Twitter className="h-4 w-4" /> Twitter
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      {featuredMedia?.url ? (
                        <img src={featuredMedia.url} alt={effectiveTitle} className="w-full aspect-video object-cover" />
                      ) : (
                        <div className="w-full aspect-video bg-muted/50 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="p-2 space-y-1">
                        <div className="text-xs font-semibold line-clamp-1">{twitterMeta.title}</div>
                        <div className="text-[10px] text-muted-foreground line-clamp-1">{twitterMeta.description}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{effectiveCanonical}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!featuredMedia?.url && hasRequiredData && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-dashed">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Add a featured image in Media step for better social sharing
                  </span>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Card 2: Open Graph Details */}
      <Collapsible open={ogOpen} onOpenChange={setOgOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  Open Graph Metadata
                </CardTitle>
                <ChevronDown className={cn("h-5 w-5 transition-transform", ogOpen && "rotate-180")} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <MetaRow label="og:type" value={openGraphMeta.type as string} />
                <MetaRow label="og:site_name" value={openGraphMeta.siteName as string} />
                <MetaRow label="og:locale" value={openGraphMeta.locale as string} />
                <MetaRow label="og:section" value={openGraphMeta.section as string} />
                <MetaRow label="og:author" value={(openGraphMeta.authors as string[])?.[0]} />
                <MetaRow label="og:published" value={openGraphMeta.publishedTime ? new Date(openGraphMeta.publishedTime as string).toLocaleDateString('ar-SA') : undefined} />
                <MetaRow label="og:modified" value={openGraphMeta.modifiedTime ? new Date(openGraphMeta.modifiedTime as string).toLocaleDateString('ar-SA') : undefined} />
                {(openGraphMeta.tags as string[])?.length > 0 && (
                  <div className="col-span-2 flex items-center justify-between py-1.5 border-b">
                    <span className="text-muted-foreground">og:tags</span>
                    <div className="flex gap-1 flex-wrap">
                      {(openGraphMeta.tags as string[]).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Card 3: Twitter Card Details */}
      <Collapsible open={twitterOpen} onOpenChange={setTwitterOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Twitter className="h-4 w-4" />
                  Twitter Card Metadata
                </CardTitle>
                <ChevronDown className={cn("h-5 w-5 transition-transform", twitterOpen && "rotate-180")} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <MetaRow label="twitter:card" value={twitterMeta.card} />
                <MetaRow label="twitter:site" value={twitterMeta.site} />
                <MetaRow label="twitter:creator" value={twitterMeta.creator} />
                <MetaRow label="twitter:label1" value={twitterMeta.label1} />
                <MetaRow label="twitter:data1" value={twitterMeta.data1} />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Card 4: JSON-LD Summary */}
      <Collapsible open={jsonLdOpen} onOpenChange={setJsonLdOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  Structured Data (JSON-LD)
                </CardTitle>
                <ChevronDown className={cn("h-5 w-5 transition-transform", jsonLdOpen && "rotate-180")} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-900 dark:text-blue-100">
                  JSON-LD will be generated after saving the article
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Entities</h4>
                <div className="flex flex-wrap gap-2">
                  {jsonLdPreview['@graph'].map((item, idx) => (
                    <Badge key={idx} variant="outline" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      {item['@type'] as string}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">JSON-LD Preview</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(jsonLdPreview, null, 2), 'JSON-LD')}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="p-3 bg-muted rounded-md overflow-auto max-h-64 text-xs">
                  <code>{JSON.stringify(jsonLdPreview, null, 2)}</code>
                </pre>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b">
      <span className="text-muted-foreground">{label}</span>
      {value ? (
        <code className="bg-muted px-2 py-0.5 rounded text-xs">{value}</code>
      ) : (
        <Badge variant="secondary" className="text-xs">Default</Badge>
      )}
    </div>
  );
}
