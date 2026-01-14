import { db } from "@/lib/db";
import {
  ArticleStatus,
  TrafficSource,
  SubscriptionTier,
  SubscriptionStatus,
  PaymentStatus,
} from "@prisma/client";
import {
  generateArticleWithOpenAI,
  type OpenAIArticleData,
} from "@/lib/openai-seed";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateSEOArticleContent(
  title: string,
  category: string,
  length: "short" | "medium" | "long"
): { content: string; excerpt: string; wordCount: number } {
  const seoContentTemplates: Record<string, Record<string, string[]>> = {
    "technical-seo": {
      short: [
        "Core Web Vitals هي مجموعة من المؤشرات التي يقيسها Google لتقييم تجربة المستخدم على موقعك. LCP (Largest Contentful Paint) يقيس سرعة تحميل المحتوى الرئيسي، بينما FID (First Input Delay) يقيس سرعة الاستجابة للتفاعلات.",
        "لتحسين Core Web Vitals، يجب تحسين سرعة تحميل الصور، تقليل JavaScript غير الضروري، واستخدام CDN لتسريع التحميل.",
      ],
      medium: [
        "Core Web Vitals هي مجموعة من المؤشرات الأساسية التي يستخدمها Google لتقييم جودة تجربة المستخدم على موقعك. هذه المؤشرات الثلاثة - LCP (Largest Contentful Paint)، FID (First Input Delay)، و CLS (Cumulative Layout Shift) - أصبحت جزءاً أساسياً من خوارزمية Google منذ عام 2021.",
        "LCP يقيس الوقت الذي يستغرقه أكبر عنصر محتوى في الصفحة للظهور. الهدف هو أن يكون أقل من 2.5 ثانية. يمكن تحسين LCP من خلال تحسين سرعة الخادم، استخدام CDN، تحسين الصور، وإزالة JavaScript الذي يعيق التحميل.",
        "FID يقيس الوقت بين تفاعل المستخدم الأول مع الصفحة (مثل النقر على رابط) ووقت استجابة المتصفح. الهدف هو أقل من 100 مللي ثانية. يمكن تحسين FID من خلال تقليل JavaScript، استخدام code splitting، وتأجيل تحميل المكونات غير الضرورية.",
        "CLS يقيس استقرار المحتوى المرئي. الهدف هو أقل من 0.1. يمكن تحسين CLS من خلال تحديد أبعاد الصور والفيديو مسبقاً، تجنب إدراج المحتوى فوق المحتوى الموجود، واستخدام خطوط web fonts بشكل صحيح.",
      ],
      long: [
        "Core Web Vitals هي مجموعة من المؤشرات الأساسية التي يستخدمها Google لتقييم جودة تجربة المستخدم على موقعك. هذه المؤشرات الثلاثة - LCP (Largest Contentful Paint)، FID (First Input Delay)، و CLS (Cumulative Layout Shift) - أصبحت جزءاً أساسياً من خوارزمية Google منذ عام 2021، وتؤثر بشكل مباشر على ترتيب موقعك في نتائج البحث.",
        "LCP (Largest Contentful Paint) يقيس الوقت الذي يستغرقه أكبر عنصر محتوى في الصفحة للظهور. الهدف هو أن يكون أقل من 2.5 ثانية. يمكن تحسين LCP من خلال عدة استراتيجيات:",
        "1. تحسين سرعة الخادم: استخدم خوادم سريعة وموزعة جغرافياً، واستخدم CDN لتوزيع المحتوى.",
        "2. تحسين الصور: استخدم تنسيقات الصور الحديثة مثل WebP أو AVIF، وضغط الصور بشكل صحيح.",
        "3. إزالة JavaScript المعيق: حدد JavaScript غير الضروري وأجله للتحميل بعد تحميل المحتوى الأساسي.",
        "4. تحسين CSS: استخدم critical CSS، وأزل CSS غير المستخدم.",
        "FID (First Input Delay) يقيس الوقت بين تفاعل المستخدم الأول مع الصفحة (مثل النقر على رابط) ووقت استجابة المتصفح. الهدف هو أقل من 100 مللي ثانية. يمكن تحسين FID من خلال:",
        "1. تقليل JavaScript: قلل من كمية JavaScript المستخدمة، واستخدم code splitting.",
        "2. تأجيل تحميل المكونات: أزل المكونات غير الضرورية من التحميل الأولي.",
        "3. استخدام Web Workers: استخدم Web Workers للمهام الثقيلة.",
        "CLS (Cumulative Layout Shift) يقيس استقرار المحتوى المرئي. الهدف هو أقل من 0.1. يمكن تحسين CLS من خلال:",
        "1. تحديد أبعاد الصور والفيديو: حدد width و height للصور والفيديو مسبقاً.",
        "2. تجنب إدراج المحتوى فوق المحتوى الموجود: لا تضيف إعلانات أو محتوى ديناميكي فوق المحتوى الموجود.",
        "3. استخدام خطوط web fonts بشكل صحيح: استخدم font-display: swap، وحدد fallback fonts.",
        "بتحسين Core Web Vitals، يمكنك تحسين تجربة المستخدم وترتيب موقعك في نتائج البحث بشكل كبير.",
      ],
    },
    "on-page-seo": {
      short: [
        "On-Page SEO يشمل جميع التحسينات التي يمكنك إجراؤها على صفحات موقعك لتحسين ترتيبها في محركات البحث. يتضمن ذلك تحسين Title Tags، Meta Descriptions، والعناوين.",
        "الكلمات المفتاحية مهمة جداً في On-Page SEO. يجب استخدام الكلمات المفتاحية بشكل طبيعي في العنوان، المحتوى، والعناوين الفرعية.",
      ],
      medium: [
        "On-Page SEO يشمل جميع التحسينات التي يمكنك إجراؤها مباشرة على صفحات موقعك لتحسين ترتيبها في محركات البحث. هذه التحسينات تتضمن تحسين Title Tags، Meta Descriptions، العناوين، المحتوى، والروابط الداخلية.",
        "Title Tags هي أحد أهم عناصر On-Page SEO. يجب أن يكون Title Tag فريداً لكل صفحة، ويحتوي على الكلمة المفتاحية الرئيسية، ويجب أن يكون طوله بين 50-60 حرفاً. يجب وضع الكلمة المفتاحية في بداية Title Tag كلما أمكن.",
        "Meta Descriptions مهمة أيضاً لـ SEO، رغم أنها لا تؤثر مباشرة على الترتيب. لكنها تؤثر على معدل النقر (CTR) من نتائج البحث. يجب أن تكون Meta Description جذابة، وتحتوي على الكلمة المفتاحية، ويجب أن يكون طولها بين 150-160 حرفاً.",
        "العناوين (H1, H2, H3) مهمة جداً لتنظيم المحتوى وإخبار محركات البحث عن هيكل الصفحة. يجب استخدام H1 مرة واحدة فقط في كل صفحة، ويجب أن يحتوي على الكلمة المفتاحية الرئيسية. العناوين الفرعية (H2, H3) تساعد في تنظيم المحتوى وجعل القراءة أسهل.",
      ],
      long: [
        "On-Page SEO يشمل جميع التحسينات التي يمكنك إجراؤها مباشرة على صفحات موقعك لتحسين ترتيبها في محركات البحث. هذه التحسينات تتضمن تحسين Title Tags، Meta Descriptions، العناوين، المحتوى، والروابط الداخلية.",
        "Title Tags هي أحد أهم عناصر On-Page SEO. يجب أن يكون Title Tag فريداً لكل صفحة، ويحتوي على الكلمة المفتاحية الرئيسية، ويجب أن يكون طوله بين 50-60 حرفاً. يجب وضع الكلمة المفتاحية في بداية Title Tag كلما أمكن. Title Tag يظهر في نتائج البحث وهو أول ما يراه المستخدم، لذلك يجب أن يكون جذاباً ومقنعاً.",
        "Meta Descriptions مهمة أيضاً لـ SEO، رغم أنها لا تؤثر مباشرة على الترتيب. لكنها تؤثر على معدل النقر (CTR) من نتائج البحث. يجب أن تكون Meta Description جذابة، وتحتوي على الكلمة المفتاحية، ويجب أن يكون طولها بين 150-160 حرفاً. يمكنك استخدام call-to-action في Meta Description لزيادة معدل النقر.",
        "العناوين (H1, H2, H3) مهمة جداً لتنظيم المحتوى وإخبار محركات البحث عن هيكل الصفحة. يجب استخدام H1 مرة واحدة فقط في كل صفحة، ويجب أن يحتوي على الكلمة المفتاحية الرئيسية. العناوين الفرعية (H2, H3) تساعد في تنظيم المحتوى وجعل القراءة أسهل. يجب استخدام العناوين بشكل هرمي ومنطقي.",
        "المحتوى هو الملك في On-Page SEO. يجب أن يكون المحتوى عالي الجودة، مفيداً للقارئ، ويجب أن يحتوي على الكلمات المفتاحية بشكل طبيعي. يجب تجنب keyword stuffing (حشو الكلمات المفتاحية). يجب أن يكون المحتوى طويلاً بما يكفي لتغطية الموضوع بشكل شامل (عادة 1000+ كلمة للمواضيع المهمة).",
        "الروابط الداخلية مهمة جداً لـ On-Page SEO. تساعد الروابط الداخلية في توزيع PageRank على صفحات الموقع، وتسهل على محركات البحث اكتشاف وفهم هيكل الموقع. يجب ربط الصفحات ذات الصلة ببعضها البعض باستخدام anchor text وصفية.",
        "تحسين الصور مهم أيضاً. يجب استخدام alt text وصفية للصور، وضغط الصور لتقليل حجمها، واستخدام تنسيقات الصور الحديثة. يجب أيضاً استخدام أسماء ملفات وصفية للصور.",
      ],
    },
    "off-page-seo": {
      short: [
        "Off-Page SEO يشمل جميع الأنشطة التي تقوم بها خارج موقعك لتحسين ترتيبه في محركات البحث. أهم عنصر في Off-Page SEO هو بناء الروابط الخلفية (Backlinks).",
        "الروابط الخلفية عالية الجودة من مواقع موثوقة تساعد في تحسين Domain Authority وترتيب موقعك في نتائج البحث.",
      ],
      medium: [
        "Off-Page SEO يشمل جميع الأنشطة التي تقوم بها خارج موقعك لتحسين ترتيبه في محركات البحث. أهم عنصر في Off-Page SEO هو بناء الروابط الخلفية (Backlinks) من مواقع أخرى.",
        "الروابط الخلفية عالية الجودة من مواقع موثوقة تساعد في تحسين Domain Authority وترتيب موقعك في نتائج البحث. Google يعتبر الروابط الخلفية كتصويتات ثقة من مواقع أخرى. كلما زادت جودة وعدد الروابط الخلفية، كلما تحسن ترتيب موقعك.",
        "هناك عدة طرق لبناء الروابط الخلفية:",
        "1. إنشاء محتوى عالي الجودة يجذب الروابط الطبيعية.",
        "2. Guest Posting على مواقع أخرى في نفس المجال.",
        "3. المشاركة في المنتديات والمجتمعات المتخصصة.",
        "4. استخدام Broken Link Building (العثور على روابط معطلة في مواقع أخرى واقتراح محتوى بديل).",
        "يجب تجنب شراء الروابط أو استخدام روابط غير طبيعية، لأن ذلك قد يؤدي إلى عقوبات من Google.",
      ],
      long: [
        "Off-Page SEO يشمل جميع الأنشطة التي تقوم بها خارج موقعك لتحسين ترتيبه في محركات البحث. أهم عنصر في Off-Page SEO هو بناء الروابط الخلفية (Backlinks) من مواقع أخرى.",
        "الروابط الخلفية عالية الجودة من مواقع موثوقة تساعد في تحسين Domain Authority وترتيب موقعك في نتائج البحث. Google يعتبر الروابط الخلفية كتصويتات ثقة من مواقع أخرى. كلما زادت جودة وعدد الروابط الخلفية، كلما تحسن ترتيب موقعك.",
        "هناك عدة طرق لبناء الروابط الخلفية:",
        "1. إنشاء محتوى عالي الجودة يجذب الروابط الطبيعية: المحتوى القيم والجذاب يجذب الروابط تلقائياً من مواقع أخرى. ركز على إنشاء محتوى فريد ومفيد يجيب على أسئلة المستخدمين.",
        "2. Guest Posting على مواقع أخرى في نفس المجال: الكتابة كضيف على مواقع أخرى في نفس المجال يمكن أن تساعدك في الحصول على روابط خلفية عالية الجودة. اختر المواقع التي لها Domain Authority عالي وحركة مرور جيدة.",
        "3. المشاركة في المنتديات والمجتمعات المتخصصة: المشاركة في المنتديات والمجتمعات المتخصصة (مثل Reddit، Quora) يمكن أن تساعدك في بناء سمعة وروابط خلفية. لكن يجب أن تكون مساهماً حقيقياً وليس فقط للترويج.",
        "4. استخدام Broken Link Building: هذه الاستراتيجية تتضمن العثور على روابط معطلة في مواقع أخرى واقتراح محتوى بديل من موقعك. هذه طريقة فعالة للحصول على روابط خلفية.",
        "5. إنشاء موارد قابلة للمشاركة: إنشاء أدوات، حاسبات، أو موارد أخرى قابلة للمشاركة يمكن أن يجذب روابط خلفية طبيعية.",
        "يجب تجنب شراء الروابط أو استخدام روابط غير طبيعية، لأن ذلك قد يؤدي إلى عقوبات من Google. ركز على بناء روابط طبيعية وعالية الجودة بدلاً من الكمية.",
      ],
    },
  };

  const defaultContent = {
    short: [
      `${title} هو موضوع مهم في تحسين محركات البحث. في هذا المقال، سنستكشف الجوانب الأساسية لهذا الموضوع.`,
      `من خلال فهم المبادئ الأساسية وتطبيقها بشكل صحيح، يمكنك تحسين ترتيب موقعك في نتائج البحث.`,
    ],
    medium: [
      `${title} هو موضوع مهم في تحسين محركات البحث. في هذا المقال، سنستكشف الجوانب الأساسية لهذا الموضوع بالتفصيل.`,
      `سنتناول في هذا الدليل الشامل كل ما تحتاج معرفته عن ${title}. من الأساسيات إلى المستوى المتقدم.`,
      `من خلال فهم المبادئ الأساسية وتطبيقها بشكل صحيح، يمكنك تحسين ترتيب موقعك في نتائج البحث بشكل كبير.`,
      `في الختام، ${title} يمثل فرصة كبيرة لتحسين ظهور موقعك في محركات البحث.`,
    ],
    long: [
      `${title} هو موضوع مهم في تحسين محركات البحث. في هذا المقال، سنستكشف الجوانب الأساسية لهذا الموضوع بالتفصيل.`,
      `سنتناول في هذا الدليل الشامل كل ما تحتاج معرفته عن ${title}. من الأساسيات إلى المستوى المتقدم.`,
      `في القسم الأول، سنغطي المبادئ الأساسية لـ ${title}. هذه المبادئ مهمة لفهم الموضوع بشكل كامل.`,
      `في القسم الثاني، سنستكشف الاستراتيجيات المتقدمة لـ ${title}. هذه الاستراتيجيات يمكن أن تساعدك في تحقيق نتائج أفضل.`,
      `في القسم الثالث، سنناقش أفضل الممارسات في ${title}. هذه الممارسات مستندة إلى سنوات من الخبرة والبحث.`,
      `من خلال فهم المبادئ الأساسية وتطبيقها بشكل صحيح، يمكنك تحسين ترتيب موقعك في نتائج البحث بشكل كبير.`,
      `في الختام، ${title} يمثل فرصة كبيرة لتحسين ظهور موقعك في محركات البحث. من خلال تطبيق ما تعلمناه في هذا المقال، يمكنك تحقيق نتائج متميزة.`,
    ],
  };

  const templates = seoContentTemplates[category] || defaultContent;
  const paragraphs = templates[length] || defaultContent[length];

  const content = paragraphs.join("\n\n");
  const words = content.split(/\s+/);
  const wordCount = words.length;
  const excerpt = paragraphs[0].substring(0, 150) + "...";

  return { content, excerpt, wordCount };
}

