"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Music,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  detectPlatform,
  getPlatformName,
  type Platform,
} from "../../helpers/url-validation";

interface Client {
  id: string;
  name: string;
  slug: string;
  legalName: string | null;
  url: string | null;
  logo: string | null;
  ogImage: string | null;
  email: string | null;
  phone: string | null;
  sameAs: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  foundingDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    articles: number;
  };
}

interface ClientViewProps {
  client: Client;
}

export function ClientView({ client }: ClientViewProps) {
  const [brandingOpen, setBrandingOpen] = useState(true);
  const [contactOpen, setContactOpen] = useState(true);
  const [seoOpen, setSeoOpen] = useState(true);
  const [metadataOpen, setMetadataOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {client.logo && (
            <img
              src={client.logo}
              alt={client.name}
              className="h-16 w-16 rounded-lg object-contain"
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/clients">Back</Link>
          </Button>
          <Button asChild>
            <Link href={`/clients/${client.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{client.name}</CardTitle>
          {client.legalName && (
            <p className="text-muted-foreground text-sm">{client.legalName}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Slug</p>
            <p className="font-mono text-sm">{client.slug}</p>
          </div>
          {client.url && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Website</p>
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {client.url}
              </a>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Articles</p>
            <Link
              href={`/articles?clientId=${client.id}`}
              className="text-sm text-primary hover:underline font-medium"
            >
              {client._count.articles} {client._count.articles === 1 ? "article" : "articles"}
            </Link>
          </div>
        </CardContent>
      </Card>

      <Collapsible open={brandingOpen} onOpenChange={setBrandingOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle>Branding</CardTitle>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    brandingOpen && "transform rotate-180"
                  )}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
          {client.logo && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Logo</p>
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                className="h-24 w-24 rounded object-contain"
              />
            </div>
          )}
          {client.ogImage && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">OG Image</p>
              <img
                src={client.ogImage}
                alt={`${client.name} OG image`}
                className="h-32 w-32 rounded object-cover"
              />
            </div>
          )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={contactOpen} onOpenChange={setContactOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle>Contact Information</CardTitle>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    contactOpen && "transform rotate-180"
                  )}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
          {client.email && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <a
                href={`mailto:${client.email}`}
                className="text-sm text-primary hover:underline"
              >
                {client.email}
              </a>
            </div>
          )}
          {client.phone && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone</p>
              <a
                href={`tel:${client.phone}`}
                className="text-sm text-primary hover:underline"
              >
                {client.phone}
              </a>
            </div>
          )}
          {client.sameAs && client.sameAs.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Social Profiles</p>
              <div className="flex flex-col gap-2">
                {client.sameAs.map((url, index) => {
                  const platform = detectPlatform(url);
                  const platformName = getPlatformName(platform);
                  
                  const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
                    linkedin: Linkedin,
                    twitter: Twitter,
                    facebook: Facebook,
                    instagram: Instagram,
                    youtube: Youtube,
                    tiktok: Music,
                    other: LinkIcon,
                  };
                  
                  const Icon = platformIcons[platform] || LinkIcon;
                  
                  return (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-md border bg-card hover:bg-muted/50 transition-colors group"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-primary group-hover:underline break-all">
                          {url}
                        </p>
                        <p className="text-xs text-muted-foreground">{platformName}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {(client.seoTitle || client.seoDescription) && (
        <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle>SEO</CardTitle>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      seoOpen && "transform rotate-180"
                    )}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
            {client.seoTitle && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">SEO Title</p>
                <p className="text-sm">{client.seoTitle}</p>
              </div>
            )}
            {client.seoDescription && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">SEO Description</p>
                <p className="text-sm">{client.seoDescription}</p>
              </div>
            )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      <Collapsible open={metadataOpen} onOpenChange={setMetadataOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle>Metadata</CardTitle>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    metadataOpen && "transform rotate-180"
                  )}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
          {client.foundingDate && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Founding Date</p>
              <p>{format(new Date(client.foundingDate), "MMM d, yyyy")}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Created</p>
            <p>{format(new Date(client.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
            <p>{format(new Date(client.updatedAt), "MMM d, yyyy 'at' h:mm a")}</p>
          </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
