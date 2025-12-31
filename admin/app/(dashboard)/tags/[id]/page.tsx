import { redirect } from "next/navigation";
import { getTagById, updateTag } from "../actions/tags-actions";
import { PageHeader } from "@/components/shared/page-header";
import { TagForm } from "../components/tag-form";
import { DeleteTagButton } from "./components/delete-tag-button";

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tag = await getTagById(id);

  if (!tag) {
    redirect("/tags");
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Edit Tag</h1>
          <p className="text-muted-foreground mt-1">Update tag information</p>
        </div>
        <DeleteTagButton tagId={id} />
      </div>
      <TagForm initialData={tag} onSubmit={(data) => updateTag(id, data)} />
    </div>
  );
}
