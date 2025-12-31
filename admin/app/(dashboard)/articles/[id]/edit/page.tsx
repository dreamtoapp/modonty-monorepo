import { redirect } from "next/navigation";
import {
  getArticleById,
  getClients,
  getCategories,
  getAuthors,
  createUpdateArticleAction,
} from "../../actions/articles-actions";
import { PageHeader } from "@/components/shared/page-header";
import { ArticleForm } from "../../components/article-form-enhanced";
import { DeleteArticleButton } from "../components/delete-article-button";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, clients, categories, authors] = await Promise.all([
    getArticleById(id),
    getClients(),
    getCategories(),
    getAuthors(),
  ]);

  if (!article) {
    redirect("/articles");
  }

  const updateArticleAction = await createUpdateArticleAction(id);

  return (
    <div className="container mx-auto max-w-[1128px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Edit Article</h1>
          <p className="text-muted-foreground mt-1">Update article information</p>
        </div>
        <DeleteArticleButton articleId={id} />
      </div>
      <ArticleForm
        initialData={{
          ...article,
          categoryId: article.categoryId || "",
        }}
        clients={clients}
        categories={categories}
        authors={authors}
        onSubmit={updateArticleAction}
      />
    </div>
  );
}
