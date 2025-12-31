"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getClients() {
  try {
    const clients = await db.client.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function getClientById(id: string) {
  try {
    const client = await db.client.findUnique({
      where: { id },
    });
    return client;
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
}

export async function createClient(data: {
  name: string;
  slug: string;
  legalName?: string;
  url?: string;
  logo?: string;
  favicon?: string;
  ogImage?: string;
  primaryColor?: string;
  sameAs?: string[];
  email?: string;
  phone?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}) {
  try {
    const client = await db.client.create({
      data: {
        name: data.name,
        slug: data.slug,
        legalName: data.legalName,
        url: data.url,
        logo: data.logo,
        favicon: data.favicon,
        ogImage: data.ogImage,
        primaryColor: data.primaryColor,
        sameAs: data.sameAs || [],
        email: data.email,
        phone: data.phone,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords || [],
      },
    });
    revalidatePath("/clients");
    return { success: true, client };
  } catch (error: any) {
    console.error("Error creating client:", error);
    return { success: false, error: error.message || "Failed to create client" };
  }
}

export async function updateClient(
  id: string,
  data: {
    name: string;
    slug: string;
    legalName?: string;
    url?: string;
    logo?: string;
    favicon?: string;
    ogImage?: string;
    primaryColor?: string;
    sameAs?: string[];
    email?: string;
    phone?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
  }
) {
  try {
    const client = await db.client.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        legalName: data.legalName,
        url: data.url,
        logo: data.logo,
        favicon: data.favicon,
        ogImage: data.ogImage,
        primaryColor: data.primaryColor,
        sameAs: data.sameAs || [],
        email: data.email,
        phone: data.phone,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords || [],
      },
    });
    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { success: true, client };
  } catch (error: any) {
    console.error("Error updating client:", error);
    return { success: false, error: error.message || "Failed to update client" };
  }
}

export async function deleteClient(id: string) {
  try {
    await db.client.delete({
      where: { id },
    });
    revalidatePath("/clients");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting client:", error);
    return { success: false, error: error.message || "Failed to delete client" };
  }
}
