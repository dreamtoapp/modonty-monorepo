"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import NextImage from "next/image";
import Link from "next/link";

interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  createdAt: Date;
}

interface MediaGridProps {
  media: Media[];
}

export function MediaGrid({ media }: MediaGridProps) {
  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {media.map((item) => (
        <Link key={item.id} href={`/media/${item.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-0">
              {isImage(item.mimeType) ? (
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <NextImage
                    src={item.url}
                    alt={item.altText || item.filename}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-muted flex items-center justify-center rounded-t-lg">
                  <span className="text-muted-foreground">{item.mimeType}</span>
                </div>
              )}
              <div className="p-4">
                <p className="font-medium text-sm line-clamp-2">{item.filename}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.mimeType.split("/")[0]}
                  </Badge>
                  {item.width && item.height && (
                    <span className="text-xs text-muted-foreground">
                      {item.width} × {item.height}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(item.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
