"use client";

import { useState, useTransition } from "react";
import { MetricsCards } from "./metrics-cards";
import { AnalyticsCharts } from "./analytics-charts";
import { ViewsChart } from "./views-chart";
import { TrafficSourcesChart } from "./traffic-sources-chart";
import { TopArticlesChart } from "./top-articles-chart";
import { DateRangeFilter } from "./date-range-filter";
import { ExportButton } from "./export-button";
import { getAnalyticsData, getViewsTrendData } from "../actions/analytics-actions";

interface AnalyticsPageClientProps {
  initialAnalytics: any;
  initialViewsTrend: any[];
}

export function AnalyticsPageClient({
  initialAnalytics,
  initialViewsTrend,
}: AnalyticsPageClientProps) {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [viewsTrend, setViewsTrend] = useState(initialViewsTrend);
  const [isPending, startTransition] = useTransition();

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    startTransition(async () => {
      try {
        const [newAnalytics, newTrend] = await Promise.all([
          getAnalyticsData({
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          }),
          getViewsTrendData({
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          }),
        ]);

        setAnalytics(newAnalytics);
        setViewsTrend(newTrend);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    });
  };

  const exportData = analytics.topArticles.map((article: any) => ({
    Title: article.title,
    Client: article.client,
    Views: article.views,
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
        <ExportButton data={exportData} filename="analytics-top-articles" />
      </div>

      <MetricsCards
        totalViews={analytics.totalViews}
        uniqueSessions={analytics.uniqueSessions}
        avgTimeOnPage={analytics.avgTimeOnPage}
        bounceRate={analytics.bounceRate}
        avgScrollDepth={analytics.avgScrollDepth}
      />

      {isPending && (
        <div className="text-center py-4 text-muted-foreground">Loading...</div>
      )}

      <ViewsChart data={viewsTrend} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficSourcesChart data={analytics.trafficSources} />
        <TopArticlesChart data={analytics.topArticles} />
      </div>

      <AnalyticsCharts
        topArticles={analytics.topArticles as any}
        trafficSources={analytics.trafficSources}
      />
    </>
  );
}
