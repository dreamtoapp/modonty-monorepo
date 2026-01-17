import { getClients, getClientsStats, ClientFilters } from "./actions/clients-actions";
import { ClientsStats } from "./components/clients-stats";
import { ClientsFilters } from "./components/clients-filters";
import { ClientsPageClient } from "./components/clients-page-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage({
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
  const filters: ClientFilters = {
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

  const [clients, stats] = await Promise.all([getClients(filters), getClientsStats()]);

  const getDescription = () => {
    if (filters.hasArticles === true) return "Viewing clients with articles";
    if (filters.hasArticles === false) return "Viewing clients without articles";
    if (filters.createdFrom || filters.createdTo) return "Viewing clients by date range";
    if (filters.minArticleCount !== undefined || filters.maxArticleCount !== undefined)
      return "Viewing clients by article count";
    return "Manage all clients in the system";
  };

  return (
    <div className="container mx-auto max-w-[1128px] space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">{getDescription()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/clients/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Client
            </Button>
          </Link>
        </div>
      </div>
      <ClientsStats stats={stats} />
      <ClientsFilters />
      <ClientsPageClient clients={clients as any} />
    </div>
  );
}
