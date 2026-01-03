import { getClients, createAuthor } from "../actions/authors-actions";
import { getUsers } from "../../users/actions/users-actions";
import { PageHeader } from "@/components/shared/page-header";
import { AuthorForm } from "../components/author-form";

export default async function NewAuthorPage() {
  const [clients, users] = await Promise.all([getClients(), getUsers()]);

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Create Author" description="Add a new author to the system" />
      <AuthorForm 
        clients={clients} 
        users={users.map(u => ({ id: u.id, name: u.name, email: u.email }))}
        onSubmit={createAuthor} 
      />
    </div>
  );
}
