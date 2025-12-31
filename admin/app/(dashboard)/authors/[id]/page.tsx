import { redirect } from "next/navigation";
import { getAuthorById, getClients, updateAuthor } from "../actions/authors-actions";
import { PageHeader } from "@/components/shared/page-header";
import { AuthorForm } from "../components/author-form";
import { DeleteAuthorButton } from "./components/delete-author-button";

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [author, clients] = await Promise.all([getAuthorById(id), getClients()]);

  if (!author) {
    redirect("/authors");
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Edit Author</h1>
          <p className="text-muted-foreground mt-1">Update author information</p>
        </div>
        <DeleteAuthorButton authorId={id} />
      </div>
      <AuthorForm
        initialData={author}
        clients={clients}
        onSubmit={(data) => updateAuthor(id, data)}
      />
    </div>
  );
}
