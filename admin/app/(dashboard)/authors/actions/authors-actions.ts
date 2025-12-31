"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAuthors() {
  try {
    const authors = await db.author.findMany({
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: { name: "asc" },
    });
    return authors;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

export async function getAuthorById(id: string) {
  try {
    return await db.author.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}

export async function createAuthor(data: {
  name: string;
  slug: string;
  jobTitle?: string;
  worksFor?: string;
  bio?: string;
  image?: string;
  url?: string;
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  sameAs?: string[];
  credentials?: string[];
  qualifications?: string[];
  expertiseAreas?: string[];
  experienceYears?: number;
  verificationStatus?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}) {
  try {
    const author = await db.author.create({
      data: {
        name: data.name,
        slug: data.slug,
        jobTitle: data.jobTitle,
        worksFor: data.worksFor || null,
        bio: data.bio,
        image: data.image,
        url: data.url,
        linkedIn: data.linkedIn,
        twitter: data.twitter,
        facebook: data.facebook,
        sameAs: data.sameAs || [],
        credentials: data.credentials || [],
        qualifications: data.qualifications || [],
        expertiseAreas: data.expertiseAreas || [],
        experienceYears: data.experienceYears,
        verificationStatus: data.verificationStatus || false,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      },
    });
    revalidatePath("/authors");
    return { success: true, author };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create author" };
  }
}

export async function updateAuthor(
  id: string,
  data: {
    name: string;
    slug: string;
    jobTitle?: string;
    worksFor?: string;
    bio?: string;
    image?: string;
    url?: string;
    linkedIn?: string;
    twitter?: string;
    facebook?: string;
    sameAs?: string[];
    credentials?: string[];
    qualifications?: string[];
    expertiseAreas?: string[];
    experienceYears?: number;
    verificationStatus?: boolean;
    seoTitle?: string;
    seoDescription?: string;
  }
) {
  try {
    const author = await db.author.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        jobTitle: data.jobTitle,
        worksFor: data.worksFor || null,
        bio: data.bio,
        image: data.image,
        url: data.url,
        linkedIn: data.linkedIn,
        twitter: data.twitter,
        facebook: data.facebook,
        sameAs: data.sameAs || [],
        credentials: data.credentials || [],
        qualifications: data.qualifications || [],
        expertiseAreas: data.expertiseAreas || [],
        experienceYears: data.experienceYears,
        verificationStatus: data.verificationStatus || false,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      },
    });
    revalidatePath("/authors");
    return { success: true, author };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update author" };
  }
}

export async function deleteAuthor(id: string) {
  try {
    await db.author.delete({ where: { id } });
    revalidatePath("/authors");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete author" };
  }
}

export async function getClients() {
  try {
    return await db.client.findMany({ orderBy: { name: "asc" } });
  } catch (error) {
    return [];
  }
}
