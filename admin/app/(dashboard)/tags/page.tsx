import { getTags } from "./actions/tags-actions";
import { PageHeader } from "@/components/shared/page-header";
import { TagTable } from "./components/tag-table";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Tags"
        description="Manage all tags in the system"
        actionLabel="New Tag"
        actionHref="/tags/new"
      />
      <TagTable tags={tags} />
    </div>
  );
}
