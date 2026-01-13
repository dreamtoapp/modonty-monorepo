import { db } from "../lib/db";
import { ArticleStatus, TrafficSource } from "@prisma/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function clearDatabase() {
  console.log("Clearing existing data...");
  await db.relatedArticle.deleteMany();
  await db.fAQ.deleteMany();
  await db.analytics.deleteMany();
  await db.articleTag.deleteMany();
  await db.articleVersion.deleteMany();
  await db.article.deleteMany();
  await db.media.deleteMany();
  await db.tag.deleteMany();
  await db.category.deleteMany();
  await db.author.deleteMany();
  await db.client.deleteMany();
  console.log("Database cleared.");
}

async function seedClients() {
  console.log("Seeding clients...");
  const clients = [
    {
      name: "حلول التقنية المتقدمة",
      slug: "techcorp-solutions",
      legalName: "حلول التقنية المتقدمة ش.م.م",
      url: "https://techcorp-solutions.example.com",
      sameAs: [
        "https://linkedin.com/company/techcorp-solutions",
        "https://twitter.com/techcorp",
      ],
      email: "info@techcorp-solutions.com",
      phone: "+966501234567",
      seoTitle: "حلول التقنية المتقدمة - شركة تقنية رائدة",
      seoDescription:
        "شركة رائدة في مجال الحلول التقنية والبرمجيات. نقدم خدمات تطوير الويب والتطبيقات والذكاء الاصطناعي.",
      foundingDate: new Date("2015-01-15"),
    },
    {
      name: "استوديو التصميم المحترف",
      slug: "design-studio-pro",
      legalName: "استوديو التصميم المحترف ش.م.م",
      url: "https://design-studio-pro.example.com",
      sameAs: [
        "https://linkedin.com/company/design-studio-pro",
        "https://twitter.com/designstudiopro",
      ],
      email: "hello@design-studio-pro.com",
      phone: "+966502345678",
      seoTitle: "استوديو التصميم المحترف - تصميم واجهات مستخدم متميز",
      seoDescription:
        "استوديو متخصص في تصميم واجهات المستخدم وتجربة المستخدم. نقدم حلول تصميم مبتكرة وعصرية.",
      foundingDate: new Date("2018-03-20"),
    },
    {
      name: "مركز التسويق الرقمي",
      slug: "digital-marketing-hub",
      legalName: "مركز التسويق الرقمي ش.م.م",
      url: "https://digital-marketing-hub.example.com",
      sameAs: [
        "https://linkedin.com/company/digital-marketing-hub",
        "https://twitter.com/digitalmarketinghub",
      ],
      email: "contact@digital-marketing-hub.com",
      phone: "+966503456789",
      seoTitle: "مركز التسويق الرقمي - حلول تسويق رقمي متكاملة",
      seoDescription:
        "مركز متخصص في التسويق الرقمي وتحسين محركات البحث. نساعد الشركات على النمو عبر الإنترنت.",
      foundingDate: new Date("2016-07-10"),
    },
    {
      name: "مختبرات الابتكار",
      slug: "innovation-labs",
      legalName: "مختبرات الابتكار ش.م.م",
      url: "https://innovation-labs.example.com",
      sameAs: [
        "https://linkedin.com/company/innovation-labs",
        "https://twitter.com/innovationlabs",
      ],
      email: "info@innovation-labs.com",
      phone: "+966504567890",
      seoTitle: "مختبرات الابتكار - ابتكارات تقنية متقدمة",
      seoDescription:
        "مختبرات متخصصة في البحث والتطوير والابتكار التقني. نطور حلولاً مبتكرة للمستقبل.",
      foundingDate: new Date("2019-11-05"),
    },
  ];

  const createdClients = [];
  for (const clientData of clients) {
    const client = await db.client.upsert({
      where: { slug: clientData.slug },
      update: clientData,
      create: clientData,
    });
    createdClients.push(client);
  }

  console.log(`Seeded ${createdClients.length} clients.`);
  return createdClients;
}

async function seedAuthors() {
  console.log("Skipping author reseed, using existing authors...");
  const existingAuthors = await db.author.findMany();
  return existingAuthors;
}

