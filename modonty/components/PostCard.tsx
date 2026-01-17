import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ThumbsUp, ThumbsDown, MessageCircle, Share2, Images, Video, Heart } from "lucide-react";
import { formatRelativeTime, type Post } from "@/helpers/mockData";
import { TextToSpeech } from "@/components/TextToSpeech";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const companyInitials = post.clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const getClientAvatar = () => {
    const clientMap: Record<string, string> = {
      "حلول التقنية المتقدمة": "https://api.dicebear.com/7.x/shapes/svg?seed=TechCorp",
      "استوديو التصميم المحترف": "https://api.dicebear.com/7.x/shapes/svg?seed=DesignStudio",
      "مركز التسويق الرقمي": "https://api.dicebear.com/7.x/shapes/svg?seed=MarketingHub",
      "مختبرات الابتكار": "https://api.dicebear.com/7.x/shapes/svg?seed=InnovationLabs",
    };
    return clientMap[post.clientName] || "";
  };


  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.content,
    image: post.image,
    datePublished: post.publishedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author?.name || "Modonty",
    },
    publisher: {
      "@type": "Organization",
      name: post.clientName,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com"}/articles/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <article itemScope itemType="https://schema.org/Article">
        <Card className="bg-white border border-border shadow-sm">
          <CardHeader className="pb-3">
            <header className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Link href={`/clients/${post.clientSlug}`}>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={getClientAvatar()} alt={post.clientName} />
                    <AvatarFallback>{companyInitials}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/clients/${post.clientSlug}`}
                    className="font-semibold text-sm hover:text-primary hover:underline"
                  >
                    <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                      <span itemProp="name">{post.clientName}</span>
                    </span>
                  </Link>
                  <time
                    itemProp="datePublished"
                    dateTime={post.publishedAt.toISOString()}
                    className="text-xs text-muted-foreground mt-1 block"
                  >
                    {formatRelativeTime(post.publishedAt)}
                  </time>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="min-h-11 min-w-11">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/articles/${post.slug}/gallery/images`} className="flex items-center gap-2 cursor-pointer">
                      <Images className="h-4 w-4" />
                      الصور
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/articles/${post.slug}/gallery/videos`} className="flex items-center gap-2 cursor-pointer">
                      <Video className="h-4 w-4" />
                      الفيديو
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Share2 className="h-4 w-4" />
                    مشاركة
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
          </CardHeader>

          <CardContent className="pt-0 space-y-4">
            <div className="space-y-2">
              {post.title && (
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/articles/${post.slug}`} className="flex-1">
                    <h2 itemProp="headline" className="font-semibold text-base hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <TextToSpeech
                    text={`${post.title}. ${post.content}`}
                    lang="ar-SA"
                  />
                </div>
              )}
              <p itemProp="description" className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {post.image && (
              <Link href={`/articles/${post.slug}`} className="block">
                <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted">
                  <img
                    itemProp="image"
                    src={post.image}
                    alt={post.title || "صورة المقال"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </Link>
            )}

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
          <Button variant="ghost" className="min-h-11 min-w-11 gap-1 hover:text-primary px-1 sm:px-2">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" className="min-h-11 min-w-11 gap-1 hover:text-primary px-1 sm:px-2">
            <ThumbsDown className="h-4 w-4" />
            <span>{post.dislikes}</span>
          </Button>
          <Button variant="ghost" className="min-h-11 min-w-11 gap-1 hover:text-primary px-1 sm:px-2">
            <Heart className="h-4 w-4" />
            <span>{post.favorites}</span>
          </Button>
          <Button variant="ghost" className="min-h-11 min-w-11 gap-1 hover:text-primary px-1 sm:px-2">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
    </article>
    </>
  );
}

