import { TopNav } from "@/components/TopNav";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { PostCard } from "@/components/PostCard";
import { Footer } from "@/components/Footer";
import { type Post } from "@/helpers/mockData";

interface FeedContainerProps {
  posts: Post[];
}

export function FeedContainer({ posts }: FeedContainerProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <div className="container mx-auto max-w-[1128px] px-4 py-6 flex-1">
        <div className="flex gap-6 items-start">
          <div className="sticky top-[3.5rem] self-start h-fit will-change-transform">
            <LeftSidebar />
          </div>
          <main className="flex-1 max-w-[600px] space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا توجد مقالات متاحة</p>
              </div>
            )}
          </main>
          <div className="sticky top-[3.5rem] self-start h-fit will-change-transform">
            <RightSidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

