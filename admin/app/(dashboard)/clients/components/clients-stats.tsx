import { AnalticCard } from "@/components/shared/analtic-card";
import { SEOScoreOverall } from "@/components/shared/seo-doctor";
import { Building2, FileText, FileX, Calendar } from "lucide-react";

interface ClientsStatsProps {
  stats: {
    total: number;
    withArticles: number;
    withoutArticles: number;
    createdThisMonth: number;
    averageSEO: number;
  };
}

export function ClientsStats({ stats }: ClientsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <AnalticCard
        title="Total Clients"
        value={stats.total}
        icon={Building2}
        description="All clients in the system"
      />
      <AnalticCard
        title="With Articles"
        value={stats.withArticles}
        icon={FileText}
        description="Clients with published articles"
      />
      <AnalticCard
        title="Without Articles"
        value={stats.withoutArticles}
        icon={FileX}
        description="Clients with no articles"
      />
      <AnalticCard
        title="This Month"
        value={stats.createdThisMonth}
        icon={Calendar}
        description="Created this month"
      />
      <SEOScoreOverall value={stats.averageSEO} />
    </div>
  );
}
