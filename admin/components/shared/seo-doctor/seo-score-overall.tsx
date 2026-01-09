import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Stethoscope, CheckCircle2, AlertCircle, AlertTriangle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SEOScoreOverallProps {
  value: number;
  title?: string;
  icon?: LucideIcon;
  className?: string;
  thresholds?: {
    excellent: number;
    good: number;
    fair: number;
  };
}

export function SEOScoreOverall({
  value,
  title = "SEO Health",
  icon: Icon = Stethoscope,
  className,
  thresholds = {
    excellent: 90,
    good: 70,
    fair: 50,
  },
}: SEOScoreOverallProps) {
  const getScoreColor = (score: number) => {
    if (score >= thresholds.excellent) return "text-green-600";
    if (score >= thresholds.good) return "text-yellow-600";
    if (score >= thresholds.fair) return "text-orange-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= thresholds.excellent) return "bg-green-600";
    if (score >= thresholds.good) return "bg-yellow-600";
    if (score >= thresholds.fair) return "bg-orange-600";
    return "bg-red-600";
  };

  const getBorderColor = (score: number) => {
    if (score >= thresholds.excellent) return "#16a34a";
    if (score >= thresholds.good) return "#ca8a04";
    if (score >= thresholds.fair) return "#ea580c";
    return "#dc2626";
  };

  const getStatusIcon = (score: number) => {
    if (score >= thresholds.excellent) return CheckCircle2;
    if (score >= thresholds.good) return AlertTriangle;
    return AlertCircle;
  };

  const getStatusHint = (score: number) => {
    if (score >= thresholds.excellent) return "Excellent";
    if (score >= thresholds.good) return "Good";
    if (score >= thresholds.fair) return "Fair";
    return "Poor";
  };

  const scoreColor = getScoreColor(value);
  const progressColor = getProgressColor(value);
  const borderColor = getBorderColor(value);
  const StatusIcon = getStatusIcon(value);
  const statusHint = getStatusHint(value);

  return (
    <Card
      className={cn("hover:shadow-md transition-shadow border-l-4 flex flex-col", className)}
      style={{ borderLeftColor: borderColor }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium">{title}</span>
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className={cn("text-2xl font-semibold mb-2", scoreColor)}>
          {value}%
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted mb-2">
          <div
            className={cn("h-full transition-all duration-500 ease-out", progressColor)}
            style={{ width: `${value}%` }}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-auto">
          <StatusIcon className={cn("h-3.5 w-3.5", scoreColor)} />
          <span className={cn("text-xs font-medium", scoreColor)}>
            {statusHint}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
