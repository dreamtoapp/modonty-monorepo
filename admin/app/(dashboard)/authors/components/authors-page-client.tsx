"use client";

import { useState } from "react";
import { AuthorTable } from "./author-table";
import { BulkActionsToolbar } from "./bulk-actions-toolbar";

interface Author {
  id: string;
  name: string;
  slug: string;
  jobTitle: string | null;
  verificationStatus: boolean;
  createdAt: Date;
  _count: { articles: number };
  seoTitle?: string | null;
  seoDescription?: string | null;
  imageAlt?: string | null;
  [key: string]: unknown;
}

interface AuthorsPageClientProps {
  authors: Author[];
}

export function AuthorsPageClient({ authors }: AuthorsPageClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <>
      <BulkActionsToolbar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
      />
      <AuthorTable authors={authors} onSelectionChange={setSelectedIds} />
    </>
  );
}
