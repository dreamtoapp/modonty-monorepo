import { getClients, getCategories, getAuthors, createArticle } from '../actions/articles-actions';
import { getTags } from '../../tags/actions/tags-actions';
import { ArticleFormProvider } from '../components/article-form-context';
import { ArticleFormStep } from '../components/article-form-step';
import { ArticleFormNavigation } from '../components/article-form-navigation';
import { BasicStep } from '../components/steps/basic-step';
import { ContentStep } from '../components/steps/content-step';
import { SEOStep } from '../components/steps/seo-step';
import { SettingsStep } from '../components/steps/settings-step';
import { MediaStep } from '../components/steps/media-step';
import { FAQsStep } from '../components/steps/faqs-step';
import { RelatedArticlesStep } from '../components/steps/related-articles-step';
import { ReviewStep } from '../components/steps/review-step';

export default async function NewArticlePage() {
  const [clients, categories, authors, tags] = await Promise.all([
    getClients(),
    getCategories(),
    getAuthors(),
    getTags(),
  ]);

  return (
    <ArticleFormProvider
      initialData={undefined}
      onSubmit={createArticle}
      clients={clients}
      categories={categories}
      authors={authors}
      tags={tags}
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6   pb-6 md:pb-8  ">
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
          <ArticleFormStep step={8}>
            <ReviewStep />
          </ArticleFormStep>
        </div>
      </div>
    </ArticleFormProvider>
  );
}
