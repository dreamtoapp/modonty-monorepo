import { StatsCard } from "@/app/(dashboard)/components/stats-card";
import { Building2, FileText, FileX, Calendar } from "lucide-react";

interface ClientsStatsProps {
  stats: {
    total: number;
    withArticles: number;
    withoutArticles: number;
    createdThisMonth: number;
  };
}

export function ClientsStats({ stats }: ClientsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Clients"
        value={stats.total}
        icon={Building2}
        description="All clients in the system"
      />
      <StatsCard
        title="With Articles"
        value={stats.withArticles}
        icon={FileText}
        description="Clients with published articles"
      />
      <StatsCard
        title="Without Articles"
        value={stats.withoutArticles}
        icon={FileX}
        description="Clients with no articles"
      />
      <StatsCard
        title="This Month"
        value={stats.createdThisMonth}
        icon={Calendar}
        description="Created this month"
      />
    </div>
  );
}
