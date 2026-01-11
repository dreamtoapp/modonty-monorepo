'use client';

import { useArticleForm } from './article-form-context';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import { ArticleFormStepper } from './article-form-stepper';

export function ArticleFormNavigation() {
  const {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    canGoNext,
    canGoPrevious,
    save,
    isSaving,
  } = useArticleForm();

  return (
    <TooltipProvider>
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto max-w-6xl px-4 py-2">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* Left: Previous + Counter + Next */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={previousStep}
                    disabled={!canGoPrevious}
                    className="h-8 w-8"
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Previous</TooltipContent>
              </Tooltip>
              <span className="text-xs text-muted-foreground font-medium">
                {currentStep}/{totalSteps}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextStep}
                    disabled={!canGoNext}
                    className="h-8 w-8"
                    aria-label="Next step"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Next</TooltipContent>
              </Tooltip>
            </div>

            {/* Center: Stepper */}
            <div className="flex justify-center">
              <ArticleFormStepper />
            </div>

            {/* Right: Save */}
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={save}
                    disabled={isSaving}
                    className="h-8 w-8"
                    aria-label="Save article"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isSaving ? 'Saving...' : 'Save'}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
