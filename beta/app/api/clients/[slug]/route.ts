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
        logoMedia: {
          select: {
            url: true,
          },
        },
        ogImageMedia: {
          select: {
            url: true,
          },
        },
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
        alternateName: (client as any).alternateName || null,
        url: client.url,
        logo: client.logoMedia?.url || null,
        ogImage: client.ogImageMedia?.url || null,
        email: client.email,
        phone: client.phone,
        seoTitle: client.seoTitle,
        seoDescription: client.seoDescription,
        sameAs: client.sameAs,
        // Saudi Arabia & Gulf Identifiers
        commercialRegistrationNumber: (client as any).commercialRegistrationNumber || null,
        vatID: (client as any).vatID || null,
        taxID: (client as any).taxID || null,
        legalForm: (client as any).legalForm || null,
        // Address Enhancement
        addressRegion: (client as any).addressRegion || null,
        addressNeighborhood: (client as any).addressNeighborhood || null,
        addressBuildingNumber: (client as any).addressBuildingNumber || null,
        // Classification
        businessActivityCode: (client as any).businessActivityCode || null,
        isicV4: (client as any).isicV4 || null,
        numberOfEmployees: (client as any).numberOfEmployees || null,
        // Additional Properties
        slogan: (client as any).slogan || null,
        keywords: (client as any).keywords || [],
        knowsLanguage: (client as any).knowsLanguage || [],
        organizationType: (client as any).organizationType || null,
        articleCount: (client as any)._count?.articles ?? 0,
        articles: (client as any).articles ?? [],
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
