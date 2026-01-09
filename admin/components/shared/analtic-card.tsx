import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatValue {
  count: number;
  trend?: number;
}

export interface AnalticCardProps {
  title: string;
  value: number | string | StatValue;
  icon?: LucideIcon;
  description?: string;
  trend?: number;
  className?: string;
  formatValue?: (value: number | string) => string;
}

export function AnalticCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  formatValue,
}: AnalticCardProps) {
  const getDisplayValue = () => {
    if (typeof value === "object" && "count" in value) {
      return formatValue ? formatValue(value.count) : value.count.toLocaleString();
    }
    if (typeof value === "number") {
      return formatValue ? formatValue(value) : value.toLocaleString();
    }
    return value;
  };

  const displayValue = getDisplayValue();
  const trendValue = trend !== undefined ? trend : (typeof value === "object" && "trend" in value ? value.trend : undefined);

  return (
    <Card className={cn("hover:shadow-md transition-shadow flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn("text-sm font-medium", Icon ? "text-muted-foreground" : "")}>
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="text-2xl font-semibold">{displayValue}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trendValue !== undefined && (
          <div className="flex items-center mt-2">
            {trendValue >= 0 ? (
              <TrendingUp
                className={cn(
                  "h-4 w-4 mr-1",
                  trendValue > 0 ? "text-green-600" : "text-muted-foreground"
                )}
              />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                trendValue > 0
                  ? "text-green-600"
                  : trendValue < 0
                    ? "text-red-600"
                    : "text-muted-foreground"
              )}
            >
              {Math.abs(trendValue).toFixed(1)}% from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
