'use client';

import { useArticleForm } from '../article-form-context';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CharacterCounter } from '@/components/shared/character-counter';
import { SEOPreviewCard } from '../seo-preview-card';
import { validateSEOTitle, validateSEODescription } from '../../helpers/seo-helpers';
import { useMemo } from 'react';

export function SEOSection() {
  const { formData, updateField, errors } = useArticleForm();

  const seoTitleValidation = useMemo(
    () => validateSEOTitle(formData.seoTitle || ''),
    [formData.seoTitle],
  );
  const seoDescriptionValidation = useMemo(
    () => validateSEODescription(formData.seoDescription || ''),
    [formData.seoDescription],
  );

  const isTitleValid = seoTitleValidation.valid;
  const isDescriptionValid = seoDescriptionValidation.valid;

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>SEO Title</Label>
            {seoTitleValidation.message && (
              <p className={`text-xs ${
                isTitleValid ? 'text-muted-foreground' : 'text-amber-600 dark:text-amber-500'
              }`}>
                {seoTitleValidation.message}
              </p>
            )}
          </div>
          <Input
            value={formData.seoTitle || ''}
            onChange={(e) => updateField('seoTitle', e.target.value)}
            placeholder="Will be auto-generated from title"
            className={!isTitleValid && formData.seoTitle ? 'border-destructive' : ''}
          />
          <div className="flex justify-between items-center mt-1.5">
            <p className="text-xs text-muted-foreground">
              Optimize for 50-60 characters for better search visibility
            </p>
            <CharacterCounter current={(formData.seoTitle || '').length} max={60} />
          </div>
          {errors.seoTitle && (
            <p className="text-xs text-destructive mt-1">{errors.seoTitle[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>SEO Description</Label>
            {seoDescriptionValidation.message && (
              <p className={`text-xs ${
                isDescriptionValid ? 'text-muted-foreground' : 'text-amber-600 dark:text-amber-500'
              }`}>
                {seoDescriptionValidation.message}
              </p>
            )}
          </div>
          <Textarea
            value={formData.seoDescription || ''}
            onChange={(e) => updateField('seoDescription', e.target.value)}
            placeholder="Will be auto-generated from excerpt"
            rows={3}
            className={!isDescriptionValid && formData.seoDescription ? 'border-destructive' : ''}
          />
          <div className="flex justify-between items-center mt-1.5">
            <p className="text-xs text-muted-foreground">
              Optimize for 150-160 characters for better search visibility
            </p>
            <CharacterCounter
              current={(formData.seoDescription || '').length}
              max={160}
            />
          </div>
          {errors.seoDescription && (
            <p className="text-xs text-destructive mt-1">{errors.seoDescription[0]}</p>
          )}
        </div>

        {(formData.seoTitle || formData.title) && (
          <div className="border-t pt-6">
            <Label className="mb-4 block">Search Preview</Label>
            <SEOPreviewCard
              title={formData.seoTitle || formData.title}
              description={formData.seoDescription || formData.excerpt || ''}
              url={formData.canonicalUrl || `/articles/${formData.slug}`}
              image={''}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
