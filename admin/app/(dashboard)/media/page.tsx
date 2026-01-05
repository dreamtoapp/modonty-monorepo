import { getMedia, getClients, type MediaFilters } from "./actions/media-actions";
import { PageHeader } from "@/components/shared/page-header";
import { MediaGrid } from "./components/media-grid";
import { MediaFilters as MediaFiltersComponent } from "./components/media-filters";
import { MediaToolbar } from "./components/media-toolbar";
import { MediaPageClient } from "./components/media-page-client";

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{
    clientId?: string;
    mimeType?: string;
    search?: string;
    used?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  
  const filters: MediaFilters = {
    clientId: params.clientId && params.clientId !== "all" ? params.clientId : undefined,
    mimeType: params.mimeType && params.mimeType !== "all" ? params.mimeType : undefined,
    search: params.search || undefined,
    used: params.used === "used" ? true : params.used === "unused" ? false : undefined,
  };

  const [media, clients] = await Promise.all([
    getMedia(filters),
    getClients(),
  ]);

  // Transform client from null to undefined to match Media type
  const transformedMedia = media.map((m) => ({
    ...m,
    client: m.client || undefined,
  }));

  return (
    <div className="container mx-auto max-w-[1128px] space-y-6">
      <PageHeader
        title="Media Library"
        description="Manage all media files in the system"
      />
      <MediaFiltersComponent clients={clients} defaultClientId={params.clientId} />
      <MediaPageClient media={transformedMedia} sortBy={params.sort || "newest"} />
    </div>
  );
}
