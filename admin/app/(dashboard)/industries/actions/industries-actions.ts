"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getIndustries() {
  try {
    const industries = await db.industry.findMany({
      include: {
        _count: { select: { clients: true } },
      },
      orderBy: { name: "asc" },
    });
    return industries;
  } catch (error) {
    console.error("Error fetching industries:", error);
    return [];
  }
}

export async function getIndustryById(id: string) {
  try {
    return await db.industry.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}

export async function createIndustry(data: { name: string; slug: string }) {
  try {
    const industry = await db.industry.create({ data });
    revalidatePath("/industries");
    return { success: true, industry };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create industry" };
  }
}

export async function updateIndustry(id: string, data: { name: string; slug: string }) {
  try {
    const industry = await db.industry.update({ where: { id }, data });
    revalidatePath("/industries");
    return { success: true, industry };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update industry" };
  }
}

export async function deleteIndustry(id: string) {
  try {
    const industry = await db.industry.findUnique({
      where: { id },
      include: { _count: { select: { clients: true } } },
    });

    if (industry && industry._count.clients > 0) {
      return {
        success: false,
        error: `Cannot delete industry. It is used by ${industry._count.clients} client(s).`,
      };
    }

    await db.industry.delete({ where: { id } });
    revalidatePath("/industries");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete industry" };
  }
}
