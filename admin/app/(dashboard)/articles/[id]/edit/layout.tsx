import { redirect } from 'next/navigation';
import {
  getArticleById,
  getClients,
  getCategories,
  getAuthors,
  createUpdateArticleAction,
} from '../../actions/articles-actions';
import { getTags } from '../../../tags/actions/tags-actions';
import { ArticleFormProvider } from '../../components/article-form-context';
import { ArticleFormLayout } from '../../components/article-form-layout';

export default async function EditArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [article, clients, categories, authors, tags] = await Promise.all([
    getArticleById(id),
    getClients(),
    getCategories(),
    getAuthors(),
    getTags(),
  ]);

  if (!article) {
    redirect('/articles');
  }

  const updateArticleAction = await createUpdateArticleAction(id);

  // Transform article data - convert null to undefined for optional fields
  const initialData = {
    ...article,
    excerpt: article.excerpt ?? undefined,
    seoTitle: article.seoTitle ?? undefined,
    seoDescription: article.seoDescription ?? undefined,
    ogTitle: article.ogTitle ?? undefined,
    ogDescription: article.ogDescription ?? undefined,
    ogUrl: article.ogUrl ?? undefined,
    ogSiteName: article.ogSiteName ?? undefined,
    ogLocale: article.ogLocale ?? undefined,
    ogType: article.ogType ?? undefined,
    ogArticleAuthor: article.ogArticleAuthor ?? undefined,
    ogArticlePublishedTime: article.ogArticlePublishedTime ?? undefined,
    ogArticleModifiedTime: article.ogArticleModifiedTime ?? undefined,
    ogArticleTag: article.ogArticleTag ?? [],
    ogArticleSection: article.ogArticleSection ?? undefined,
    twitterTitle: article.twitterTitle ?? undefined,
    twitterDescription: article.twitterDescription ?? undefined,
    twitterSite: article.twitterSite ?? undefined,
    twitterCreator: article.twitterCreator ?? undefined,
    twitterLabel1: article.twitterLabel1 ?? undefined,
    twitterData1: article.twitterData1 ?? undefined,
    twitterCard: article.twitterCard ?? undefined,
    canonicalUrl: article.canonicalUrl ?? undefined,
    license: article.license ?? undefined,
    metaRobots: article.metaRobots ?? undefined,
    robotsMeta: article.robotsMeta ?? undefined,
    sitemapPriority: article.sitemapPriority ?? undefined,
    sitemapChangeFreq: article.sitemapChangeFreq ?? undefined,
    alternateLanguages: article.alternateLanguages && typeof article.alternateLanguages === 'object' && Array.isArray(article.alternateLanguages)
      ? article.alternateLanguages as Array<{ hreflang: string; url: string }>
      : undefined,
    datePublished: article.datePublished ?? undefined,
    lastReviewed: article.lastReviewed ?? undefined,
    wordCount: article.wordCount ?? undefined,
    readingTimeMinutes: article.readingTimeMinutes ?? undefined,
    contentDepth: article.contentDepth ?? undefined,
    categoryId: article.categoryId || '',
    tags:
      article.tags?.map((t: any) => {
        if (typeof t === 'string') return t;
        if (t && typeof t === 'object' && 'tag' in t && t.tag && typeof t.tag === 'object' && 'id' in t.tag) {
          return t.tag.id as string;
        }
        if (t && typeof t === 'object' && 'tagId' in t) {
          return t.tagId as string;
        }
        if (t && typeof t === 'object' && 'id' in t) {
          return t.id as string;
        }
        return '';
      }).filter(Boolean) || [],
    faqs: (article.faqs || []) as any[],
    gallery: article.gallery?.map((item: any) => ({
      mediaId: item.mediaId,
      position: item.position,
      caption: item.caption || null,
      altText: item.altText || null,
      media: item.media ? {
        id: item.media.id,
        url: item.media.url,
        altText: item.media.altText || null,
        width: item.media.width || null,
        height: item.media.height || null,
        filename: item.media.filename,
      } : undefined,
    })) || [],
  };

  return (
    <ArticleFormProvider
      mode="edit"
      articleId={id}
      initialData={initialData}
      onSubmit={updateArticleAction}
      clients={clients}
      categories={categories}
      authors={authors}
      tags={tags}
    >
      <ArticleFormLayout>{children}</ArticleFormLayout>
    </ArticleFormProvider>
  );
}
