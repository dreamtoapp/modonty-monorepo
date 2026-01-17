"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye, Users, Clock, TrendingDown, MousePointerClick, BarChart3, Search, Share2, Mail, ExternalLink, FileText } from "lucide-react";
import { AnalticCard } from "@/components/shared/analtic-card";
import { ClientDeliveryMetrics } from "./client-delivery-metrics";

interface ChannelSummary {
  views: number;
  sessions: number;
  avgTimeOnPage: number;
  bounceRate: number;
  avgScrollDepth: number;
}

interface TopArticle {
  articleId: string;
  title: string;
  client: string;
  views: number;
}

interface ClientAnalyticsProps {
  analytics: {
    totalViews: number;
    uniqueSessions: number;
    avgTimeOnPage: number;
    bounceRate: number;
    avgScrollDepth: number;
    topArticles?: TopArticle[];
    trafficSources?: Record<string, number>;
    channelSummary?: Record<string, ChannelSummary>;
  };
  clientId: string;
  client: {
    subscriptionTier?: string | null;
    subscriptionStatus: string;
    subscriptionStartDate: Date | null;
    subscriptionEndDate: Date | null;
    articlesPerMonth: number | null;
    subscriptionTierConfig?: {
      articlesPerMonth: number;
      price: number;
      tier: string;
    } | null;
    _count: {
      articles: number;
    };
  };
  articlesThisMonth: number;
  totalArticles: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function ClientAnalytics({ analytics, clientId, client, articlesThisMonth, totalArticles }: ClientAnalyticsProps) {
  const engagementScore = Math.round(
    (Math.min(analytics.avgTimeOnPage / 120, 1) * 50 + Math.min(analytics.avgScrollDepth / 100, 1) * 50)
  );

  const channelSummary = analytics.channelSummary || {};
  const topArticles = analytics.topArticles || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analytics</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive metrics with traffic sources, engagement data, and top performing content
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/analytics?clientId=${clientId}`}>View Full Analytics</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <AnalticCard
              title="Total Views"
              value={formatNumber(analytics.totalViews)}
              icon={Eye}
              description="All time"
              info="Total number of page views tracked for this client's articles in the last 30 days. Each time a user loads an article page, it counts as one view."
            />
            <AnalticCard
              title="Sessions"
              value={formatNumber(analytics.uniqueSessions)}
              icon={Users}
              description="Unique visitors"
              info="Number of unique visitor sessions in the last 30 days. A session is identified by a unique browser session ID. Multiple views from the same session count as one session."
            />
            <AnalticCard
              title="Articles"
              value={formatNumber(totalArticles)}
              icon={FileText}
              description={`${articlesThisMonth} this month`}
            />
            <AnalticCard
              title="Engagement"
              value={`${engagementScore}%`}
              icon={BarChart3}
              description={`${Math.round(analytics.avgTimeOnPage)}s avg time`}
              info="Engagement score calculated from time on page (max 120 seconds = 50 points) and scroll depth (max 100% = 50 points). Formula: (time/120 × 50) + (scroll/100 × 50). Higher scores indicate better user engagement."
            />
            <AnalticCard
              title="Bounce Rate"
              value={`${analytics.bounceRate.toFixed(1)}%`}
              icon={TrendingDown}
              description={`${analytics.avgScrollDepth.toFixed(0)}% scroll`}
              info="Percentage of visitors who left within 10 seconds of viewing the page. A bounce is recorded when timeOnPage < 10 seconds. Lower bounce rates indicate better content engagement."
            />
            <AnalticCard
              title="Time on Page"
              value={`${Math.round(analytics.avgTimeOnPage)}s`}
              icon={Clock}
              description="Average"
              info="Average time in seconds that users spent reading articles. Calculated from the timeOnPage field in analytics records. Only records with valid timeOnPage values are included in the average."
            />
          </div>
        </CardContent>
      </Card>

      <ClientDeliveryMetrics
        client={client}
        articlesThisMonth={articlesThisMonth}
        totalArticles={totalArticles}
      />

      {Object.keys(channelSummary).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(channelSummary).map(([channel, stats]) => {
                const getIcon = () => {
                  switch (channel.toLowerCase()) {
                    case "organic":
                      return Search;
                    case "social":
                      return Share2;
                    case "email":
                      return Mail;
                    default:
                      return ExternalLink;
                  }
                };
                const Icon = getIcon();
                const percentage = analytics.totalViews > 0
                  ? Math.round((stats.views / analytics.totalViews) * 100)
                  : 0;

                return (
                  <Card key={channel}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-sm font-medium">{channel}</CardTitle>
                        </div>
                        <Badge variant="outline">{percentage}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Views</p>
                        <p className="text-lg font-semibold">{formatNumber(stats.views)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Sessions</p>
                          <p className="font-medium">{formatNumber(stats.sessions)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Bounce</p>
                          <p className="font-medium">{stats.bounceRate.toFixed(1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {topArticles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topArticles.slice(0, 5).map((article, index) => (
                <div
                  key={article.articleId}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/articles/${article.articleId}`}
                        className="font-medium hover:text-primary hover:underline block truncate"
                      >
                        {article.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatNumber(article.views)} views
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{formatNumber(article.views)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
