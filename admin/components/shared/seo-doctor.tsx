"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SEOHealthCheck {
  field: string;
  status: "good" | "warning" | "error" | "info";
  message: string;
  score: number;
}

export interface SEOFieldValidator {
  (value: any, data: Record<string, any>): {
    status: "good" | "warning" | "error" | "info";
    message: string;
    score: number;
  };
}

export interface SEOFieldConfig {
  name: string;
  label: string;
  validator: SEOFieldValidator;
}

export interface SEODoctorConfig {
  entityType: string;
  fields: SEOFieldConfig[];
  maxScore: number;
  generateStructuredData: (data: Record<string, any>) => any;
}

export interface SEODoctorProps {
  data: Record<string, any>;
  config: SEODoctorConfig;
  title?: string;
}

export function SEODoctor({ data, config, title = "SEO Doctor" }: SEODoctorProps) {
  const [showSchema, setShowSchema] = useState(false);

  const structuredDataPreview = useMemo(() => {
    return config.generateStructuredData(data);
  }, [data, config]);

  const healthChecks = useMemo(() => {
    const checks: SEOHealthCheck[] = [];
    let totalScore = 0;

    for (const fieldConfig of config.fields) {
      const value = data[fieldConfig.name];
      const result = fieldConfig.validator(value, data);
      
      checks.push({
        field: fieldConfig.label,
        status: result.status,
        message: result.message,
        score: result.score,
      });
      
      totalScore += result.score;
    }

    return { checks, totalScore, maxScore: config.maxScore };
  }, [data, config]);

  const scorePercentage = Math.round(
    (healthChecks.totalScore / healthChecks.maxScore) * 100
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getStatusIcon = (status: SEOHealthCheck["status"]) => {
    switch (status) {
      case "good":
        return <CheckCircle2 className="h-3 w-3 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-3 w-3 text-yellow-600" />;
      case "error":
        return <XCircle className="h-3 w-3 text-red-600" />;
      default:
        return <Info className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge
            variant={getScoreBadgeVariant(scorePercentage)}
            className="text-sm font-semibold"
          >
            {scorePercentage}%
          </Badge>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
            <span>SEO Health Score</span>
            <span className={cn("font-semibold", getScoreColor(scorePercentage))}>
              {healthChecks.totalScore} / {healthChecks.maxScore} points
            </span>
          </div>
          <Progress value={scorePercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex flex-wrap gap-2">
            {healthChecks.checks.map((check, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border bg-card w-fit"
              >
                <div className="flex-shrink-0">{getStatusIcon(check.status)}</div>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-medium">{check.field}</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{check.message}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {check.score > 0 && (
                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                    +{check.score}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </TooltipProvider>
        <div className="mt-3 p-2 rounded-md bg-muted/50 border">
          <p className="text-[10px] text-muted-foreground">
            <strong>Tip:</strong> Aim for 80%+ score for optimal SEO performance. All fields
            marked in green contribute to better search engine visibility and Schema.org
            structured data.
          </p>
        </div>
        <Collapsible open={showSchema} onOpenChange={setShowSchema}>
          <CollapsibleTrigger className="w-full mt-3">
            <div className="flex items-center justify-between p-2 rounded-md border bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Code className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">Schema.org Preview</span>
              </div>
              {showSchema ? (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-3 rounded-md border bg-background">
              <p className="text-[10px] text-muted-foreground mb-2">
                This is how your Schema.org structured data will appear:
              </p>
              <pre className="text-[10px] overflow-x-auto p-2 rounded bg-muted/30 border font-mono">
                {JSON.stringify(structuredDataPreview, null, 2)}
              </pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
