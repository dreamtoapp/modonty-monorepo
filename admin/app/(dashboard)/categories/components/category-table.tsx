"use client";

import { DataTable } from "@/components/admin/data-table";
import { format } from "date-fns";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  parent: { name: string } | null;
  _count: { articles: number };
}

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  return (
    <DataTable
      data={categories}
      columns={[
        {
          key: "name",
          header: "Name",
          render: (category) => (
            <Link href={`/categories/${category.id}`} className="font-medium hover:text-primary">
              {category.name}
            </Link>
          ),
        },
        { key: "slug", header: "Slug" },
        {
          key: "parent",
          header: "Parent",
          render: (category) => category.parent?.name || "-",
        },
        {
          key: "_count",
          header: "Articles",
          render: (category) => category._count.articles,
        },
        {
          key: "createdAt",
          header: "Created",
          render: (category) => format(new Date(category.createdAt), "MMM d, yyyy"),
        },
      ]}
      searchKey="name"
      onRowClick={(category) => {
        window.location.href = `/categories/${category.id}`;
      }}
    />
  );
}