function generateSEOFields(title: string, excerpt: string, category: string) {
  const seoTitle = `${title} | ${category}`;
  const seoDescription = excerpt.length > 155 ? excerpt.substring(0, 152) + "..." : excerpt;

  return {
    seoTitle,
    seoDescription,
    metaRobots: "index, follow",
    canonicalUrl: `https://modonty.com/articles/${slugify(title)}`,
    sitemapPriority: 0.7,
    sitemapChangeFreq: "weekly" as const,
    ogType: "article" as const,
    ogArticleAuthor: "Modonty",
    twitterCard: "summary_large_image" as const,
    twitterSite: "@modonty",
    twitterCreator: "@modonty",
  };
}

async function clearDatabase() {
  console.log("Clearing existing data...");

  try {
    console.log("  [1/6] Deleting related articles...");
    const relatedCount = await db.relatedArticle.count();
    if (relatedCount > 0) {
      await db.relatedArticle.deleteMany({});
      console.log(`    Deleted ${relatedCount} related articles`);
    }

    console.log("  [2/6] Deleting FAQs...");
    const faqCount = await db.articleFAQ.count();
    if (faqCount > 0) {
      await db.articleFAQ.deleteMany({});
      console.log(`    Deleted ${faqCount} FAQs`);
    }

    console.log("  [3/6] Deleting analytics...");
    const analyticsCount = await db.analytics.count();
    if (analyticsCount > 0) {
      await db.analytics.deleteMany({});
      console.log(`    Deleted ${analyticsCount} analytics records`);
    }

    console.log("  [4/6] Deleting article media gallery...");
    const mediaCount = await db.articleMedia.count();
    if (mediaCount > 0) {
      await db.articleMedia.deleteMany({});
      console.log(`    Deleted ${mediaCount} article media records`);
    }

    console.log("  [5/6] Deleting article tags...");
    const tagCount = await db.articleTag.count();
    if (tagCount > 0) {
      await db.articleTag.deleteMany({});
      console.log(`    Deleted ${tagCount} article tags`);
    }

    console.log("  [6/6] Deleting article versions...");
    const versionCount = await db.articleVersion.count();
    if (versionCount > 0) {
      await db.articleVersion.deleteMany({});
      console.log(`    Deleted ${versionCount} article versions`);
    }

    console.log("  Deleting articles...");
    const articleCount = await db.article.count();
    if (articleCount > 0) {
      await db.article.deleteMany({});
      console.log(`    Deleted ${articleCount} articles`);
    }

    console.log("  Deleting article tags (before deleting tags - children first)...");
    await db.articleTag.deleteMany({});
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log("  Deleting tags (parent)...");
    await db.tag.deleteMany({});

    console.log("  Deleting subscribers (depend on clients - children)...");
    await db.subscriber.deleteMany({});

    console.log("  Clearing media references from clients...");
    await db.client.updateMany({
      data: {
        logoMediaId: null,
        ogImageMediaId: null,
        twitterImageMediaId: null,
      },
    });

    console.log("  Deleting clients (parent)...");
    await db.client.deleteMany({});

    console.log("  Deleting media (parent)...");
    await db.media.deleteMany({});

    console.log("  Clearing parent references from categories...");
    await db.category.updateMany({
      data: { parentId: null },
    });

    console.log("  Deleting categories...");
    await db.category.deleteMany({});

    console.log("  Deleting authors...");
    await db.author.deleteMany({});

    console.log("  Deleting industries...");
    await db.industry.deleteMany({});

    console.log("  Deleting settings...");
    await db.settings.deleteMany({});

    console.log("✅ Database cleared successfully.");
  } catch (error) {
    console.error("❌ Error during database clearing:", error);
    throw error;
  }
}

