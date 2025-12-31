import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatValue {
  count: number;
  trend?: number;
}

interface StatsCardProps {
  title: string;
  value: number | StatValue;
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  const count = typeof value === "number" ? value : value.count;
  const trend = typeof value === "object" ? value.trend : undefined;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{count.toLocaleString()}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend !== undefined && (
          <div className="flex items-center mt-2">
            {trend >= 0 ? (
              <TrendingUp
                className={cn(
                  "h-4 w-4 mr-1",
                  trend > 0 ? "text-green-600" : "text-muted-foreground"
                )}
              />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                trend > 0
                  ? "text-green-600"
                  : trend < 0
                    ? "text-red-600"
                    : "text-muted-foreground"
              )}
            >
              {Math.abs(trend).toFixed(1)}% from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
