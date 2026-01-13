import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Link2, Globe, Navigation } from "lucide-react";
import { Article } from "../helpers/article-view-types";

interface ArticleViewSeoProps {
  article: Article;
  sectionRef: (el: HTMLElement | null) => void;
}

export function ArticleViewSeo({ article, sectionRef }: ArticleViewSeoProps) {
  const alternateLanguages = article.alternateLanguages
    ? (Array.isArray(article.alternateLanguages)
        ? article.alternateLanguages
        : typeof article.alternateLanguages === "object"
          ? [article.alternateLanguages]
          : [])
    : [];

  return (
    <Card id="section-seo" ref={sectionRef} className="scroll-mt-20">
      <CardHeader className="text-right" dir="rtl">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          <CardTitle className="text-right">SEO</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4" dir="rtl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">SEO Title</p>
            <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
              article.seoTitle
            </Badge>
          </div>
          <p className="text-sm font-medium">
            {article.seoTitle || <span className="text-muted-foreground italic">Missing</span>}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">SEO Description</p>
            <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
              article.seoDescription
            </Badge>
          </div>
          <p className="text-sm line-clamp-3">
            {article.seoDescription || (
              <span className="text-muted-foreground italic">Missing</span>
            )}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Link2 className="h-3 w-3" />
              Canonical URL
            </p>
            <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
              article.canonicalUrl
            </Badge>
          </div>
          <p className="text-sm">
            {article.canonicalUrl ? (
              <span className="font-mono text-xs break-all text-primary">
                {article.canonicalUrl}
              </span>
            ) : (
              <span className="text-muted-foreground italic">Not set</span>
            )}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Link2 className="h-3 w-3" />
              Main Entity of Page
            </p>
            <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
              article.mainEntityOfPage
            </Badge>
          </div>
          <p className="text-sm">
            {article.mainEntityOfPage ? (
              <span className="font-mono text-xs break-all text-primary">
                {article.mainEntityOfPage}
              </span>
            ) : (
              <span className="text-muted-foreground italic">Not set</span>
            )}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Meta Robots</p>
            <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
              article.metaRobots
            </Badge>
          </div>
          <p className="text-sm font-medium">
            {article.metaRobots || <span className="text-muted-foreground italic">Not set</span>}
          </p>
        </div>
        <div className="pt-2 border-t space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Alternate Languages (hreflang)
            </p>
            <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
              article.alternateLanguages
            </Badge>
          </div>
          {alternateLanguages.length > 0 ? (
            <div className="space-y-2">
              {alternateLanguages.map((lang: any, index: number) => (
                <div key={index} className="flex flex-col gap-1 p-2 rounded border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">hreflang:</span>
                    <Badge variant="outline" className="text-xs font-mono">
                      {lang?.hreflang || "—"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">URL:</span>
                    <span className="text-xs font-mono break-all text-primary">
                      {lang?.url || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No alternate languages set</p>
          )}
        </div>
        <div className="pt-2 border-t space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Navigation className="h-3 w-3" />
              Breadcrumb Path
            </p>
            <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
              article.breadcrumbPath
            </Badge>
          </div>
          {article.breadcrumbPath ? (
            <div className="p-3 rounded border bg-muted/30">
              <pre className="text-xs font-mono overflow-auto max-h-64">
                <code>{JSON.stringify(article.breadcrumbPath, null, 2)}</code>
              </pre>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No breadcrumb path set</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
