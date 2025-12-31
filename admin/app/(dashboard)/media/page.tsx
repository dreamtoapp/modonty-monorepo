import { getMedia } from "./actions/media-actions";
import { PageHeader } from "@/components/shared/page-header";
import { MediaGrid } from "./components/media-grid";

export default async function MediaPage() {
  const media = await getMedia();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Media Library"
        description="Manage all media files in the system"
        actionLabel="Upload Media"
        actionHref="/media/upload"
      />
      <MediaGrid media={media} />
    </div>
  );
}
