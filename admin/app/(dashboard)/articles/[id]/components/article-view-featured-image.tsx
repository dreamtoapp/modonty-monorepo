"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Article } from "../helpers/article-view-types";

interface ArticleViewFeaturedImageProps {
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

export function ArticleViewFeaturedImage({
  article,
  sectionRef,
}: ArticleViewFeaturedImageProps) {
  if (!article.featuredImage) return null;

  return (
    <Card
      id="section-featured-image"
      ref={sectionRef}
      className="overflow-hidden scroll-mt-20"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={article.featuredImage.url}
          alt={article.featuredImage.altText || article.title}
          className="h-full w-full object-cover"
        />
        {article.featuredImage.altText && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-white text-sm text-right" dir="rtl">
            <div className="flex items-center justify-between gap-4">
              <span>{article.featuredImage.altText}</span>
              <CopyableId id={article.featuredImage.id} label="Featured Image" />
            </div>
          </div>
        )}
        {!article.featuredImage.altText && (
          <div className="absolute bottom-4 left-4">
            <CopyableId id={article.featuredImage.id} label="Featured Image" />
          </div>
        )}
      </div>
    </Card>
  );
}
