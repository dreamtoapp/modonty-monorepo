"use client";

import { DataTable } from "@/components/admin/data-table";
import { format } from "date-fns";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  createdAt: Date;
  _count: {
    articles: number;
  };
}

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps) {
  return (
    <DataTable
      data={clients}
      columns={[
        {
          key: "name",
          header: "Name",
          render: (client) => (
            <Link href={`/clients/${client.id}`} className="font-medium hover:text-primary">
              {client.name}
            </Link>
          ),
        },
        {
          key: "slug",
          header: "Slug",
        },
        {
          key: "email",
          header: "Email",
          render: (client) => client.email || "-",
        },
        {
          key: "_count",
          header: "Articles",
          render: (client) => client._count.articles,
        },
        {
          key: "createdAt",
          header: "Created",
          render: (client) => format(new Date(client.createdAt), "MMM d, yyyy"),
        },
      ]}
      searchKey="name"
      searchPlaceholder="Search clients..."
      onRowClick={(client) => {
        window.location.href = `/clients/${client.id}`;
      }}
    />
  );
}
