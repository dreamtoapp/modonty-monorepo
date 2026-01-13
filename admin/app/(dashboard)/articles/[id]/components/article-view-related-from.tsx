"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Article } from "../helpers/article-view-types";
import { FieldLabel } from "./shared/field-label";
import { CopyableId } from "./shared/copyable-id";

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
          <CardTitle className="text-right flex-1">Related Articles (Incoming Links)</CardTitle>
          <FieldLabel
            label=""
            fieldPath="article.relatedFrom"
            fieldType="RelatedArticle[]"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3" dir="rtl">
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
