import { AnalticCard } from "@/components/shared/analtic-card";
import { SEOScoreOverall } from "@/components/shared/seo-doctor";
import type { ClientsStats as ClientsStatsType } from "../actions/clients-actions/types";

interface ClientsStatsProps {
  stats: ClientsStatsType;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function ClientsStats({ stats }: ClientsStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      <AnalticCard
        title="Articles"
        value={formatNumber(stats.articles.total)}
        icon="FileText"
        description={`${stats.articles.thisMonth} this month`}
      />
      <AnalticCard
        title="Total Views"
        value={formatNumber(stats.views.total)}
        icon="Eye"
        description={`${formatNumber(stats.views.thisMonth)} this month`}
      />
      <AnalticCard
        title="Engagement"
        value={`${stats.engagement.engagementScore}%`}
        icon="BarChart3"
        description={`${Math.round(stats.engagement.avgTimeOnPage)}s avg time`}
      />
      <AnalticCard
        title="Bounce Rate"
        value={`${stats.engagement.bounceRate}%`}
        icon="TrendingUp"
        description={`${Math.round(stats.engagement.avgScrollDepth)}% scroll`}
      />
      <AnalticCard
        title="Organic"
        value={formatNumber(stats.traffic.organic)}
        icon="Search"
        description="Organic search"
      />
      <AnalticCard
        title="New Clients"
        value={stats.createdThisMonth}
        icon="Users"
        description={`${stats.growth.newClientsTrend >= 0 ? "+" : ""}${stats.growth.newClientsTrend}% trend`}
      />
      <AnalticCard
        title="Delivery"
        value={`${stats.delivery.deliveryRate}%`}
        icon="Package"
        description={`${stats.delivery.totalDelivered}/${stats.delivery.totalPromised}`}
      />
      <AnalticCard
        title="Retention"
        value={`${stats.growth.retentionRate}%`}
        icon="Target"
        description={`${stats.withArticles} with content`}
      />
      <SEOScoreOverall value={stats.averageSEO} />
    </div>
  );
}
