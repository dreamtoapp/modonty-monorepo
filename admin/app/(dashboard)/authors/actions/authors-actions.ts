"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ArticleStatus } from "@prisma/client";
import { calculateSEOScore } from "@/helpers/utils/seo-score-calculator";
import { authorSEOConfig } from "../helpers/author-seo-config";
import { MODONTY_AUTHOR_SLUG } from "@/lib/constants/modonty-author";


export async function getModontyAuthor() {
  try {
    const author = await db.author.upsert({
      where: { slug: MODONTY_AUTHOR_SLUG },
      update: {}, // Don't update if exists, just return it
      create: {
        name: "Modonty",
        slug: MODONTY_AUTHOR_SLUG,
        url: "https://modonty.com",
        bio: "Modonty is a leading content platform providing high-quality articles and insights.",
        seoTitle: "Modonty - Author Profile",
        seoDescription: "Learn more about Modonty, the author behind all content on Modonty.com",
        canonicalUrl: "https://modonty.com",
        verificationStatus: true,
      },
      include: {
        _count: { select: { articles: true } },
      },
    });

    return author;
  } catch (error) {
    // If upsert fails, try to fetch existing author
    try {
      const existingAuthor = await db.author.findUnique({
        where: { slug: MODONTY_AUTHOR_SLUG },
        include: {
          _count: { select: { articles: true } },
        },
      });
      if (existingAuthor) {
        return existingAuthor;
      }
    } catch (fetchError) {
      console.error("Error fetching existing Modonty author:", fetchError);
    }
    console.error("Error fetching/creating Modonty author:", error);
    return null;
  }
}

