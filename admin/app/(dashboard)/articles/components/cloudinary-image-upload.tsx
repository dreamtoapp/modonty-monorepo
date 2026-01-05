"use client";

import { useState, useEffect, useRef } from "react";
import { CldUploadWidget } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

interface CloudinaryImageUploadProps {
  onUploadComplete: (url: string) => void;
  trigger?: React.ReactNode;
}

export function CloudinaryImageUpload({
  onUploadComplete,
  trigger,
}: CloudinaryImageUploadProps) {
  const [open, setOpen] = useState(false);
  const openWidgetRef = useRef<(() => void) | null>(null);

  const handleUploadSuccess = (result: any) => {
    if (result?.info?.secure_url) {
      const imageUrl = result.info.secure_url;
      onUploadComplete(imageUrl);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open && openWidgetRef.current) {
      setTimeout(() => {
        openWidgetRef.current?.();
      }, 100);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            type="button"
            variant="ghost"
            size="sm"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>رفع صورة</DialogTitle>
          <DialogDescription>
            اختر صورة من جهازك أو اسحبها هنا
          </DialogDescription>
        </DialogHeader>
        <CldUploadWidget
          uploadPreset={
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default"
          }
          onSuccess={handleUploadSuccess}
          options={{
            sources: ["local", "camera", "url"],
            multiple: false,
            maxFiles: 1,
            resourceType: "image",
          }}
        >
          {({ open: openWidget }) => {
            openWidgetRef.current = openWidget;
            return (
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  onClick={() => openWidget()}
                  className="w-full"
                >
                  اختر صورة
                </Button>
              </div>
            );
          }}
        </CldUploadWidget>
      </DialogContent>
    </Dialog>
  );
}
