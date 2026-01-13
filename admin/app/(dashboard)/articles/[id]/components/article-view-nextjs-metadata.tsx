import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Settings } from "lucide-react";
import { Article } from "../helpers/article-view-types";
import { Prisma } from "@prisma/client";

interface ArticleViewNextjsMetadataProps {
  article: Article & {
    nextjsMetadata?: Prisma.JsonValue | null;
    nextjsMetadataLastGenerated?: Date | null;
  };
  sectionRef: (el: HTMLElement | null) => void;
}

export function ArticleViewNextjsMetadata({
  article,
  sectionRef,
}: ArticleViewNextjsMetadataProps) {
  const hasMetadata = article.nextjsMetadata !== null && article.nextjsMetadata !== undefined;

  if (!hasMetadata && !article.nextjsMetadataLastGenerated) return null;

  return (
    <Card id="section-nextjs-metadata" ref={sectionRef} className="scroll-mt-20">
      <CardHeader className="text-left" dir="ltr">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle className="text-left">Next.js Metadata</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4" dir="ltr">
        {article.nextjsMetadataLastGenerated && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Last Generated</p>
              <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                article.nextjsMetadataLastGenerated
              </Badge>
            </div>
            <p className="text-sm font-medium">
              {format(new Date(article.nextjsMetadataLastGenerated), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        )}
        {article.nextjsMetadata && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Metadata</p>
              <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                article.nextjsMetadata
              </Badge>
            </div>
            <div className="p-3 rounded border bg-muted/30">
              <pre className="text-xs font-mono overflow-auto max-h-96">
                <code>{JSON.stringify(article.nextjsMetadata, null, 2)}</code>
              </pre>
            </div>
          </div>
        )}
        {!hasMetadata && !article.nextjsMetadataLastGenerated && (
          <p className="text-sm text-muted-foreground">No Next.js metadata available.</p>
        )}
      </CardContent>
    </Card>
  );
}
