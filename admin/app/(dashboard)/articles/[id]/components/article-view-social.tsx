import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Share2 } from "lucide-react";
import { Article } from "../helpers/article-view-types";

interface ArticleViewSocialProps {
  article: Article;
  sectionRef: (el: HTMLElement | null) => void;
}

export function ArticleViewSocial({ article, sectionRef }: ArticleViewSocialProps) {
  return (
    <Card id="section-social" ref={sectionRef} className="scroll-mt-20">
      <CardHeader className="text-right" dir="rtl">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-right">Social & Protocols</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm" dir="rtl">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Open Graph</p>
          <div className="space-y-1 pr-2 border-r-2 border-primary/20">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                  article.ogType
                </Badge>
              </div>
              <span className="font-medium">{article.ogType || "article"}</span>
            </div>
            {article.ogArticlePublishedTime && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Published:</span>
                  <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                    article.ogArticlePublishedTime
                  </Badge>
                </div>
                <span className="font-medium text-xs">
                  {format(new Date(article.ogArticlePublishedTime), "MMM d, yyyy")}
                </span>
              </div>
            )}
            {article.ogArticleModifiedTime && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Modified:</span>
                  <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                    article.ogArticleModifiedTime
                  </Badge>
                </div>
                <span className="font-medium text-xs">
                  {format(new Date(article.ogArticleModifiedTime), "MMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Twitter Card</p>
          <div className="space-y-1 pr-2 border-r-2 border-primary/20">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Card:</span>
                <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                  article.twitterCard
                </Badge>
              </div>
              <span className="font-medium">{article.twitterCard || "Not set"}</span>
            </div>
            {article.twitterSite && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Site:</span>
                  <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                    article.twitterSite
                  </Badge>
                </div>
                <span className="font-medium">{article.twitterSite}</span>
              </div>
            )}
            {article.twitterCreator && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Creator:</span>
                  <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                    article.twitterCreator
                  </Badge>
                </div>
                <span className="font-medium">{article.twitterCreator}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground">Technical SEO</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Sitemap priority:</span>
                <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                  article.sitemapPriority
                </Badge>
              </div>
              <span className="font-medium">
                {typeof article.sitemapPriority === "number"
                  ? article.sitemapPriority.toFixed(2)
                  : "Default"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Change frequency:</span>
                <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                  article.sitemapChangeFreq
                </Badge>
              </div>
              <span className="font-medium">{article.sitemapChangeFreq || "Default"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
