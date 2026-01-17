"use client";

import { useState } from "react";
import { ArticleTable } from "./article-table";
import { BulkActionsToolbar } from "./bulk-actions-toolbar";
import type { Article as ArticleViewType } from "../[id]/helpers/article-view-types";

type Article = ArticleViewType & {
  views: number;
};

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
