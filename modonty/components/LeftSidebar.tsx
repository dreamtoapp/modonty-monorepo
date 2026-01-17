import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tag, BarChart3, Heart, MessageCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getCategoryAnalytics, getCategoryStats } from "@/helpers/mockData";

interface LeftSidebarProps {
  currentCategory?: string;
}

export function LeftSidebar({ currentCategory = "تقنية" }: LeftSidebarProps) {
  const categoryStats = getCategoryStats();
  const stats = getCategoryAnalytics(currentCategory);

  return (
    <aside className="hidden lg:block w-[240px] space-y-4">
      <Card className="relative">
        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center z-10">
          1
        </div>
        <CardContent className="p-3 pt-5">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-semibold text-foreground">
              تحليلات {currentCategory}
            </h4>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  المقالات
                </span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {stats.totalBlogs}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  التفاعلات
                </span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {stats.totalReactions.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  متوسط التفاعل
                </span>
              </div>
              <span className="text-sm font-bold text-primary">
                {stats.averageEngagement}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative">
        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center z-10">
          2
        </div>
        <CardContent className="p-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase">
            الفئات
          </h4>
          <div className="space-y-2">
            <CategoryLink label="تقنية" count={4} />
            <CategoryLink label="تصميم" count={3} />
            <CategoryLink label="تسويق" count={3} />
            <CategoryLink label="ابتكار" count={2} />
          </div>
        </CardContent>
      </Card>

      <Card className="relative">
        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center z-10">
          3
        </div>
        <CardContent className="p-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase">
            نصائح وحيل
          </h4>
          <div className="space-y-2">
            <TipItem title="حسّن محتواك لمحركات البحث" />
            <TipItem title="استخدم عناوين جذابة" />
            <TipItem title="أضف عناصر بصرية" />
            <TipItem title="انشر بانتظام" />
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

function CategoryLink({ label, count }: { label: string; count: number }) {
  return (
    <Link
      href="#"
      className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm group"
    >
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="group-hover:text-primary transition-colors">{label}</span>
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
        {count}
      </span>
    </Link>
  );
}

function TipItem({ title }: { title: string }) {
  return (
    <Link
      href="#"
      className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 group"
    >
      <span className="text-primary mt-0.5">•</span>
      <span className="group-hover:underline">{title}</span>
    </Link>
  );
}

