import { AnalticCard } from "@/components/shared/analtic-card";
import { SEOScoreOverall } from "@/components/shared/seo-doctor";
import { User, FileText, FileX, Calendar } from "lucide-react";

interface AuthorsStatsProps {
  stats: {
    total: number;
    withArticles: number;
    withoutArticles: number;
    createdThisMonth: number;
    averageSEO: number;
  };
}

export function AuthorsStats({ stats }: AuthorsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <AnalticCard
        title="Total Authors"
        value={stats.total}
        icon={User}
        description="All authors in the system"
      />
      <AnalticCard
        title="With Articles"
        value={stats.withArticles}
        icon={FileText}
        description="Authors with published articles"
      />
      <AnalticCard
        title="Without Articles"
        value={stats.withoutArticles}
        icon={FileX}
        description="Authors with no articles"
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
