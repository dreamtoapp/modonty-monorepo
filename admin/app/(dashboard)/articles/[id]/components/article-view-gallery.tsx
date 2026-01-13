"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Article } from "../helpers/article-view-types";

interface ArticleViewGalleryProps {
  article: Article;
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
      <span className="text-xs font-mono text-white/80">{id}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 text-white hover:bg-white/20"
        onClick={handleCopy}
        title={`Copy ${label} ID`}
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-400" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}

export function ArticleViewGallery({ article, sectionRef }: ArticleViewGalleryProps) {
  if (!article.gallery || article.gallery.length === 0) return null;

  return (
    <Card id="section-gallery" ref={sectionRef} className="scroll-mt-20">
      <CardHeader className="text-right" dir="rtl">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-right">Media Gallery</CardTitle>
        </div>
      </CardHeader>
      <CardContent dir="rtl">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
            article.gallery
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {article.gallery.map((item) =>
            item.media ? (
              <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg border bg-muted/30 group cursor-pointer">
                <img
                  src={item.media.url}
                  alt={item.media.altText || ""}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {item.media.altText && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs text-right" dir="rtl">
                    <div className="flex items-center justify-between gap-2">
                      <span className="line-clamp-1">{item.media.altText}</span>
                      <CopyableId id={item.media.id} label="Media" />
                    </div>
                  </div>
                )}
                {!item.media.altText && (
                  <div className="absolute bottom-2 left-2">
                    <CopyableId id={item.media.id} label="Media" />
                  </div>
                )}
              </div>
            ) : null
          )}
        </div>
      </CardContent>
    </Card>
  );
}
