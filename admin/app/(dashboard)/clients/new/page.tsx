import { createClient } from "../actions/clients-actions";
import { PageHeader } from "@/components/shared/page-header";
import { ClientForm } from "../components/client-form";

export default function NewClientPage() {
  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Create Client" description="Add a new client to the system" />
      <ClientForm onSubmit={createClient} />
    </div>
  );
}