async function seedCategories() {
  console.log("Seeding categories...");
  const categories = [
    {
      name: "تقنية",
      slug: "technology",
      description: "مقالات عن التقنية والبرمجة والتطوير",
      seoTitle: "مقالات تقنية - آخر أخبار التقنية والبرمجة",
      seoDescription:
        "اكتشف أحدث المقالات عن التقنية والبرمجة وتطوير الويب والتطبيقات.",
    },
    {
      name: "تصميم",
      slug: "design",
      description: "مقالات عن التصميم وواجهات المستخدم",
      seoTitle: "مقالات تصميم - واجهات المستخدم وتجربة المستخدم",
      seoDescription:
        "مقالات متخصصة في التصميم وواجهات المستخدم وتجربة المستخدم.",
    },
    {
      name: "تسويق",
      slug: "marketing",
      description: "مقالات عن التسويق الرقمي وSEO",
      seoTitle: "مقالات تسويق - التسويق الرقمي وSEO",
      seoDescription:
        "تعلم أحدث استراتيجيات التسويق الرقمي وتحسين محركات البحث.",
    },
    {
      name: "ابتكار",
      slug: "innovation",
      description: "مقالات عن الابتكار والتقنيات الناشئة",
      seoTitle: "مقالات ابتكار - التقنيات الناشئة والابتكار",
      seoDescription:
        "اكتشف أحدث الابتكارات والتقنيات الناشئة التي تشكل المستقبل.",
    },
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    const category = await db.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData,
    });
    createdCategories.push(category);
  }

  // Seed hierarchical child categories for tree testing
  const parentSlugs = ["technology", "design", "marketing", "innovation"];
  const parents = await db.category.findMany({
    where: { slug: { in: parentSlugs } },
    select: { id: true, slug: true },
  });
  const parentMap = new Map(parents.map((p) => [p.slug, p.id]));

  const childCategories = [
    {
      name: "تطوير الويب",
      slug: "web-development",
      description: "تطوير مواقع وتطبيقات الويب باستخدام أحدث التقنيات",
      seoTitle: "تصنيفات تطوير الويب",
      seoDescription: "مقالات حول تطوير الويب، واجهات المستخدم، وFrontend/Backend.",
      parentSlug: "technology",
    },
    {
      name: "تطوير المحمول",
      slug: "mobile-development",
      description: "تطوير تطبيقات الهواتف الذكية لأنظمة iOS و Android",
      seoTitle: "تصنيفات تطوير تطبيقات الموبايل",
      seoDescription: "مقالات حول تطوير تطبيقات الهاتف باستخدام أطر العمل الحديثة.",
      parentSlug: "technology",
    },
    {
      name: "واجهة المستخدم",
      slug: "ui-design",
      description: "تصميم واجهات مستخدم جذابة وسهلة الاستخدام",
      seoTitle: "تصميم واجهة المستخدم",
      seoDescription: "مقالات حول تصميم واجهات المستخدم وأنماط التصميم.",
      parentSlug: "design",
    },
    {
      name: "تجربة المستخدم",
      slug: "ux-design",
      description: "تحليل وتحسين تجربة المستخدم في المنتجات الرقمية",
      seoTitle: "تصميم تجربة المستخدم",
      seoDescription: "مقالات حول أبحاث وتجارب المستخدم وتحسين الرحلة.",
      parentSlug: "design",
    },
    {
      name: "تحسين محركات البحث",
      slug: "seo",
      description: "استراتيجيات وتقنيات تحسين محركات البحث",
      seoTitle: "SEO وتحسين محركات البحث",
      seoDescription: "مقالات حول تحسين ظهور المواقع في نتائج البحث.",
      parentSlug: "marketing",
    },
    {
      name: "التسويق عبر الشبكات الاجتماعية",
      slug: "social-media-marketing",
      description: "استراتيجيات التسويق عبر منصات التواصل الاجتماعي",
      seoTitle: "التسويق عبر الشبكات الاجتماعية",
      seoDescription: "مقالات حول إدارة الحملات على منصات التواصل.",
      parentSlug: "marketing",
    },
  ];

  for (const child of childCategories) {
    const parentId = parentMap.get(child.parentSlug);
    if (!parentId) continue;

    const { parentSlug, ...categoryData } = child;
    const category = await db.category.upsert({
      where: { slug: categoryData.slug },
      update: { ...categoryData, parentId },
      create: { ...categoryData, parentId },
    });
    createdCategories.push(category);
  }

  console.log(`Seeded ${createdCategories.length} categories (including hierarchy).`);
  return createdCategories;
}

