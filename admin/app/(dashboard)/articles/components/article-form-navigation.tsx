'use client';

import { useArticleForm } from './article-form-context';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, Save, Loader2, Sparkles } from 'lucide-react';
import { ArticleFormStepper } from './article-form-stepper';
import { faker } from '@faker-js/faker/locale/ar';
import { slugify } from '../helpers/seo-helpers';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AiArticleDialog } from './ai-article-dialog';
import { useState } from 'react';

export function ArticleFormNavigation() {
  const {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    canGoNext,
    canGoPrevious,
    save,
    isSaving,
    overallProgress,
    mode,
    updateFields,
    clients,
    categories,
    authors,
    tags,
  } = useArticleForm();
  const router = useRouter();
  const { toast } = useToast();
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  const handleSave = async () => {
    try {
      const result = await save();

      if (result.success) {
        const savedArticleId = result.article?.id;
        const articleTitle = result.article?.title;
        const articleStatus = result.article?.status;

        const detailsParts: string[] = [];
        if (savedArticleId) detailsParts.push(`المعرّف: ${savedArticleId}`);
        if (articleTitle) detailsParts.push(`العنوان: "${articleTitle}"`);
        if (articleStatus) detailsParts.push(`الحالة: ${articleStatus}`);

        toast({
          title: 'تم الحفظ بنجاح',
          description:
            detailsParts.length > 0
              ? `تم حفظ المقال بنجاح.\n${detailsParts.join(' — ')}`
              : 'تم حفظ المقال بنجاح وهو في انتظار معاينة المدير',
        });

        if (mode === 'new') {
          router.push('/articles');
          router.refresh();
        } else if (mode === 'edit' && savedArticleId) {
          router.push(`/articles/${savedArticleId}`);
          router.refresh();
        }
      } else {
        toast({
          title: 'فشل الحفظ',
          description: result.error || 'حدث خطأ أثناء حفظ المقال',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'فشل الحفظ',
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    }
  };

  const fillDummyData = () => {
    // Generate random title
    const title = faker.lorem.sentence({ min: 5, max: 10 });
    const slug = slugify(title) || faker.lorem.slug();
    
    // Generate content with HTML structure
    const paragraphs = faker.lorem.paragraphs({ min: 5, max: 10 }, '<br/>\n');
    const content = `<h1>${faker.lorem.sentence({ min: 3, max: 6 })}</h1>\n<p>${paragraphs}</p>\n<h2>${faker.lorem.sentence({ min: 3, max: 5 })}</h2>\n<p>${faker.lorem.paragraphs({ min: 2, max: 4 }, '<br/>\n')}</p>`;
    
    // Calculate word count from content (approximate)
    const wordCount = faker.number.int({ min: 500, max: 3000 });
    const readingTimeMinutes = Math.ceil(wordCount / 200);
    const contentDepth = wordCount < 800 ? 'short' : wordCount < 1500 ? 'medium' : 'long';
    
    // Generate dates
    const datePublished = faker.date.recent({ days: 30 });
    const lastReviewed = faker.date.recent({ days: 7 });
    
    // Generate SEO content
    const seoTitle = faker.lorem.sentence({ min: 5, max: 10 });
    const seoDescription = faker.lorem.paragraph().substring(0, 160);
    const excerpt = faker.lorem.paragraph().substring(0, 200);
    
    // Generate URLs
    const baseUrl = faker.internet.url();
    const articlePath = `/${slug}`;
    const canonicalUrl = `${baseUrl}${articlePath}`;
    
    // Select random items from available data
    const randomClient = clients.length > 0 ? faker.helpers.arrayElement(clients) : null;
    const randomCategory = categories.length > 0 ? faker.helpers.arrayElement(categories) : null;
    const randomAuthor = authors.length > 0 ? faker.helpers.arrayElement(authors) : null;
    const randomTags = tags.length > 0 
      ? faker.helpers.arrayElements(tags, { min: 2, max: Math.min(4, tags.length) })
      : [];
    
    // Generate FAQs
    const faqCount = faker.number.int({ min: 3, max: 5 });
    const faqs = Array.from({ length: faqCount }, (_, i) => ({
      question: faker.lorem.sentence({ min: 5, max: 10 }) + '؟',
      answer: faker.lorem.paragraphs({ min: 1, max: 2 }, ' '),
      position: i,
    }));
    
    // Generate citations
    const citationCount = faker.number.int({ min: 2, max: 5 });
    const citations = Array.from({ length: citationCount }, () => faker.internet.url());
    
    // Generate breadcrumb
    const breadcrumbPath = [
      { name: 'الرئيسية', url: '/' },
      { name: 'المقالات', url: '/articles' },
      ...(randomCategory ? [{ name: randomCategory.name, url: `/categories/${randomCategory.slug || randomCategory.id}` }] : []),
      { name: title, url: articlePath },
    ];
    
    // Generate Twitter handles
    const twitterSite = `@${faker.internet.username()}`;
    const twitterCreator = `@${faker.internet.username()}`;
    
    // Generate OG tags
    const ogArticleTag = randomTags.length > 0
      ? randomTags.slice(0, 3).map(tag => tag.name)
      : [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()];
    
    const dummyData = {
      // Basic Content
      title,
      slug,
      excerpt,
      content,
      contentFormat: 'rich_text' as const,
      
      // Relationships - Use random available items
      clientId: randomClient?.id || (clients.length > 0 ? clients[0].id : ''),
      categoryId: randomCategory?.id || (categories.length > 0 ? categories[0].id : undefined),
      authorId: randomAuthor?.id || (authors.length > 0 ? authors[0].id : ''),
      
      // Status & Workflow
      status: faker.helpers.arrayElement(['WRITING', 'DRAFT', 'SCHEDULED'] as const),
      featured: faker.datatype.boolean(),
      scheduledAt: faker.datatype.boolean({ probability: 0.3 }) ? faker.date.future() : null,
      
      // Schema.org Article
      datePublished,
      lastReviewed,
      mainEntityOfPage: canonicalUrl,
      wordCount,
      readingTimeMinutes,
      contentDepth,
      inLanguage: 'ar',
      isAccessibleForFree: faker.datatype.boolean({ probability: 0.9 }),
      license: faker.helpers.arrayElement(['CC-BY-SA', 'CC-BY', 'CC0', 'All Rights Reserved', '']),
      
      // SEO Meta Tags
      seoTitle,
      seoDescription,
      metaRobots: faker.helpers.arrayElement(['index, follow', 'noindex, follow', 'index, nofollow']),
      
      // Open Graph
      ogTitle: seoTitle,
      ogDescription: seoDescription,
      ogType: 'article',
      ogUrl: canonicalUrl,
      ogSiteName: 'مودونتي',
      ogLocale: 'ar_SA',
      ogArticleAuthor: randomAuthor?.name || faker.person.fullName(),
      ogArticlePublishedTime: datePublished,
      ogArticleModifiedTime: faker.date.recent({ days: 3 }),
      ogArticleSection: randomCategory?.name || faker.lorem.word(),
      ogArticleTag,
      
      // Twitter Cards
      twitterCard: faker.helpers.arrayElement(['summary_large_image', 'summary']),
      twitterTitle: seoTitle.substring(0, 70),
      twitterDescription: seoDescription.substring(0, 200),
      twitterSite,
      twitterCreator,
      
      // Technical SEO
      canonicalUrl,
      sitemapPriority: faker.number.float({ min: 0.3, max: 1.0, fractionDigits: 1 }),
      sitemapChangeFreq: faker.helpers.arrayElement(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']),
      
      // Breadcrumb
      breadcrumbPath,
      
      // Tags & FAQs
      tags: randomTags.map(tag => tag.id),
      faqs,
      
      // Related Articles
      relatedArticles: [],
      
      // Citations
      citations,
    };
    
    updateFields(dummyData);
  };

  return (
    <TooltipProvider>
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-2">
          <div className="space-y-2">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
              {/* Left: Previous + Counter + Next */}
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={previousStep}
                      disabled={!canGoPrevious}
                      className="h-8 w-8 transition-all hover:scale-105"
                      aria-label="Previous step"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Previous</TooltipContent>
                </Tooltip>
                <span className="text-xs text-muted-foreground font-medium min-w-[3rem] text-center">
                  {currentStep}/{totalSteps}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextStep}
                      disabled={!canGoNext}
                      className="h-8 w-8 transition-all hover:scale-105"
                      aria-label="Next step"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Next</TooltipContent>
                </Tooltip>
              </div>

              {/* Center: Stepper */}
              <div className="flex justify-center">
                <ArticleFormStepper />
              </div>

              {/* Right: Fill Dummy Data + Save */}
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end gap-0.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    {overallProgress}% Complete
                  </span>
                </div>
                {/* AI Article Generator */}
                {mode === 'new' && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setAiDialogOpen(true)}
                          className="h-8 w-8 transition-all hover:scale-105 border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                          aria-label="Generate Article with AI"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Generate Article with AI</TooltipContent>
                    </Tooltip>
                    <AiArticleDialog
                      open={aiDialogOpen}
                      onOpenChange={setAiDialogOpen}
                    />
                  </>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="h-8 w-8 transition-all hover:scale-105"
                      aria-label="Save article"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isSaving ? 'Saving...' : 'Save'}</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <Progress 
                value={overallProgress} 
                className="h-1 transition-all duration-300" 
                aria-label={`Overall progress: ${overallProgress}%`}
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
