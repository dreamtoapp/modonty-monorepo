"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export interface MediaFilters {
  clientId?: string;
  mimeType?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  used?: boolean;
}

export async function getMedia(filters?: MediaFilters) {
  try {
    const whereConditions: Prisma.MediaWhereInput[] = [];

    // Always filter out media with null clientId (existing records before migration)
    // This prevents showing orphaned media without clientId
    whereConditions.push({ clientId: { not: null } });

    // Client filter (required for non-admin, optional "all" for admin)
    if (filters?.clientId && filters.clientId !== "all") {
      whereConditions.push({ clientId: filters.clientId });
    }

    // MIME type filter
    if (filters?.mimeType) {
      if (filters.mimeType === "image") {
        whereConditions.push({ mimeType: { startsWith: "image/" } });
      } else if (filters.mimeType === "video") {
        whereConditions.push({ mimeType: { startsWith: "video/" } });
      } else {
        whereConditions.push({ mimeType: filters.mimeType });
      }
    }

    // Search filter (filename, altText, keywords)
    if (filters?.search) {
      whereConditions.push({
        OR: [
          { filename: { contains: filters.search, mode: "insensitive" } },
          { altText: { contains: filters.search, mode: "insensitive" } },
          { keywords: { has: filters.search } },
        ],
      });
    }

    // Date range filter
    if (filters?.dateFrom || filters?.dateTo) {
      const dateCondition: Prisma.DateTimeFilter = {};
      if (filters.dateFrom) {
        dateCondition.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        dateCondition.lte = filters.dateTo;
      }
      whereConditions.push({ createdAt: dateCondition });
    }

    // Usage filter (used/unused)
    if (filters?.used !== undefined) {
      if (filters.used) {
        // Media is used if it is featured in articles
        whereConditions.push({
          featuredArticles: { some: {} },
        });
      } else {
        // Media is unused if it is not featured in any articles
        whereConditions.push({
          featuredArticles: { none: {} },
        });
      }
    }

    // Combine all conditions with AND
    const where: Prisma.MediaWhereInput =
      whereConditions.length > 0 ? { AND: whereConditions } : {};

    const media = await db.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return media;
  } catch (error) {
    console.error("Error fetching media:", error);
    return [];
  }
}