async function seedTags() {
  console.log("Seeding tags...");
  const tags = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "UI/UX",
    "تصميم",
    "SEO",
    "تسويق",
    "ذكاء اصطناعي",
    "Cloud",
    "DevOps",
    "Mobile",
    "Web Development",
    "Best Practices",
    "Tutorials",
    "Tips",
    "Tools",
    "Framework",
    "Architecture",
  ];

  const createdTags = [];
  for (const tagName of tags) {
    const tag = await db.tag.upsert({
      where: { slug: slugify(tagName) },
      update: { name: tagName },
      create: { name: tagName, slug: slugify(tagName) },
    });
    createdTags.push(tag);
  }

  console.log(`Seeded ${createdTags.length} tags.`);
  return createdTags;
}

function generateArticleContent(
  title: string,
  category: string,
  index: number
): { content: string; excerpt: string; wordCount: number } {
  const templates = {
    تقنية: [
      "في هذا المقال، سنستكشف {topic} بالتفصيل. {topic} أصبح جزءاً أساسياً من تطوير الويب الحديث.",
      "سنتناول في هذا الدليل الشامل كل ما تحتاج معرفته عن {topic}. من الأساسيات إلى المستوى المتقدم.",
      "اكتشف كيف يمكن لـ {topic} أن يحسن من أداء تطبيقاتك ويجعلها أكثر كفاءة.",
    ],
    تصميم: [
      "التصميم الجيد يبدأ بفهم احتياجات المستخدم. في هذا المقال، سنستكشف {topic} وكيفية تطبيقه.",
      "اكتشف المبادئ الأساسية لـ {topic} وكيفية استخدامها لإنشاء تجارب مستخدم متميزة.",
      "في هذا الدليل، سنغطي كل ما تحتاج معرفته عن {topic} في التصميم الحديث.",
    ],
    تسويق: [
      "تسويق المحتوى الفعال يتطلب استراتيجية مدروسة. تعلم كيف تستخدم {topic} لتحقيق نتائج أفضل.",
      "اكتشف أحدث استراتيجيات {topic} التي تساعد الشركات على النمو وزيادة المبيعات.",
      "في هذا المقال، سنستعرض أفضل الممارسات في {topic} وكيفية تطبيقها بنجاح.",
    ],
    ابتكار: [
      "الابتكار هو محرك النمو في الأعمال الحديثة. اكتشف كيف يمكن لـ {topic} أن يغير من طريقة عملك.",
      "في هذا المقال، سنستكشف {topic} وتأثيره على الصناعات المختلفة والمستقبل.",
      "اكتشف كيف يمكن للشركات استخدام {topic} لتحقيق ميزة تنافسية قوية.",
    ],
  };

  const template = getRandomElement(templates[category as keyof typeof templates] || templates.تقنية);
  const topic = title;
  const content = template.replace(/{topic}/g, topic);

  const paragraphs = [
    content,
    `هذا القسم يغطي الجوانب العملية لـ ${topic}. سنقدم أمثلة واقعية ونصائح عملية يمكنك تطبيقها فوراً.`,
    `في الختام، ${topic} يمثل فرصة كبيرة للمطورين والشركات. من خلال فهم المبادئ الأساسية وتطبيقها بشكل صحيح، يمكنك تحقيق نتائج متميزة.`,
  ];

  const fullContent = paragraphs.join("\n\n");
  const wordCount = fullContent.split(/\s+/).length;
  const excerpt = content.substring(0, 150) + "...";

  return { content: fullContent, excerpt, wordCount };
}

