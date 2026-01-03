import { redirect } from "next/navigation";
import { getAuthorById, getClients } from "../../actions/authors-actions";
import { getUsers } from "../../../users/actions/users-actions";
import { PageHeader } from "@/components/shared/page-header";
import { AuthorForm } from "../../components/author-form";
import { DeleteAuthorButton } from "../components/delete-author-button";
import { updateAuthor } from "../../actions/authors-actions";

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [author, clients, users] = await Promise.all([
    getAuthorById(id),
    getClients(),
    getUsers(),
  ]);

  if (!author) {
    redirect("/authors");
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Edit Author" description="Update author information" />
      <div className="mb-6">
        <DeleteAuthorButton authorId={id} />
      </div>
      <AuthorForm
        initialData={author}
        clients={clients}
        users={users.map(u => ({ id: u.id, name: u.name, email: u.email }))}
        onSubmit={(data) => updateAuthor(id, data)}
      />
    </div>
  );
}
