import { getSubscribers } from "./actions/subscribers-actions";
import { SubscriberTable } from "./components/subscriber-table";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default async function SubscribersPage() {
  const subscribers = await getSubscribers();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Subscribers</h1>
          <p className="text-muted-foreground mt-1">Manage all newsletter subscribers in the system</p>
        </div>
        <Link href="/guidelines/subscribers">
          <Button variant="outline" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Guidelines
          </Button>
        </Link>
      </div>
      <SubscriberTable subscribers={subscribers} />
    </div>
  );
}
