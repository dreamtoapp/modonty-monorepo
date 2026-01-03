"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FormInput, FormTextarea, FormNativeSelect } from "@/components/admin/form-field";
import { ArticleStatus } from "@prisma/client";
import { getStatusLabel, getAvailableStatuses } from "../helpers/status-utils";
import { RichTextEditor } from "./rich-text-editor";
import { CharacterCounter } from "@/components/shared/character-counter";
import { SEOPreviewCard } from "./seo-preview-card";
import { TagInput } from "./tag-input";
import { FAQBuilder, FAQItem } from "./faq-builder";
import { SEODoctor } from "@/components/shared/seo-doctor";
import { articleSEOConfig } from "@/components/shared/seo-doctor/seo-configs";
import { ArticleFormData, ArticleWithRelations, FormSubmitResult } from "@/lib/types";
import {
  calculateWordCount,
  calculateReadingTime,
  determineContentDepth,
  generateSEOTitle,
  generateSEODescription,
  generateCanonicalUrl,
  validateSEOTitle,
  validateSEODescription,
  slugify,
} from "../helpers/seo-helpers";

interface ArticleFormProps {
  initialData?: Partial<ArticleWithRelations>;
  clients: Array<{ id: string; name: string; slug?: string }>;
  categories: Array<{ id: string; name: string; slug?: string }>;
  authors: Array<{ id: string; name: string }>;
  onSubmit: (data: ArticleFormData) => Promise<FormSubmitResult>;
}

