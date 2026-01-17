import type { Metadata } from "next";
import "./globals.css";
import { GTMContainer } from "@/components/gtm/GTMContainer";

export const metadata: Metadata = {
  title: "Coming Soon - Modonty",
  description: "We're working on something amazing. Stay tuned for updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <GTMContainer />
        {children}
      </body>
    </html>
  );
}