async function seedIndustries() {
  console.log("Seeding industries...");
  const industriesData = [
    {
      name: "التقنية والبرمجيات",
      slug: "technology-software",
      description: "صناعة التقنية والبرمجيات وتطوير التطبيقات",
      seoTitle: "التقنية والبرمجيات - صناعة التكنولوجيا",
      seoDescription: "اكتشف أحدث التطورات في صناعة التقنية والبرمجيات وتطوير التطبيقات.",
    },
    {
      name: "التسويق الرقمي",
      slug: "digital-marketing",
      description: "صناعة التسويق الرقمي وتحسين محركات البحث",
      seoTitle: "التسويق الرقمي - استراتيجيات التسويق عبر الإنترنت",
      seoDescription: "تعلم أحدث استراتيجيات التسويق الرقمي وتحسين محركات البحث لزيادة المبيعات.",
    },
    {
      name: "التصميم والإبداع",
      slug: "design-creativity",
      description: "صناعة التصميم الجرافيكي وواجهات المستخدم",
      seoTitle: "التصميم والإبداع - تصميم واجهات المستخدم",
      seoDescription: "اكتشف أحدث اتجاهات التصميم وواجهات المستخدم وتجربة المستخدم.",
    },
    {
      name: "التجارة الإلكترونية",
      slug: "ecommerce",
      description: "صناعة التجارة الإلكترونية والمتاجر الإلكترونية",
      seoTitle: "التجارة الإلكترونية - بناء متاجر إلكترونية ناجحة",
      seoDescription: "تعلم كيفية بناء وإدارة متاجر إلكترونية ناجحة وتحسين المبيعات.",
    },
    {
      name: "الخدمات المالية",
      slug: "financial-services",
      description: "صناعة الخدمات المالية والتكنولوجيا المالية",
      seoTitle: "الخدمات المالية - التكنولوجيا المالية",
      seoDescription: "اكتشف أحدث التطورات في التكنولوجيا المالية والخدمات المالية.",
    },
    {
      name: "الرعاية الصحية",
      slug: "healthcare",
      description: "صناعة الرعاية الصحية والتكنولوجيا الطبية",
      seoTitle: "الرعاية الصحية - التكنولوجيا الطبية",
      seoDescription: "تعلم عن أحدث التطورات في التكنولوجيا الطبية والرعاية الصحية.",
    },
    {
      name: "التعليم",
      slug: "education",
      description: "صناعة التعليم والتكنولوجيا التعليمية",
      seoTitle: "التعليم - التكنولوجيا التعليمية",
      seoDescription: "اكتشف كيف يمكن للتكنولوجيا تحسين التعليم والتعلم.",
    },
    {
      name: "الطاقة والاستدامة",
      slug: "energy-sustainability",
      description: "صناعة الطاقة المتجددة والاستدامة",
      seoTitle: "الطاقة والاستدامة - الطاقة المتجددة",
      seoDescription: "تعلم عن الطاقة المتجددة والاستدامة والتقنيات الخضراء.",
    },
  ];

  const createdIndustries = [];
  for (const industryData of industriesData) {
    const industry = await db.industry.upsert({
      where: { slug: industryData.slug },
      update: industryData,
      create: industryData,
    });
    createdIndustries.push(industry);
  }

  console.log(`Seeded ${createdIndustries.length} industries.`);
  return createdIndustries;
}

