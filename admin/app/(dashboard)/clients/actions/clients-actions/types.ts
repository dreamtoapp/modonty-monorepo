export interface ClientFilters {
  createdFrom?: Date;
  createdTo?: Date;
  minArticleCount?: number;
  maxArticleCount?: number;
  hasArticles?: boolean;
  search?: string;
}

export interface ClientsStats {
  total: number;
  withArticles: number;
  withoutArticles: number;
  createdThisMonth: number;
  averageSEO: number;
  subscription: {
    active: number;
    expired: number;
    cancelled: number;
    pending: number;
    expiringSoon: number;
  };
  revenue?: {
    byTier: Record<string, number>;
  };
  payment?: {
    paid: number;
    pending: number;
    overdue: number;
  };
  delivery: {
    totalPromised: number;
    totalDelivered: number;
    deliveryRate: number;
    behindSchedule: number;
  };
  articles: {
    total: number;
    thisMonth: number;
    averageViewsPerArticle: number;
  };
  views: {
    total: number;
    thisMonth: number;
  };
  engagement: {
    avgTimeOnPage: number;
    avgScrollDepth: number;
    bounceRate: number;
    engagementScore: number;
  };
  traffic: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
    sources: Record<string, number>;
  };
  growth: {
    retentionRate: number;
    newClientsTrend: number;
  };
}

