export function calculateWordCount(content: string): number {
  if (!content) return 0;
  const stripped = content.replace(/<[^>]*>/g, "");
  const words = stripped.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function calculateReadingTime(wordCount: number, wordsPerMinute: number = 200): number {
  return Math.ceil(wordCount / wordsPerMinute);
}

export function determineContentDepth(wordCount: number): "short" | "medium" | "long" {
  if (wordCount < 500) return "short";
  if (wordCount < 1500) return "medium";
  return "long";
}

export function generateSEOTitle(title: string, clientName?: string): string {
  if (!title) return "";
  if (clientName) {
    return `${title} | ${clientName}`;
  }
  return title;
}

export function generateSEODescription(
  excerpt: string,
  maxLength: number = 155
): string {
  if (!excerpt) return "";
  const stripped = excerpt.replace(/<[^>]*>/g, "").trim();
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength - 3) + "...";
}

export function generateCanonicalUrl(
  slug: string,
  baseUrl?: string,
  clientSlug?: string
): string {
  const siteUrl = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://modonty.com";
  if (clientSlug) {
    return `${siteUrl}/clients/${clientSlug}/articles/${slug}`;
  }
  return `${siteUrl}/articles/${slug}`;
}

export function validateSEOTitle(title: string): { valid: boolean; message?: string } {
  if (!title) {
    return { valid: false, message: "عنوان SEO مطلوب" };
  }
  if (title.length > 60) {
    return {
      valid: false,
      message: `عنوان SEO طويل جداً (${title.length}/60 حرف). الأفضل 50-60 حرف.`,
    };
  }
  if (title.length < 30) {
    return {
      valid: true,
      message: `عنوان SEO قصير (${title.length} حرف). الأفضل 50-60 حرف.`,
    };
  }
  return { valid: true };
}

export function validateSEODescription(
  description: string
): { valid: boolean; message?: string } {
  if (!description) {
    return { valid: false, message: "وصف SEO مطلوب" };
  }
  const length = description.length;
  if (length < 120) {
    return {
      valid: true,
      message: `وصف SEO قصير (${length} حرف). الأفضل 155-160 حرف.`,
    };
  }
  if (length > 160) {
    return {
      valid: false,
      message: `وصف SEO طويل جداً (${length}/160 حرف). الأفضل 155-160 حرف.`,
    };
  }
  if (length >= 155 && length <= 160) {
    return { valid: true, message: "ممتاز! طول الوصف مثالي." };
  }
  return { valid: true };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbPath(
  categoryName?: string,
  categorySlug?: string,
  articleTitle?: string,
  articleSlug?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: "الرئيسية", url: "/" },
  ];

  if (categoryName && categorySlug) {
    items.push({
      name: categoryName,
      url: `/categories/${categorySlug}`,
    });
  }

  if (articleTitle && articleSlug) {
    items.push({
      name: articleTitle,
      url: `/articles/${articleSlug}`,
    });
  }

  return items;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function extractExcerpt(content: string, maxLength: number = 155): string {
  if (!content) return "";
  const stripped = content.replace(/<[^>]*>/g, "").trim();
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength - 3) + "...";
}