async function seedClients(industries: Awaited<ReturnType<typeof seedIndustries>>) {
  console.log("Seeding clients...");
  const clientsData = [
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
      industrySlug: "technology-software",
      subscriptionTier: SubscriptionTier.PRO,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      paymentStatus: PaymentStatus.PAID,
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
      industrySlug: "design-creativity",
      subscriptionTier: SubscriptionTier.STANDARD,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      paymentStatus: PaymentStatus.PAID,
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
      industrySlug: "digital-marketing",
      subscriptionTier: SubscriptionTier.PREMIUM,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      paymentStatus: PaymentStatus.PAID,
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
      industrySlug: "technology-software",
      subscriptionTier: SubscriptionTier.STANDARD,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      paymentStatus: PaymentStatus.PAID,
    },
    {
      name: "متجر الإلكتروني المتقدم",
      slug: "advanced-ecommerce",
      legalName: "متجر الإلكتروني المتقدم ش.م.م",
      url: "https://advanced-ecommerce.example.com",
      sameAs: [
        "https://linkedin.com/company/advanced-ecommerce",
        "https://twitter.com/advancecommerce",
      ],
      email: "info@advanced-ecommerce.com",
      phone: "+966505678901",
      seoTitle: "متجر الإلكتروني المتقدم - حلول التجارة الإلكترونية",
      seoDescription:
        "متجر متخصص في بناء وإدارة المتاجر الإلكترونية. نقدم حلولاً شاملة للتجارة الإلكترونية.",
      foundingDate: new Date("2017-05-12"),
      industrySlug: "ecommerce",
      subscriptionTier: SubscriptionTier.PRO,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      paymentStatus: PaymentStatus.PAID,
    },
    {
      name: "خدمات التكنولوجيا المالية",
      slug: "fintech-services",
      legalName: "خدمات التكنولوجيا المالية ش.م.م",
      url: "https://fintech-services.example.com",
      sameAs: [
        "https://linkedin.com/company/fintech-services",
        "https://twitter.com/fintechservices",
      ],
      email: "contact@fintech-services.com",
      phone: "+966506789012",
      seoTitle: "خدمات التكنولوجيا المالية - حلول مالية مبتكرة",
      seoDescription:
        "شركة متخصصة في التكنولوجيا المالية والحلول المالية المبتكرة للشركات والأفراد.",
      foundingDate: new Date("2018-09-20"),
      industrySlug: "financial-services",
      subscriptionTier: SubscriptionTier.PREMIUM,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      paymentStatus: PaymentStatus.PAID,
    },
    {
      name: "حلول الرعاية الصحية الرقمية",
      slug: "digital-healthcare-solutions",
      legalName: "حلول الرعاية الصحية الرقمية ش.م.م",
      url: "https://digital-healthcare.example.com",
      sameAs: [
        "https://linkedin.com/company/digital-healthcare",
        "https://twitter.com/digitalhealth",
      ],
      email: "info@digital-healthcare.com",
      phone: "+966507890123",
      seoTitle: "حلول الرعاية الصحية الرقمية - التكنولوجيا الطبية",
      seoDescription:
        "شركة متخصصة في تطوير حلول الرعاية الصحية الرقمية والتكنولوجيا الطبية.",
      foundingDate: new Date("2019-02-15"),
      industrySlug: "healthcare",
      subscriptionTier: SubscriptionTier.STANDARD,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      paymentStatus: PaymentStatus.PAID,
    },
    {
      name: "منصة التعليم الإلكتروني",
      slug: "e-learning-platform",
      legalName: "منصة التعليم الإلكتروني ش.م.م",
      url: "https://e-learning-platform.example.com",
      sameAs: [
        "https://linkedin.com/company/e-learning-platform",
        "https://twitter.com/elearningplat",
      ],
      email: "hello@e-learning-platform.com",
      phone: "+966508901234",
      seoTitle: "منصة التعليم الإلكتروني - التكنولوجيا التعليمية",
      seoDescription:
        "منصة متخصصة في التعليم الإلكتروني وتطوير المحتوى التعليمي التفاعلي.",
      foundingDate: new Date("2020-06-10"),
      industrySlug: "education",
      subscriptionTier: SubscriptionTier.BASIC,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      paymentStatus: PaymentStatus.PAID,
    },
  ];

  const createdClients = [];
  for (const clientData of clientsData) {
    const industry = industries.find((i) => i.slug === clientData.industrySlug);
    const { industrySlug, ...clientFields } = clientData;

    const client = await db.client.upsert({
      where: { slug: clientFields.slug },
      update: {
        ...clientFields,
        industryId: industry?.id,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        articlesPerMonth:
          clientFields.subscriptionTier === SubscriptionTier.PREMIUM
            ? 50
            : clientFields.subscriptionTier === SubscriptionTier.PRO
            ? 30
            : clientFields.subscriptionTier === SubscriptionTier.STANDARD
            ? 20
            : 10,
      },
      create: {
        ...clientFields,
        industryId: industry?.id,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        articlesPerMonth:
          clientFields.subscriptionTier === SubscriptionTier.PREMIUM
            ? 50
            : clientFields.subscriptionTier === SubscriptionTier.PRO
            ? 30
            : clientFields.subscriptionTier === SubscriptionTier.STANDARD
            ? 20
            : 10,
      },
    });
    createdClients.push(client);
  }

  console.log(`Seeded ${createdClients.length} clients.`);
  return createdClients;
}

async function seedAuthors() {
  console.log("Seeding author (singleton: modonty)...");

  const author = await db.author.upsert({
    where: { slug: "modonty" },
    update: {
      name: "Modonty",
      firstName: "Modonty",
      lastName: "Team",
      bio: "فريق Modonty المتخصص في تحسين محركات البحث والتسويق الرقمي. نقدم محتوى عالي الجودة عن SEO وأفضل الممارسات.",
      jobTitle: "خبير SEO ومتخصص في التسويق الرقمي",
      expertiseAreas: [
        "Technical SEO",
        "On-Page SEO",
        "Off-Page SEO",
        "Local SEO",
        "Content SEO",
        "E-E-A-T",
        "Core Web Vitals",
        "Schema Markup",
      ],
      credentials: [
        "Google Analytics Certified",
        "Google Search Console Expert",
        "SEO Specialist Certification",
      ],
      qualifications: [
        "خبرة 10+ سنوات في SEO",
        "خبير في تحليل البيانات",
        "متخصص في تحسين الأداء",
      ],
      experienceYears: 10,
      verificationStatus: true,
      memberOf: ["Google Partners", "SEO Professionals Association"],
      seoTitle: "Modonty - خبير SEO ومتخصص في التسويق الرقمي",
      seoDescription:
        "فريق Modonty المتخصص في تحسين محركات البحث. اكتشف أحدث استراتيجيات SEO وأفضل الممارسات.",
      linkedIn: "https://linkedin.com/company/modonty",
      twitter: "https://twitter.com/modonty",
      sameAs: [
        "https://linkedin.com/company/modonty",
        "https://twitter.com/modonty",
        "https://facebook.com/modonty",
      ],
    },
    create: {
      name: "Modonty",
      slug: "modonty",
      firstName: "Modonty",
      lastName: "Team",
      bio: "فريق Modonty المتخصص في تحسين محركات البحث والتسويق الرقمي. نقدم محتوى عالي الجودة عن SEO وأفضل الممارسات.",
      jobTitle: "خبير SEO ومتخصص في التسويق الرقمي",
      expertiseAreas: [
        "Technical SEO",
        "On-Page SEO",
        "Off-Page SEO",
        "Local SEO",
        "Content SEO",
        "E-E-A-T",
        "Core Web Vitals",
        "Schema Markup",
      ],
      credentials: [
        "Google Analytics Certified",
        "Google Search Console Expert",
        "SEO Specialist Certification",
      ],
      qualifications: [
        "خبرة 10+ سنوات في SEO",
        "خبير في تحليل البيانات",
        "متخصص في تحسين الأداء",
      ],
      experienceYears: 10,
      verificationStatus: true,
      memberOf: ["Google Partners", "SEO Professionals Association"],
      seoTitle: "Modonty - خبير SEO ومتخصص في التسويق الرقمي",
      seoDescription:
        "فريق Modonty المتخصص في تحسين محركات البحث. اكتشف أحدث استراتيجيات SEO وأفضل الممارسات.",
      linkedIn: "https://linkedin.com/company/modonty",
      twitter: "https://twitter.com/modonty",
      sameAs: [
        "https://linkedin.com/company/modonty",
        "https://twitter.com/modonty",
        "https://facebook.com/modonty",
      ],
    },
  });

  console.log(`Seeded author: ${author.name}`);
  return author;
}

