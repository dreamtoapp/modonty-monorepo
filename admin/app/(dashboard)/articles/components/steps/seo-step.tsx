'use client';

import { SEOSection } from '../sections/seo-section';
import { SocialSection } from '../sections/social-section';

export function SEOStep() {
  return (
    <div className="space-y-6">
      <SEOSection />
      <SocialSection />
    </div>
  );
}