function generateSEOFields(title: string, excerpt: string, category: string) {
  const seoTitle = `${title} | ${category}`;
  const seoDescription = excerpt.length > 155 ? excerpt.substring(0, 152) + "..." : excerpt;

  return {
    seoTitle,
    seoDescription,
    metaRobots: "index, follow",
    canonicalUrl: `https://example.com/articles/${slugify(title)}`,
    sitemapPriority: 0.7,
    sitemapChangeFreq: "weekly",
    ogTitle: title,
    ogDescription: seoDescription,
    ogImage: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=1200&h=630&fit=crop`,
    ogType: "article",
    ogUrl: `https://example.com/articles/${slugify(title)}`,
    ogSiteName: "Modonty Blog",
    ogLocale: "ar_SA",
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: seoDescription,
    twitterImage: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=1200&h=630&fit=crop`,
    twitterSite: "@modonty",
  };
}

async function seedArticles(
  clients: Awaited<ReturnType<typeof seedClients>>,
  authors: Awaited<ReturnType<typeof seedAuthors>>,
  categories: Awaited<ReturnType<typeof seedCategories>>
) {
  console.log("Seeding articles...");

  const categoryMap: Record<string, string> = {
    "techcorp-solutions": "تقنية",
    "design-studio-pro": "تصميم",
    "digital-marketing-hub": "تسويق",
    "innovation-labs": "ابتكار",
  };

  const articleTemplates = {
    تقنية: [
      "مستقبل تطوير الويب: الاتجاهات الجديدة في {year}",
      "دليل شامل لـ {tech}: من المبتدئ إلى المحترف",
      "أفضل ممارسات {tech} لتطبيقات عالية الأداء",
      "كيفية استخدام {tech} في مشاريعك القادمة",
      "مقارنة بين {tech1} و {tech2}: أيهما تختار؟",
      "نصائح متقدمة في {tech} للمطورين المحترفين",
      "بناء تطبيقات {tech} قابلة للتوسع",
      "أخطاء شائعة في {tech} وكيفية تجنبها",
      "أدوات وموارد مفيدة لمطوري {tech}",
      "التحديثات الجديدة في {tech} وما يعنيه ذلك لك",
    ],
    تصميم: [
      "مبادئ تصميم واجهة المستخدم الحديثة",
      "كيفية إنشاء تجارب مستخدم متميزة",
      "دليل شامل لتصميم {designType}",
      "أفضل ممارسات {designType} في {year}",
      "كيفية استخدام الألوان في التصميم بشكل فعال",
      "نصائح لتحسين إمكانية الوصول في التصميم",
      "التصميم المتجاوب: دليل شامل",
      "أنظمة التصميم: بناء واجهات متسقة",
      "أدوات التصميم التي يجب أن تعرفها",
      "الاتجاهات الجديدة في تصميم الويب",
    ],
    تسويق: [
      "استراتيجيات تسويق المحتوى الفعالة",
      "دليل شامل لتحسين محركات البحث (SEO)",
      "كيفية استخدام {platform} للتسويق",
      "أفضل ممارسات التسويق الرقمي في {year}",
      "كيفية قياس نجاح حملاتك التسويقية",
      "نصائح لزيادة التفاعل على وسائل التواصل",
      "استراتيجيات البريد الإلكتروني التسويقي",
      "كيفية بناء علامة تجارية قوية عبر الإنترنت",
      "أدوات التسويق الرقمي الأساسية",
      "التسويق بالذكاء الاصطناعي: المستقبل هنا",
    ],
    ابتكار: [
      "دور الذكاء الاصطناعي في {industry}",
      "كيفية بناء ثقافة الابتكار في شركتك",
      "التقنيات الناشئة التي ستغير {industry}",
      "الابتكار في {year}: ما يمكن توقعه",
      "كيفية تطبيق {innovation} في أعمالك",
      "الاستدامة والابتكار: بناء المستقبل",
      "منهجيات الابتكار الناجحة",
      "كيفية تحويل الأفكار إلى منتجات",
      "الابتكار المفتوح: التعاون من أجل النجاح",
      "التقنيات المستقبلية التي يجب مراقبتها",
    ],
  };

  const techTerms = ["React", "Next.js", "TypeScript", "Node.js", "Vue.js", "Angular"];
  const designTypes = ["واجهات المستخدم", "تجربة المستخدم", "التصميم الجرافيكي"];
  const platforms = ["LinkedIn", "Twitter", "Instagram", "Facebook"];
  const industries = ["التقنية", "التعليم", "الصحة", "المالية"];

  const articles = [];
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 100; i++) {
    const client = clients[i % clients.length];
    const author = authors[i % authors.length];
    const categoryName = categoryMap[client.slug] || "تقنية";
    const category = categories.find((c) => c.name === categoryName) || categories[0];

    let title = getRandomElement(articleTemplates[categoryName as keyof typeof articleTemplates] || articleTemplates.تقنية);
    title = title
      .replace(/{year}/g, "2025")
      .replace(/{tech}/g, getRandomElement(techTerms))
      .replace(/{tech1}/g, getRandomElement(techTerms))
      .replace(/{tech2}/g, getRandomElement(techTerms))
      .replace(/{designType}/g, getRandomElement(designTypes))
      .replace(/{platform}/g, getRandomElement(platforms))
      .replace(/{industry}/g, getRandomElement(industries))
      .replace(/{innovation}/g, "الذكاء الاصطناعي");

    const slug = `${slugify(title)}-${i + 1}`;
    const { content, excerpt, wordCount } = generateArticleContent(title, categoryName, i);
    const readingTime = Math.ceil(wordCount / 200);
    const contentDepth = wordCount < 500 ? "short" : wordCount < 1500 ? "medium" : "long";

    const statuses: ArticleStatus[] = ["PUBLISHED", "PUBLISHED", "PUBLISHED", "PUBLISHED", "PUBLISHED", "PUBLISHED", "PUBLISHED", "DRAFT", "DRAFT", "SCHEDULED"];
    const status = statuses[i % statuses.length];

    const datePublished = status === "PUBLISHED" 
      ? generateRandomDate(sixMonthsAgo, now)
      : status === "SCHEDULED"
      ? new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      : null;

    const seoFields = generateSEOFields(title, excerpt, categoryName);

    const article = await db.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        contentFormat: "markdown",
        clientId: client.id,
        categoryId: category.id,
        authorId: author.id,
        status,
        scheduledAt: status === "SCHEDULED" ? datePublished || undefined : undefined,
        featured: i % 10 === 0,
        datePublished,
        wordCount,
        readingTimeMinutes: readingTime,
        contentDepth,
        inLanguage: "ar",
        isAccessibleForFree: true,
        creativeWorkStatus: status === "PUBLISHED" ? "published" : status.toLowerCase(),
        ...seoFields,
      },
    });

    articles.push(article);

    if ((i + 1) % 10 === 0) {
      console.log(`Seeded ${i + 1}/100 articles...`);
    }
  }

  console.log(`Seeded ${articles.length} articles.`);
  return articles;
}

async function seedArticleTags(
  articles: Awaited<ReturnType<typeof seedArticles>>,
  tags: Awaited<ReturnType<typeof seedTags>>
) {
  console.log("Seeding article tags...");
  let count = 0;

  for (const article of articles) {
    const tagCount = Math.floor(Math.random() * 3) + 2;
    const selectedTags = getRandomElements(tags, tagCount);

    for (const tag of selectedTags) {
      await db.articleTag.upsert({
        where: {
          articleId_tagId: {
            articleId: article.id,
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          articleId: article.id,
          tagId: tag.id,
        },
      });
      count++;
    }
  }

  console.log(`Seeded ${count} article-tag relationships.`);
}

async function seedMedia(articles: Awaited<ReturnType<typeof seedArticles>>) {
  console.log("Seeding media...");
  const createdMedia = [];

  for (const article of articles) {
    const media = await db.media.create({
      data: {
        filename: `article-${article.slug}.jpg`,
        url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=1200&h=630&fit=crop`,
        mimeType: "image/jpeg",
        fileSize: Math.floor(Math.random() * 500000) + 100000,
        width: 1200,
        height: 630,
        encodingFormat: "image/jpeg",
        altText: article.title,
        caption: article.excerpt || undefined,
        title: article.title,
      },
    });

    await db.article.update({
      where: { id: article.id },
      data: { featuredImageId: media.id, featuredImageAlt: article.title },
    });

    createdMedia.push(media);
  }

  console.log(`Seeded ${createdMedia.length} media files.`);
  return createdMedia;
}

