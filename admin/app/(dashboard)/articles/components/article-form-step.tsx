'use client';

import { ReactNode } from 'react';
import { useArticleForm } from './article-form-context';

interface ArticleFormStepProps {
  step: number;
  children: ReactNode;
}

export function ArticleFormStep({ step, children }: ArticleFormStepProps) {
  const { currentStep } = useArticleForm();

  if (currentStep !== step) {
    return null;
  }

  return <div className="w-full">{children}</div>;
}
