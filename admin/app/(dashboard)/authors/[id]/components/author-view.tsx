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
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { SEOHealthGauge } from "@/components/shared/seo-doctor/seo-health-gauge";
import { authorSEOConfig } from "@/components/shared/seo-doctor/seo-configs";

interface Author {
  id: string;
  name: string;
  slug: string;
  jobTitle: string | null;
  worksFor: string | null;
  bio: string | null;
  image: string | null;
  imageAlt: string | null;
  url: string | null;
  linkedIn: string | null;
  twitter: string | null;
  facebook: string | null;
  sameAs: string[];
  credentials: string[];
  qualifications: string[];
  expertiseAreas: string[];
  experienceYears: number | null;
  verificationStatus: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    articles: number;
  };
}

interface AuthorViewProps {
  author: Author;
}

export function AuthorView({ author }: AuthorViewProps) {
  const [basicOpen, setBasicOpen] = useState(true);
  const [professionalOpen, setProfessionalOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {author.image && (
            <img
              src={author.image}
              alt={author.imageAlt || author.name}
              className="h-16 w-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-semibold">{author.name}</h1>
            {author.jobTitle && (
              <p className="text-sm text-muted-foreground">{author.jobTitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SEOHealthGauge data={author} config={authorSEOConfig} size="md" />
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/authors">Back</Link>
            </Button>
            <Button asChild>
              <Link href={`/authors/${author.id}/edit`}>Edit</Link>
            </Button>
          </div>
        </div>
      </div>

      <Collapsible open={basicOpen} onOpenChange={setBasicOpen}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle>Basic Information</CardTitle>
              {basicOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="text-sm font-medium">{author.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Slug</p>
                <p className="font-mono text-sm">{author.slug}</p>
              </div>
              {author.jobTitle && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Job Title</p>
                  <p className="text-sm">{author.jobTitle}</p>
                </div>
              )}
              {author.bio && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bio</p>
                  <p className="text-sm whitespace-pre-wrap">{author.bio}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Articles</p>
                <Link
                  href={`/articles?authorId=${author.id}`}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {author._count.articles} {author._count.articles === 1 ? "article" : "articles"}
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Verification Status</p>
                <Badge variant={author.verificationStatus ? "default" : "secondary"}>
                  {author.verificationStatus ? "Verified" : "Not Verified"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="text-sm">{format(new Date(author.createdAt), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="text-sm">{format(new Date(author.updatedAt), "MMM d, yyyy")}</p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={professionalOpen} onOpenChange={setProfessionalOpen}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle>Professional Information</CardTitle>
              {professionalOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              {author.experienceYears !== null && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Experience Years</p>
                  <p className="text-sm">{author.experienceYears} years</p>
                </div>
              )}
              {author.credentials.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credentials</p>
                  <div className="flex flex-wrap gap-2">
                    {author.credentials.map((cred, idx) => (
                      <Badge key={idx} variant="secondary">
                        {cred}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {author.qualifications.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Qualifications</p>
                  <div className="flex flex-wrap gap-2">
                    {author.qualifications.map((qual, idx) => (
                      <Badge key={idx} variant="secondary">
                        {qual}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {author.expertiseAreas.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Expertise Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {author.expertiseAreas.map((area, idx) => (
                      <Badge key={idx} variant="outline">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={socialOpen} onOpenChange={setSocialOpen}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle>Social & Links</CardTitle>
              {socialOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              {author.url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Website</p>
                  <a
                    href={author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {author.url}
                  </a>
                </div>
              )}
              {author.linkedIn && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">LinkedIn</p>
                  <a
                    href={author.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {author.linkedIn}
                  </a>
                </div>
              )}
              {author.twitter && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Twitter</p>
                  <a
                    href={author.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {author.twitter}
                  </a>
                </div>
              )}
              {author.facebook && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Facebook</p>
                  <a
                    href={author.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {author.facebook}
                  </a>
                </div>
              )}
              {author.sameAs.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Additional Profiles</p>
                  <div className="flex flex-col gap-2">
                    {author.sameAs.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle>SEO</CardTitle>
              {seoOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              {author.seoTitle && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">SEO Title</p>
                  <p className="text-sm">{author.seoTitle}</p>
                </div>
              )}
              {author.seoDescription && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">SEO Description</p>
                  <p className="text-sm">{author.seoDescription}</p>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
