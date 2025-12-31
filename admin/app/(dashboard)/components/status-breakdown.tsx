"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Archive } from "lucide-react";

interface StatusBreakdownProps {
  breakdown: {
    draft: number;
    published: number;
    archived: number;
    total: number;
  };
}

export function StatusBreakdown({ breakdown }: StatusBreakdownProps) {
  const percentage = (value: number) => {
    if (breakdown.total === 0) return 0;
    return (value / breakdown.total) * 100;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles by Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href="/articles?status=DRAFT" className="block space-y-2 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="underline">Draft</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{breakdown.draft}</span>
              <span className="text-muted-foreground text-xs">
                ({percentage(breakdown.draft).toFixed(0)}%)
              </span>
            </div>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full transition-all"
              style={{ width: `${percentage(breakdown.draft)}%` }}
            />
          </div>
        </Link>

        <Link href="/articles?status=PUBLISHED" className="block space-y-2 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span className="underline">Published</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{breakdown.published}</span>
              <span className="text-muted-foreground text-xs">
                ({percentage(breakdown.published).toFixed(0)}%)
              </span>
            </div>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${percentage(breakdown.published)}%` }}
            />
          </div>
        </Link>

        <Link href="/articles?status=ARCHIVED" className="block space-y-2 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4 text-muted-foreground" />
              <span className="underline">Archived</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{breakdown.archived}</span>
              <span className="text-muted-foreground text-xs">
                ({percentage(breakdown.archived).toFixed(0)}%)
              </span>
            </div>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-muted-foreground h-full transition-all"
              style={{ width: `${percentage(breakdown.archived)}%` }}
            />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
