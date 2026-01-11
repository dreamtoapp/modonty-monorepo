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
  const isPositive = trendValue !== undefined && trendValue > 0;
  const isNegative = trendValue !== undefined && trendValue < 0;
  const isNeutral = trendValue === 0 || trendValue === undefined;

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-200 border-border/50 h-full",
        "min-h-[140px] sm:min-h-[160px]",
        className
      )}
      role="region"
      aria-label={`${title} metric card`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 sm:pb-3">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight pr-2">
          {title}
        </CardTitle>
        {Icon && (
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-1.5 sm:space-y-2">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight tabular-nums leading-none">
          {displayValue}
        </div>
        {description && (
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
        {trendValue !== undefined && (
          <div className="flex items-center gap-1 sm:gap-1.5 pt-0.5 sm:pt-1" role="status" aria-live="polite">
            {isPositive && <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 flex-shrink-0" aria-hidden="true" />}
            {isNegative && <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-600 flex-shrink-0" aria-hidden="true" />}
            {isNeutral && <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />}
            <span
              className={cn(
                "text-[10px] sm:text-xs font-medium tabular-nums",
                isPositive && "text-emerald-600",
                isNegative && "text-red-600",
                isNeutral && "text-muted-foreground"
              )}
            >
              {isPositive && "+"}
              {Math.abs(trendValue).toFixed(1)}% {isNeutral ? "" : "vs last period"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
