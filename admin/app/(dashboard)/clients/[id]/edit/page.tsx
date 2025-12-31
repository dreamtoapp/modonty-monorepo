import { redirect } from "next/navigation";
import { getClientById, updateClient } from "../../actions/clients-actions";
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Edit Client</h1>
          <p className="text-muted-foreground mt-1">Update client information</p>
        </div>
        <DeleteClientButton clientId={id} />
      </div>
      <ClientForm initialData={client} industries={industries} onSubmit={(data) => updateClient(id, data)} />
    </div>
  );
}