export async function getMediaById(id: string, clientId?: string) {
  try {
    const where: Prisma.MediaWhereInput = { id };

    // If clientId provided, ensure media belongs to that client (security)
    if (clientId) {
      where.clientId = clientId;
    }

    return await db.media.findFirst({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        featuredArticles: {
          select: {
            id: true,
            title: true,
            slug: true,
            clientId: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching media by ID:", error);
    return null;
  }
}

export async function getClients() {
  try {
    const clients = await db.client.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: { name: "asc" },
    });
    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function createMedia(data: {
  filename: string;
  url: string;
  mimeType: string;
  clientId: string; // REQUIRED
  fileSize?: number;
  width?: number;
  height?: number;
  altText: string; // REQUIRED for SEO and accessibility
  caption?: string;
  credit?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  license?: string;
  creator?: string;
  dateCreated?: Date;
  geoLatitude?: number;
  geoLongitude?: number;
  geoLocationName?: string;
  contentLocation?: string;
  exifData?: Record<string, unknown>;
  cloudinaryPublicId?: string;
  cloudinaryVersion?: string;
  cloudinarySignature?: string;
}) {
  try {
    // Validate altText is required
    if (!data.altText || data.altText.trim().length === 0) {
      return { success: false, error: "Alt text is required for SEO and accessibility." };
    }

    // Validate clientId exists
    const client = await db.client.findUnique({
      where: { id: data.clientId },
      select: { id: true },
    });

    if (!client) {
      return { success: false, error: "Invalid client ID. Client not found." };
    }

    // Validate file type
    const allowedMimeTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      // Videos
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedMimeTypes.includes(data.mimeType.toLowerCase())) {
      return {
        success: false,
        error: `File type not allowed. Allowed types: images (jpg, png, gif, webp, svg), videos (mp4, webm)`,
      };
    }

    // Validate file size
    const maxSizes: Record<string, number> = {
      image: 10 * 1024 * 1024, // 10MB
      video: 100 * 1024 * 1024, // 100MB
    };

    const fileCategory = data.mimeType.split("/")[0];
    const maxSize = maxSizes[fileCategory];

    if (data.fileSize && data.fileSize > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        success: false,
        error: `File too large. Maximum size for ${fileCategory} files is ${maxSizeMB}MB.`,
      };
    }

    const media = await db.media.create({
      data: {
        filename: data.filename,
        url: data.url,
        mimeType: data.mimeType,
        clientId: data.clientId,
        fileSize: data.fileSize,
        width: data.width,
        height: data.height,
        altText: data.altText,
        caption: data.caption,
        credit: data.credit,
        title: data.title,
        description: data.description,
        keywords: data.keywords || [],
        license: data.license,
        creator: data.creator,
        dateCreated: data.dateCreated,
        geoLatitude: data.geoLatitude,
        geoLongitude: data.geoLongitude,
        geoLocationName: data.geoLocationName,
        contentLocation: data.contentLocation,
        exifData: data.exifData ? (JSON.parse(JSON.stringify(data.exifData)) as Prisma.InputJsonValue) : null,
        cloudinaryPublicId: data.cloudinaryPublicId,
        cloudinaryVersion: data.cloudinaryVersion,
        cloudinarySignature: data.cloudinarySignature,
      },
    });
    revalidatePath("/media");
    return { success: true, media };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create media";
    return { success: false, error: message };
  }
}

/**
 * Rename Cloudinary asset using Admin API
 * 
 * This function renames a Cloudinary asset by changing its public_id.
 * Requires Admin API credentials (CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).
 * 
 * @param oldPublicId - Current public_id
 * @param newPublicId - New public_id
 * @param resourceType - Resource type (default: "image")
 * @returns Result with success status and new public_id/URL
 */
export async function renameCloudinaryAsset(
  oldPublicId: string,
  newPublicId: string,
  resourceType: string = "image"
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return {
      success: false,
      error: "Cloudinary Admin API credentials are missing. Please check your environment variables (CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
    };
  }

  // Trim whitespace from API secret (common issue with .env files)
  apiSecret = apiSecret.trim();

  // Verify API secret is not empty and has reasonable length (Cloudinary secrets are typically 20+ chars)
  if (!apiSecret || apiSecret.length < 10) {
    return {
      success: false,
      error: `CLOUDINARY_API_SECRET appears to be invalid (length: ${apiSecret?.length || 0}). Please verify your API secret in the Cloudinary dashboard (Settings → Security).`,
    };
  }

  try {
    // Cloudinary Admin API rename endpoint
    // Documentation: https://cloudinary.com/documentation/admin_api#rename_resources
    const timestamp = Math.round(Date.now() / 1000);
    
    // Cloudinary Admin API signature generation
    // According to Cloudinary docs, signature should include: from_public_id, timestamp, to_public_id
    // Parameters must be sorted alphabetically (NOT URL-encoded in signature string)
    // Note: resource_type is NOT included in the signature for rename endpoint
    const signatureParams: Record<string, string> = {
      from_public_id: oldPublicId,
      timestamp: timestamp.toString(),
      to_public_id: newPublicId,
    };

    // Sort parameters alphabetically and build signature string (plain, not URL-encoded)
    const sortedKeys = Object.keys(signatureParams).sort();
    const paramString = sortedKeys
      .map((key) => `${key}=${signatureParams[key]}`)
      .join("&");
    const signatureString = paramString + apiSecret;

    // Generate signature (SHA-1 hash of sorted params + secret)
    const crypto = await import("crypto");
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    // Build final params for the request (api_key and signature are added after)
    const params = new URLSearchParams({
      from_public_id: oldPublicId,
      to_public_id: newPublicId,
      resource_type: resourceType,
      timestamp: timestamp.toString(),
      api_key: apiKey,
      signature: signature,
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/rename`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText || response.statusText } };
      }
      console.error("Cloudinary rename API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        oldPublicId,
        newPublicId,
      });
      return {
        success: false,
        error: errorData.error?.message || `Failed to rename asset: ${response.statusText}`,
      };
    }

    const result = await response.json();
    console.log("Cloudinary rename success:", {
      oldPublicId,
      newPublicId: result.public_id,
      result,
    });

    // Extract format from result or from old public_id
    // Cloudinary rename API returns the resource with format
    const format = result.format || oldPublicId.split('.').pop() || "png";
    // Use version from result, or extract from old URL if available
    const version = result.version || null;
    
    // Construct new URL with version and format
    // Format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
    // Note: public_id from Cloudinary doesn't include the extension, so we add it
    const newUrl = version 
      ? `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/v${version}/${result.public_id}.${format}`
      : `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${result.public_id}.${format}`;

    return {
      success: true,
      newPublicId: result.public_id,
      newUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred while renaming asset",
    };
  }
}

export async function updateMedia(
  id: string,
  data: {
    altText?: string;
    caption?: string;
    credit?: string;
    title?: string;
    description?: string;
    keywords?: string[];
    license?: string;
    creator?: string;
    dateCreated?: Date;
    geoLatitude?: number;
    geoLongitude?: number;
    geoLocationName?: string;
    contentLocation?: string;
    exifData?: Record<string, unknown>;
    cloudinaryPublicId?: string;
    cloudinaryVersion?: string;
    cloudinarySignature?: string;
  }
) {
  try {
    const media = await db.media.update({
      where: { id },
      data: {
        altText: data.altText,
        caption: data.caption,
        credit: data.credit,
        title: data.title,
        description: data.description,
        keywords: data.keywords || [],
        license: data.license,
        creator: data.creator,
        dateCreated: data.dateCreated,
        geoLatitude: data.geoLatitude,
        geoLongitude: data.geoLongitude,
        geoLocationName: data.geoLocationName,
        contentLocation: data.contentLocation,
        exifData: data.exifData ? (JSON.parse(JSON.stringify(data.exifData)) as Prisma.InputJsonValue) : null,
        cloudinaryPublicId: data.cloudinaryPublicId,
        cloudinaryVersion: data.cloudinaryVersion,
        cloudinarySignature: data.cloudinarySignature,
      },
    });
    revalidatePath("/media");
    return { success: true, media };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update media";
    return { success: false, error: message };
  }
}

export async function getMediaUsage(id: string, clientId?: string) {
  try {
    const where: Prisma.MediaWhereInput = { id };
    if (clientId) {
      where.clientId = clientId;
    }

    const media = await db.media.findFirst({
      where,
      include: {
        featuredArticles: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            clientId: true,
          },
        },
      },
    });

    if (!media) {
      return { success: false, error: "Media not found" };
    }

    const usage = {
      featuredIn: media.featuredArticles,
      inArticle: [],
      totalUsage: media.featuredArticles.length,
    };

    return { success: true, usage };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get media usage";
    return { success: false, error: message };
  }
}

export async function canDeleteMedia(id: string, clientId?: string) {
  try {
    const usageResult = await getMediaUsage(id, clientId);
    if (!usageResult.success) {
      return { canDelete: false, reason: usageResult.error };
    }

    const { usage } = usageResult;
    if (!usage) {
      return { canDelete: false, reason: "Failed to get usage information" };
    }
    const publishedUsage = usage.featuredIn.filter((a) => a.status === "PUBLISHED");

    if (publishedUsage.length > 0) {
      return {
        canDelete: false,
        reason: `This media is used in ${publishedUsage.length} published article(s). Please remove it from articles first.`,
        usage: publishedUsage,
      };
    }

    return { canDelete: true, usage };
  } catch (error) {
    return { canDelete: false, reason: "Failed to check media usage" };
  }
}

/**
 * Delete Cloudinary asset using Admin API
 * 
 * @param publicId - Cloudinary public_id of the asset
 * @param resourceType - Resource type (default: "image")
 * @returns Result with success status
 */
async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: string = "image"
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return {
      success: false,
      error: "Cloudinary Admin API credentials are missing.",
    };
  }

  apiSecret = apiSecret.trim();

  try {
    const timestamp = Math.round(Date.now() / 1000);
    
    // Cloudinary Admin API signature generation for delete
    // Note: resource_type is NOT included in the signature for destroy endpoint
    // Only public_id and timestamp are used for signature
    const signatureParams: Record<string, string> = {
      public_id: publicId,
      timestamp: timestamp.toString(),
    };

    // Sort parameters alphabetically and build signature string
    const sortedKeys = Object.keys(signatureParams).sort();
    const paramString = sortedKeys
      .map((key) => `${key}=${signatureParams[key]}`)
      .join("&");
    const signatureString = paramString + apiSecret;

    // Generate signature (SHA-1 hash)
    const crypto = await import("crypto");
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    // Build params for the request
    const params = new URLSearchParams({
      public_id: publicId,
      resource_type: resourceType,
      timestamp: timestamp.toString(),
      api_key: apiKey,
      signature: signature,
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText || response.statusText } };
      }
      console.error("Cloudinary delete API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        publicId,
      });
      return {
        success: false,
        error: errorData.error?.message || `Failed to delete asset: ${response.statusText}`,
      };
    }

    const result = await response.json();
    console.log("Cloudinary delete success:", { publicId, result });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred while deleting asset",
    };
  }
}

export async function deleteMedia(id: string, clientId?: string) {
  try {
    // Check if media can be deleted
    const canDelete = await canDeleteMedia(id, clientId);
    if (!canDelete.canDelete) {
      return {
        success: false,
        error: canDelete.reason || "Cannot delete media",
        usage: canDelete.usage,
      };
    }

    const where: Prisma.MediaWhereUniqueInput = { id };
    
    // Get media record to check for Cloudinary public_id
    const media = await db.media.findUnique({ 
      where: { id },
      select: {
        id: true,
        cloudinaryPublicId: true,
        mimeType: true,
        clientId: true,
      },
    });

    if (!media) {
      return { success: false, error: "Media not found" };
    }

    if (clientId && media.clientId !== clientId) {
      return { success: false, error: "Media not found or access denied" };
    }

    // Delete from Cloudinary if public_id exists
    if (media.cloudinaryPublicId) {
      const resourceType = media.mimeType.startsWith("image/") ? "image" : "video";
      const cloudinaryResult = await deleteCloudinaryAsset(media.cloudinaryPublicId, resourceType);
      
      if (!cloudinaryResult.success) {
        // Return error to prevent database deletion if Cloudinary deletion fails
        return {
          success: false,
          error: `Failed to delete from Cloudinary: ${cloudinaryResult.error}. The file was not deleted from the database.`,
        };
      }
    } else {
      // Log warning if no Cloudinary public_id (might be old record)
      console.warn("Media record has no cloudinaryPublicId, skipping Cloudinary deletion");
    }

    // Delete from database
    await db.media.delete({ where });
    revalidatePath("/media");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete media";
    return { success: false, error: message };
  }
}

export async function bulkDeleteMedia(ids: string[], clientId?: string) {
  try {
    const where: Prisma.MediaWhereInput = { id: { in: ids } };
    if (clientId) {
      where.clientId = clientId;
    }

    // Check each media for usage
    const mediaList = await db.media.findMany({
      where,
      select: {
        id: true,
        filename: true,
        cloudinaryPublicId: true,
        mimeType: true,
        featuredArticles: {
          where: { status: "PUBLISHED" },
          select: {
            id: true,
          },
        },
      },
    });

    const cannotDelete = mediaList.filter(
      (m) => m.featuredArticles.length > 0
    );

    if (cannotDelete.length > 0) {
      return {
        success: false,
        error: `${cannotDelete.length} media file(s) are in use and cannot be deleted.`,
        cannotDelete: cannotDelete.map((m) => ({ id: m.id, filename: m.filename })),
      };
    }

    // Delete from Cloudinary for all media with public_id
    const deletePromises = mediaList
      .filter((m) => m.cloudinaryPublicId)
      .map((m) => {
        const resourceType = m.mimeType.startsWith("image/") ? "image" : "video";
        return deleteCloudinaryAsset(m.cloudinaryPublicId!, resourceType);
      });

    // Execute Cloudinary deletions (don't fail if some fail)
    await Promise.allSettled(deletePromises);

    // Delete from database
    await db.media.deleteMany({ where });
    revalidatePath("/media");
    return { success: true, deleted: ids.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete media";
    return { success: false, error: message };
  }
}
