'use client';

import { useArticleForm } from '../article-form-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormNativeSelect } from '@/components/admin/form-field';
import { CharacterCounter } from '@/components/shared/character-counter';
import { LICENSE_OPTIONS } from '@/lib/constants/licenses';

export function SettingsStep() {
  const { formData, updateField, authors } = useArticleForm();

  return (
    <div className="space-y-4">
      {/* Publication Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Publication Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={formData.featured || false}
              onCheckedChange={(checked) => updateField('featured', checked)}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured
            </Label>
            {formData.featured && (
              <Badge variant="default" className="ml-2">
                Enabled
              </Badge>
            )}
          </div>

          <div>
            <Label>Scheduled At</Label>
            <input
              type="datetime-local"
              value={
                formData.scheduledAt
                  ? new Date(formData.scheduledAt).toISOString().slice(0, 16)
                  : ''
              }
              onChange={(e) =>
                updateField('scheduledAt', e.target.value ? new Date(e.target.value) : null)
              }
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <Label>Author</Label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <span className="text-sm font-medium">Modonty</span>
              <span className="text-xs text-muted-foreground">(Only author)</span>
            </div>
            <input
              type="hidden"
              name="authorId"
              value={authors[0]?.id || formData.authorId || ''}
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO Basics */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>SEO Title</Label>
            <Input
              value={formData.seoTitle || ''}
              onChange={(e) => updateField('seoTitle', e.target.value)}
              placeholder="Optimized title for search engines (50-60 characters)"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Optimize for 50-60 characters for better search visibility
              </p>
              <CharacterCounter current={(formData.seoTitle || '').length} max={60} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>SEO Description</Label>
            <Textarea
              value={formData.seoDescription || ''}
              onChange={(e) => updateField('seoDescription', e.target.value)}
              placeholder="Meta description for search results (150-160 characters)"
              rows={3}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Optimize for 150-160 characters for better search visibility
              </p>
              <CharacterCounter current={(formData.seoDescription || '').length} max={160} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Canonical URL</Label>
            <Input
              value={formData.canonicalUrl || ''}
              onChange={(e) => updateField('canonicalUrl', e.target.value)}
              placeholder="https://example.com/articles/your-article"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to auto-generate from article slug
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Technical SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Technical SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <FormNativeSelect
              label="Meta Robots"
              name="metaRobots"
              value={formData.metaRobots || 'index, follow'}
              onChange={(e) => updateField('metaRobots', e.target.value)}
            >
              <option value="index, follow">index, follow</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </FormNativeSelect>
          </div>

          <div>
            <Label>Sitemap Priority</Label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={formData.sitemapPriority || 0.5}
              onChange={(e) =>
                updateField('sitemapPriority', parseFloat(e.target.value) || 0.5)
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.featured ? '0.8 (Featured)' : '0.5 (Normal)'}
            </p>
          </div>

          <div>
            <FormNativeSelect
              label="Sitemap Change Frequency"
              name="sitemapChangeFreq"
              value={formData.sitemapChangeFreq || 'weekly'}
              onChange={(e) => updateField('sitemapChangeFreq', e.target.value)}
            >
              <option value="always">always</option>
              <option value="hourly">hourly</option>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
              <option value="yearly">yearly</option>
              <option value="never">never</option>
            </FormNativeSelect>
          </div>

          <div>
            <FormNativeSelect
              label="License"
              name="license"
              value={formData.license || ''}
              onChange={(e) => updateField('license', e.target.value)}
            >
              {LICENSE_OPTIONS.map((license) => (
                <option key={license.value} value={license.value}>
                  {license.label}
                </option>
              ))}
            </FormNativeSelect>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
