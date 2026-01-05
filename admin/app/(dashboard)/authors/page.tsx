import { getAuthors, getAuthorsStats, AuthorFilters } from "./actions/authors-actions";
import { AuthorsStats } from "./components/authors-stats";
import { AuthorsFilters } from "./components/authors-filters";
import { AuthorsPageClient } from "./components/authors-page-client";
import { ExportButton } from "./components/export-button";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function AuthorsPage({
  searchParams,
}: {
  searchParams: Promise<{
    hasArticles?: string;
    createdFrom?: string;
    createdTo?: string;
    minArticleCount?: string;
    maxArticleCount?: string;
  }>;
}) {
  const params = await searchParams;
  const filters: AuthorFilters = {
    hasArticles:
      params.hasArticles === "yes"
        ? true
        : params.hasArticles === "no"
          ? false
          : undefined,
    createdFrom: params.createdFrom ? new Date(params.createdFrom) : undefined,
    createdTo: params.createdTo ? new Date(params.createdTo) : undefined,
    minArticleCount: params.minArticleCount ? parseInt(params.minArticleCount) : undefined,
    maxArticleCount: params.maxArticleCount ? parseInt(params.maxArticleCount) : undefined,
  };

  const [authors, stats] = await Promise.all([getAuthors(filters), getAuthorsStats()]);

  const getDescription = () => {
    if (filters.hasArticles === true) return "Viewing authors with articles";
    if (filters.hasArticles === false) return "Viewing authors without articles";
    if (filters.createdFrom || filters.createdTo) return "Viewing authors by date range";
    if (filters.minArticleCount !== undefined || filters.maxArticleCount !== undefined)
      return "Viewing authors by article count";
    return "Manage all authors in the system";
  };

  return (
    <div className="container mx-auto max-w-[1128px] space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Authors</h1>
          <p className="text-muted-foreground mt-1">{getDescription()}</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton filters={filters} />
          <Link href="/guidelines/authors">
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Guidelines
            </Button>
          </Link>
          <Link href="/authors/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Author
            </Button>
          </Link>
        </div>
      </div>
      <AuthorsStats stats={stats} />
      <AuthorsFilters />
      <AuthorsPageClient authors={authors} />
    </div>
  );
}
