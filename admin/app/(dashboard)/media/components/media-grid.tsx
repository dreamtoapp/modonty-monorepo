"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Copy, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SEOHealthGauge } from "@/components/shared/seo-doctor/seo-health-gauge";
import { mediaSEOConfig } from "../helpers/media-seo-config";
import { MediaType } from "@prisma/client";
import { getMediaTypeLabel, getMediaTypeBadgeVariant } from "../helpers/media-utils";

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

interface MediaGridProps {
  media: Media[];
  viewMode?: "grid" | "list";
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  onDelete?: (id: string) => void;
}

export function MediaGrid({
  media,
  viewMode = "grid",
  selectedIds = new Set(),
  onSelectionChange,
  onDelete,
}: MediaGridProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "Unknown";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (!onSelectionChange) return;
    const newSelection = new Set(selectedIds);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    onSelectionChange(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(new Set(media.map((m) => m.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const getImageUrl = (item: Media): string => {
    // If we have cloudinaryPublicId, construct the URL from it (more reliable)
    if (item.cloudinaryPublicId) {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dfegnpgwx";
      const resourceType = item.mimeType.startsWith("image/") ? "image" : "video";
      const version = item.cloudinaryVersion || "";
      
      // Extract format from filename or mimeType
      let format = item.filename.split(".").pop() || "";
      if (!format) {
        // Fallback to mimeType
        format = item.mimeType.split("/")[1] || "png";
      }
      
      // Remove extension from cloudinaryPublicId if it exists (Cloudinary stores public_id without extension)
      let publicId = item.cloudinaryPublicId;
      const lastDot = publicId.lastIndexOf(".");
      if (lastDot > 0) {
        // Check if the part after the dot looks like a file extension
        const possibleExt = publicId.substring(lastDot + 1).toLowerCase();
        const validExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "mp4", "mov", "avi"];
        if (validExtensions.includes(possibleExt)) {
          publicId = publicId.substring(0, lastDot);
        }
      }
      
      // Construct Cloudinary URL: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
      if (version) {
        return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/v${version}/${publicId}.${format}`;
      } else {
        return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${publicId}.${format}`;
      }
    }
    
    // Fallback to stored URL (for old records or non-Cloudinary URLs)
    return item.url;
  };

  const copyUrl = async (item: Media) => {
    try {
      const urlToCopy = getImageUrl(item);
      await navigator.clipboard.writeText(urlToCopy);
      toast({
        title: "URL Copied",
        description: "Image URL has been copied to clipboard. You can now share it with clients.",
      });
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast({
        title: "Failed to copy",
        description: "Could not copy URL to clipboard.",
        variant: "destructive",
      });
    }
  };


  if (viewMode === "list") {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
              <div className="col-span-1">
                {onSelectionChange && (
                  <Checkbox
                    checked={selectedIds.size === media.length && media.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                )}
              </div>
              <div className="col-span-2">Preview</div>
              <div className="col-span-2">Filename</div>
              <div className="col-span-1">SEO</div>
              <div className="col-span-2">Client</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Size</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Rows */}
            {media.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/50 transition-colors items-center"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="col-span-1">
                  {onSelectionChange && (
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={(checked) => handleSelect(item.id, checked as boolean)}
                    />
                  )}
                </div>
                <div className="col-span-2">
                  {isImage(item.mimeType) ? (
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                      <NextImage
                        src={item.url}
                        alt={item.altText || item.filename}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        {item.mimeType.split("/")[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <Link
                    href={`/media/${item.id}`}
                    className="font-medium text-sm hover:text-primary transition-colors underline"
                  >
                    {item.filename}
                  </Link>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  {isImage(item.mimeType) && (
                    <SEOHealthGauge
                      data={{
                        altText: item.altText,
                        title: item.title,
                        description: item.description,
                        // Keywords removed from SEO scoring - they should be naturally in alt text, title, description
                        width: item.width,
                        height: item.height,
                        filename: item.filename,
                        cloudinaryPublicId: item.cloudinaryPublicId,
                      }}
                      config={mediaSEOConfig}
                      size="xs"
                      showScore={false}
                    />
                  )}
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-muted-foreground">
                    {item.client?.name || "Unknown"}
                  </span>
                </div>
                <div className="col-span-1">
                  <div className="flex flex-col gap-1">
                    <Badge variant={getMediaTypeBadgeVariant(item.type)} className="text-xs">
                      {getMediaTypeLabel(item.type)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {item.mimeType.split("/")[0]}
                    </Badge>
                  </div>
                </div>
                <div className="col-span-1">
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(item.fileSize)}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="col-span-1 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/media/${item.id}/edit`);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid View
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {media.map((item) => (
        <Card
          key={item.id}
          className="hover:shadow-md transition-shadow h-full relative group"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <CardContent className="p-0">
            <Link href={`/media/${item.id}`} className="block">
              {isImage(item.mimeType) ? (
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <NextImage
                    src={item.url}
                    alt={item.altText || item.filename}
                    fill
                    className="object-cover"
                  />
                  {hoveredId === item.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(item.url, "_blank");
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View image in new tab</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                copyUrl(item);
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy image URL to share with client</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/media/${item.id}/edit`);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit media metadata</p>
                          </TooltipContent>
                        </Tooltip>

                        {onDelete && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onDelete(item.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete image</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-muted flex items-center justify-center rounded-t-lg">
                  <span className="text-muted-foreground">{item.mimeType}</span>
                </div>
              )}
            </Link>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link
                  href={`/media/${item.id}`}
                  className="font-medium text-sm line-clamp-2 flex-1 hover:text-primary transition-colors underline"
                >
                  {item.filename}
                </Link>
                <div className="flex items-center gap-2">
                  {isImage(item.mimeType) && (
                    <SEOHealthGauge
                      data={{
                        altText: item.altText,
                        title: item.title,
                        description: item.description,
                        // Keywords removed from SEO scoring - they should be naturally in alt text, title, description
                        width: item.width,
                        height: item.height,
                        filename: item.filename,
                        cloudinaryPublicId: item.cloudinaryPublicId,
                      }}
                      config={mediaSEOConfig}
                      size="xs"
                      showScore={false}
                    />
                  )}
                  {onSelectionChange && (
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={(checked) => handleSelect(item.id, checked as boolean)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant={getMediaTypeBadgeVariant(item.type)} className="text-xs">
                  {getMediaTypeLabel(item.type)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {item.mimeType.split("/")[0]}
                </Badge>
                {item.width && item.height && (
                  <span className="text-xs text-muted-foreground">
                    {item.width} × {item.height}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {format(new Date(item.createdAt), "MMM d, yyyy")}
                </p>
                {item.client && (
                  <Badge variant="outline" className="text-xs">
                    {item.client.name}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

