"use client";

import { DataTable } from "@/components/admin/data-table";
import { format } from "date-fns";
import Link from "next/link";

interface Industry {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  _count: { clients: number };
}

interface IndustryTableProps {
  industries: Industry[];
}

export function IndustryTable({ industries }: IndustryTableProps) {
  return (
    <DataTable
      data={industries}
      columns={[
        {
          key: "name",
          header: "Name",
          render: (industry) => (
            <Link href={`/industries/${industry.id}`} className="font-medium hover:text-primary">
              {industry.name}
            </Link>
          ),
        },
        { key: "slug", header: "Slug" },
        {
          key: "_count",
          header: "Clients",
          render: (industry) => industry._count.clients,
        },
        {
          key: "createdAt",
          header: "Created",
          render: (industry) => format(new Date(industry.createdAt), "MMM d, yyyy"),
        },
      ]}
      searchKey="name"
      onRowClick={(industry) => {
        window.location.href = `/industries/${industry.id}`;
      }}
    />
  );
}
