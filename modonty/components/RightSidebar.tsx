import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Mail } from "lucide-react";
import Link from "next/link";

export function RightSidebar() {
  return (
    <aside className="hidden xl:block w-[300px] space-y-4">
      <Card className="relative">
        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center z-10">
          4
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">أخبار مودونتي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <NewsItem
            title="نمو صناعة التقنية"
            description="قطاع التقنية يشهد نمواً بنسبة 15%"
            badge="رائج"
          />
          <NewsItem
            title="اتجاهات العمل عن بُعد"
            description="النماذج الهجينة تصبح معياراً"
          />
          <NewsItem
            title="اعتماد الذكاء الاصطناعي"
            description="الشركات تسرع من تكامل الذكاء الاصطناعي"
          />
        </CardContent>
      </Card>

      <Card className="relative">
        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center z-10">
          5
        </div>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            مقالات قد تعجبك
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ArticleSuggestion title="اتجاهات تطوير الويب" client="حلول التقنية المتقدمة" />
          <ArticleSuggestion title="مبادئ التصميم 2025" client="استوديو التصميم المحترف" />
          <ArticleSuggestion title="الذكاء الاصطناعي في الأعمال" client="مختبرات الابتكار" />
        </CardContent>
      </Card>

      <Card className="relative">
        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center z-10">
          6
        </div>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">النشرة الإخبارية</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            احصل على رؤى وتحديثات أسبوعية في بريدك الإلكتروني
          </p>
          <form className="space-y-2">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            />
            <Button type="submit" className="w-full h-9 text-sm">
              اشترك
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground">
            نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}

function NewsItem({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-tight">{title}</h4>
        {badge && (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function ArticleSuggestion({ title, client }: { title: string; client: string }) {
  return (
    <Link href="#" className="flex items-start gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
      <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
        <TrendingUp className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold truncate">{title}</h4>
        <p className="text-xs text-muted-foreground truncate">{client}</p>
      </div>
    </Link>
  );
}

