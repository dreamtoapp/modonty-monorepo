"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MediaGrid } from "./media-grid";
import { MediaToolbar } from "./media-toolbar";
import { deleteMedia, bulkDeleteMedia, canDeleteMedia } from "../actions/media-actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MediaType } from "@prisma/client";

interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  title: string | null;
  description: string | null;
  type: MediaType;
  createdAt: Date;
  cloudinaryPublicId?: string | null;
  cloudinaryVersion?: string | null;
  client?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface MediaPageClientProps {
  media: Media[];
  sortBy: string;
}

export function MediaPageClient({ media, sortBy: initialSort }: MediaPageClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState(initialSort);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "single" | "bulk"; id?: string; ids?: string[] } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sort media
  const sortedMedia = [...media].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "name-asc":
        return a.filename.localeCompare(b.filename);
      case "name-desc":
        return b.filename.localeCompare(a.filename);
      case "size-asc":
        return (a.fileSize || 0) - (b.fileSize || 0);
      case "size-desc":
        return (b.fileSize || 0) - (a.fileSize || 0);
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    setIsDeleting(true);

    try {
      const canDelete = await canDeleteMedia(id);
      setIsDeleting(false);

      if (!canDelete.canDelete) {
        setDeleteError(canDelete.reason || "Cannot delete this media file.");
        setDeleteTarget({ type: "single", id });
        setDeleteDialogOpen(true);
        return;
      }

      setDeleteTarget({ type: "single", id });
      setDeleteDialogOpen(true);
    } catch (error) {
      setIsDeleting(false);
      toast({
        title: "Error",
        description: "Failed to check media usage. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    setDeleteError(null);
    setIsDeleting(true);

    try {
      const idsArray = Array.from(selectedIds);
      const checks = await Promise.all(
        idsArray.map((id) => canDeleteMedia(id))
      );

      const cannotDelete = checks
        .map((check, index) => ({ check, id: idsArray[index] }))
        .filter(({ check }) => !check.canDelete);

      setIsDeleting(false);

      if (cannotDelete.length > 0) {
        const reasons = cannotDelete.map(({ check, id }) => {
          const mediaItem = media.find((m) => m.id === id);
          return `${mediaItem?.filename || id}: ${check.reason}`;
        }).join("\n");

        setDeleteError(
          `${cannotDelete.length} media file(s) cannot be deleted:\n${reasons}`
        );
        setDeleteTarget({ type: "bulk", ids: idsArray });
        setDeleteDialogOpen(true);
        return;
      }

      setDeleteTarget({ type: "bulk", ids: idsArray });
      setDeleteDialogOpen(true);
    } catch (error) {
      setIsDeleting(false);
      toast({
        title: "Error",
        description: "Failed to check media usage. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      if (deleteTarget.type === "single" && deleteTarget.id) {
        const result = await deleteMedia(deleteTarget.id);

        if (result.success) {
          toast({
            title: "Success",
            description: "Media file deleted successfully.",
          });
          setSelectedIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(deleteTarget.id!);
            return newSet;
          });
          router.refresh();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete media file.",
            variant: "destructive",
          });
        }
      } else if (deleteTarget.type === "bulk" && deleteTarget.ids) {
        const result = await bulkDeleteMedia(deleteTarget.ids);

        if (result.success) {
          toast({
            title: "Success",
            description: `Successfully deleted ${result.deleted || deleteTarget.ids.length} media file(s).`,
          });
          setSelectedIds(new Set());
          router.refresh();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete media files.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setDeleteError(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <MediaToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedCount={selectedIds.size}
          onBulkDelete={selectedIds.size > 0 ? handleBulkDelete : undefined}
        />
        {sortedMedia.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No media found. Upload your first file to get started.</p>
          </div>
        ) : (
          <MediaGrid
            media={sortedMedia}
            viewMode={viewMode}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onDelete={handleDelete}
          />
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteError ? "Cannot Delete Media" : "Confirm Delete"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteError ? (
                <div className="space-y-2">
                  <p className="text-destructive">{deleteError}</p>
                  <p className="text-sm text-muted-foreground">
                    Media files used in published articles cannot be deleted. Please remove them from articles first.
                  </p>
                </div>
              ) : deleteTarget?.type === "single" ? (
                `Are you sure you want to delete this media file? This action cannot be undone.`
              ) : (
                `Are you sure you want to delete ${deleteTarget?.ids?.length || 0} media file(s)? This action cannot be undone.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {deleteError ? "Close" : "Cancel"}
            </AlertDialogCancel>
            {!deleteError && (
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
