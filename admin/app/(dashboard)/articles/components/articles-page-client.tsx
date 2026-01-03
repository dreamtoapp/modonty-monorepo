"use client";

import { useState } from "react";
import { ArticleTable } from "./article-table";
import { BulkActionsToolbar } from "./bulk-actions-toolbar";
import { ArticleStatus } from "@prisma/client";

interface Article {
  id: string;
  title: string;
  status: ArticleStatus;
  createdAt: Date;
  datePublished: Date | null;
  scheduledAt: Date | null;
  views: number;
  client: { name: string } | null;
  category: { name: string } | null;
  author: { name: string } | null;
  [key: string]: unknown;
}

interface ArticlesPageClientProps {
  articles: Article[];
}

export function ArticlesPageClient({ articles }: ArticlesPageClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <>
      <BulkActionsToolbar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
      />
      <ArticleTable articles={articles} onSelectionChange={setSelectedIds} />
    </>
  );
}
