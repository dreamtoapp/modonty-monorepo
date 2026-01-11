import { notFound } from 'next/navigation';
import { BasicSection } from '../../../components/sections/basic-section';
import { ContentSection } from '../../../components/sections/content-section';
import { MetaSection } from '../../../components/sections/meta-section';
import { SEOSection } from '../../../components/sections/seo-section';
import { MediaSection } from '../../../components/sections/media-section';
import { TagsFAQSection } from '../../../components/sections/tags-faq-section';
import { SEOValidationSection } from '../../../components/sections/seo-validation-section';
import { JsonLdSection } from '../../../components/sections/jsonld-section';

const SECTIONS: Record<string, React.ComponentType> = {
  basic: BasicSection,
  content: ContentSection,
  meta: MetaSection,
  seo: SEOSection,
  media: MediaSection,
  tags: TagsFAQSection,
  'seo-validation': SEOValidationSection,
  jsonld: JsonLdSection,
};

export default async function SectionPage({ params }: { params: Promise<{ id: string; section: string }> }) {
  const { section } = await params;

  const SectionComponent = SECTIONS[section];

  if (!SectionComponent) {
    notFound();
  }

  return <SectionComponent />;
}
