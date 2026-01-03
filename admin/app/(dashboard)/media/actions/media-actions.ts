"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getMedia() {
  try {
    const media = await db.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return media;
  } catch (error) {
    console.error("Error fetching media:", error);
    return [];
  }
}

export async function getMediaById(id: string) {
  try {
    return await db.media.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}

export async function createMedia(data: {
  filename: string;
  url: string;
  mimeType: string;
  fileSize?: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  credit?: string;
  title?: string;
  description?: string;
  keywords?: string[];
}) {
  try {
    const media = await db.media.create({
      data: {
        filename: data.filename,
        url: data.url,
        mimeType: data.mimeType,
        fileSize: data.fileSize,
        width: data.width,
        height: data.height,
        altText: data.altText,
        caption: data.caption,
        credit: data.credit,
        title: data.title,
        description: data.description,
        keywords: data.keywords || [],
      },
    });
    revalidatePath("/media");
    return { success: true, media };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create media";
    return { success: false, error: message };
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
      },
    });
    revalidatePath("/media");
    return { success: true, media };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update media";
    return { success: false, error: message };
  }
}

export async function deleteMedia(id: string) {
  try {
    await db.media.delete({ where: { id } });
    revalidatePath("/media");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete media";
    return { success: false, error: message };
  }
}
