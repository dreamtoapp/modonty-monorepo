import { TopNav } from "@/components/TopNav";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { PostCard } from "@/components/PostCard";
import { Footer } from "@/components/Footer";
import { MobileFooter } from "@/components/MobileFooter";
import { type Post } from "@/helpers/mockData";

interface FeedContainerProps {
  posts: Post[];
}

export function FeedContainer({ posts }: FeedContainerProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <div className="container mx-auto max-w-[1128px] px-4 py-6 flex-1">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="hidden lg:block sticky top-[3.5rem] self-start h-fit will-change-transform">
            <LeftSidebar />
          </aside>
          <main className="w-full lg:flex-1 lg:max-w-[600px] space-y-4 pb-20 md:pb-0 [&>article:first-of-type]:!mt-0">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا توجد مقالات متاحة</p>
              </div>
            )}
          </main>
          <aside className="hidden xl:block sticky top-[3.5rem] self-start h-fit will-change-transform">
            <RightSidebar />
          </aside>
        </div>
      </div>
      <Footer />
      <MobileFooter />
    </div>
  );
}