async function seedAnalytics(articles: Awaited<ReturnType<typeof seedArticles>>) {
  console.log("Seeding analytics...");
  let count = 0;

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
  ];

  for (const article of articles) {
    if (article.status !== "PUBLISHED") continue;

    // Generate 5-20 view events per article (simulating real traffic)
    const viewCount = Math.floor(Math.random() * 15) + 5;
    const sessionIds = new Set<string>();

    for (let i = 0; i < viewCount; i++) {
      // Generate unique session IDs (some may repeat for same user multiple views)
      const sessionId = `session-${Math.floor(Math.random() * 1000)}-${Date.now()}-${i}`;
      sessionIds.add(sessionId);

      await db.analytics.create({
        data: {
          articleId: article.id,
          clientId: article.clientId,
          sessionId: sessionId,
          userId: Math.random() > 0.7 ? undefined : undefined, // Most views are anonymous
          lcp: Math.random() * 2 + 1,
          cls: Math.random() * 0.1,
          inp: Math.random() * 200 + 50,
          ttfb: Math.random() * 500 + 200,
          timeOnPage: Math.random() * 300 + 30, // 30-330 seconds
          scrollDepth: Math.random() * 40 + 60, // 60-100% scroll
          bounced: Math.random() > 0.6, // 40% bounce rate
          clickThroughRate: Math.random() > 0.8 ? Math.random() * 5 + 1 : undefined,
          source: getRandomElement([
            TrafficSource.ORGANIC,
            TrafficSource.DIRECT,
            TrafficSource.REFERRAL,
            TrafficSource.SOCIAL,
          ]),
          searchEngine: Math.random() > 0.5 ? "Google" : undefined,
          referrerDomain: Math.random() > 0.6 ? getRandomElement(["twitter.com", "facebook.com", "linkedin.com", "reddit.com"]) : undefined,
          userAgent: getRandomElement(userAgents),
          timestamp: generateRandomDate(
            article.datePublished || article.createdAt,
            new Date()
          ),
        },
      });
      count++;
    }
  }

  console.log(`Seeded ${count} analytics records (event-based).`);
}

