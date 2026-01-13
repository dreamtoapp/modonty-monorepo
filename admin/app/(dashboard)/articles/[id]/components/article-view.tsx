"use client";

import { useRef, useState, useMemo } from "react";
import { Article } from "../helpers/article-view-types";
import { useContentStats } from "../helpers/use-content-stats";
import { getArticleSections } from "../helpers/sections";
import { useIntersectionObserver } from "../helpers/use-intersection-observer";
import { scrollToSection, createSectionRefHandler } from "../helpers/scroll-utils";
import { ArticleViewHeader } from "./article-view-header";
import { ArticleViewNavigation } from "./article-view-navigation";
import { ArticleViewFeaturedImage } from "./article-view-featured-image";
import { ArticleViewContent } from "./article-view-content";
import { ArticleViewFaqs } from "./article-view-faqs";
import { ArticleViewRelated } from "./article-view-related";
import { ArticleViewRelatedFrom } from "./article-view-related-from";
import { ArticleViewGallery } from "./article-view-gallery";
import { ArticleViewInfo } from "./article-view-info";
import { ArticleViewSeo } from "./article-view-seo";
import { ArticleViewSocial } from "./article-view-social";
import { ArticleViewStructuredData } from "./article-view-structured-data";
import { ArticleViewNextjsMetadata } from "./article-view-nextjs-metadata";
import { ArticleViewUnusedFields } from "./article-view-unused-fields";

interface ArticleViewProps {
  article: Article;
}

export function ArticleView({ article }: ArticleViewProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const contentStats = useContentStats(article);

  const sections = useMemo(() => getArticleSections(article), [article]);

  useIntersectionObserver({
    sections,
    sectionRefs,
    onSectionChange: setActiveSection,
  });

  const handleScrollToSection = (sectionId: string) => {
    scrollToSection(sectionId, sectionRefs.current);
  };

  const getSectionRef = (sectionId: string) => {
    return createSectionRefHandler(sectionRefs, sectionId);
  };

  return (
    <div className="space-y-8">
      <ArticleViewHeader article={article} />

      <ArticleViewNavigation
        sections={sections}
        activeSection={activeSection}
        onSectionClick={handleScrollToSection}
      />

      <ArticleViewFeaturedImage
        article={article}
        sectionRef={getSectionRef("section-featured-image")}
      />

      <div className="flex flex-col gap-6">
        <ArticleViewContent
          article={article}
          contentStats={contentStats}
          sectionRef={getSectionRef("section-content")}
        />

        <ArticleViewFaqs article={article} sectionRef={getSectionRef("section-faqs")} />

        <ArticleViewRelated
          article={article}
          sectionRef={getSectionRef("section-related")}
        />

        <ArticleViewRelatedFrom
          article={article}
          sectionRef={getSectionRef("section-related-from")}
        />

        <ArticleViewGallery
          article={article}
          sectionRef={getSectionRef("section-gallery")}
        />

        <ArticleViewInfo
          article={article}
          contentStats={contentStats}
          sectionRef={getSectionRef("section-info")}
        />

        <ArticleViewSeo article={article} sectionRef={getSectionRef("section-seo")} />

        <ArticleViewSocial
          article={article}
          sectionRef={getSectionRef("section-social")}
        />

        <ArticleViewStructuredData
          article={article}
          sectionRef={getSectionRef("section-structured-data")}
        />

        <ArticleViewNextjsMetadata
          article={article}
          sectionRef={getSectionRef("section-nextjs-metadata")}
        />

        <ArticleViewUnusedFields
          article={article}
          sectionRef={getSectionRef("section-unused-fields")}
        />
      </div>
    </div>
  );
}
