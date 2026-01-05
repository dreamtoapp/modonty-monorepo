import { PageHeader } from "@/components/shared/page-header";
import { UploadZone } from "../components/upload-zone";

export default function UploadMediaPage() {
  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Upload Media" description="Upload media files with drag-and-drop support" />
      <UploadZone />
    </div>
  );
}
