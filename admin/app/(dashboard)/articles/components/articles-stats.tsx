import { StatsCard } from "@/app/(dashboard)/components/stats-card";
import { FileText, CheckCircle2, Edit, Archive, Calendar } from "lucide-react";

interface ArticlesStatsProps {
  stats: {
    total: number;
    published: number;
    draft: number;
    scheduled: number;
    archived: number;
    publishedThisMonth: number;
  };
}

export function ArticlesStats({ stats }: ArticlesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <StatsCard
        title="Total Articles"
        value={stats.total}
        icon={FileText}
        description="All articles in the system"
      />
      <StatsCard
        title="Published"
        value={stats.published}
        icon={CheckCircle2}
        description="Live articles"
      />
      <StatsCard
        title="Drafts"
        value={stats.draft}
        icon={Edit}
        description="In progress"
      />
      <StatsCard
        title="Archived"
        value={stats.archived}
        icon={Archive}
        description="Archived articles"
      />
      <StatsCard
        title="This Month"
        value={stats.publishedThisMonth}
        icon={Calendar}
        description="Published this month"
      />
    </div>
  );
}
