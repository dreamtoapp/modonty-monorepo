import { getClients, getCategories, getAuthors, createArticle } from "../actions/articles-actions";
import { PageHeader } from "@/components/shared/page-header";
import { ArticleForm } from "../components/article-form-enhanced";

export default async function NewArticlePage() {
  const [clients, categories, authors] = await Promise.all([
    getClients(),
    getCategories(),
    getAuthors(),
  ]);

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader title="Create Article" description="Add a new article to the system" />
      <ArticleForm
        clients={clients}
        categories={categories}
        authors={authors}
        onSubmit={createArticle}
      />
    </div>
  );
}
