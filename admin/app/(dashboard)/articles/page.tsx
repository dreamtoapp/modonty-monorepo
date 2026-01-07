import { getArticles, getArticlesStats, getClients, getCategories, getAuthors, ArticleFilters } from "./actions/articles-actions";
import { ArticlesStats } from "./components/articles-stats";
import { ArticlesFilters } from "./components/articles-filters";
import { BulkActionsToolbar } from "./components/bulk-actions-toolbar";
import { ArticleStatus } from "@prisma/client";
import { ArticlesPageClient } from "./components/articles-page-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    clientId?: string;
    categoryId?: string;
    authorId?: string;
    createdFrom?: string;
    createdTo?: string;
    publishedFrom?: string;
    publishedTo?: string;
  }>;
}) {
  const params = await searchParams;
  const filters: ArticleFilters = {
    status: params.status && Object.values(ArticleStatus).includes(params.status as ArticleStatus)
      ? (params.status as ArticleStatus)
      : undefined,
    clientId: params.clientId || undefined,
    categoryId: params.categoryId || undefined,
    authorId: params.authorId || undefined,
    createdFrom: params.createdFrom ? new Date(params.createdFrom) : undefined,
    createdTo: params.createdTo ? new Date(params.createdTo) : undefined,
    publishedFrom: params.publishedFrom ? new Date(params.publishedFrom) : undefined,
    publishedTo: params.publishedTo ? new Date(params.publishedTo) : undefined,
  };
  
  const [articles, stats, clients, categories, authors] = await Promise.all([
    getArticles(filters),
    getArticlesStats(),
    getClients(),
    getCategories(),
    getAuthors(),
  ]);

  const getStatusDescription = () => {
    if (filters.status === "DRAFT") return "Viewing draft articles";
    if (filters.status === "PUBLISHED") return "Viewing published articles";
    if (filters.status === "ARCHIVED") return "Viewing archived articles";
    return "Manage all articles in the system";
  };

  return (
    <div className="container mx-auto max-w-[1128px] space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Articles</h1>
          <p className="text-muted-foreground mt-1">{getStatusDescription()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/articles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </Link>
        </div>
      </div>
      <ArticlesStats stats={stats} />
      <ArticlesFilters clients={clients} categories={categories} authors={authors} />
      <ArticlesPageClient articles={articles} />
    </div>
  );
}
