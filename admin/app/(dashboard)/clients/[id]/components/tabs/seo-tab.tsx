"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Link2, Code, Image as ImageIcon, FileCode, Tag, AlertTriangle, Sparkles, Copy, Check } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { generateClientSEO } from "../../../actions/clients-actions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SEOTabProps {
  client: {
    seoTitle: string | null;
    seoDescription: string | null;
    description: string | null;
    canonicalUrl: string | null;
    twitterCard: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterSite: string | null;
    twitterImageMedia: {
      url: string;
      altText: string | null;
    } | null;
    ogImageMedia: {
      url: string;
      altText: string | null;
    } | null;
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
    id: string;
    slug: string;
  };
}

export function SEOTab({ client }: SEOTabProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [metaTagsExpanded, setMetaTagsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateSEO = async () => {
    setIsGenerating(true);
    try {
      const result = await generateClientSEO(client.id);
      if (result.success) {
        toast({
          title: "Success",
          description: "SEO data generated successfully",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate SEO data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate SEO data",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMetaTags = async () => {
    if (client.metaTags) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(client.metaTags, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Copied",
          description: "Meta tags copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy meta tags",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle>SEO Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {client.seoTitle && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">SEO Title</p>
                <p className="text-sm font-medium">{client.seoTitle}</p>
              </div>
            )}
            {client.seoDescription && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">SEO Description</p>
                <p className="text-sm leading-relaxed">{client.seoDescription}</p>
              </div>
            )}
            {client.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Organization Description</p>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{client.description}</p>
              </div>
            )}
            {client.canonicalUrl && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Canonical URL</p>
                </div>
                <a
                  href={client.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {client.canonicalUrl}
                </a>
              </div>
            )}
            {!client.seoTitle && !client.seoDescription && !client.description && !client.canonicalUrl && (
              <p className="text-sm text-muted-foreground text-center py-4">No SEO information available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {client.ogImageMedia?.url && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <CardTitle>OG Image</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <img
                src={client.ogImageMedia.url}
                alt={client.ogImageMedia.altText || "OG image"}
                className="h-40 w-40 rounded object-cover border"
              />
              <a
                href={client.ogImageMedia.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline block break-all"
              >
                {client.ogImageMedia.url}
              </a>
              {client.ogImageMedia.altText && (
                <p className="text-xs text-muted-foreground">Alt: {client.ogImageMedia.altText}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {(client.twitterCard ||
        client.twitterTitle ||
        client.twitterDescription ||
        client.twitterImageMedia?.url ||
        client.twitterSite) && (
          <Card>
            <CardHeader>
              <CardTitle>Twitter Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {client.twitterCard && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Twitter Card Type</p>
                    <p className="text-sm font-medium">{client.twitterCard}</p>
                  </div>
                )}
                {client.twitterTitle && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Twitter Title</p>
                    <p className="text-sm font-medium">{client.twitterTitle}</p>
                  </div>
                )}
                {client.twitterDescription && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Twitter Description</p>
                    <p className="text-sm leading-relaxed">{client.twitterDescription}</p>
                  </div>
                )}
                {client.twitterSite && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Twitter Site</p>
                    <p className="text-sm font-medium">{client.twitterSite}</p>
                  </div>
                )}
                {client.twitterImageMedia?.url && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Twitter Image</p>
                    <div className="space-y-3">
                      <img
                        src={client.twitterImageMedia.url}
                        alt={client.twitterImageMedia.altText || "Twitter image"}
                        className="h-40 w-40 rounded object-cover border"
                      />
                      <a
                        href={client.twitterImageMedia.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline block break-all"
                      >
                        {client.twitterImageMedia.url}
                      </a>
                      {client.twitterImageMedia.altText && (
                        <p className="text-xs text-muted-foreground">Alt: {client.twitterImageMedia.altText}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {(!client.metaRobots || !client.metaTags || !client.jsonLdStructuredData) && (
        <div className="flex justify-end">
          <Button
            onClick={handleGenerateSEO}
            disabled={isGenerating}
            variant="default"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Meta Tags & JSON-LD
              </>
            )}
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Meta Tags</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {!client.metaRobots && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Critical
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!client.metaRobots ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Meta Robots Tag Missing</AlertTitle>
                <AlertDescription>
                  The meta robots tag is not configured. This is critical for SEO as it controls how search engines index and follow links on this page.
                </AlertDescription>
              </Alert>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Meta Robots</p>
                <Badge variant="outline" className="font-mono">
                  {client.metaRobots}
                </Badge>
              </div>
            )}

            {client.metaTags && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Complete Meta Tags Object</p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyMetaTags}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Collapsible open={metaTagsExpanded} onOpenChange={setMetaTagsExpanded}>
                      <CollapsibleTrigger asChild>
                        <Button size="sm" variant="ghost">
                          {metaTagsExpanded ? "Collapse" : "Expand"}
                        </Button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  </div>
                </div>
                <Collapsible open={metaTagsExpanded} onOpenChange={setMetaTagsExpanded}>
                  <CollapsibleContent>
                    <div className="relative">
                      <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto max-h-96 overflow-y-auto font-mono">
                        {JSON.stringify(client.metaTags, null, 2)}
                      </pre>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              <p className="mb-1">Common values:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><code className="bg-muted px-1 rounded">index, follow</code> - Allow indexing and following links</li>
                <li><code className="bg-muted px-1 rounded">noindex, follow</code> - Don't index but follow links</li>
                <li><code className="bg-muted px-1 rounded">index, nofollow</code> - Index but don't follow links</li>
                <li><code className="bg-muted px-1 rounded">noindex, nofollow</code> - Don't index or follow links</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-muted-foreground" />
              <CardTitle>JSON-LD Structured Data</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {!client.jsonLdStructuredData && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Critical
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!client.jsonLdStructuredData ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>JSON-LD Structured Data Missing</AlertTitle>
                <AlertDescription>
                  JSON-LD structured data is not configured. This is critical for SEO as it helps search engines understand your organization's information and improves rich results visibility.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {client.jsonLdLastGenerated && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Last Generated</p>
                    <p className="text-sm font-medium">
                      {format(new Date(client.jsonLdLastGenerated), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                )}

                {client.jsonLdValidationReport && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Validation Status</p>
                    <div className="space-y-2">
                      {client.jsonLdValidationReport.adobe && (
                        <div className="flex items-center gap-2">
                          <Badge variant={client.jsonLdValidationReport.adobe.valid ? "default" : "destructive"}>
                            {client.jsonLdValidationReport.adobe.valid ? "Valid" : "Invalid"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Adobe Validator</span>
                        </div>
                      )}
                      {client.jsonLdValidationReport.custom && (
                        <div className="flex items-center gap-2">
                          <Badge variant={client.jsonLdValidationReport.custom.valid ? "default" : "destructive"}>
                            {client.jsonLdValidationReport.custom.valid ? "Valid" : "Invalid"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Custom Validator</span>
                        </div>
                      )}
                      {client.jsonLdValidationReport.richResults && (
                        <div className="flex items-center gap-2">
                          <Badge variant={client.jsonLdValidationReport.richResults.valid ? "default" : "destructive"}>
                            {client.jsonLdValidationReport.richResults.valid ? "Valid" : "Invalid"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Rich Results</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Structured Data</p>
                  <div className="relative">
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto max-h-96 overflow-y-auto font-mono">
                      {(() => {
                        try {
                          return JSON.stringify(JSON.parse(client.jsonLdStructuredData), null, 2);
                        } catch (error) {
                          return client.jsonLdStructuredData;
                        }
                      })()}
                    </pre>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {client.gtmId && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Google Tag Manager ID</p>
              <p className="text-sm font-mono bg-muted p-2 rounded">{client.gtmId}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
