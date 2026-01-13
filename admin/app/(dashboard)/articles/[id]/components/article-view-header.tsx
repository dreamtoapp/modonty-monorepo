"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { getStatusLabel, getStatusVariant } from "../../helpers/status-utils";
import { SEOHealthGauge } from "@/components/shared/seo-doctor/seo-health-gauge";
import { articleSEOConfig } from "../../helpers/article-seo-config";
import {
  Calendar,
  Clock,
  FileText,
  User,
  Building2,
  Folder,
  ExternalLink,
  Star,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Article } from "../helpers/article-view-types";

interface ArticleViewHeaderProps {
  article: Article;
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

export function ArticleViewHeader({ article }: ArticleViewHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            {article.featured && (
              <Badge variant="outline" className="text-sm px-3 py-1 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700">
                <Star className="h-3.5 w-3.5 mr-1.5 fill-yellow-500 dark:fill-yellow-400" />
                Featured
              </Badge>
            )}
            <Badge variant={getStatusVariant(article.status)} className="text-sm px-3 py-1">
              {getStatusLabel(article.status)}
            </Badge>
            {article.client?.name && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="font-medium text-foreground">{article.client.name}</span>
                <CopyableId id={article.client.id} label="Client" />
              </div>
            )}
            {article.category?.name && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Folder className="h-4 w-4" />
                <span className="font-medium text-foreground">{article.category.name}</span>
                <CopyableId id={article.category.id} label="Category" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {article.author?.name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author.name}</span>
                <CopyableId id={article.author.id} label="Author" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(article.createdAt), "MMM d, yyyy")}</span>
            </div>
            {article.lastReviewed && (
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Reviewed {format(new Date(article.lastReviewed), "MMM d, yyyy")}</span>
              </div>
            )}
            {article.readingTimeMinutes && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>~{article.readingTimeMinutes} min read</span>
              </div>
            )}
            {article.contentDepth && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{article.contentDepth}</span>
              </div>
            )}
            {article.license && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>License: {article.license}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SEOHealthGauge data={article} config={articleSEOConfig} size="md" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/articles">
                <FileText className="h-4 w-4 mr-2" />
                Back to list
              </Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link href={`/articles/${article.id}`} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                View public
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
