import Link from "next/link";
import { Globe } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white mt-12">
      <div className="container mx-auto max-w-[1128px] px-4 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-sm font-semibold text-foreground">مودونتي</span>
            <span className="text-sm text-muted-foreground">© {currentYear}</span>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            <Link
              href="/legal/user-agreement"
              className="text-xs text-muted-foreground hover:text-primary hover:underline"
            >
              اتفاقية المستخدم
            </Link>
            <Link
              href="/legal/privacy-policy"
              className="text-xs text-muted-foreground hover:text-primary hover:underline"
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="/legal/community-guidelines"
              className="text-xs text-muted-foreground hover:text-primary hover:underline"
            >
              إرشادات المجتمع
            </Link>
            <Link
              href="/legal/cookie-policy"
              className="text-xs text-muted-foreground hover:text-primary hover:underline"
            >
              سياسة ملفات تعريف الارتباط
            </Link>
            <Link
              href="/legal/copyright-policy"
              className="text-xs text-muted-foreground hover:text-primary hover:underline"
            >
              سياسة حقوق النشر
            </Link>
            <Link
              href="/help/feedback"
              className="text-xs text-muted-foreground hover:text-primary hover:underline"
            >
              إرسال ملاحظات
            </Link>
            <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
              <Globe className="h-3 w-3" />
              اللغة
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}




