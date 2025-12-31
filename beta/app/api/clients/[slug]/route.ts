import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ArticleStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const client = await db.client.findUnique({
      where: { slug },
      include: {
        articles: {
          where: {
            status: ArticleStatus.PUBLISHED,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            datePublished: true,
            featuredImage: {
              select: {
                url: true,
                alt: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: {
            datePublished: "desc",
          },
          take: 50, // Limit for performance
        },
        _count: {
          select: {
            articles: {
              where: {
                status: ArticleStatus.PUBLISHED,
              },
            },
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: client.id,
        name: client.name,
        slug: client.slug,
        legalName: client.legalName,
        url: client.url,
        logo: client.logo,
        ogImage: client.ogImage,
        email: client.email,
        phone: client.phone,
        seoTitle: client.seoTitle,
        seoDescription: client.seoDescription,
        seoKeywords: client.seoKeywords,
        sameAs: client.sameAs,
        articleCount: client._count.articles,
        articles: client.articles,
      },
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}
