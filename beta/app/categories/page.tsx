import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Tag } from "lucide-react";
import { getCategoryStats } from "@/helpers/mockData";
import { generateMetadataFromSEO } from "@/lib/seo";

export const metadata: Metadata = generateMetadataFromSEO({
  title: "الفئات",
  description: "استكشف المقالات حسب الفئة - تصفح جميع فئات المحتوى المتاحة",
  keywords: ["فئات", "تصنيفات", "مقالات", "محتوى"],
  url: "/categories",
  type: "website",
});

export default function CategoriesPage() {
  const categories = getCategoryStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-[1128px] px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">الفئات</h1>
          <p className="text-muted-foreground">استكشف المقالات حسب الفئة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={`/categories/${category.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Tag className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">عدد المقالات</span>
                    <Badge variant="secondary" className="text-sm">
                      {category.count}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}




