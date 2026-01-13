import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { Article } from "../helpers/article-view-types";

interface ArticleViewFaqsProps {
  article: Article;
  sectionRef: (el: HTMLElement | null) => void;
}

export function ArticleViewFaqs({ article, sectionRef }: ArticleViewFaqsProps) {
  if (!article.faqs || article.faqs.length === 0) return null;

  return (
    <Card id="section-faqs" ref={sectionRef} className="scroll-mt-20">
      <CardHeader className="text-right" dir="rtl">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <CardTitle className="text-right">Frequently Asked Questions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-right" dir="rtl">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="text-xs font-mono font-normal px-1.5 py-0 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
            article.faqs
          </Badge>
        </div>
        {article.faqs.map((faq, index) => (
          <div key={faq.id} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
            <div className="text-base font-semibold flex items-start gap-2  text-right">
              <span className="text-primary mt-0.5 shrink-0">س{index + 1}:</span>
              <span>{faq.question}</span>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap text-right" dir="rtl">
              {faq.answer}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
