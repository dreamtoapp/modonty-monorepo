"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArticleStatus } from "@prisma/client";
import { getStatusLabel, getStatusVariant } from "../../helpers/status-utils";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: ArticleStatus;
  createdAt: Date;
  updatedAt: Date;
  datePublished: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  client: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  author: { id: string; name: string } | null;
}

interface ArticleViewProps {
  article: Article;
}

export function ArticleView({ article }: ArticleViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant={getStatusVariant(article.status)}>
            {getStatusLabel(article.status)}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/articles">Back</Link>
          </Button>
          <Button asChild>
            <Link href={`/articles/${article.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{article.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Slug</p>
            <p className="font-mono text-sm">{article.slug}</p>
          </div>
          {article.excerpt && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Excerpt</p>
              <p className="text-sm">{article.excerpt}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Content</p>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{article.content}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relationships</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Client</p>
            <p>{article.client?.name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Category</p>
            <p>{article.category?.name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Author</p>
            <p>{article.author?.name || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Created</p>
            <p>{format(new Date(article.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
            <p>{format(new Date(article.updatedAt), "MMM d, yyyy 'at' h:mm a")}</p>
          </div>
          {article.datePublished && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Published</p>
              <p>{format(new Date(article.datePublished), "MMM d, yyyy 'at' h:mm a")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {(article.seoTitle || article.seoDescription) && (
        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {article.seoTitle && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">SEO Title</p>
                <p>{article.seoTitle}</p>
              </div>
            )}
            {article.seoDescription && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">SEO Description</p>
                <p>{article.seoDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
