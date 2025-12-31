"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ClientAnalyticsProps {
  analytics: {
    totalViews: number;
    uniqueSessions: number;
    avgTimeOnPage: number;
    bounceRate: number;
    avgScrollDepth: number;
  };
  clientId: string;
}

export function ClientAnalytics({ analytics, clientId }: ClientAnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Analytics Summary</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/analytics?clientId=${clientId}`}>View Full Analytics</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{analytics.totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{analytics.uniqueSessions.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Time on Page</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{analytics.avgTimeOnPage}s</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{analytics.bounceRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Scroll Depth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{analytics.avgScrollDepth.toFixed(0)}%</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
