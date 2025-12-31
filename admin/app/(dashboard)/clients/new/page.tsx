import { createClient } from "../actions/clients-actions";
import { getIndustries } from "../../industries/actions/industries-actions";
import { PageHeader } from "@/components/shared/page-header";
import { ClientForm } from "../components/client-form";

export default async function NewClientPage() {
  const industries = await getIndustries();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Create Client" description="Add a new client to the system" />
      <ClientForm industries={industries} onSubmit={createClient} />
    </div>
  );
}
