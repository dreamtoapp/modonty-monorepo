interface CharacterCounterProps {
  current: number;
  min?: number;
  max?: number;
  restrict?: boolean;
  className?: string;
}

export function CharacterCounter({ current, min, max, restrict = false, className = "" }: CharacterCounterProps) {
  const isBelowMin = min !== undefined && current < min;
  const isAboveMax = max !== undefined && current > max;
  const isValid = (!min || current >= min) && (!max || current <= max);

  // If restrict is true and above max, show error. Otherwise show warning.
  const showError = restrict && isAboveMax;
  const showWarning = !restrict && isAboveMax;

  return (
    <div className={`text-xs ${className}`}>
      <span className={
        showError
          ? "text-destructive"
          : showWarning
            ? "text-yellow-600 dark:text-yellow-500"
            : isValid
              ? "text-muted-foreground"
              : "text-destructive"
      }>
        {current}
        {min !== undefined && ` / ${min} minimum`}
        {max !== undefined && !min && ` / ${max} maximum`}
        {min !== undefined && max !== undefined && ` (max: ${max})`}
        {showError && " - Exceeds maximum"}
        {showWarning && " - Warning: exceeds recommended"}
      </span>
    </div>
  );
}
