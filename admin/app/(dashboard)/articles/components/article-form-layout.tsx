'use client';

import { usePathname } from 'next/navigation';
import { useArticleForm } from './article-form-context';
import { ArticleFormHeader } from './article-form-header';

export function ArticleFormLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { formData, save, isSaving, isDirty, mode } = useArticleForm();

  // Extract current section from pathname
  const currentSection = pathname?.split('/').pop() || 'basic';

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-1.75rem)] bg-background -m-6">
      {/* Header with Sidebar Navigation */}
      <ArticleFormHeader
        currentSection={currentSection}
        mode={mode}
        title={mode === 'edit' ? formData.title : undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-8">{children}</div>
      </main>
    </div>
  );
}
