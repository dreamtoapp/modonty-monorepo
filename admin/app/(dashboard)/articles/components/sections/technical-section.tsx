'use client';

import { useArticleForm } from '../article-form-context';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormNativeSelect } from '@/components/admin/form-field';
import { Button } from '@/components/ui/button';

export function TechnicalSection() {
  const { formData, updateField } = useArticleForm();

  const handleAlternateLanguageChange = (
    index: number,
    field: 'hreflang' | 'url',
    value: string,
  ) => {
    const updated = [...(formData.alternateLanguages || [])];
    if (!updated[index]) {
      updated[index] = { hreflang: '', url: '' };
    }
    updated[index] = { ...updated[index], [field]: value };
    updateField('alternateLanguages', updated);
  };

  const handleRemoveAlternateLanguage = (index: number) => {
    const updated = (formData.alternateLanguages || []).filter((_, i) => i !== index);
    updateField('alternateLanguages', updated);
  };

  const handleAddAlternateLanguage = () => {
    const updated = [...(formData.alternateLanguages || []), { hreflang: '', url: '' }];
    updateField('alternateLanguages', updated);
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold mb-4">Technical SEO</h3>

        <div>
          <Label>Canonical URL</Label>
          <Input
            value={formData.canonicalUrl || ''}
            onChange={(e) => updateField('canonicalUrl', e.target.value)}
            placeholder="Will be auto-generated"
          />
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
          <Label>Alternate Languages (hreflang)</Label>
          <div className="space-y-2">
            {(formData.alternateLanguages || []).map((lang, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="hreflang (e.g., en, fr)"
                  value={lang.hreflang || ''}
                  onChange={(e) => handleAlternateLanguageChange(index, 'hreflang', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="URL"
                  value={lang.url || ''}
                  onChange={(e) => handleAlternateLanguageChange(index, 'url', e.target.value)}
                  className="flex-[2]"
                  type="url"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveAlternateLanguage(index)}
                >
                  Delete
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={handleAddAlternateLanguage}>
              Add Language
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Add alternate links for the article in other languages (hreflang)
          </p>
        </div>

        <div>
          <Label>License</Label>
          <Input
            value={formData.license || ''}
            onChange={(e) => updateField('license', e.target.value)}
            placeholder="Optional license URL"
          />
        </div>
      </CardContent>
    </Card>
  );
}