async function seedCategories() {
  console.log("Seeding categories...");
  const categoriesData = [
    {
      name: "Technical SEO",
      slug: "technical-seo",
      description: "مقالات عن Technical SEO وCore Web Vitals وSchema Markup",
      seoTitle: "Technical SEO - تحسين محركات البحث التقني",
      seoDescription:
        "اكتشف أحدث استراتيجيات Technical SEO وCore Web Vitals وSchema Markup لتحسين ظهور موقعك في نتائج البحث.",
    },
    {
      name: "On-Page SEO",
      slug: "on-page-seo",
      description: "مقالات عن On-Page SEO وتحسين المحتوى",
      seoTitle: "On-Page SEO - تحسين محركات البحث على الصفحة",
      seoDescription:
        "تعلم كيفية تحسين On-Page SEO من خلال تحسين المحتوى والكلمات المفتاحية والعناصر الداخلية.",
    },
    {
      name: "Off-Page SEO",
      slug: "off-page-seo",
      description: "مقالات عن Off-Page SEO وبناء الروابط",
      seoTitle: "Off-Page SEO - تحسين محركات البحث خارج الصفحة",
      seoDescription:
        "اكتشف استراتيجيات Off-Page SEO وبناء الروابط الخلفية لتحسين ترتيب موقعك في محركات البحث.",
    },
    {
      name: "Local SEO",
      slug: "local-seo",
      description: "مقالات عن Local SEO وGoogle My Business",
      seoTitle: "Local SEO - تحسين محركات البحث المحلي",
      seoDescription:
        "تعلم كيفية تحسين Local SEO وGoogle My Business لزيادة ظهورك في البحث المحلي.",
    },
    {
      name: "Content SEO",
      slug: "content-seo",
      description: "مقالات عن Content SEO واستراتيجيات المحتوى",
      seoTitle: "Content SEO - تحسين محركات البحث للمحتوى",
      seoDescription:
        "اكتشف كيفية إنشاء محتوى محسّن لـ SEO يجذب الزوار ويحسن ترتيبك في محركات البحث.",
    },
    {
      name: "E-E-A-T",
      slug: "e-e-a-t",
      description: "مقالات عن E-E-A-T (Expertise, Authoritativeness, Trustworthiness)",
      seoTitle: "E-E-A-T - الخبرة والسلطة والموثوقية في SEO",
      seoDescription:
        "تعلم كيفية تحسين E-E-A-T (Expertise, Authoritativeness, Trustworthiness) لموقعك ومحتواك.",
    },
    {
      name: "Mobile SEO",
      slug: "mobile-seo",
      description: "مقالات عن Mobile SEO وMobile-First Indexing",
      seoTitle: "Mobile SEO - تحسين محركات البحث للموبايل",
      seoDescription:
        "اكتشف كيفية تحسين Mobile SEO وMobile-First Indexing لتحسين تجربة المستخدم على الأجهزة المحمولة.",
    },
    {
      name: "International SEO",
      slug: "international-seo",
      description: "مقالات عن International SEO وhreflang",
      seoTitle: "International SEO - تحسين محركات البحث الدولي",
      seoDescription:
        "تعلم كيفية تحسين International SEO وhreflang لاستهداف الأسواق الدولية.",
    },
  ];

  const createdCategories = [];
  for (const categoryData of categoriesData) {
    const category = await db.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData,
    });
    createdCategories.push(category);
  }

  const parentSlugs = ["technical-seo", "on-page-seo", "off-page-seo", "local-seo"];
  const parents = await db.category.findMany({
    where: { slug: { in: parentSlugs } },
    select: { id: true, slug: true },
  });
  const parentMap = new Map(parents.map((p) => [p.slug, p.id]));

  const childCategories = [
    {
      name: "Core Web Vitals",
      slug: "core-web-vitals",
      description: "مقالات عن Core Web Vitals وقياس الأداء",
      seoTitle: "Core Web Vitals - مؤشرات الأداء الأساسية",
      seoDescription: "تعلم كيفية تحسين Core Web Vitals (LCP, FID, CLS) لتحسين تجربة المستخدم.",
      parentSlug: "technical-seo",
    },
    {
      name: "Schema Markup",
      slug: "schema-markup",
      description: "مقالات عن Schema Markup والبيانات المنظمة",
      seoTitle: "Schema Markup - البيانات المنظمة",
      seoDescription: "اكتشف كيفية استخدام Schema Markup لتحسين ظهورك في نتائج البحث.",
      parentSlug: "technical-seo",
    },
    {
      name: "Keyword Research",
      slug: "keyword-research",
      description: "مقالات عن Keyword Research واستراتيجيات الكلمات المفتاحية",
      seoTitle: "Keyword Research - البحث عن الكلمات المفتاحية",
      seoDescription: "تعلم كيفية إجراء Keyword Research واختيار الكلمات المفتاحية المناسبة.",
      parentSlug: "on-page-seo",
    },
    {
      name: "Link Building",
      slug: "link-building",
      description: "مقالات عن Link Building وبناء الروابط الخلفية",
      seoTitle: "Link Building - بناء الروابط الخلفية",
      seoDescription: "اكتشف استراتيجيات Link Building الفعالة لتحسين Domain Authority.",
      parentSlug: "off-page-seo",
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
  const tagsData = [
    "SEO",
    "Technical SEO",
    "On-Page SEO",
    "Off-Page SEO",
    "Local SEO",
    "Content SEO",
    "E-E-A-T",
    "Core Web Vitals",
    "LCP",
    "FID",
    "CLS",
    "INP",
    "Schema Markup",
    "Structured Data",
    "JSON-LD",
    "Backlinks",
    "Link Building",
    "Domain Authority",
    "Page Speed",
    "Mobile SEO",
    "Mobile-First Indexing",
    "Keyword Research",
    "Long-Tail Keywords",
    "Meta Tags",
    "Title Tags",
    "Meta Descriptions",
    "Canonical URLs",
    "Robots.txt",
    "Sitemap",
    "Google Search Console",
    "Google Analytics",
    "Search Engine Optimization",
    "Organic Traffic",
    "Search Rankings",
    "Algorithm Updates",
    "Google Updates",
    "Content Marketing",
    "Blogging",
    "Content Strategy",
    "User Experience",
    "Conversion Rate Optimization",
    "A/B Testing",
    "Landing Pages",
    "Internal Linking",
    "External Linking",
    "Anchor Text",
    "Image SEO",
    "Alt Text",
    "Video SEO",
    "Voice Search",
    "Featured Snippets",
    "Rich Snippets",
    "Knowledge Graph",
    "Semantic SEO",
    "Topic Clusters",
    "Pillar Pages",
    "Content Clusters",
  ];

  const createdTags = [];
  console.log(`  Creating ${tagsData.length} tags...`);
  for (let idx = 0; idx < tagsData.length; idx++) {
    const tagName = tagsData[idx];
    const tag = await db.tag.upsert({
      where: { slug: slugify(tagName) },
      update: { name: tagName },
      create: { name: tagName, slug: slugify(tagName) },
    });
    createdTags.push(tag);

    if ((idx + 1) % 10 === 0) {
      console.log(`    ✓ Created ${idx + 1}/${tagsData.length} tags...`);
    }
  }

  console.log(`✅ Seeded ${createdTags.length} tags.`);
  return createdTags;
}

async function seedArticles(
  clients: Awaited<ReturnType<typeof seedClients>>,
  author: Awaited<ReturnType<typeof seedAuthors>>,
  categories: Awaited<ReturnType<typeof seedCategories>>,
  articleCount: number,
  useOpenAI: boolean
) {
  console.log(`Seeding ${articleCount} SEO articles...`);
  const startTime = Date.now();

  const seoArticleTitles = [
    "دليل شامل لتحسين Core Web Vitals في 2025",
    "كيفية استخدام Schema Markup لتحسين ظهورك في البحث",
    "تحسين سرعة الصفحة: أدوات وأفضل الممارسات",
    "Mobile-First Indexing: كل ما تحتاج معرفته",
    "كيفية تحسين LCP (Largest Contentful Paint)",
    "تحسين FID و INP: تقليل وقت الاستجابة",
    "تقليل CLS: تحسين استقرار التخطيط",
    "استخدام JSON-LD للبيانات المنظمة",
    "تحسين Structured Data لنتائج البحث الغنية",
    "Technical SEO Checklist: قائمة التحقق الكاملة",
    "استراتيجيات البحث عن الكلمات المفتاحية",
    "كيفية كتابة Title Tags محسّنة لـ SEO",
    "أفضل الممارسات في Meta Descriptions",
    "تحسين العناوين (H1, H2, H3) لـ SEO",
    "Keyword Research: دليل شامل للمبتدئين",
    "Long-Tail Keywords: استراتيجيات فعالة",
    "تحسين المحتوى للكلمات المفتاحية",
    "Internal Linking: استراتيجيات الربط الداخلي",
    "تحسين الصور لـ SEO: Alt Text وأفضل الممارسات",
    "On-Page SEO Checklist: قائمة التحقق الكاملة",
    "استراتيجيات بناء الروابط الخلفية (Backlinks) الفعالة",
    "Link Building: دليل شامل للمبتدئين",
    "كيفية تحسين Domain Authority",
    "Guest Posting: كيفية الكتابة كضيف",
    "Broken Link Building: استراتيجية فعالة",
    "تحليل الروابط الخلفية للمنافسين",
    "تجنب عقوبات Google: أفضل الممارسات",
    "Off-Page SEO Checklist: قائمة التحقق الكاملة",
    "تحسين محركات البحث المحلي: دليل Google My Business",
    "Local SEO: استراتيجيات للشركات المحلية",
    "كيفية تحسين NAP (Name, Address, Phone)",
    "Local Citations: بناء Citations محلية",
    "Google Maps Optimization: تحسين الخرائط",
    "Local SEO Checklist: قائمة التحقق الكاملة",
    "استراتيجيات Content Marketing لـ SEO",
    "كيفية إنشاء محتوى محسّن لـ SEO",
    "Topic Clusters: استراتيجية المحتوى المتقدم",
    "Pillar Pages: بناء صفحات الركيزة",
    "Content Clusters: تنظيم المحتوى",
    "كيفية كتابة محتوى طويل وعالي الجودة",
    "Content SEO Checklist: قائمة التحقق الكاملة",
    "أهمية E-E-A-T في تحسين محركات البحث",
    "كيفية تحسين Expertise في المحتوى",
    "بناء Authoritativeness لموقعك",
    "تحسين Trustworthiness للموقع",
    "E-E-A-T Checklist: قائمة التحقق الكاملة",
    "Mobile SEO: دليل شامل",
    "تحسين Mobile User Experience",
    "AMP (Accelerated Mobile Pages): دليل شامل",
    "Mobile SEO Checklist: قائمة التحقق الكاملة",
    "International SEO: استهداف الأسواق الدولية",
    "hreflang Tags: دليل شامل",
    "Multilingual SEO: تحسين المواقع متعددة اللغات",
    "International SEO Checklist: قائمة التحقق الكاملة",
    "Google Search Console: دليل الاستخدام الكامل",
    "Google Analytics 4: تحليل البيانات",
    "أفضل أدوات SEO التي يجب أن تعرفها",
    "كيفية تحليل بيانات SEO",
    "SEO Tools Checklist: قائمة الأدوات",
    "Semantic SEO: تحسين البحث الدلالي",
    "Voice Search Optimization: تحسين البحث الصوتي",
    "Featured Snippets: كيفية الظهور في المقتطفات",
    "Rich Snippets: تحسين النتائج الغنية",
    "Knowledge Graph: فهم الرسم البياني المعرفي",
    "تحسين Robots.txt لـ SEO",
    "XML Sitemap: دليل شامل",
    "Canonical URLs: كيفية استخدامها",
    "تحسين 404 Errors",
    "Redirects: 301 vs 302",
    "HTTPS و SEO: أهمية SSL",
    "تحسين URL Structure",
    "Image SEO: دليل شامل",
    "Video SEO: تحسين الفيديو",
    "Podcast SEO: تحسين البودكاست",
    "E-commerce SEO: تحسين المتاجر الإلكترونية",
    "Blog SEO: تحسين المدونات",
    "News SEO: تحسين الأخبار",
    "YouTube SEO: تحسين اليوتيوب",
    "Social Media SEO: تحسين وسائل التواصل",
    "Email Marketing و SEO",
    "PPC و SEO: التكامل بينهما",
    "Competitor Analysis: تحليل المنافسين",
    "SEO Audit: كيفية إجراء تدقيق شامل",
    "Technical SEO Audit: تدقيق تقني",
    "Content Audit: تدقيق المحتوى",
    "Link Audit: تدقيق الروابط",
    "SEO Reporting: كيفية إنشاء تقارير",
    "KPIs لـ SEO: مؤشرات الأداء",
    "ROI في SEO: قياس العائد",
    "SEO Budget: كيفية تخصيص الميزانية",
    "In-House vs Agency: أيهما أفضل",
    "SEO Trends 2025: الاتجاهات الجديدة",
    "Google Algorithm Updates: التحديثات الأخيرة",
    "Future of SEO: مستقبل SEO",
  ];

  const extendedTitles = seoArticleTitles;

  const articles: Awaited<ReturnType<typeof db.article.create>>[] = [];
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  const statusDistribution: ArticleStatus[] = [];
  const publishedTarget = Math.round(articleCount * 0.6);
  const draftTarget = articleCount - publishedTarget;
  for (let i = 0; i < publishedTarget; i++) statusDistribution.push(ArticleStatus.PUBLISHED);
  for (let i = 0; i < draftTarget; i++) statusDistribution.push(ArticleStatus.DRAFT);

  const lengthDistribution: ("short" | "medium" | "long")[] = [];
  const shortTarget = Math.round(articleCount * 0.3);
  const mediumTarget = Math.round(articleCount * 0.4);
  const longTarget = articleCount - (shortTarget + mediumTarget);
  for (let i = 0; i < shortTarget; i++) lengthDistribution.push("short");
  for (let i = 0; i < mediumTarget; i++) lengthDistribution.push("medium");
  for (let i = 0; i < longTarget; i++) lengthDistribution.push("long");

  const shuffledStatus = statusDistribution.sort(() => Math.random() - 0.5);
  const shuffledLength = lengthDistribution.sort(() => Math.random() - 0.5);

  for (let i = 0; i < articleCount; i++) {
    const client = clients[i % clients.length];
    const category = categories[i % categories.length];
    const title = extendedTitles[i % extendedTitles.length];
    const slug = `${slugify(title)}-${i + 1}`;
    const status = shuffledStatus[i];
    const length = shuffledLength[i];
    const categorySlug = category.slug;

    let content: string;
    let excerpt: string;
    let wordCount: number;
    let aiData: OpenAIArticleData | null = null;

    if (useOpenAI) {
      try {
        aiData = await generateArticleWithOpenAI({
          title,
          category: categorySlug,
          length,
          language: "ar",
        });
        content = aiData.content;
        excerpt = aiData.excerpt;
        wordCount = aiData.wordCount;
      } catch (error) {
        console.error(
          "OpenAI article generation failed, falling back to templates:",
          error
        );
        const fallback = generateSEOArticleContent(title, categorySlug, length);
        content = fallback.content;
        excerpt = fallback.excerpt;
        wordCount = fallback.wordCount;
        aiData = null;
      }
    } else {
      const fallback = generateSEOArticleContent(title, categorySlug, length);
      content = fallback.content;
      excerpt = fallback.excerpt;
      wordCount = fallback.wordCount;
    }

    const readingTime = Math.ceil(wordCount / 200);
    const contentDepth = length;

    const datePublished =
      status === ArticleStatus.PUBLISHED ? generateRandomDate(twelveMonthsAgo, now) : null;

    let seoFields = generateSEOFields(title, excerpt, category.name);
    if (aiData) {
      if (aiData.seoTitle) {
        seoFields = { ...seoFields, seoTitle: aiData.seoTitle };
      }
      if (aiData.seoDescription) {
        seoFields = { ...seoFields, seoDescription: aiData.seoDescription };
      }
    }

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
        datePublished,
        featured: i % 20 === 0,
        wordCount,
        readingTimeMinutes: readingTime,
        contentDepth,
        inLanguage: "ar",
        isAccessibleForFree: true,
        ...seoFields,
        ogArticlePublishedTime: datePublished || undefined,
        ogArticleModifiedTime: datePublished || undefined,
      },
    });

    articles.push(article);

    if ((i + 1) % 10 === 0 || i === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `    ✓ Created ${i + 1}/${articleCount} articles (${status}, ${length}, ${wordCount} words) - ${elapsed}s`
      );
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Seeded ${articles.length} articles in ${totalTime} seconds.`);
  return articles;
}

async function seedArticleTags(
  articles: Awaited<ReturnType<typeof seedArticles>>,
  tags: Awaited<ReturnType<typeof seedTags>>
) {
  console.log("Seeding article tags...");
  const startTime = Date.now();
  let count = 0;
  const total = articles.length;

  for (let idx = 0; idx < articles.length; idx++) {
    const article = articles[idx];
    const tagCount = Math.floor(Math.random() * 4) + 2;
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

    if ((idx + 1) % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `    ✓ Processed ${idx + 1}/${total} articles (${count} tag relations) - ${elapsed}s`
      );
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Seeded ${count} article-tag relationships in ${totalTime} seconds.`);
}

