"use client";

import { useState } from "react";
import { ClientTable } from "./client-table";
import { BulkActionsToolbar } from "./bulk-actions-toolbar";
import { ClientWithCount } from "@/lib/types";

interface ClientsPageClientProps {
  clients: ClientWithCount[];
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
