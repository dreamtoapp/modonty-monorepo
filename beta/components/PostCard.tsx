import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
      name: post.author.name,
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
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
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
                <div className="relative w-full h-64 rounded-md overflow-hidden bg-muted">
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

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Button variant="ghost" className="h-8 gap-2 hover:text-primary">
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" className="h-8 gap-2 hover:text-primary">
                <ThumbsDown className="h-4 w-4" />
                <span>{post.dislikes}</span>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="h-8 gap-2 hover:text-primary">
                <Heart className="h-4 w-4" />
                <span>{post.favorites}</span>
              </Button>
              <Button variant="ghost" className="h-8 gap-2 hover:text-primary">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/articles/${post.slug}/gallery/images`}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Images className="h-4 w-4" />
            </Link>
            <Link
              href={`/articles/${post.slug}/gallery/videos`}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Video className="h-4 w-4" />
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </article>
    </>
  );
}

