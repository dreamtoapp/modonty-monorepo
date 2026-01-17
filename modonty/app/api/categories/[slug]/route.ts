import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ArticleStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const category = await db.category.findUnique({
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
                altText: true,
              },
            },
            client: {
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

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        seoTitle: category.seoTitle,
        seoDescription: category.seoDescription,
        articleCount: (category as any)._count?.articles ?? 0,
        articles: (category as any).articles ?? [],
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