export function ArticleForm({
  initialData,
  clients,
  categories,
  authors,
  onSubmit,
}: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    contentFormat: initialData?.contentFormat || "rich_text",
    clientId: initialData?.clientId || "",
    categoryId: initialData?.categoryId || "",
    authorId: initialData?.authorId || "",
    status: (initialData?.status || "DRAFT") as ArticleStatus,
    scheduledAt: initialData?.scheduledAt || null,
    featured: initialData?.featured || false,
    featuredImageId: initialData?.featuredImageId || null,
    featuredImageAlt: initialData?.featuredImageAlt || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    metaRobots: initialData?.metaRobots || "index, follow",
    ogTitle: initialData?.ogTitle || "",
    ogDescription: initialData?.ogDescription || "",
    ogImage: initialData?.ogImage || "",
    ogImageAlt: initialData?.ogImageAlt || "",
    ogImageWidth: initialData?.ogImageWidth?.toString() || "",
    ogImageHeight: initialData?.ogImageHeight?.toString() || "",
    ogUrl: initialData?.ogUrl || "",
    ogSiteName: initialData?.ogSiteName || "مودونتي",
    ogLocale: initialData?.ogLocale || "ar_SA",
    ogArticleAuthor: initialData?.ogArticleAuthor || "",
    ogArticleSection: initialData?.ogArticleSection || "",
    ogArticleTag: initialData?.ogArticleTag || [],
    twitterCard: initialData?.twitterCard || "summary_large_image",
    twitterTitle: initialData?.twitterTitle || "",
    twitterDescription: initialData?.twitterDescription || "",
    twitterImage: initialData?.twitterImage || "",
    twitterImageAlt: initialData?.twitterImageAlt || "",
    twitterSite: initialData?.twitterSite || "",
    twitterCreator: initialData?.twitterCreator || "",
    twitterLabel1: initialData?.twitterLabel1 || "",
    twitterData1: initialData?.twitterData1 || "",
    canonicalUrl: initialData?.canonicalUrl || "",
    sitemapPriority: initialData?.sitemapPriority || 0.5,
    sitemapChangeFreq: initialData?.sitemapChangeFreq || "weekly",
    alternateLanguages: (initialData?.alternateLanguages 
      ? (Array.isArray(initialData.alternateLanguages) 
          ? initialData.alternateLanguages 
          : []) 
      : []) as Array<{ hreflang: string; url: string }>,
    license: initialData?.license || "",
    lastReviewed: initialData?.lastReviewed || null,
    tags: initialData?.tags?.map((t) => {
      if (typeof t === "string") return t;
      if (t && typeof t === "object" && "tag" in t && t.tag && typeof t.tag === "object" && "name" in t.tag) {
        return t.tag.name as string;
      }
      if (t && typeof t === "object" && "name" in t) {
        return t.name as string;
      }
      return "";
    }).filter(Boolean) || [],
    faqs: (initialData?.faqs || []) as FAQItem[],
  });

  const selectedClient = clients.find((c) => c.id === formData.clientId);
  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  useEffect(() => {
    const newSlug = slugify(formData.title);
    setFormData((prev) => ({
      ...prev,
      slug: newSlug,
    }));
  }, [formData.title]);

  useEffect(() => {
    if (formData.title && !formData.seoTitle) {
      const clientName = selectedClient?.name;
      setFormData((prev) => ({
        ...prev,
        seoTitle: generateSEOTitle(formData.title, clientName),
      }));
    }
  }, [formData.title, selectedClient]);

  useEffect(() => {
    if (formData.excerpt && !formData.seoDescription) {
      setFormData((prev) => ({
        ...prev,
        seoDescription: generateSEODescription(formData.excerpt),
      }));
    }
  }, [formData.excerpt]);

  useEffect(() => {
    if (formData.slug && !formData.canonicalUrl) {
      const clientSlug = selectedClient?.slug;
      setFormData((prev) => ({
        ...prev,
        canonicalUrl: generateCanonicalUrl(formData.slug, undefined, clientSlug),
      }));
    }
  }, [formData.slug, selectedClient]);

  useEffect(() => {
    if (formData.seoTitle && !formData.ogTitle) {
      setFormData((prev) => ({ ...prev, ogTitle: formData.seoTitle }));
    }
  }, [formData.seoTitle]);

  useEffect(() => {
    if (formData.seoDescription && !formData.ogDescription) {
      setFormData((prev) => ({ ...prev, ogDescription: formData.seoDescription }));
    }
  }, [formData.seoDescription]);

  useEffect(() => {
    if (formData.ogTitle && !formData.twitterTitle) {
      setFormData((prev) => ({ ...prev, twitterTitle: formData.ogTitle }));
    }
  }, [formData.ogTitle]);

  useEffect(() => {
    if (formData.ogDescription && !formData.twitterDescription) {
      setFormData((prev) => ({ ...prev, twitterDescription: formData.ogDescription }));
    }
  }, [formData.ogDescription]);

  const wordCount = calculateWordCount(formData.content);
  const readingTime = calculateReadingTime(wordCount);
  const contentDepth = determineContentDepth(wordCount);

  const seoTitleValidation = validateSEOTitle(formData.seoTitle);
  const seoDescriptionValidation = validateSEODescription(formData.seoDescription);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submitData = {
      ...formData,
      datePublished: formData.status === "PUBLISHED" ? new Date() : undefined,
      wordCount,
      readingTimeMinutes: readingTime,
      contentDepth,
      ogImageWidth: formData.ogImageWidth ? parseInt(formData.ogImageWidth) : undefined,
      ogImageHeight: formData.ogImageHeight ? parseInt(formData.ogImageHeight) : undefined,
      ogArticlePublishedTime:
        formData.status === "PUBLISHED" ? new Date() : undefined,
      ogArticleModifiedTime: new Date(),
    };

    const result = await onSubmit(submitData);

    if (result.success) {
      router.push("/articles");
      router.refresh();
    } else {
      setError(result.error || "فشل في حفظ المقال");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        <Accordion type="multiple" defaultValue={["basic", "relationships"]} className="w-full">
          <AccordionItem value="basic">
            <AccordionTrigger>المعلومات الأساسية</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <FormInput
                      label="العنوان"
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      hint={formData.slug ? `الرابط المختصر: ${formData.slug}` : "سيتم إنشاء الرابط المختصر تلقائياً من العنوان"}
                      required
                    />
                    <input type="hidden" name="slug" value={formData.slug} />
                  </div>
                  <div>
                    <FormTextarea
                      label="الملخص"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>المحتوى</Label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      placeholder="ابدأ كتابة المحتوى..."
                    />
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>عدد الكلمات: {wordCount}</span>
                    <span>وقت القراءة: {readingTime} دقيقة</span>
                    <span>عمق المحتوى: {contentDepth === "short" ? "قصير" : contentDepth === "medium" ? "متوسط" : "طويل"}</span>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="relationships">
            <AccordionTrigger>العلاقات</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <FormNativeSelect
                    label="العميل"
                    name="clientId"
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    required
                  >
                    <option value="">اختر عميل</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </FormNativeSelect>
                  <FormNativeSelect
                    label="الفئة"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">لا يوجد</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </FormNativeSelect>
                  <FormNativeSelect
                    label="المؤلف"
                    name="authorId"
                    value={formData.authorId}
                    onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                    required
                  >
                    <option value="">اختر مؤلف</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </FormNativeSelect>
                  <FormNativeSelect
                    label="الحالة"
                    name="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as ArticleStatus })
                    }
                    required
                  >
                    {getAvailableStatuses().map((status) => (
                      <option key={status} value={status}>
                        {getStatusLabel(status)}
                      </option>
                    ))}
                  </FormNativeSelect>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="featured">مميز</Label>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="seo">
            <AccordionTrigger>SEO Meta Tags</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label>عنوان SEO</Label>
                    <Input
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="سيتم إنشاؤه تلقائياً من العنوان"
                    />
                    <CharacterCounter
                      current={formData.seoTitle.length}
                      max={60}
                      className="mt-1"
                    />
                    {seoTitleValidation.message && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {seoTitleValidation.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>وصف SEO</Label>
                    <Textarea
                      value={formData.seoDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, seoDescription: e.target.value })
                      }
                      placeholder="سيتم إنشاؤه تلقائياً من الملخص"
                      rows={3}
                    />
                    <CharacterCounter
                      current={formData.seoDescription.length}
                      max={160}
                      className="mt-1"
                    />
                    {seoDescriptionValidation.message && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {seoDescriptionValidation.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormNativeSelect
                      label="Meta Robots"
                      name="metaRobots"
                      value={formData.metaRobots}
                      onChange={(e) => setFormData({ ...formData, metaRobots: e.target.value })}
                    >
                      <option value="index, follow">index, follow</option>
                      <option value="noindex, follow">noindex, follow</option>
                      <option value="index, nofollow">index, nofollow</option>
                      <option value="noindex, nofollow">noindex, nofollow</option>
                    </FormNativeSelect>
                  </div>
                  <SEOPreviewCard
                    title={formData.seoTitle || formData.title}
                    description={formData.seoDescription || formData.excerpt}
                    url={formData.canonicalUrl || `/articles/${formData.slug}`}
                    image={formData.ogImage}
                  />
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="open-graph">
            <AccordionTrigger>Open Graph</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label>OG Title</Label>
                    <Input
                      value={formData.ogTitle}
                      onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                      placeholder="سيتم نسخه من عنوان SEO"
                    />
                  </div>
                  <div>
                    <Label>OG Description</Label>
                    <Textarea
                      value={formData.ogDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, ogDescription: e.target.value })
                      }
                      placeholder="سيتم نسخه من وصف SEO"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>OG Image URL</Label>
                    <Input
                      value={formData.ogImage}
                      onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                  </div>
                  <div>
                    <Label>OG Image Alt Text</Label>
                    <Input
                      value={formData.ogImageAlt}
                      onChange={(e) => setFormData({ ...formData, ogImageAlt: e.target.value })}
                      placeholder="Alt text for OG image (required for accessibility and SEO)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>OG Image Width</Label>
                      <Input
                        value={formData.ogImageWidth}
                        onChange={(e) => setFormData({ ...formData, ogImageWidth: e.target.value })}
                        placeholder="1200"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label>OG Image Height</Label>
                      <Input
                        value={formData.ogImageHeight}
                        onChange={(e) => setFormData({ ...formData, ogImageHeight: e.target.value })}
                        placeholder="630"
                        type="number"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>OG URL</Label>
                    <Input
                      value={formData.ogUrl}
                      onChange={(e) => setFormData({ ...formData, ogUrl: e.target.value })}
                      placeholder="سيتم إنشاؤه تلقائياً"
                    />
                  </div>
                  <div>
                    <Label>OG Site Name</Label>
                    <Input
                      value={formData.ogSiteName}
                      onChange={(e) => setFormData({ ...formData, ogSiteName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>OG Locale</Label>
                    <Input
                      value={formData.ogLocale}
                      onChange={(e) => setFormData({ ...formData, ogLocale: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>OG Article Section</Label>
                    <Input
                      value={formData.ogArticleSection}
                      onChange={(e) =>
                        setFormData({ ...formData, ogArticleSection: e.target.value })
                      }
                      placeholder={selectedCategory?.name}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="twitter">
            <AccordionTrigger>Twitter Cards</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <FormNativeSelect
                      label="Twitter Card Type"
                      name="twitterCard"
                      value={formData.twitterCard}
                      onChange={(e) => setFormData({ ...formData, twitterCard: e.target.value })}
                    >
                      <option value="summary_large_image">summary_large_image</option>
                      <option value="summary">summary</option>
                    </FormNativeSelect>
                  </div>
                  <div>
                    <Label>Twitter Title</Label>
                    <Input
                      value={formData.twitterTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, twitterTitle: e.target.value })
                      }
                      placeholder="سيتم نسخه من OG Title"
                    />
                  </div>
                  <div>
                    <Label>Twitter Description</Label>
                    <Textarea
                      value={formData.twitterDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, twitterDescription: e.target.value })
                      }
                      placeholder="سيتم نسخه من OG Description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Twitter Image URL</Label>
                    <Input
                      value={formData.twitterImage}
                      onChange={(e) =>
                        setFormData({ ...formData, twitterImage: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                  </div>
                  <div>
                    <Label>Twitter Image Alt Text</Label>
                    <Input
                      value={formData.twitterImageAlt}
                      onChange={(e) =>
                        setFormData({ ...formData, twitterImageAlt: e.target.value })
                      }
                      placeholder="Alt text for Twitter image (required for accessibility and SEO)"
                    />
                  </div>
                  <div>
                    <Label>Twitter Site</Label>
                    <Input
                      value={formData.twitterSite}
                      onChange={(e) => setFormData({ ...formData, twitterSite: e.target.value })}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label>Twitter Creator</Label>
                    <Input
                      value={formData.twitterCreator}
                      onChange={(e) =>
                        setFormData({ ...formData, twitterCreator: e.target.value })
                      }
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label>Twitter Label 1</Label>
                    <Input
                      value={formData.twitterLabel1 || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, twitterLabel1: e.target.value })
                      }
                      placeholder="Optional label for Twitter card"
                    />
                  </div>
                  <div>
                    <Label>Twitter Data 1</Label>
                    <Input
                      value={formData.twitterData1 || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, twitterData1: e.target.value })
                      }
                      placeholder="Optional data for Twitter card"
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="technical">
            <AccordionTrigger>Technical SEO</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label>Canonical URL</Label>
                    <Input
                      value={formData.canonicalUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, canonicalUrl: e.target.value })
                      }
                      placeholder="سيتم إنشاؤه تلقائياً"
                    />
                  </div>
                  <div>
                    <Label>Sitemap Priority</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.sitemapPriority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sitemapPriority: parseFloat(e.target.value) || 0.5,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.featured ? "0.8 (مميز)" : "0.5 (عادي)"}
                    </p>
                  </div>
                  <div>
                    <FormNativeSelect
                      label="Sitemap Change Frequency"
                      name="sitemapChangeFreq"
                      value={formData.sitemapChangeFreq}
                      onChange={(e) =>
                        setFormData({ ...formData, sitemapChangeFreq: e.target.value })
                      }
                    >
                      <option value="always">always</option>
                      <option value="hourly">hourly</option>
                      <option value="daily">daily</option>
                      <option value="weekly">weekly</option>
                      <option value="monthly">monthly</option>
                      <option value="yearly">yearly</option>
                      <option value="never">never</option>
                    </FormNativeSelect>
                  </div>
                  <div>
                    <Label>Alternate Languages (hreflang)</Label>
                    <div className="space-y-2">
                      {(formData.alternateLanguages || []).map((lang, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="hreflang (e.g., en, fr)"
                            value={lang.hreflang || ""}
                            onChange={(e) => {
                              const updated = [...(formData.alternateLanguages || [])];
                              updated[index] = { ...updated[index], hreflang: e.target.value };
                              setFormData({ ...formData, alternateLanguages: updated });
                            }}
                            className="flex-1"
                          />
                          <Input
                            placeholder="URL"
                            value={lang.url || ""}
                            onChange={(e) => {
                              const updated = [...(formData.alternateLanguages || [])];
                              updated[index] = { ...updated[index], url: e.target.value };
                              setFormData({ ...formData, alternateLanguages: updated });
                            }}
                            className="flex-[2]"
                            type="url"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = (formData.alternateLanguages || []).filter((_, i) => i !== index);
                              setFormData({ ...formData, alternateLanguages: updated });
                            }}
                          >
                            حذف
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            alternateLanguages: [...(formData.alternateLanguages || []), { hreflang: "", url: "" }],
                          });
                        }}
                      >
                        إضافة لغة
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      أضف روابط بديلة للمقال بلغات أخرى (hreflang)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tags-faqs">
            <AccordionTrigger>العلامات والأسئلة الشائعة</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <Label>العلامات</Label>
                    <TagInput
                      tags={formData.tags}
                      onChange={(tags) => setFormData({ ...formData, tags })}
                      placeholder="أضف علامة واضغط Enter"
                    />
                  </div>
                  <div>
                    <FAQBuilder
                      faqs={formData.faqs}
                      onChange={(faqs) => setFormData({ ...formData, faqs })}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "جاري الحفظ..." : initialData ? "تحديث المقال" : "إنشاء المقال"}
          </Button>
        </div>
        </div>

        {/* Right Column - SEO Doctor (Always Visible) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <SEODoctor data={formData} config={articleSEOConfig} />
          </div>
        </div>
      </div>
    </form>
  );
}
