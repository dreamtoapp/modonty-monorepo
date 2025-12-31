import { PageHeader } from "@/components/shared/page-header";
import { UploadForm } from "../components/upload-form";

export default function UploadMediaPage() {
  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Upload Media" description="Upload a new media file to the system" />
      <UploadForm />
    </div>
  );
}
