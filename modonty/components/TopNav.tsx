"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Home, Tags, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/UserMenu";
import { LoginButton } from "@/components/auth/LoginButton";
import { MobileMenu } from "@/components/MobileMenu";
import { MobileSearch } from "@/components/MobileSearch";

export function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto max-w-[1128px]">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <MobileMenu />
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-semibold text-foreground hidden sm:inline">
                مودونتي
              </span>
            </Link>
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث"
                className="h-9 w-64 rounded-md border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <nav className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-1">
              <NavItem icon={Home} label="الرئيسية" href="/" active={pathname === "/"} />
              <NavItem icon={Tags} label="الفئات" href="/categories" active={pathname?.startsWith("/categories")} />
              <NavItem icon={Building2} label="العملاء" href="/clients" active={pathname?.startsWith("/clients")} />
            </div>
            <MobileSearch />
            {session?.user ? (
              <UserMenu />
            ) : (
              <LoginButton />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center px-4 py-2 text-xs hover:text-primary transition-colors min-h-11",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="mt-1">{label}</span>
    </Link>
  );
}

