import { AnalticCard } from "@/components/shared/analtic-card";
import { FileText, CheckCircle2, Edit, Archive, Calendar } from "lucide-react";
import { SEOScoreOverall } from "@/components/shared/seo-doctor";

interface ArticlesStatsProps {
  stats: {
    total: number;
    published: number;
    draft: number;
    scheduled: number;
    archived: number;
    publishedThisMonth: number;
    averageSEO: number;
  };
}

export function ArticlesStats({ stats }: ArticlesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <AnalticCard
        title="Total Articles"
        value={stats.total}
        icon={FileText}
        description="All articles in the system"
      />
      <AnalticCard
        title="Published"
        value={stats.published}
        icon={CheckCircle2}
        description="Live articles"
      />
      <AnalticCard
        title="Drafts"
        value={stats.draft}
        icon={Edit}
        description="In progress"
      />
      <AnalticCard
        title="Archived"
        value={stats.archived}
        icon={Archive}
        description="Archived articles"
      />
      <AnalticCard
        title="This Month"
        value={stats.publishedThisMonth}
        icon={Calendar}
        description="Published this month"
      />
      <SEOScoreOverall value={stats.averageSEO} />
    </div>
  );
}