async function seedMedia(
  articles: Awaited<ReturnType<typeof seedArticles>>,
  clients: Awaited<ReturnType<typeof seedClients>>,
  author: Awaited<ReturnType<typeof seedAuthors>>
) {
  console.log("Seeding media...");
  const startTime = Date.now();
  const createdMedia = [];

  console.log("  Creating featured images for articles...");
  for (let idx = 0; idx < articles.length; idx++) {
    const article = articles[idx];
    const media = await db.media.create({
      data: {
        filename: `article-${article.slug}.jpg`,
        url: `https://images.unsplash.com/photo-${Math.floor(
          Math.random() * 1000000
        )}?w=1200&h=630&fit=crop`,
        mimeType: "image/jpeg",
        fileSize: Math.floor(Math.random() * 500000) + 100000,
        width: 1200,
        height: 630,
        encodingFormat: "image/jpeg",
        altText: article.title,
        caption: article.excerpt || undefined,
        title: article.title,
        clientId: article.clientId,
        type: "POST",
      },
    });

    await db.article.update({
      where: { id: article.id },
      data: { featuredImageId: media.id },
    });

    createdMedia.push(media);

    if ((idx + 1) % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `    ✓ Created ${idx + 1}/${articles.length} article featured images - ${elapsed}s`
      );
    }
  }

  console.log("  Creating client logos and OG images...");
  for (let idx = 0; idx < clients.length; idx++) {
    const client = clients[idx];
    const logoMedia = await db.media.create({
      data: {
        filename: `logo-${client.slug}.png`,
        url: `https://images.unsplash.com/photo-${Math.floor(
          Math.random() * 1000000
        )}?w=400&h=400&fit=crop`,
        mimeType: "image/png",
        fileSize: Math.floor(Math.random() * 200000) + 50000,
        width: 400,
        height: 400,
        encodingFormat: "image/png",
        altText: `Logo ${client.name}`,
        title: `Logo ${client.name}`,
        clientId: client.id,
        type: "LOGO",
      },
    });

    const ogMedia = await db.media.create({
      data: {
        filename: `og-${client.slug}.jpg`,
        url: `https://images.unsplash.com/photo-${Math.floor(
          Math.random() * 1000000
        )}?w=1200&h=630&fit=crop`,
        mimeType: "image/jpeg",
        fileSize: Math.floor(Math.random() * 500000) + 100000,
        width: 1200,
        height: 630,
        encodingFormat: "image/jpeg",
        altText: `OG Image ${client.name}`,
        title: `OG Image ${client.name}`,
        clientId: client.id,
        type: "OGIMAGE",
      },
    });

    await db.client.update({
      where: { id: client.id },
      data: {
        logoMediaId: logoMedia.id,
        ogImageMediaId: ogMedia.id,
      },
    });

    createdMedia.push(logoMedia, ogMedia);
    console.log(`  Created media for client ${idx + 1}/${clients.length}: ${client.name}`);
  }

  const authorMedia = await db.media.create({
    data: {
      filename: "author-modonty.jpg",
      url: `https://images.unsplash.com/photo-${Math.floor(
        Math.random() * 1000000
      )}?w=400&h=400&fit=crop`,
      mimeType: "image/jpeg",
      fileSize: Math.floor(Math.random() * 200000) + 50000,
      width: 400,
      height: 400,
      encodingFormat: "image/jpeg",
      altText: "Modonty Author",
      title: "Modonty Author",
      type: "GENERAL",
    },
  });

  await db.author.update({
    where: { id: author.id },
    data: { image: authorMedia.url },
  });

  createdMedia.push(authorMedia);

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Seeded ${createdMedia.length} media files in ${totalTime} seconds.`);
  return createdMedia;
}

async function seedAnalytics(articles: Awaited<ReturnType<typeof seedArticles>>) {
  console.log("Seeding analytics...");
  const startTime = Date.now();
  let count = 0;
  const publishedArticles = articles.filter((a) => a.status === ArticleStatus.PUBLISHED);
  let processed = 0;

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
  ];

  console.log(`  Creating analytics for ${publishedArticles.length} published articles...`);
  for (let idx = 0; idx < publishedArticles.length; idx++) {
    const article = publishedArticles[idx];
    const viewCount = Math.floor(Math.random() * 15) + 5;
    const sessionIds = new Set<string>();

    for (let i = 0; i < viewCount; i++) {
      const sessionId = `session-${Math.floor(Math.random() * 1000)}-${Date.now()}-${i}`;
      sessionIds.add(sessionId);

      await db.analytics.create({
        data: {
          articleId: article.id,
          clientId: article.clientId,
          sessionId,
          lcp: Math.random() * 2 + 1,
          cls: Math.random() * 0.1,
          inp: Math.random() * 200 + 50,
          ttfb: Math.random() * 500 + 200,
          timeOnPage: Math.random() * 300 + 30,
          scrollDepth: Math.random() * 40 + 60,
          bounced: Math.random() > 0.6,
          clickThroughRate: Math.random() > 0.8 ? Math.random() * 5 + 1 : undefined,
          source: getRandomElement([
            TrafficSource.ORGANIC,
            TrafficSource.DIRECT,
            TrafficSource.REFERRAL,
            TrafficSource.SOCIAL,
          ]),
          searchEngine: Math.random() > 0.5 ? "Google" : undefined,
          referrerDomain:
            Math.random() > 0.6
              ? getRandomElement(["twitter.com", "facebook.com", "linkedin.com", "reddit.com"])
              : undefined,
          userAgent: getRandomElement(userAgents),
          timestamp: generateRandomDate(article.datePublished || article.createdAt, new Date()),
        },
      });
      count++;
    }

    processed++;
    if (processed % 5 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `    ✓ Processed ${processed}/${publishedArticles.length} articles (${count} analytics records) - ${elapsed}s`
      );
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Seeded ${count} analytics records in ${totalTime} seconds.`);
}

