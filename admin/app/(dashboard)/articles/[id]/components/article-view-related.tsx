import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";
import { Article } from "../helpers/article-view-types";

interface ArticleViewRelatedProps {
  article: Article;
  sectionRef: (el: HTMLElement | null) => void;
}

export function ArticleViewRelated({ article, sectionRef }: ArticleViewRelatedProps) {
  if (!article.relatedTo || article.relatedTo.length === 0) return null;

  return (
    <Card id="section-related" ref={sectionRef} className="scroll-mt-20">
      <CardHeader className="text-right" dir="rtl">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <CardTitle className="text-right">Related Articles</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3" dir="rtl">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
            article.relatedTo
          </Badge>
        </div>
        {article.relatedTo.map((rel) => (
          <Link
            key={rel.id}
            href={`/articles/${rel.related.id}`}
            className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
          >
            <p className="text-sm font-medium group-hover:text-primary transition-colors">
              {rel.related.title}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="font-mono break-all">/{rel.related.slug}</span>
              {rel.relationshipType && (
                <Badge variant="secondary" className="text-[10px] uppercase">
                  {rel.relationshipType}
                </Badge>
              )}
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
