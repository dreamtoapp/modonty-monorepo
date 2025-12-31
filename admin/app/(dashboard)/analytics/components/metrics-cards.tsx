import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricsCardsProps {
  totalViews: number;
  uniqueSessions: number;
  avgTimeOnPage: number;
  bounceRate: number;
  avgScrollDepth: number;
}

export function MetricsCards({
  totalViews,
  uniqueSessions,
  avgTimeOnPage,
  bounceRate,
  avgScrollDepth,
}: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{totalViews.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{uniqueSessions.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Time on Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{avgTimeOnPage}s</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{bounceRate.toFixed(1)}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Scroll Depth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{avgScrollDepth.toFixed(0)}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