async function seedFAQs(articles: Awaited<ReturnType<typeof seedArticles>>) {
  console.log("Seeding FAQs...");
  const startTime = Date.now();
  let count = 0;
  const publishedArticles = articles.filter((a) => a.status === ArticleStatus.PUBLISHED);
  let processed = 0;

  const faqTemplates = [
    { q: "ما هو {topic}؟", a: "{topic} هو {definition}." },
    { q: "كيف يمكنني استخدام {topic}؟", a: "يمكنك استخدام {topic} من خلال {method}." },
    { q: "ما هي فوائد {topic}؟", a: "من فوائد {topic} {benefits}." },
    { q: "ما هي أفضل الممارسات في {topic}؟", a: "أفضل الممارسات في {topic} تشمل {practices}." },
  ];

  console.log(`  Creating FAQs for ${publishedArticles.length} published articles...`);
  for (let idx = 0; idx < publishedArticles.length; idx++) {
    const article = publishedArticles[idx];
    const faqCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < faqCount; i++) {
      const template = getRandomElement(faqTemplates);
      const topic = article.title.split(" ")[0];
      const question = template.q.replace(/{topic}/g, topic);
      const answer = template.a
        .replace(/{topic}/g, topic)
        .replace(/{definition}/g, "أحد أهم المفاهيم في تحسين محركات البحث")
        .replace(/{method}/g, "اتباع الخطوات المذكورة في هذا المقال")
        .replace(/{benefits}/g, "تحسين ترتيب موقعك في نتائج البحث وزيادة الزيارات")
        .replace(/{practices}/g, "اتباع أفضل الممارسات المذكورة في هذا المقال");

      await db.articleFAQ.create({
        data: {
          articleId: article.id,
          question,
          answer,
          position: i + 1,
        },
      });
      count++;
    }

    processed++;
    if (processed % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `    ✓ Processed ${processed}/${publishedArticles.length} articles (${count} FAQs) - ${elapsed}s`
      );
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Seeded ${count} FAQs in ${totalTime} seconds.`);
}

async function seedRelatedArticles(articles: Awaited<ReturnType<typeof seedArticles>>) {
  console.log("Seeding related articles...");
  const startTime = Date.now();
  let count = 0;
  const publishedArticles = articles.filter((a) => a.status === ArticleStatus.PUBLISHED);
  let processed = 0;

  console.log(`  Creating relationships for ${publishedArticles.length} published articles...`);
  for (let idx = 0; idx < publishedArticles.length; idx++) {
    const article = publishedArticles[idx];
    const relatedCount = Math.floor(Math.random() * 3) + 2;
    const otherArticles = articles.filter(
      (a) =>
        a.id !== article.id &&
        a.status === ArticleStatus.PUBLISHED &&
        a.categoryId === article.categoryId
    );
    const relatedArticles = getRandomElements(
      otherArticles,
      Math.min(relatedCount, otherArticles.length)
    );

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
        },
      });
      count++;
    }

    processed++;
    if (processed % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `    ✓ Processed ${processed}/${publishedArticles.length} articles (${count} relationships) - ${elapsed}s`
      );
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Seeded ${count} related article relationships in ${totalTime} seconds.`);
}

