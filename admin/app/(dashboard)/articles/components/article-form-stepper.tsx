'use client';

import { useArticleForm } from './article-form-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEP_CONFIG = [
  { number: 1, label: 'Basic', id: 'basic' },
  { number: 2, label: 'Content', id: 'content' },
  { number: 3, label: 'SEO', id: 'seo' },
  { number: 4, label: 'Media', id: 'media' },
  { number: 5, label: 'FAQs', id: 'faqs' },
  { number: 6, label: 'Settings', id: 'settings' },
  { number: 7, label: 'All Fields', id: 'all-fields' },
];

export function ArticleFormStepper() {
  const { currentStep, goToStep, totalSteps } = useArticleForm();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEP_CONFIG.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isLast = index === STEP_CONFIG.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToStep(step.number)}
                  className={cn(
                    'h-10 w-10 rounded-full p-0 relative',
                    isActive && 'bg-primary text-primary-foreground',
                    isCompleted && 'bg-primary/20 text-primary',
                    !isActive && !isCompleted && 'bg-muted text-muted-foreground hover:bg-muted/80',
                  )}
                  aria-label={`Go to step ${step.number}: ${step.label}`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </Button>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    isActive && 'text-primary',
                    isCompleted && 'text-muted-foreground',
                    !isActive && !isCompleted && 'text-muted-foreground/60',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <Separator
                  className={cn(
                    'mx-2 h-0.5 flex-1 max-w-[100px]',
                    isCompleted ? 'bg-primary' : 'bg-muted',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
