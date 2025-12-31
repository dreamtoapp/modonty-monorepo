interface CharacterCounterProps {
  current: number;
  min?: number;
  max?: number;
  className?: string;
}

export function CharacterCounter({ current, min, max, className = "" }: CharacterCounterProps) {
  const isBelowMin = min !== undefined && current < min;
  const isAboveMax = max !== undefined && current > max;
  const isValid = (!min || current >= min) && (!max || current <= max);

  return (
    <div className={`text-xs ${className}`}>
      <span className={isValid ? "text-muted-foreground" : "text-destructive"}>
        {current}
        {min !== undefined && ` / ${min} minimum`}
        {max !== undefined && !min && ` / ${max} maximum`}
        {min !== undefined && max !== undefined && ` (max: ${max})`}
      </span>
    </div>
  );
}
