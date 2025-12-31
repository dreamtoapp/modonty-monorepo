import { redirect } from "next/navigation";
import { getArticleById } from "../actions/articles-actions";
import { PageHeader } from "@/components/shared/page-header";
import { ArticleView } from "./components/article-view";

export default async function ArticleViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    redirect("/articles");
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Article Details"
        description="View article information"
      />
      <ArticleView article={article} />
    </div>
  );
}
