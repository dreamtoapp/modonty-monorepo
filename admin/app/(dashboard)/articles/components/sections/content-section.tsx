'use client';

import { useArticleForm } from '../article-form-context';
import { Card, CardContent } from '@/components/ui/card';
import { RichTextEditor } from '../rich-text-editor';
import { Label } from '@/components/ui/label';
import {
  calculateWordCount,
  calculateReadingTime,
  determineContentDepth,
} from '../../helpers/seo-helpers';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

export function ContentSection() {
  const { formData, updateField } = useArticleForm();

  // Calculate content stats
  const wordCount = useMemo(
    () => calculateWordCount(formData.content || ''),
    [formData.content],
  );
  const readingTime = useMemo(() => calculateReadingTime(wordCount), [wordCount]);
  const contentDepth = useMemo(() => determineContentDepth(wordCount), [wordCount]);

  const depthLabel =
    contentDepth === 'short' ? 'Short' : contentDepth === 'medium' ? 'Medium' : 'Long';
  const depthColor =
    contentDepth === 'short'
      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      : contentDepth === 'medium'
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div>
          <Label>Content</Label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => updateField('content', content)}
            placeholder="Start writing content..."
          />
        </div>

        {/* Content Stats */}
        {formData.content && (
          <div className="border-t pt-6 space-y-4">
            <Label className="text-sm font-medium">Content Statistics</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col p-4 bg-muted/30 rounded-lg">
                <span className="text-xs text-muted-foreground mb-1">Word Count</span>
                <span className="text-2xl font-semibold">{wordCount}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {wordCount < 300
                    ? 'Short content (less than 300 words)'
                    : wordCount < 1000
                      ? 'Medium content (300-1000 words)'
                      : 'Long content (more than 1000 words)'}
                </span>
              </div>

              <div className="flex flex-col p-4 bg-muted/30 rounded-lg">
                <span className="text-xs text-muted-foreground mb-1">Reading Time</span>
                <span className="text-2xl font-semibold">{readingTime}</span>
                <span className="text-xs text-muted-foreground mt-1">minutes</span>
              </div>

              <div className="flex flex-col p-4 bg-muted/30 rounded-lg">
                <span className="text-xs text-muted-foreground mb-1">Content Depth</span>
                <Badge className={`w-fit ${depthColor} border-0`}>{depthLabel}</Badge>
                <span className="text-xs text-muted-foreground mt-1">
                  {contentDepth === 'short'
                    ? 'Add more content'
                    : contentDepth === 'medium'
                      ? 'Balanced content'
                      : 'Comprehensive and detailed content'}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
