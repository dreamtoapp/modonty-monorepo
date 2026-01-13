"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FileText, Copy, Check, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Article, ContentStats } from "../helpers/article-view-types";

interface ArticleViewInfoProps {
  article: Article;
  contentStats: ContentStats;
  sectionRef: (el: HTMLElement | null) => void;
}

function CopyableId({ id, label }: { id: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      toast({
        title: "Copied",
        description: `${label} ID copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-mono text-muted-foreground">{id}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4"
        onClick={handleCopy}
        title={`Copy ${label} ID`}
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-600" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}

export function ArticleViewInfo({ article, contentStats, sectionRef }: ArticleViewInfoProps) {
  return (
    <Card id="section-info" ref={sectionRef} className="scroll-mt-20">
      <CardHeader className="text-right" dir="rtl">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="text-right">Article Info</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4" dir="rtl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Last Updated</p>
            <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
              article.updatedAt
            </Badge>
          </div>
          <p className="text-sm font-medium">
            {format(new Date(article.updatedAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        {article.datePublished && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Published</p>
              <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                article.datePublished
              </Badge>
            </div>
            <p className="text-sm font-medium">
              {format(new Date(article.datePublished), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        )}
        {article.scheduledAt && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Scheduled</p>
              <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                article.scheduledAt
              </Badge>
            </div>
            <p className="text-sm font-medium">
              {format(new Date(article.scheduledAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        )}
        <div className="pt-2 border-t space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Language</p>
              <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                article.inLanguage
              </Badge>
            </div>
            <p className="text-sm font-medium">{article.inLanguage || "—"}</p>
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">Tags</p>
                <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                  article.tags
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((t) => (
                  <div key={t.tag.id} className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-xs">
                      {t.tag.name}
                    </Badge>
                    <CopyableId id={t.tag.id} label="Tag" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {article.versions && article.versions.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Versions</p>
                <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                  article.versions
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {article.versions.length}
                </Badge>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {article.versions.map((version, index) => (
                  <div key={version.id} className="flex flex-col gap-1 p-2 rounded border bg-muted/30 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Version {article.versions!.length - index}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(version.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                        {version.createdBy && (
                          <span className="text-xs text-muted-foreground">by {version.createdBy}</span>
                        )}
                      </div>
                      <CopyableId id={version.id} label="Version" />
                    </div>
                    <p className="text-xs font-medium truncate">{version.title}</p>
                    {version.seoTitle && version.seoTitle !== version.title && (
                      <p className="text-xs text-muted-foreground truncate">SEO: {version.seoTitle}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
