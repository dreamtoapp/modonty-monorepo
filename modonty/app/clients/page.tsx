import { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { mockClients, getPublishedPosts } from "@/helpers/mockData";
import { generateMetadataFromSEO } from "@/lib/seo";

export const metadata: Metadata = generateMetadataFromSEO({
  title: "العملاء",
  description: "استكشف جميع العملاء والشركات - تصفح المقالات من مختلف العملاء",
  keywords: ["عملاء", "شركات", "منظمات", "مقالات"],
  url: "/clients",
  type: "website",
});

export default function ClientsPage() {
  const clients = mockClients;
  const posts = getPublishedPosts();

  const getClientPostCount = (clientSlug: string) => {
    return posts.filter((post) => post.clientSlug === clientSlug).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-[1128px] px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">العملاء</h1>
          <p className="text-muted-foreground">استكشف جميع العملاء والشركات</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => {
            const postCount = getClientPostCount(client.slug);
            const initials = client.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <Link key={client.id} href={`/clients/${client.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={client.avatar} alt={client.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">
                          {client.name}
                        </h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{postCount} مقال</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}




