'use client';

import { TechnicalSEOGuidance } from './technical-seo-guidance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Settings } from 'lucide-react';
import { useState } from 'react';
import { useArticleForm } from '../article-form-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormNativeSelect } from '@/components/admin/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export function TechnicalSection() {
  const { formData, updateField } = useArticleForm();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main SEO Guidance Component */}
      <TechnicalSEOGuidance />

      {/* Advanced Settings (Collapsible) */}
      <Card>
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <CardTitle className="text-base">Advanced Settings</CardTitle>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    advancedOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>OG Article Published Time</strong> will be automatically set when you publish the article.
                </AlertDescription>
              </Alert>

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
                <Label>License</Label>
                <Input
                  value={formData.license || ''}
                  onChange={(e) => updateField('license', e.target.value)}
                  placeholder="Optional license URL"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
