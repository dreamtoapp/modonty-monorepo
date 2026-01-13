"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Article } from "../helpers/article-view-types";

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

interface ArticleViewRelatedFromProps {
  article: Article;
  sectionRef: (el: HTMLElement | null) => void;
}

export function ArticleViewRelatedFrom({ article, sectionRef }: ArticleViewRelatedFromProps) {
  const hasData = article.relatedFrom && article.relatedFrom.length > 0;

  return (
    <Card id="section-related-from" ref={sectionRef} className="scroll-mt-20">
      <CardHeader className="text-right" dir="rtl">
        <div className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5 text-primary" />
          <CardTitle className="text-right">Related Articles (Incoming Links)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3" dir="rtl">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
            article.relatedFrom
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Articles that link to this article (incoming relationships)
        </p>
        {hasData ? (
          article.relatedFrom!.map((rel) => (
            <Link
              key={rel.id}
              href={`/articles/${rel.article.id}`}
              className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {rel.article.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="font-mono break-all">/{rel.article.slug}</span>
                    {rel.relationshipType && (
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {rel.relationshipType}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Relationship ID:</span>
                    <CopyableId id={rel.id} label="Relationship" />
                    <span className="text-xs text-muted-foreground">Article ID:</span>
                    <CopyableId id={rel.article.id} label="Article" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No other articles link to this article yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
