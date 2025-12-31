import { redirect } from "next/navigation";
import { getClientById, getClientArticles, getClientAnalytics } from "../actions/clients-actions";
import { PageHeader } from "@/components/shared/page-header";
import { ClientView } from "./components/client-view";
import { ClientArticles } from "./components/client-articles";
import { ClientAnalytics } from "./components/client-analytics";

export default async function ClientViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [client, articles, analytics] = await Promise.all([
    getClientById(id),
    getClientArticles(id),
    getClientAnalytics(id),
  ]);

  if (!client) {
    redirect("/clients");
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Client Details"
        description="View client information, articles, and analytics"
      />
      <div className="space-y-6">
        <ClientView client={client} />
        <ClientAnalytics analytics={analytics} clientId={id} />
        <ClientArticles articles={articles} clientId={id} />
      </div>
    </div>
  );
}
