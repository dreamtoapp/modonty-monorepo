import { getClients } from "./actions/clients-actions";
import { PageHeader } from "@/components/shared/page-header";
import { ClientTable } from "./components/client-table";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Clients"
        description="Manage all clients in the system"
        actionLabel="New Client"
        actionHref="/clients/new"
      />
      <ClientTable clients={clients} />
    </div>
  );
}