export async function getAuthors() {
  try {
    const modontyAuthor = await getModontyAuthor();
    if (!modontyAuthor) {
      return [];
    }

    return [modontyAuthor];
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}


export async function createAuthor(data: {
  name: string;
  slug: string;
  jobTitle?: string;
  bio?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  email?: string;
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  sameAs?: string[];
  credentials?: string[];
  expertiseAreas?: string[];
  verificationStatus?: boolean;
  memberOf?: string[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}) {
  return {
    success: false,
    error: "Creating new authors is not allowed. Only the Modonty author exists in the system.",
  };
}

export async function updateAuthor(
  id: string,
  data: {
    name: string;
    slug: string;
    jobTitle?: string;
    bio?: string;
    image?: string | null;
    imageAlt?: string | null;
    url?: string;
    email?: string;
    linkedIn?: string;
    twitter?: string;
    facebook?: string;
    sameAs?: string[];
    credentials?: string[];
    expertiseAreas?: string[];
    verificationStatus?: boolean;
    memberOf?: string[];
    seoTitle?: string;
    seoDescription?: string;
    socialImage?: string | null;
    socialImageAlt?: string | null;
    cloudinaryPublicId?: string | null;
    canonicalUrl?: string;
  }
) {
  try {
    const modontyAuthor = await getModontyAuthor();
    if (!modontyAuthor || modontyAuthor.id !== id) {
      return {
        success: false,
        error: "You can only edit the Modonty author.",
      };
    }

    if (data.slug !== MODONTY_AUTHOR_SLUG) {
      return {
        success: false,
        error: `The author slug must be "${MODONTY_AUTHOR_SLUG}".`,
      };
    }

    const updateData: {
      name: string;
      slug: string;
      jobTitle?: string;
      bio?: string;
      image?: string | null;
      imageAlt?: string | null;
      url?: string;
      email?: string | null;
      linkedIn?: string;
      twitter?: string;
      facebook?: string;
      sameAs?: string[];
      credentials?: string[];
      expertiseAreas?: string[];
      verificationStatus?: boolean;
      memberOf?: string[];
      seoTitle?: string;
      seoDescription?: string;
      socialImage?: string | null;
      socialImageAlt?: string | null;
      cloudinaryPublicId?: string | null;
      canonicalUrl?: string;
    } = {
      name: data.name,
      slug: data.slug,
      jobTitle: data.jobTitle,
      bio: data.bio,
      url: data.url,
      email: data.email || null,
      linkedIn: data.linkedIn,
      twitter: data.twitter,
      facebook: data.facebook,
      sameAs: data.sameAs || [],
      credentials: data.credentials || [],
      expertiseAreas: data.expertiseAreas || [],
      verificationStatus: data.verificationStatus || false,
      memberOf: data.memberOf || [],
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      canonicalUrl: data.canonicalUrl,
    };

    // Only update image fields if they are explicitly provided (including null for removal)
    if (data.image !== undefined) {
      updateData.image = data.image;
    }
    if (data.imageAlt !== undefined) {
      updateData.imageAlt = data.imageAlt;
    }
    if (data.socialImage !== undefined) {
      updateData.socialImage = data.socialImage;
    }
    if (data.socialImageAlt !== undefined) {
      updateData.socialImageAlt = data.socialImageAlt;
    }
    if (data.cloudinaryPublicId !== undefined) {
      updateData.cloudinaryPublicId = data.cloudinaryPublicId;
    }

    const author = await db.author.update({
      where: { id },
      data: updateData,
    });
    revalidatePath("/authors");
    return { success: true, author };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update author";
    return { success: false, error: message };
  }
}

export async function getAuthorsStats() {
  try {
    const modontyAuthor = await getModontyAuthor();
    if (!modontyAuthor) {
      return {
        total: 0,
        withArticles: 0,
        withoutArticles: 0,
        createdThisMonth: 0,
        averageSEO: 0,
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        archivedArticles: 0,
        socialProfilesCount: 0,
        eetatSignalsCount: 0,
      };
    }

    const articleCount = modontyAuthor._count.articles;
    const [publishedArticleCount, draftArticleCount, archivedArticleCount] = await Promise.all([
      db.article.count({
        where: {
          authorId: modontyAuthor.id,
          status: ArticleStatus.PUBLISHED,
        },
      }),
      db.article.count({
        where: {
          authorId: modontyAuthor.id,
          status: ArticleStatus.DRAFT,
        },
      }),
      db.article.count({
        where: {
          authorId: modontyAuthor.id,
          status: ArticleStatus.ARCHIVED,
        },
      }),
    ]);

    const scoreResult = calculateSEOScore(modontyAuthor, authorSEOConfig);

    // Calculate social profiles count
    const socialProfilesCount = [
      modontyAuthor.linkedIn,
      modontyAuthor.twitter,
      modontyAuthor.facebook,
      ...(modontyAuthor.sameAs || []),
    ].filter(Boolean).length;

    // Calculate E-E-A-T signals count
    const eetatSignalsCount = [
      modontyAuthor.jobTitle ? 1 : 0,
      modontyAuthor.credentials && modontyAuthor.credentials.length > 0 ? 1 : 0,
      modontyAuthor.expertiseAreas && modontyAuthor.expertiseAreas.length > 0 ? 1 : 0,
      modontyAuthor.verificationStatus ? 1 : 0,
      socialProfilesCount > 0 ? 1 : 0,
    ].reduce((sum, val) => sum + val, 0);

    return {
      total: 1,
      withArticles: publishedArticleCount > 0 ? 1 : 0,
      withoutArticles: publishedArticleCount === 0 ? 1 : 0,
      createdThisMonth: 0,
      averageSEO: scoreResult.percentage,
      totalArticles: articleCount,
      publishedArticles: publishedArticleCount,
      draftArticles: draftArticleCount,
      archivedArticles: archivedArticleCount,
      socialProfilesCount,
      eetatSignalsCount,
    };
  } catch (error) {
    console.error("Error fetching authors stats:", error);
      return {
        total: 0,
        withArticles: 0,
        withoutArticles: 0,
        createdThisMonth: 0,
        averageSEO: 0,
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        archivedArticles: 0,
        socialProfilesCount: 0,
        eetatSignalsCount: 0,
      };
  }
}

