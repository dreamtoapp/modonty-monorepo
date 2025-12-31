import { z } from "zod";

export const ArticleStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "SCHEDULED"]);

export const ContentFormatEnum = z.enum(["markdown", "html", "rich_text"]);

export const SitemapChangeFreqEnum = z.enum([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
]);

export const TwitterCardEnum = z.enum(["summary_large_image", "summary"]);

export const FAQSchema = z.object({
  question: z.string().min(1, "السؤال مطلوب"),
  answer: z.string().min(1, "الإجابة مطلوبة"),
  position: z.number().int().min(0).optional(),
});

export const RelatedArticleSchema = z.object({
  relatedId: z.string().min(1, "معرف المقال المرتبط مطلوب"),
  relationshipType: z.enum(["related", "similar", "recommended"]).optional().default("related"),
  weight: z.number().min(0).max(1).optional().default(1.0),
});

export const AlternateLanguageSchema = z.object({
  hreflang: z.string().min(1),
  url: z.string().url("يجب أن يكون رابط صحيح"),
});

export const articleFormSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب").max(200, "العنوان طويل جداً"),
  slug: z.string().min(1, "الرابط المختصر مطلوب").regex(/^[a-z0-9-]+$/, "الرابط المختصر يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "المحتوى مطلوب"),
  contentFormat: ContentFormatEnum.optional().default("rich_text"),

  clientId: z.string().min(1, "العميل مطلوب"),
  categoryId: z.string().optional().nullable(),
  authorId: z.string().min(1, "المؤلف مطلوب"),
  status: ArticleStatusEnum.default("DRAFT"),
  scheduledAt: z.date().optional().nullable(),
  featured: z.boolean().default(false),

  featuredImageId: z.string().optional().nullable(),
  featuredImageAlt: z.string().optional().nullable(),

  seoTitle: z.string().max(60, "عنوان SEO يجب أن يكون أقل من 60 حرف").optional(),
  seoDescription: z.string().max(160, "وصف SEO يجب أن يكون أقل من 160 حرف").optional(),
  metaRobots: z.string().optional(),

  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url("يجب أن يكون رابط صورة صحيح").optional().nullable(),
  ogUrl: z.string().url("يجب أن يكون رابط صحيح").optional(),
  ogSiteName: z.string().optional(),
  ogLocale: z.string().optional().default("ar_SA"),
  ogType: z.string().optional().default("article"),
  ogArticleAuthor: z.string().optional(),
  ogArticlePublishedTime: z.date().optional().nullable(),
  ogArticleModifiedTime: z.date().optional().nullable(),
  ogArticleSection: z.string().optional(),
  ogArticleTag: z.array(z.string()).default([]),

  twitterCard: TwitterCardEnum.optional().default("summary_large_image"),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().url("يجب أن يكون رابط صورة صحيح").optional().nullable(),
  twitterSite: z.string().optional(),
  twitterCreator: z.string().optional(),
  twitterLabel1: z.string().optional(),
  twitterData1: z.string().optional(),

  canonicalUrl: z.string().url("يجب أن يكون رابط صحيح").optional(),
  robotsMeta: z.string().optional(),
  sitemapPriority: z.number().min(0).max(1).optional().default(0.5),
  sitemapChangeFreq: SitemapChangeFreqEnum.optional().default("weekly"),
  alternateLanguages: z.array(AlternateLanguageSchema).optional().default([]),

  license: z.string().optional().nullable(),
  lastReviewed: z.date().optional().nullable(),

  tags: z.array(z.string()).default([]),
  faqs: z.array(FAQSchema).default([]),
  relatedArticles: z.array(RelatedArticleSchema).default([]),
}).refine(
  (data) => {
    if (data.status === "SCHEDULED" && !data.scheduledAt) {
      return false;
    }
    return true;
  },
  {
    message: "تاريخ النشر المجدول مطلوب عند اختيار حالة 'مجدول'",
    path: ["scheduledAt"],
  }
).refine(
  (data) => {
    if (data.featuredImageId && !data.featuredImageAlt) {
      return false;
    }
    return true;
  },
  {
    message: "نص بديل للصورة مطلوب عند اختيار صورة مميزة",
    path: ["featuredImageAlt"],
  }
);

export type ArticleFormData = z.infer<typeof articleFormSchema>;
