import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { GTMContainer } from "@/components/gtm/GTMContainer";

export const metadata: Metadata = {
  title: "مودونتي - منصة المدونات متعددة العملاء",
  description: "منصة مدونات احترافية لإدارة المحتوى عبر عملاء متعددين",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-background">
        <GTMContainer />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

