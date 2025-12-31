import { getClients, createAuthor } from "../actions/authors-actions";
import { PageHeader } from "@/components/shared/page-header";
import { AuthorForm } from "../components/author-form";

export default async function NewAuthorPage() {
  const clients = await getClients();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Create Author" description="Add a new author to the system" />
      <AuthorForm clients={clients} onSubmit={createAuthor} />
    </div>
  );
}
