"use client";

import { cn } from "@/lib/utils";

interface CharacterCounterProps {
  value: string;
  maxLength: number;
  optimalMin?: number;
  optimalMax?: number;
  label?: string;
  className?: string;
}

export function CharacterCounter({
  value,
  maxLength,
  optimalMin,
  optimalMax,
  label,
  className,
}: CharacterCounterProps) {
  const length = value.length;
  const isOptimal =
    optimalMin && optimalMax
      ? length >= optimalMin && length <= optimalMax
      : length <= maxLength;
  const isWarning = length > maxLength * 0.9 || (optimalMax && length > optimalMax);
  const isError = length > maxLength;

  return (
    <div className={cn("flex items-center justify-between text-xs", className)}>
      {label && <span className="text-muted-foreground">{label}</span>}
      <span
        className={cn(
          "font-medium",
          isError && "text-destructive",
          isWarning && !isError && "text-yellow-600",
          isOptimal && !isWarning && "text-green-600"
        )}
      >
        {length}/{maxLength}
        {optimalMin && optimalMax && (
          <span className="text-muted-foreground ml-1">
            (الأفضل: {optimalMin}-{optimalMax})
          </span>
        )}
      </span>
    </div>
  );
}
