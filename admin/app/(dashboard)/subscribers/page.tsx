import { getSubscribers } from "./actions/subscribers-actions";
import { PageHeader } from "@/components/shared/page-header";
import { SubscriberTable } from "./components/subscriber-table";

export default async function SubscribersPage() {
  const subscribers = await getSubscribers();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Subscribers"
        description="Manage all newsletter subscribers in the system"
      />
      <SubscriberTable subscribers={subscribers} />
    </div>
  );
}
