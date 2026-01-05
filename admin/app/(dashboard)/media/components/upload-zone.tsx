"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createMedia, getClients } from "../actions/media-actions";
import { optimizeCloudinaryUrl } from "@/lib/utils/image-seo";
import { useToast } from "@/hooks/use-toast";
import { extractEXIFData } from "@/lib/utils/exif-extractor";
import { generateSEOFileName, generateCloudinaryPublicId, isValidCloudinaryPublicId } from "@/lib/utils/image-seo";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error" | "saved";
  error?: string;
  mediaId?: string;
  previewUrl?: string; // Local preview URL (URL.createObjectURL)
  uploadResult?: {
    url: string;
    secure_url: string;
    public_id: string;
    version: string;
    width: number;
    height: number;
    format: string;
    signature?: string;
  };
}

interface UploadZoneProps {
  onUploadComplete?: () => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [clientId, setClientId] = useState<string>("");
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [savingFileId, setSavingFileId] = useState<string | null>(null);
  const filesRef = useRef<UploadFile[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // SEO form state - only essential fields for upload page
  const [seoForm, setSeoForm] = useState({
    altText: "",
    title: "",
    description: "",
  });

  // EXIF data state (stored separately for submission)
  const [exifData, setExifData] = useState<Record<string, unknown> | null>(null);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((uploadFile) => {
        if (uploadFile.previewUrl) {
          URL.revokeObjectURL(uploadFile.previewUrl);
        }
      });
    };
  }, []);

  // Load clients on mount
  useEffect(() => {
    const loadClients = async () => {
      const clientsList = await getClients();
      setClients(clientsList);
      if (clientsList.length > 0) {
        setClientId(clientsList[0].id);
      }
      setIsLoadingClients(false);
    };
    loadClients();
  }, []);

  const validateFile = (file: File): string | null => {
    // Check if file type is detected
    if (!file.type || file.type === "") {
      return `File type could not be detected for "${file.name}". Please ensure the file has a valid extension.`;
    }

    // File type validation
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      const fileExtension = file.name.split(".").pop()?.toUpperCase() || "unknown";
      return `File type "${file.type}" (${fileExtension}) is not supported. Supported types: Images (JPG, PNG, GIF, WebP, SVG) and Videos (MP4, WebM).`;
    }

    // File size validation
    const maxSizes: Record<string, number> = {
      image: 10 * 1024 * 1024, // 10MB
      video: 100 * 1024 * 1024, // 100MB
    };

    const fileCategory = file.type.split("/")[0];
    const maxSize = maxSizes[fileCategory];

    if (!maxSize) {
      return `File type "${file.type}" is not supported. Please upload an image or video file.`;
    }

    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      const fileSizeMB = Math.round((file.size / (1024 * 1024)) * 100) / 100;
      return `File size (${fileSizeMB}MB) exceeds the maximum allowed size of ${maxSizeMB}MB for ${fileCategory} files.`;
    }

    return null;
  };

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      if (!clientId) {
        toast({
          title: "Client Required",
          description: "Please select a client first before uploading a file.",
          variant: "destructive",
        });
        return;
      }

      // Single file upload - take first file only
      const file = Array.isArray(fileList) ? fileList[0] : fileList[0];
      if (!file) return;

      const error = validateFile(file);
      const uploadFile: UploadFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        status: error ? "error" : "pending",
        error: error || undefined,
      };

      // Show toast for validation errors
      if (error) {
        toast({
          title: "File Validation Failed",
          description: error,
          variant: "destructive",
        });
      }

      // Cleanup previous preview URL
      setFiles((prev) => {
        prev.forEach((f) => {
          if (f.previewUrl) {
            URL.revokeObjectURL(f.previewUrl);
          }
        });
        return [];
      });

      // Create preview URL for images
      let previewUrl: string | undefined;
      if (file.type.startsWith("image/")) {
        previewUrl = URL.createObjectURL(file);
      }

      // Store file with preview
      const newFile = {
        ...uploadFile,
        previewUrl,
      };

      setFiles([newFile]);


      // Extract EXIF data for images
      if (file.type.startsWith("image/") && !error) {
        extractEXIFData(file)
          .then((exifData) => {
            if (exifData) {
              // Store full EXIF data
              if (exifData.fullData) {
                setExifData(exifData.fullData);
              }

              // Auto-populate dateCreated from EXIF
              if (exifData.dateCreated) {
                const dateStr = exifData.dateCreated.toISOString().split("T")[0];
                setSeoForm((prev) => ({
                  ...prev,
                  dateCreated: dateStr,
                }));
              }

              // Note: GPS coordinates and other advanced fields are handled in edit page
            }
          })
          .catch((err) => {
            // Silently fail - EXIF extraction is optional
            console.warn("EXIF extraction failed:", err);
          });
      }
    },
    [clientId, toast]
  );

  const getErrorMessage = async (response: Response): Promise<string> => {
    try {
      const errorData = await response.json();

      // Cloudinary API errors
      if (errorData.error?.message) {
        return errorData.error.message;
      }
      if (errorData.error) {
        return typeof errorData.error === "string"
          ? errorData.error
          : JSON.stringify(errorData.error);
      }

      // HTTP status code errors
      switch (response.status) {
        case 400:
          return "Invalid request. Please check your upload settings and try again.";
        case 401:
          return "Authentication failed. Please check your Cloudinary configuration.";
        case 403:
          return "Upload forbidden. Please check your upload preset permissions.";
        case 404:
          return "Cloudinary account not found. Please verify your cloud name configuration.";
        case 413:
          return "File too large for Cloudinary upload.";
        case 500:
          return "Cloudinary server error. Please try again in a moment.";
        case 503:
          return "Cloudinary service unavailable. Please try again later.";
        default:
          return `Upload failed with status ${response.status}. Please try again.`;
      }
    } catch {
      // If we can't parse the error response
      return response.status === 0
        ? "Network error. Please check your internet connection."
        : `Upload failed with status ${response.status}. Please try again.`;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  // Upload to Cloudinary with SEO-friendly public_id
  const uploadToCloudinary = async (file: File, fileId: string): Promise<void> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      const errorMsg = "Cloudinary configuration missing. Please check your environment variables.";
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "error", error: errorMsg }
            : f
        )
      );
      toast({
        title: "Configuration Error",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    // Get client slug for folder organization
    const selectedClient = clients.find((c) => c.id === clientId);
    const clientSlug = selectedClient?.name
      ? selectedClient.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      : "default";

    // Generate SEO-friendly public_id from alt text/title
    const seoFileName = generateSEOFileName(
      seoForm.altText || "",
      seoForm.title || "",
      file.name,
      clientSlug
    );

    // Add folder structure
    const publicId = generateCloudinaryPublicId(seoFileName, "media");

    // Validate public_id format
    if (!isValidCloudinaryPublicId(publicId)) {
      const errorMsg = "Generated filename is invalid. Please check your alt text or title.";
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "error", error: errorMsg }
            : f
        )
      );
      toast({
        title: "Validation Error",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    // Update status to uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: "uploading", progress: 10 } : f
      )
    );

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("public_id", publicId); // SEO-friendly public_id

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, progress: 30 } : f
        )
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, progress: 70 } : f
        )
      );

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: "error", error: errorMessage, progress: 0 }
              : f
          )
        );
        toast({
          title: "Upload Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      const result = await response.json();

      // Store upload result with SEO-friendly public_id
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
              ...f,
              status: "success",
              progress: 100,
              uploadResult: {
                url: result.secure_url || result.url,
                secure_url: result.secure_url || result.url,
                public_id: result.public_id,
                version: result.version?.toString() || "",
                width: result.width,
                height: result.height,
                format: result.format,
                signature: result.signature,
              },
            }
            : f
        )
      );

      toast({
        title: "Upload Successful",
        description: "File uploaded to Cloudinary with SEO-friendly filename.",
        variant: "default",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Network error. Please check your internet connection.";
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "error", error: errorMessage, progress: 0 }
            : f
        )
      );
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const allComplete = files.length > 0 && files.every((f) => f.status === "success" || f.status === "error");
  const hasSuccess = files.some((f) => f.status === "success");
  const isUploading = files.some((f) => f.status === "uploading");
  const hasPending = files.some((f) => f.status === "pending");
  const isDisabled = isUploading || !clientId;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!isDisabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDisabled && e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
    setSeoForm({
      altText: "",
      title: "",
      description: "",
    });
    setExifData(null);
  };

  const handleAddNew = () => {
    setFiles([]);
    setSeoForm({
      altText: "",
      title: "",
      description: "",
    });
    setExifData(null);
  };

  const handleSaveMedia = async (uploadFile: UploadFile) => {
    // Prevent multiple simultaneous saves
    if (savingFileId === uploadFile.id) {
      return;
    }

    // Validate altText is required (needed for SEO-friendly filename)
    if (!seoForm.altText || seoForm.altText.trim().length === 0) {
      toast({
        title: "Alt Text Required",
        description: "Alt text is required for SEO and accessibility.",
        variant: "destructive",
      });
      return;
    }

    setSavingFileId(uploadFile.id);

    // Get current file state
    const currentFile = files.find((f) => f.id === uploadFile.id);

    // If file is NOT currently uploading to Cloudinary, set status to "uploading" immediately
    // This makes the form disappear and progress bar appear instantly
    if (!(currentFile?.status === "uploading" && !currentFile?.uploadResult)) {
      setFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading", progress: 0 } : f)),
      );
    }

    try {
      // Helper function to wait for upload completion using polling
      const waitForUploadCompletion = async (fileId: string): Promise<UploadFile | null> => {
        return new Promise((resolve) => {
          let attempts = 0;
          const maxAttempts = 60; // 30 seconds max wait time (60 * 500ms)

          const checkUpload = () => {
            attempts++;

            // Get current state from ref (always up-to-date)
            const currentFile = filesRef.current.find((f) => f.id === fileId);

            if (currentFile?.uploadResult) {
              // Upload completed successfully
              resolve(currentFile);
              return;
            }

            if (currentFile?.status === "error") {
              // Upload failed
              resolve(null);
              return;
            }

            if (attempts >= maxAttempts) {
              // Timeout
              resolve(null);
              return;
            }

            // Check again after delay
            setTimeout(checkUpload, 500);
          };

          // Start checking
          checkUpload();
        });
      };

      // Get current file state
      const currentFile = files.find((f) => f.id === uploadFile.id);

      // If file is currently uploading to Cloudinary, wait for it to complete
      // Don't change status here - it's already "uploading" for Cloudinary upload
      if (currentFile?.status === "uploading" && !currentFile?.uploadResult) {
        const completedFile = await waitForUploadCompletion(uploadFile.id);
        if (!completedFile?.uploadResult) {
          setSavingFileId(null);
          // Reset status if upload failed
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id ? { ...f, status: "error" } : f
            )
          );
          toast({
            title: "Upload Required",
            description: "Please wait for the file to upload to Cloudinary before saving.",
            variant: "default",
          });
          return;
        }
        // Upload completed, now set status to "uploading" for database save
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "uploading", progress: 0 } : f
          )
        );
        // Proceed with save
        await saveMediaToDatabase(completedFile);
        setSavingFileId(null);
        return;
      }

      // If file hasn't been uploaded to Cloudinary yet, upload it first
      if (!uploadFile.uploadResult) {
        // Upload to Cloudinary with SEO-friendly public_id
        await uploadToCloudinary(uploadFile.file, uploadFile.id);

        // Wait for upload to complete
        const completedFile = await waitForUploadCompletion(uploadFile.id);
        if (!completedFile?.uploadResult) {
          setSavingFileId(null);
          toast({
            title: "Upload Failed",
            description: "Failed to upload file to Cloudinary. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Upload completed, now set status to "uploading" for database save
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "uploading", progress: 0 } : f
          )
        );
        // Proceed with save
        await saveMediaToDatabase(completedFile);
        setSavingFileId(null);
        return;
      }

      // File already uploaded, set status to "uploading" for database save
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "uploading", progress: 0 } : f
        )
      );
      // Proceed with save
      await saveMediaToDatabase(uploadFile);
      setSavingFileId(null);
    } catch (error) {
      setSavingFileId(null);
      console.error("Error saving media:", error);
      toast({
        title: "Error",
        description: "Failed to save media. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveMediaToDatabase = async (uploadFile: UploadFile) => {
    // Get file data from uploadResult (Cloudinary)
    const originalUrl = uploadFile.uploadResult!.url;
    const fileWidth = uploadFile.uploadResult!.width || 0;
    const fileHeight = uploadFile.uploadResult!.height || 0;
    const fileFormat = uploadFile.uploadResult!.format || "";

    try {
      // Update progress to 50% (status already set to "uploading" in handleSaveMedia)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, progress: 50 } : f
        )
      );

      // Get Cloudinary metadata from uploadResult (SEO-friendly public_id)
      const cloudinaryPublicId = uploadFile.uploadResult?.public_id;
      const cloudinaryVersion = uploadFile.uploadResult?.version;
      const cloudinarySignature = uploadFile.uploadResult?.signature;

      // Optimize Cloudinary URL with performance parameters
      const resourceType = uploadFile.file.type.startsWith("image/") ? "image" : "video";
      const optimizedUrl = optimizeCloudinaryUrl(
        originalUrl,
        cloudinaryPublicId || "",
        fileFormat,
        resourceType
      );

      // Save only essential SEO fields on upload page
      // Advanced fields (Caption, Credit, License, Creator, Location, Keywords, etc.) can be edited later via edit page
      const mediaResult = await createMedia({
        filename: uploadFile.file.name,
        url: optimizedUrl,
        mimeType: uploadFile.file.type,
        clientId,
        fileSize: uploadFile.file.size,
        width: fileWidth,
        height: fileHeight,
        cloudinaryPublicId,
        cloudinaryVersion,
        cloudinarySignature,
        altText: seoForm.altText.trim(),
        title: seoForm.title.trim() || undefined,
        description: seoForm.description.trim() || undefined,
        // Advanced fields - not saved on upload, can be edited later
        caption: undefined,
        credit: undefined,
        keywords: undefined,
        license: undefined,
        creator: undefined,
        dateCreated: undefined,
        geoLatitude: undefined,
        geoLongitude: undefined,
        geoLocationName: undefined,
        contentLocation: undefined,
        exifData: undefined,
      });

      // Update progress to 75% before database save
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, progress: 75 } : f
        )
      );

      if (mediaResult.success && mediaResult.media) {
        // Update file status to "saved" instead of removing it
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                ...f,
                status: "saved",
                progress: 100,
                mediaId: mediaResult.media?.id,
              }
              : f
          )
        );

        toast({
          title: "Media Saved",
          description: `${uploadFile.file.name} has been saved to the media library.`,
        });

        // Call onUploadComplete callback if provided
        onUploadComplete?.();
      } else {
        const errorMsg = mediaResult.error || "Failed to save media record.";
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save media";
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "error", error: errorMessage } : f
        )
      );
      toast({
        title: "Save Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Client Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="client-select">Client *</Label>
            {isLoadingClients ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading clients...
              </div>
            ) : (
              <Select value={clientId} onValueChange={setClientId} required>
                <SelectTrigger id="client-select" className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-xs text-muted-foreground">
              All uploaded media will be associated with the selected client.
            </p>
          </div>
        </CardContent>
      </Card>


      {/* Preview/Drop Zone and SEO Form - Unified */}
      {files.length > 0 &&
        files.some(
          (f) =>
            f.status !== "saved" && // Hide when saved (success card will show instead)
            savingFileId !== f.id && // Hide when saving
            (f.status === "pending" ||
              f.status === "success" ||
              (f.status === "error" &&
                !f.error?.includes("File type") &&
                !f.error?.includes("File size")))
        ) && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-2">SEO Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Please provide essential SEO metadata. Alt text is required for SEO and accessibility.
                  </p>
                </div>

                {files
                  .filter(
                    (f) =>
                      f.status !== "saved" && // Hide when saved (success card will show instead)
                      savingFileId !== f.id && // Hide when saving
                      (f.status === "pending" ||
                        f.status === "success" ||
                        (f.status === "error" &&
                          !f.error?.includes("File type") &&
                          !f.error?.includes("File size")))
                  )
                  .map((uploadFile) => {
                    const isImage = uploadFile.file.type.startsWith("image/");

                    return (
                      <div key={uploadFile.id} className="space-y-6">
                        {/* Preview/Drop Zone - Unified Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Preview/Drop Zone - Left Column */}
                          <div className="space-y-2">
                            <Label>Preview</Label>
                            <div
                              onDragOver={uploadFile.status !== "saved" ? handleDragOver : undefined}
                              onDragLeave={uploadFile.status !== "saved" ? handleDragLeave : undefined}
                              onDrop={uploadFile.status !== "saved" ? handleDrop : undefined}
                              onClick={() => {
                                if (!isDisabled && uploadFile.status !== "saved") {
                                  document.getElementById("file-upload-preview")?.click();
                                }
                              }}
                              className={`
                              border-2 border-dashed rounded-lg p-8 text-center transition-colors min-h-[300px] flex flex-col items-center justify-center
                              ${uploadFile.status === "saved" ? "border-border opacity-75" : isDragging && !isDisabled ? "border-primary bg-primary/5" : "border-border"}
                              ${uploadFile.status === "saved" || isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"}
                            `}
                            >
                              <input
                                type="file"
                                id="file-upload-preview"
                                onChange={handleFileInput}
                                disabled={isDisabled}
                                className="hidden"
                                accept="image/*,video/*"
                              />
                              {isImage && uploadFile.previewUrl ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                  <img
                                    src={uploadFile.previewUrl}
                                    alt={seoForm.altText || "Selected image"}
                                    className="max-w-full h-auto max-h-80 mx-auto rounded"
                                  />
                                  {uploadFile.status !== "saved" && (
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                                      <div className="opacity-0 hover:opacity-100 transition-opacity bg-background/90 px-4 py-2 rounded-md border">
                                        <p className="text-sm font-medium">Click to replace</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-4">
                                  <div
                                    className={`
                                    rounded-full p-4
                                    ${isDragging ? "bg-primary/10" : "bg-muted"}
                                  `}
                                  >
                                    <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-base font-medium">
                                      {isDragging ? "Drop file here" : "Click or drag to upload"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Supported: Images (JPG, PNG, GIF, WebP, SVG), Videos (MP4, WebM)
                                      <br />
                                      Max sizes: Images 10MB, Videos 100MB
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Essential SEO Fields - Right Column */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold mb-4">Essential SEO Fields</h4>
                            </div>

                            {/* Alt Text - Required */}
                            <div className="space-y-2">
                              <Label htmlFor="altText">
                                Alt Text <span className="text-destructive">*</span>
                              </Label>
                              <Textarea
                                id="altText"
                                placeholder="Describe the image for SEO and accessibility..."
                                value={seoForm.altText}
                                onChange={(e) => setSeoForm({ ...seoForm, altText: e.target.value })}
                                rows={3}
                                required
                                disabled={uploadFile.status === "uploading" && savingFileId === uploadFile.id}
                              />
                              <p className="text-xs text-muted-foreground">
                                Required. Describe what the image shows for search engines and screen readers.
                              </p>
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                              <Label htmlFor="title">Title</Label>
                              <Input
                                id="title"
                                placeholder="Image title (optional)"
                                value={seoForm.title}
                                onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                                disabled={uploadFile.status === "uploading" && savingFileId === uploadFile.id}
                              />
                              <p className="text-xs text-muted-foreground">
                                Used in schema.org ImageObject
                              </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                placeholder="Detailed description (optional)"
                                value={seoForm.description}
                                onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                                rows={3}
                                disabled={uploadFile.status === "uploading" && savingFileId === uploadFile.id}
                              />
                              <p className="text-xs text-muted-foreground">
                                Used in meta descriptions and schema.org
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Note about additional fields - Hide when saved */}
                        {uploadFile.status !== "saved" && (
                          <div className="rounded-lg bg-muted/50 border p-4">
                            <p className="text-sm text-muted-foreground">
                              <strong>Note:</strong> Additional fields (Caption, Credit, Keywords, License, Creator, Location, etc.) can be edited later from the media library.
                            </p>
                          </div>
                        )}

                        {/* Save Button - Only show when not saving and not saved */}
                        <div className="pt-4 border-t">
                          <Button
                            onClick={() => handleSaveMedia(uploadFile)}
                            className="w-full"
                            disabled={
                              !seoForm.altText.trim() ||
                              savingFileId === uploadFile.id ||
                              uploadFile.status === "uploading"
                            }
                          >
                            Save to Media Library
                          </Button>
                          {!seoForm.altText.trim() && savingFileId !== uploadFile.id && (
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                              Alt text is required to save
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Progress Bar Card - Show when saving */}
      {files.length > 0 && savingFileId && files.some((f) => savingFileId === f.id) && (
        <Card>
          <CardContent className="pt-6">
            {files
              .filter((f) => savingFileId === f.id)
              .map((uploadFile) => (
                <div key={uploadFile.id} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <p className="text-sm font-medium">Saving to media library...</p>
                  </div>
                  <Progress value={uploadFile.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {uploadFile.progress}% complete
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Success Message Card - Show when saved */}
      {files.length > 0 && files.some((f) => f.status === "saved") && (
        <Card>
          <CardContent className="pt-6">
            {files
              .filter((f) => f.status === "saved")
              .map((uploadFile) => (
                <div key={uploadFile.id} className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="font-medium">Media saved successfully!</p>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleAddNew} variant="outline" className="flex-1">
                      Add New Media
                    </Button>
                    <Button onClick={() => router.push("/media")} className="flex-1">
                      Go to Media Library
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Drop Zone - Show when no file selected */}
      {files.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDragging && !isDisabled ? "border-primary bg-primary/5" : "border-border"}
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"}
              `}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileInput}
                disabled={isDisabled}
                className="hidden"
                accept="image/*,video/*"
              />
              <label
                htmlFor="file-upload"
                className={`flex flex-col items-center gap-4 ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div
                  className={`
                    rounded-full p-4
                    ${isDragging ? "bg-primary/10" : "bg-muted"}
                  `}
                >
                  <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-medium">
                    {isDragging ? "Drop file here" : "Drag and drop file here"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported: Images (JPG, PNG, GIF, WebP, SVG), Videos (MP4, WebM)
                    <br />
                    Max sizes: Images 10MB, Videos 100MB
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
