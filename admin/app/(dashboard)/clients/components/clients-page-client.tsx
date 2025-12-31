"use client";

import { useState } from "react";
import { ClientTable } from "./client-table";
import { BulkActionsToolbar } from "./bulk-actions-toolbar";

interface Client {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  createdAt: Date;
  _count: {
    articles: number;
  };
}

interface ClientsPageClientProps {
  clients: Client[];
}

export function ClientsPageClient({ clients }: ClientsPageClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <>
      <BulkActionsToolbar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
      />
      <ClientTable clients={clients} onSelectionChange={setSelectedIds} />
    </>
  );
}
