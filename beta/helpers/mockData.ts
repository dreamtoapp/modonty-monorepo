export interface Author {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  title?: string;
  excerpt?: string;
  image?: string;
  publishedAt: Date;
  likes: number;
  dislikes: number;
  comments: number;
  favorites: number;
  clientName: string;
  clientSlug: string;
  slug: string;
  status: "published" | "draft";
}

export type Article = Post;

export interface Client {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
}

export const mockAuthors: Author[] = [
  {
    id: "1",
    name: "سارة أحمد",
    title: "مهندسة برمجيات أولى",
    company: "حلول التقنية المتقدمة",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "2",
    name: "محمد العلي",
    title: "مطور رئيسي",
    company: "حلول التقنية المتقدمة",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    id: "3",
    name: "فاطمة الزهراني",
    title: "مديرة تصميم تجربة المستخدم",
    company: "استوديو التصميم المحترف",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    id: "4",
    name: "خالد الدوسري",
    title: "مصمم منتجات",
    company: "استوديو التصميم المحترف",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: "5",
    name: "نورا القحطاني",
    title: "مديرة تسويق المحتوى",
    company: "مركز التسويق الرقمي",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
  },
  {
    id: "6",
    name: "عبدالله السعيد",
    title: "أخصائي تحسين محركات البحث",
    company: "مركز التسويق الرقمي",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
  },
  {
    id: "7",
    name: "ريم العتيبي",
    title: "استراتيجية الابتكار",
    company: "مختبرات الابتكار",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
  },
  {
    id: "8",
    name: "يوسف الحربي",
    title: "مدير الأبحاث",
    company: "مختبرات الابتكار",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
];

export const mockClients: Client[] = [
  {
    id: "1",
    name: "حلول التقنية المتقدمة",
    slug: "techcorp-solutions",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=TechCorp",
  },
  {
    id: "2",
    name: "استوديو التصميم المحترف",
    slug: "design-studio-pro",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=DesignStudio",
  },
  {
    id: "3",
    name: "مركز التسويق الرقمي",
    slug: "digital-marketing-hub",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=MarketingHub",
  },
  {
    id: "4",
    name: "مختبرات الابتكار",
    slug: "innovation-labs",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=InnovationLabs",
  },
];

export const mockPosts: Post[] = [
  {
    id: "1",
    author: mockAuthors[0],
    title: "مستقبل تطوير الويب: الاتجاهات التي يجب متابعتها في 2025",
    content:
      "أنا متحمسة لمشاركة بعض الأفكار حول أحدث الاتجاهات التي تشكل تطوير الويب. من مكونات الخادم إلى الأدوات المدعومة بالذكاء الاصطناعي، المشهد يتطور بسرعة. إليك ما يجب على المطورين متابعته في 2025.",
    excerpt:
      "استكشف أحدث الاتجاهات التي تشكل تطوير الويب، من مكونات الخادم إلى الأدوات المدعومة بالذكاء الاصطناعي. اكتشف ما ينتظر المطورين.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    slug: "future-of-web-development-2025",
    clientName: "حلول التقنية المتقدمة",
    clientSlug: "techcorp-solutions",
    publishedAt: new Date("2025-01-15T10:30:00"),
    likes: 124,
    dislikes: 8,
    comments: 18,
    favorites: 32,
    status: "published",
  },
  {
    id: "2",
    author: mockAuthors[1],
    title: "بناء تطبيقات React قابلة للتوسع باستخدام Next.js 16",
    content:
      "لقد انتهيت للتو من دراسة عميقة لميزات Next.js 16 الجديدة. التحسينات في مكونات الخادم وتكامل React 19 هي تغييرات جذرية. إليك أفضل الممارسات التي تعلمتها لبناء تطبيقات قابلة للتوسع.",
    excerpt:
      "تعلم كيفية الاستفادة من ميزات Next.js 16 الجديدة لبناء تطبيقات React عالية الأداء وقابلة للتوسع. يتضمن أفضل الممارسات والأنماط.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    slug: "scalable-react-applications-nextjs-16",
    clientName: "حلول التقنية المتقدمة",
    clientSlug: "techcorp-solutions",
    publishedAt: new Date("2025-01-10T14:20:00"),
    likes: 89,
    dislikes: 5,
    comments: 12,
    favorites: 21,
    status: "published",
  },
  {
    id: "3",
    author: mockAuthors[2],
    title: "مبادئ تصميم واجهة المستخدم الحديثة لعام 2025",
    content:
      "التصميم يتطور، و2025 يجلب مبادئ جديدة تعطي الأولوية لتجربة المستخدم وإمكانية الوصول. من البساطة إلى التصميم الشامل، إليك ما يشكل مستقبل واجهة المستخدم.",
    excerpt:
      "اكتشف مبادئ التصميم الرئيسية التي ستشكل واجهات المستخدم في 2025. من البساطة إلى إمكانية الوصول، نغطي كل شيء.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    slug: "modern-ui-design-principles-2025",
    clientName: "استوديو التصميم المحترف",
    clientSlug: "design-studio-pro",
    publishedAt: new Date("2025-01-12T09:15:00"),
    likes: 156,
    dislikes: 12,
    comments: 24,
    favorites: 45,
    status: "published",
  },
  {
    id: "4",
    author: mockAuthors[3],
    title: "إنشاء تجارب ويب قابلة للوصول",
    content:
      "إمكانية الوصول ليست اختيارية—إنها ضرورية. لقد جمعت دليلاً شاملاً يغطي إرشادات WCAG وخصائص ARIA وممارسات التصميم الشامل التي يجب أن يعرفها كل مطور.",
    excerpt:
      "دليل شامل لبناء تطبيقات ويب قابلة للوصول. تعرف على إرشادات WCAG وخصائص ARIA وممارسات التصميم الشامل.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop",
    slug: "creating-accessible-web-experiences",
    clientName: "استوديو التصميم المحترف",
    clientSlug: "design-studio-pro",
    publishedAt: new Date("2025-01-08T16:45:00"),
    likes: 203,
    dislikes: 15,
    comments: 31,
    favorites: 58,
    status: "published",
  },
  {
    id: "5",
    author: mockAuthors[4],
    title: "استراتيجيات تسويق المحتوى التي تحقق النتائج",
    content:
      "بعد تحليل مئات الحملات، حددت استراتيجيات تسويق المحتوى التي تحقق النتائج باستمرار. إليك ما يعمل في 2025 وكيفية تطبيقه.",
    excerpt:
      "استراتيجيات تسويق محتوى فعالة تساعد الشركات على نمو حضورها عبر الإنترنت والتفاعل مع جمهورها المستهدف.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    slug: "content-marketing-strategies-drive-results",
    clientName: "مركز التسويق الرقمي",
    clientSlug: "digital-marketing-hub",
    publishedAt: new Date("2025-01-14T11:00:00"),
    likes: 167,
    dislikes: 9,
    comments: 19,
    favorites: 38,
    status: "published",
  },
  {
    id: "6",
    author: mockAuthors[5],
    title: "أفضل ممارسات SEO للمواقع الحديثة",
    content:
      "SEO يستمر في التطور، والبقاء في المقدمة يتطلب فهم كل من التحسين التقني ومحتوى المحتوى. إليك أفضل الممارسات الأكثر أهمية في 2025.",
    excerpt:
      "ابق في المقدمة مع أحدث تقنيات وممارسات SEO. تعلم كيفية تحسين موقعك لمحركات البحث في 2025.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2f40c?w=800&h=400&fit=crop",
    slug: "seo-best-practices-modern-websites",
    clientName: "مركز التسويق الرقمي",
    clientSlug: "digital-marketing-hub",
    publishedAt: new Date("2025-01-06T13:30:00"),
    likes: 142,
    dislikes: 7,
    comments: 22,
    favorites: 29,
    status: "published",
  },
  {
    id: "7",
    author: mockAuthors[6],
    title: "دور الذكاء الاصطناعي في ابتكار الأعمال",
    content:
      "الذكاء الاصطناعي يحول الشركات عبر الصناعات. من الأتمتة إلى اتخاذ القرارات، إليك أمثلة من العالم الحقيقي واستراتيجيات التنفيذ التي تقود الابتكار.",
    excerpt:
      "كيف يحول الذكاء الاصطناعي الشركات عبر الصناعات. أمثلة من العالم الحقيقي واستراتيجيات التنفيذ.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
    slug: "role-of-ai-in-business-innovation",
    clientName: "مختبرات الابتكار",
    clientSlug: "innovation-labs",
    publishedAt: new Date("2025-01-13T08:20:00"),
    likes: 198,
    dislikes: 11,
    comments: 28,
    favorites: 52,
    status: "published",
  },
  {
    id: "8",
    author: mockAuthors[7],
    title: "بناء ثقافة الابتكار",
    content:
      "الابتكار لا يحدث بالصدفة. يتطلب ثقافة مدروسة تشجع الإبداع والتجريب. إليك كيفية تعزيز الابتكار داخل مؤسستك.",
    excerpt:
      "تعلم كيفية تعزيز الابتكار داخل مؤسستك. استراتيجيات لتشجيع الإبداع ودفع التغيير الهادف.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    slug: "building-culture-of-innovation",
    clientName: "مختبرات الابتكار",
    clientSlug: "innovation-labs",
    publishedAt: new Date("2025-01-05T15:10:00"),
    likes: 175,
    dislikes: 10,
    comments: 26,
    favorites: 41,
    status: "published",
  },
  {
    id: "9",
    author: mockAuthors[0],
    title: "أفضل ممارسات TypeScript لقواعد الكود الكبيرة",
    content:
      "العمل مع قواعد كود TypeScript الكبيرة يتطلب أنماطاً وممارسات محددة. إليك الاستراتيجيات الأساسية للحفاظ على سلامة الأنواع وتنظيم الكود على نطاق واسع.",
    excerpt:
      "أنماط وممارسات TypeScript الأساسية للحفاظ على التطبيقات واسعة النطاق. سلامة الأنواع، تنظيم الكود، والمزيد.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    slug: "typescript-best-practices-large-codebases",
    clientName: "حلول التقنية المتقدمة",
    clientSlug: "techcorp-solutions",
    publishedAt: new Date("2025-01-03T10:00:00"),
    likes: 134,
    dislikes: 6,
    comments: 15,
    favorites: 27,
    status: "published",
  },
  {
    id: "10",
    author: mockAuthors[2],
    title: "أنظمة التصميم: بناء واجهات مستخدم متسقة",
    content:
      "أنظمة التصميم هي أساس تجارب المستخدم المتسقة. إليك كيفية إنشاء وصيانة أنظمة التصميم التي تضمن الاتساق عبر منتجاتك.",
    excerpt:
      "كيفية إنشاء وصيانة أنظمة التصميم التي تضمن الاتساق عبر منتجاتك. الأدوات والعمليات وأفضل الممارسات.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    slug: "design-systems-building-consistent-uis",
    clientName: "استوديو التصميم المحترف",
    clientSlug: "design-studio-pro",
    publishedAt: new Date("2025-01-01T12:00:00"),
    likes: 189,
    dislikes: 13,
    comments: 21,
    favorites: 43,
    status: "published",
  },
  {
    id: "11",
    author: mockAuthors[4],
    title: "تسويق وسائل التواصل الاجتماعي في عصر الذكاء الاصطناعي",
    content:
      "أدوات الذكاء الاصطناعي تحدث ثورة في تسويق وسائل التواصل الاجتماعي. من الأتمتة إلى التخصيص، إليك كيفية الاستفادة من الذكاء الاصطناعي لتعزيز جهودك التسويقية ودفع التفاعل.",
    excerpt:
      "استفد من أدوات الذكاء الاصطناعي لتعزيز جهودك في تسويق وسائل التواصل الاجتماعي. الأتمتة والتخصيص واستراتيجيات التفاعل.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
    slug: "social-media-marketing-age-of-ai",
    clientName: "مركز التسويق الرقمي",
    clientSlug: "digital-marketing-hub",
    publishedAt: new Date("2024-12-28T14:30:00"),
    likes: 211,
    dislikes: 14,
    comments: 33,
    favorites: 61,
    status: "published",
  },
  {
    id: "12",
    author: mockAuthors[6],
    title: "التقنية المستدامة: البناء للمستقبل",
    content:
      "شركات التقنية لديها مسؤولية لتقليل التأثير البيئي. إليك كيفية بناء حلول مبتكرة مع إعطاء الأولوية للاستدامة من أجل الغد.",
    excerpt:
      "استكشاف كيفية تقليل شركات التقنية لتأثيرها البيئي أثناء بناء حلول مبتكرة للغد.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop",
    slug: "sustainable-technology-building-future",
    clientName: "مختبرات الابتكار",
    clientSlug: "innovation-labs",
    publishedAt: new Date("2024-12-25T09:00:00"),
    likes: 245,
    dislikes: 16,
    comments: 42,
    favorites: 72,
    status: "published",
  },
];

export function getPublishedPosts(): Post[] {
  return mockPosts
    .filter((post) => post.status === "published")
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "الآن";
  } else if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? "دقيقة" : "دقائق"}`;
  } else if (diffInHours < 24) {
    return `منذ ${diffInHours} ${diffInHours === 1 ? "ساعة" : "ساعات"}`;
  } else if (diffInDays === 1) {
    return "منذ يوم واحد";
  } else if (diffInDays < 7) {
    return `منذ ${diffInDays} ${diffInDays === 2 ? "يومين" : diffInDays < 11 ? "أيام" : "يوم"}`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `منذ ${weeks} ${weeks === 1 ? "أسبوع" : weeks === 2 ? "أسبوعين" : "أسابيع"}`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `منذ ${months} ${months === 1 ? "شهر" : months === 2 ? "شهرين" : "أشهر"}`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `منذ ${years} ${years === 1 ? "سنة" : years === 2 ? "سنتين" : "سنوات"}`;
  }
}

export interface AnalyticsStats {
  totalBlogs: number;
  totalReactions: number;
  averageEngagement: number;
}

export interface CategoryStat {
  name: string;
  slug: string;
  count: number;
}

function getCategoryFromClient(clientName: string): string {
  const categoryMap: Record<string, string> = {
    "حلول التقنية المتقدمة": "تقنية",
    "استوديو التصميم المحترف": "تصميم",
    "مركز التسويق الرقمي": "تسويق",
    "مختبرات الابتكار": "ابتكار",
  };
  return categoryMap[clientName] || "أخرى";
}

export function getAnalyticsStats(): AnalyticsStats {
  const posts = getPublishedPosts();
  const totalBlogs = posts.length;
  const totalReactions = posts.reduce(
    (sum, post) => sum + post.likes + post.comments,
    0
  );
  const averageEngagement =
    totalBlogs > 0 ? Math.round(totalReactions / totalBlogs) : 0;

  return {
    totalBlogs,
    totalReactions,
    averageEngagement,
  };
}

export function getCategoryStats(): CategoryStat[] {
  const posts = getPublishedPosts();
  const categoryCounts: Record<string, number> = {};

  posts.forEach((post) => {
    const category = getCategoryFromClient(post.clientName);
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const slugMap: Record<string, string> = {
    "تقنية": "technology",
    "تصميم": "design",
    "تسويق": "marketing",
    "ابتكار": "innovation",
    "أخرى": "other",
  };

  return Object.entries(categoryCounts)
    .map(([name, count]) => ({ 
      name, 
      slug: slugMap[name] || name.toLowerCase(),
      count 
    }))
    .sort((a, b) => b.count - a.count);
}

export function getCategoryAnalytics(categoryName: string): AnalyticsStats {
  const mockCategoryData: Record<string, AnalyticsStats> = {
    تقنية: {
      totalBlogs: 4,
      totalReactions: 500,
      averageEngagement: 125,
    },
    تصميم: {
      totalBlogs: 3,
      totalReactions: 400,
      averageEngagement: 133,
    },
    تسويق: {
      totalBlogs: 3,
      totalReactions: 350,
      averageEngagement: 117,
    },
    ابتكار: {
      totalBlogs: 2,
      totalReactions: 300,
      averageEngagement: 150,
    },
  };

  return (
    mockCategoryData[categoryName] || {
      totalBlogs: 0,
      totalReactions: 0,
      averageEngagement: 0,
    }
  );
}
