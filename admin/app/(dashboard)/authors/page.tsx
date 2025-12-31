import { getAuthors } from "./actions/authors-actions";
import { PageHeader } from "@/components/shared/page-header";
import { AuthorTable } from "./components/author-table";

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Authors"
        description="Manage all authors in the system"
        actionLabel="New Author"
        actionHref="/authors/new"
      />
      <AuthorTable authors={authors} />
    </div>
  );
}
