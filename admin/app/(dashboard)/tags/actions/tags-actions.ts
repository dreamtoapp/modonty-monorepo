"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTags() {
  try {
    const tags = await db.tag.findMany({
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: { name: "asc" },
    });
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export async function getTagById(id: string) {
  try {
    return await db.tag.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}

export async function createTag(data: { name: string; slug: string }) {
  try {
    const tag = await db.tag.create({ data });
    revalidatePath("/tags");
    return { success: true, tag };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create tag" };
  }
}

export async function updateTag(id: string, data: { name: string; slug: string }) {
  try {
    const tag = await db.tag.update({ where: { id }, data });
    revalidatePath("/tags");
    return { success: true, tag };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update tag" };
  }
}

export async function deleteTag(id: string) {
  try {
    await db.tag.delete({ where: { id } });
    revalidatePath("/tags");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete tag" };
  }
}
