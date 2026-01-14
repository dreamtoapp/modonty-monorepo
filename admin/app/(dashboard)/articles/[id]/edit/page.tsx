import { redirect } from "next/navigation";
import { getArticleById, getClients, getCategories, getAuthors, createArticle } from "../../actions/articles-actions";
import { getTags } from "../../../tags/actions/tags-actions";
import { ArticleFormProvider } from "../../components/article-form-context";
import { ArticleFormStep } from "../../components/article-form-step";
import { ArticleFormNavigation } from "../../components/article-form-navigation";
import { BasicStep } from "../../components/steps/basic-step";
import { ContentStep } from "../../components/steps/content-step";
import { SEOStep } from "../../components/steps/seo-step";
import { SettingsStep } from "../../components/steps/settings-step";
import { MediaStep } from "../../components/steps/media-step";
import { FAQsStep } from "../../components/steps/faqs-step";
import { RelatedArticlesStep } from "../../components/steps/related-articles-step";
import { transformArticleToFormData } from "../../helpers/article-form-helpers";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [article, clients, categories, authors, tags] = await Promise.all([
    getArticleById(id),
    getClients(),
    getCategories(),
    getAuthors(),
    getTags(),
  ]);

  if (!article) {
    redirect("/articles");
  }

  const transformedData = transformArticleToFormData(article);

  return (
    <ArticleFormProvider
      initialData={transformedData}
      onSubmit={createArticle}
      clients={clients}
      categories={categories}
      authors={authors}
      tags={tags}
      articleId={id}
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6 pb-6 md:pb-8">
        <ArticleFormNavigation />
        <div className="space-y-6 mt-6">
          <ArticleFormStep step={1}>
            <BasicStep />
          </ArticleFormStep>
          <ArticleFormStep step={2}>
            <ContentStep />
          </ArticleFormStep>
          <ArticleFormStep step={3}>
            <MediaStep />
          </ArticleFormStep>
          <ArticleFormStep step={4}>
            <FAQsStep />
          </ArticleFormStep>
          <ArticleFormStep step={5}>
            <SettingsStep />
          </ArticleFormStep>
          <ArticleFormStep step={6}>
            <RelatedArticlesStep />
          </ArticleFormStep>
          <ArticleFormStep step={7}>
            <SEOStep />
          </ArticleFormStep>
        </div>
      </div>
    </ArticleFormProvider>
  );
}
