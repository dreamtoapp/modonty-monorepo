import { ArticleStatus } from "@prisma/client";

export const statusLabels: Record<ArticleStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
  SCHEDULED: "Scheduled",
};

export const statusVariants: Record<
  ArticleStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
  SCHEDULED: "outline",
};

export function getStatusLabel(status: ArticleStatus): string {
  return statusLabels[status] || status;
}

export function getStatusVariant(
  status: ArticleStatus
): "default" | "secondary" | "destructive" | "outline" {
  return statusVariants[status] || "secondary";
}

export function getAvailableStatuses(): ArticleStatus[] {
  return Object.values(ArticleStatus);
}