async function seedFAQs(articles: Awaited<ReturnType<typeof seedArticles>>) {
  console.log("Seeding FAQs...");
  let count = 0;

  const faqTemplates = [
    { q: "ما هو {topic}؟", a: "{topic} هو {definition}." },
    { q: "كيف يمكنني استخدام {topic}؟", a: "يمكنك استخدام {topic} من خلال {method}." },
    { q: "ما هي فوائد {topic}؟", a: "من فوائد {topic} {benefits}." },
  ];

  for (const article of articles) {
    if (article.status !== "PUBLISHED") continue;

    const faqCount = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < faqCount; i++) {
      const template = getRandomElement(faqTemplates);
      const question = template.q.replace(/{topic}/g, article.title.split(" ")[0]);
      const answer = template.a
        .replace(/{topic}/g, article.title.split(" ")[0])
        .replace(/{definition}/g, "أحد أهم المفاهيم في هذا المجال")
        .replace(/{method}/g, "اتباع الخطوات المذكورة في هذا المقال")
        .replace(/{benefits}/g, "تحسين الأداء وزيادة الكفاءة");

      await db.fAQ.create({
        data: {
          articleId: article.id,
          question,
          answer,
          position: i + 1,
        },
      });
      count++;
    }
  }

  console.log(`Seeded ${count} FAQs.`);
}

async function seedRelatedArticles(articles: Awaited<ReturnType<typeof seedArticles>>) {
  console.log("Seeding related articles...");
  let count = 0;

  for (const article of articles) {
    if (article.status !== "PUBLISHED") continue;

    const relatedCount = Math.floor(Math.random() * 2) + 2;
    const otherArticles = articles.filter(
      (a) => a.id !== article.id && a.status === "PUBLISHED" && a.categoryId === article.categoryId
    );
    const relatedArticles = getRandomElements(otherArticles, Math.min(relatedCount, otherArticles.length));

    for (const related of relatedArticles) {
      await db.relatedArticle.upsert({
        where: {
          articleId_relatedId: {
            articleId: article.id,
            relatedId: related.id,
          },
        },
        update: {},
        create: {
          articleId: article.id,
          relatedId: related.id,
          relationshipType: "related",
          weight: Math.random() * 0.5 + 0.5,
        },
      });
      count++;
    }
  }

  console.log(`Seeded ${count} related article relationships.`);
}

async function main() {
  try {
    console.log("Starting seed process...");

    const clearFlag = process.argv.includes("--clear");
    if (clearFlag) {
      await clearDatabase();
    }

    const clients = await seedClients();
    const authors = await seedAuthors();
    const categories = await seedCategories();
    const tags = await seedTags();
    const articles = await seedArticles(clients, authors, categories);
    await seedArticleTags(articles, tags);
    await seedMedia(articles);
    await seedAnalytics(articles);
    await seedFAQs(articles);
    await seedRelatedArticles(articles);

    console.log("\n✅ Seed process completed successfully!");
    console.log(`\nSummary:
- Clients: ${clients.length}
- Authors: ${authors.length}
- Categories: ${categories.length}
- Tags: ${tags.length}
- Articles: ${articles.length}
- Media: ${articles.length}
- Analytics, FAQs, and Related Articles: Seeded
`);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();

