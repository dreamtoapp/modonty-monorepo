"use client";

import { DataTable } from "@/components/admin/data-table";
import { format } from "date-fns";
import Link from "next/link";

interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  _count: { articles: number };
}

interface TagTableProps {
  tags: Tag[];
}

export function TagTable({ tags }: TagTableProps) {
  return (
    <DataTable
      data={tags}
      columns={[
        {
          key: "name",
          header: "Name",
          render: (tag) => (
            <Link href={`/tags/${tag.id}`} className="font-medium hover:text-primary">
              {tag.name}
            </Link>
          ),
        },
        { key: "slug", header: "Slug" },
        {
          key: "_count",
          header: "Articles",
          render: (tag) => tag._count.articles,
        },
        {
          key: "createdAt",
          header: "Created",
          render: (tag) => format(new Date(tag.createdAt), "MMM d, yyyy"),
        },
      ]}
      searchKey="name"
      onRowClick={(tag) => {
        window.location.href = `/tags/${tag.id}`;
      }}
    />
  );
}
