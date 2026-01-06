import { redirect } from "next/navigation";
import { getClientById, createClient } from "../../actions/clients-actions";
import { getIndustries } from "../../../industries/actions/industries-actions";
import { PageHeader } from "@/components/shared/page-header";
import { ClientForm } from "../../components/client-form";
import { DeleteClientButton } from "../components/delete-client-button";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client, industries] = await Promise.all([getClientById(id), getIndustries()]);

  if (!client) {
    redirect("/clients");
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Edit Client"
        description="Review core details first, then expand advanced sections only when you need to adjust them."
      />
      <div className="mb-6">
        <DeleteClientButton clientId={id} />
      </div>
      <ClientForm initialData={client} industries={industries} onSubmit={createClient} clientId={id} />
    </div>
  );
}