async function seedSubscribers(clients: Awaited<ReturnType<typeof seedClients>>) {
  console.log("Seeding subscribers...");
  const startTime = Date.now();
  let count = 0;

  const firstNames = [
    "أحمد",
    "محمد",
    "علي",
    "خالد",
    "سعد",
    "فهد",
    "عمر",
    "يوسف",
    "عبدالله",
    "عبدالرحمن",
    "فاطمة",
    "مريم",
    "سارة",
    "نورا",
    "ليلى",
    "هند",
    "ريم",
    "لينا",
    "دانا",
    "سما",
  ];
  const lastNames = [
    "الخالدي",
    "العلي",
    "المحمد",
    "السعد",
    "الفهد",
    "العمر",
    "اليوسف",
    "العبدالله",
    "الرحمن",
    "الزهراني",
    "القحطاني",
    "الدوسري",
    "العتيبي",
    "الحربي",
    "الغامدي",
  ];

  console.log(`  Creating subscribers for ${clients.length} clients...`);
  for (let clientIdx = 0; clientIdx < clients.length; clientIdx++) {
    const client = clients[clientIdx];
    const subscriberCount = Math.floor(Math.random() * 15) + 10;

    for (let i = 0; i < subscriberCount; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const email = `${slugify(firstName)}.${slugify(lastName)}.${i}@example.com`;

      await db.subscriber.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          clientId: client.id,
          subscribed: Math.random() > 0.1,
          subscribedAt: generateRandomDate(
            new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            new Date()
          ),
          unsubscribedAt:
            Math.random() > 0.9
              ? generateRandomDate(
                  new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
                  new Date()
                )
              : undefined,
          consentGiven: true,
          consentDate: generateRandomDate(
            new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            new Date()
          ),
        },
      });
      count++;
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(
      `    ✓ Created ${subscriberCount} subscribers for client ${clientIdx + 1}/${
        clients.length
      }: ${client.name} (total: ${count}) - ${elapsed}s`
    );
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Seeded ${count} subscribers in ${totalTime} seconds.`);
}

async function seedSettings() {
  console.log("Seeding settings (singleton)...");

  const existingSettings = await db.settings.findFirst();

  if (existingSettings) {
    const settings = await db.settings.update({
      where: { id: existingSettings.id },
      data: {
        seoTitleMin: 30,
        seoTitleMax: 60,
        seoTitleRestrict: false,
        seoDescriptionMin: 120,
        seoDescriptionMax: 160,
        seoDescriptionRestrict: false,
        twitterTitleMax: 70,
        twitterTitleRestrict: true,
        twitterDescriptionMax: 200,
        twitterDescriptionRestrict: true,
        ogTitleMax: 60,
        ogTitleRestrict: false,
        ogDescriptionMax: 200,
        ogDescriptionRestrict: false,
        gtmContainerId: "GTM-XXXXXXX",
        gtmEnabled: true,
        hotjarSiteId: "1234567",
        hotjarEnabled: true,
        facebookUrl: "https://facebook.com/modonty",
        twitterUrl: "https://twitter.com/modonty",
        linkedInUrl: "https://linkedin.com/company/modonty",
        instagramUrl: "https://instagram.com/modonty",
        youtubeUrl: "https://youtube.com/modonty",
      },
    });
    console.log("Updated existing settings.");
    return settings;
  } else {
    const settings = await db.settings.create({
      data: {
        seoTitleMin: 30,
        seoTitleMax: 60,
        seoTitleRestrict: false,
        seoDescriptionMin: 120,
        seoDescriptionMax: 160,
        seoDescriptionRestrict: false,
        twitterTitleMax: 70,
        twitterTitleRestrict: true,
        twitterDescriptionMax: 200,
        twitterDescriptionRestrict: true,
        ogTitleMax: 60,
        ogTitleRestrict: false,
        ogDescriptionMax: 200,
        ogDescriptionRestrict: false,
        gtmContainerId: "GTM-XXXXXXX",
        gtmEnabled: true,
        hotjarSiteId: "1234567",
        hotjarEnabled: true,
        facebookUrl: "https://facebook.com/modonty",
        twitterUrl: "https://twitter.com/modonty",
        linkedInUrl: "https://linkedin.com/company/modonty",
        instagramUrl: "https://instagram.com/modonty",
        youtubeUrl: "https://youtube.com/modonty",
      },
    });
    console.log("Created new settings.");
    return settings;
  }
}

async function seedArticleVersions(articles: Awaited<ReturnType<typeof seedArticles>>) {
  console.log("Seeding article versions...");
  const startTime = Date.now();
  let count = 0;

  const articlesToVersion = getRandomElements(articles, Math.floor(articles.length * 0.4));

  console.log(`  Creating versions for ${articlesToVersion.length} articles...`);

  for (let idx = 0; idx < articlesToVersion.length; idx++) {
    const article = articlesToVersion[idx];
    const versionCount = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < versionCount; i++) {
      await db.articleVersion.create({
        data: {
          articleId: article.id,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt || undefined,
          seoTitle: article.seoTitle || undefined,
          seoDescription: article.seoDescription || undefined,
          createdAt: generateRandomDate(article.createdAt, new Date()),
        },
      });
      count++;
    }

    if ((idx + 1) % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `    ✓ Processed ${idx + 1}/${articlesToVersion.length} articles (${count} versions) - ${elapsed}s`
      );
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Seeded ${count} article versions in ${totalTime} seconds.`);
}

async function seedArticleMedia(articles: Awaited<ReturnType<typeof seedArticles>>) {
  console.log("Seeding article media gallery...");
  const startTime = Date.now();
  let count = 0;

  const articlesForGallery = getRandomElements(articles, Math.floor(articles.length * 0.45));

  console.log(`  Creating galleries for ${articlesForGallery.length} articles...`);

  for (let idx = 0; idx < articlesForGallery.length; idx++) {
    const article = articlesForGallery[idx];
    const mediaCount = Math.floor(Math.random() * 3) + 2;

    const existingMedia = await db.media.findMany({
      where: { clientId: article.clientId },
      take: mediaCount,
    });

    for (let i = 0; i < mediaCount; i++) {
      let media;
      if (existingMedia[i]) {
        media = existingMedia[i];
      } else {
        media = await db.media.create({
          data: {
            filename: `gallery-${article.slug}-${i}.jpg`,
            url: `https://images.unsplash.com/photo-${Math.floor(
              Math.random() * 1000000
            )}?w=800&h=600&fit=crop`,
            mimeType: "image/jpeg",
            fileSize: Math.floor(Math.random() * 300000) + 50000,
            width: 800,
            height: 600,
            encodingFormat: "image/jpeg",
            altText: `${article.title} - Image ${i + 1}`,
            caption: `Image ${i + 1} for ${article.title}`,
            title: `${article.title} - Image ${i + 1}`,
            clientId: article.clientId,
            type: "GENERAL",
          },
        });
      }

      await db.articleMedia.upsert({
        where: {
          articleId_mediaId: {
            articleId: article.id,
            mediaId: media.id,
          },
        },
        update: {},
        create: {
          articleId: article.id,
          mediaId: media.id,
          position: i,
          caption: `Gallery image ${i + 1} for ${article.title}`,
          altText: `${article.title} - Gallery image ${i + 1}`,
        },
      });
      count++;
    }

    if ((idx + 1) % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `    ✓ Processed ${idx + 1}/${articlesForGallery.length} articles (${count} gallery items) - ${elapsed}s`
      );
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Seeded ${count} article media gallery items in ${totalTime} seconds.`);
}

export interface SeedSummary {
  industries: number;
  clients: number;
  categories: number;
  tags: number;
  articles: {
    total: number;
    published: number;
    draft: number;
  };
}

export async function runFullSeed(options: {
  articleCount: number;
  useOpenAI: boolean;
}): Promise<SeedSummary> {
  const { articleCount, useOpenAI } = options;
  console.log("Starting comprehensive seed process via runFullSeed...");
  const startTime = Date.now();

  await clearDatabase();

  const industries = await seedIndustries();
  const clients = await seedClients(industries);
  const author = await seedAuthors();
  const categories = await seedCategories();
  const tags = await seedTags();
  const articles = await seedArticles(clients, author, categories, articleCount, useOpenAI);

  await seedArticleTags(articles, tags);
  await seedMedia(articles, clients, author);
  await seedAnalytics(articles);
  await seedFAQs(articles);
  await seedRelatedArticles(articles);
  await seedSubscribers(clients);
  await seedSettings();
  await seedArticleVersions(articles);
  await seedArticleMedia(articles);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ Comprehensive seed process completed successfully in ${duration} seconds.`);

  const publishedCount = articles.filter((a) => a.status === ArticleStatus.PUBLISHED).length;
  const draftCount = articles.filter((a) => a.status === ArticleStatus.DRAFT).length;

  return {
    industries: industries.length,
    clients: clients.length,
    categories: categories.length,
    tags: tags.length,
    articles: {
      total: articles.length,
      published: publishedCount,
      draft: draftCount,
    },
  };
}

