"use client";

import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";

interface Author {
  id: string;
  name: string;
  slug: string;
  jobTitle: string | null;
  verificationStatus: boolean;
  createdAt: Date;
  _count: { articles: number };
}

interface AuthorTableProps {
  authors: Author[];
}

export function AuthorTable({ authors }: AuthorTableProps) {
  return (
    <DataTable
      data={authors}
      columns={[
        {
          key: "name",
          header: "Name",
          render: (author) => (
            <Link href={`/authors/${author.id}`} className="font-medium hover:text-primary">
              {author.name}
            </Link>
          ),
        },
        { key: "slug", header: "Slug" },
        {
          key: "jobTitle",
          header: "Job Title",
          render: (author) => author.jobTitle || "-",
        },
        {
          key: "_count",
          header: "Articles",
          render: (author) => author._count.articles,
        },
        {
          key: "verificationStatus",
          header: "Verified",
          render: (author) => (
            <Badge variant={author.verificationStatus ? "default" : "secondary"}>
              {author.verificationStatus ? "Verified" : "Not Verified"}
            </Badge>
          ),
        },
        {
          key: "createdAt",
          header: "Created",
          render: (author) => format(new Date(author.createdAt), "MMM d, yyyy"),
        },
      ]}
      searchKey="name"
      onRowClick={(author) => {
        window.location.href = `/authors/${author.id}`;
      }}
    />
  );
}
