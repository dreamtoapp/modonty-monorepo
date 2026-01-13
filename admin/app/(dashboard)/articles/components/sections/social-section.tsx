'use client';

import { useArticleForm } from '../article-form-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormNativeSelect } from '@/components/admin/form-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SocialSection() {
  const { formData, updateField, categories } = useArticleForm();

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="og" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="og">Open Graph</TabsTrigger>
            <TabsTrigger value="twitter">Twitter Cards</TabsTrigger>
          </TabsList>

          {/* Open Graph Tab */}
          <TabsContent value="og" className="space-y-4 mt-4">
            <div>
              <Label>OG Title</Label>
              <Input
                value={formData.ogTitle || ''}
                onChange={(e) => updateField('ogTitle', e.target.value)}
                placeholder="Will be copied from SEO title"
              />
            </div>

            <div>
              <Label>OG Description</Label>
              <Textarea
                value={formData.ogDescription || ''}
                onChange={(e) => updateField('ogDescription', e.target.value)}
                placeholder="Will be copied from SEO description"
                rows={3}
              />
            </div>

            <div>
              <Label>OG URL</Label>
              <Input
                value={formData.ogUrl || ''}
                onChange={(e) => updateField('ogUrl', e.target.value)}
                placeholder="Will be auto-generated"
              />
            </div>

            <div>
              <Label>OG Site Name</Label>
              <Input
                value={formData.ogSiteName || 'مودونتي'}
                onChange={(e) => updateField('ogSiteName', e.target.value)}
              />
            </div>

            <div>
              <Label>OG Locale</Label>
              <Input
                value={formData.ogLocale || 'ar_SA'}
                onChange={(e) => updateField('ogLocale', e.target.value)}
              />
            </div>

            <div>
              <Label>OG Article Section</Label>
              <Input
                value={formData.ogArticleSection || ''}
                onChange={(e) => updateField('ogArticleSection', e.target.value)}
                placeholder={selectedCategory?.name || ''}
              />
            </div>

            <div>
              <Label>OG Article Tags</Label>
              <Input
                value={(formData.ogArticleTag || []).join(', ')}
                onChange={(e) =>
                  updateField(
                    'ogArticleTag',
                    e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean),
                  )
                }
                placeholder="Enter tags separated by commas"
              />
            </div>
          </TabsContent>

          {/* Twitter Cards Tab */}
          <TabsContent value="twitter" className="space-y-4 mt-4">
            <div>
              <FormNativeSelect
                label="Twitter Card Type"
                name="twitterCard"
                value={formData.twitterCard || 'summary_large_image'}
                onChange={(e) => updateField('twitterCard', e.target.value)}
              >
                <option value="summary_large_image">summary_large_image</option>
                <option value="summary">summary</option>
              </FormNativeSelect>
            </div>

            <div>
              <Label>Twitter Title</Label>
              <Input
                value={formData.twitterTitle || ''}
                onChange={(e) => updateField('twitterTitle', e.target.value)}
                placeholder="Will be copied from OG Title"
              />
            </div>

            <div>
              <Label>Twitter Description</Label>
              <Textarea
                value={formData.twitterDescription || ''}
                onChange={(e) => updateField('twitterDescription', e.target.value)}
                placeholder="Will be copied from OG Description"
                rows={3}
              />
            </div>

            <div>
              <Label>Twitter Site</Label>
              <Input
                value={formData.twitterSite || ''}
                onChange={(e) => updateField('twitterSite', e.target.value)}
                placeholder="@username"
              />
            </div>

            <div>
              <Label>Twitter Creator</Label>
              <Input
                value={formData.twitterCreator || ''}
                onChange={(e) => updateField('twitterCreator', e.target.value)}
                placeholder="@username"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
