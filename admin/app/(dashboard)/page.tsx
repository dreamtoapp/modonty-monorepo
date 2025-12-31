import { getDashboardStats, getRecentArticles, getStatusBreakdown } from "./actions/dashboard-actions";
import { StatsCard } from "./components/stats-card";
import { RecentArticles } from "./components/recent-articles";
import { StatusBreakdown } from "./components/status-breakdown";
import { FileText, Building2, Users, Mail } from "lucide-react";

export default async function DashboardPage() {
  const [stats, recentArticles, statusBreakdown] = await Promise.all([
    getDashboardStats(),
    getRecentArticles(),
    getStatusBreakdown(),
  ]);

  return (
    <div className="container mx-auto max-w-[1128px] space-y-6">
      <div>
        <h1 className="text-2xl font-semibold leading-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to the admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Articles"
          value={stats.articles}
          icon={FileText}
          description="All articles in the system"
        />
        <StatsCard
          title="Clients"
          value={stats.clients}
          icon={Building2}
          description="Active clients"
        />
        <StatsCard
          title="Users"
          value={stats.users}
          icon={Users}
          description="Registered users"
        />
        <StatsCard
          title="Subscribers"
          value={stats.subscribers}
          icon={Mail}
          description="Newsletter subscribers"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentArticles articles={recentArticles} />
        </div>
        <div className="self-start">
          <StatusBreakdown breakdown={statusBreakdown} />
        </div>
      </div>
    </div>
  );
}
