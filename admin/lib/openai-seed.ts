import OpenAI from "openai";

export interface OpenAIArticleData {
  content: string;
  excerpt: string;
  wordCount: number;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
}

const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
const temperature = process.env.OPENAI_TEMPERATURE
  ? Number(process.env.OPENAI_TEMPERATURE)
  : 0.2;

let client: OpenAI | null = null;

function getClient() {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export async function generateArticleWithOpenAI(params: {
  title: string;
  category: string;
  length: "short" | "medium" | "long";
  language: "ar";
}): Promise<OpenAIArticleData> {
  const { title, category, length, language } = params;
  const client = getClient();

  const targetWordCount =
    length === "short" ? 400 : length === "medium" ? 900 : 1500;

  const prompt = `
أنت كاتب محتوى SEO خبير تكتب مقالات باللغة ${language}.

اكتب مقالاً كاملاً عن العنوان التالي:
عنوان المقال: "${title}"
التصنيف: "${category}"
الطول المطلوب: ${length} (${targetWordCount} كلمة تقريباً)

أريد منك أن تُرجع JSON فقط، بدون أي نص آخر، بالشكل التالي:
{
  "content": "محتوى المقال الكامل بصيغة Markdown...",
  "excerpt": "ملخص قصير للمقال بطول 130-170 حرفاً...",
  "wordCount": 1234,
  "seoTitle": "عنوان SEO من 40-60 حرفاً...",
  "seoDescription": "وصف SEO من 130-170 حرفاً...",
  "keywords": ["كلمة 1", "كلمة 2", "كلمة 3"],
  "faqs": [
    { "question": "سؤال 1؟", "answer": "إجابة مفصلة 1..." },
    { "question": "سؤال 2؟", "answer": "إجابة مفصلة 2..." }
  ]
}

يرجى الالتزام الصارم بصيغة JSON الصحيحة فقط بدون تعليقات أو نص خارج JSON.
`;

  const response = await client.chat.completions.create({
    model,
    temperature,
    messages: [
      {
        role: "system",
        content:
          "You are an expert Arabic SEO content writer. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "";
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse OpenAI JSON response for article generation.");
  }

  const content: string = parsed.content || "";
  const excerpt: string = parsed.excerpt || "";
  const seoTitle: string = parsed.seoTitle || title;
  const seoDescription: string = parsed.seoDescription || excerpt;
  const keywords: string[] = Array.isArray(parsed.keywords) ? parsed.keywords : [];
  const faqs: { question: string; answer: string }[] = Array.isArray(parsed.faqs)
    ? parsed.faqs
    : [];

  const wordCount =
    typeof parsed.wordCount === "number" && parsed.wordCount > 0
      ? parsed.wordCount
      : content.split(/\s+/).filter(Boolean).length;

  if (!content || !excerpt) {
    throw new Error("OpenAI article response missing content or excerpt.");
  }

  return {
    content,
    excerpt,
    wordCount,
    seoTitle,
    seoDescription,
    keywords,
    faqs,
  };
}

