'use client';

import { useArticleForm } from '../article-form-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AllFieldsIndicatorStep() {
  const { formData } = useArticleForm();

  const fieldGroups = [
    {
      title: 'Basic Content',
      fields: [
        { key: 'title', label: 'Title', step: 'Step 1' },
        { key: 'slug', label: 'Slug', step: 'Step 1 (auto)' },
        { key: 'excerpt', label: 'Excerpt', step: 'Step 1' },
        { key: 'content', label: 'Content', step: 'Step 2' },
        { key: 'contentFormat', label: 'Content Format', step: 'Step 2' },
      ],
    },
    {
      title: 'Relationships',
      fields: [
        { key: 'clientId', label: 'Client ID', step: 'Step 1' },
        { key: 'categoryId', label: 'Category ID', step: 'Step 1' },
        { key: 'authorId', label: 'Author ID', step: 'Step 6 (auto)' },
      ],
    },
    {
      title: 'Status & Workflow',
      fields: [
        { key: 'status', label: 'Status', step: 'System' },
        { key: 'scheduledAt', label: 'Scheduled At', step: 'Step 6' },
        { key: 'featured', label: 'Featured', step: 'Step 6' },
      ],
    },
    {
      title: 'SEO Meta',
      fields: [
        { key: 'seoTitle', label: 'SEO Title', step: 'Step 3' },
        { key: 'seoDescription', label: 'SEO Description', step: 'Step 3' },
        { key: 'canonicalUrl', label: 'Canonical URL', step: 'Step 3' },
        { key: 'metaRobots', label: 'Meta Robots', step: 'Step 6' },
      ],
    },
    {
      title: 'Open Graph',
      fields: [
        { key: 'ogTitle', label: 'OG Title', step: 'Step 3' },
        { key: 'ogDescription', label: 'OG Description', step: 'Step 3' },
        { key: 'ogUrl', label: 'OG URL', step: 'Step 3' },
        { key: 'ogSiteName', label: 'OG Site Name', step: 'Step 3' },
        { key: 'ogLocale', label: 'OG Locale', step: 'Step 3' },
        { key: 'ogArticleAuthor', label: 'OG Article Author', step: 'Step 3' },
        { key: 'ogArticleSection', label: 'OG Article Section', step: 'Step 3' },
        { key: 'ogArticleTag', label: 'OG Article Tags', step: 'Step 3' },
      ],
    },
    {
      title: 'Twitter Cards',
      fields: [
        { key: 'twitterCard', label: 'Twitter Card Type', step: 'Step 3' },
        { key: 'twitterTitle', label: 'Twitter Title', step: 'Step 3' },
        { key: 'twitterDescription', label: 'Twitter Description', step: 'Step 3' },
        { key: 'twitterSite', label: 'Twitter Site', step: 'Step 3' },
        { key: 'twitterCreator', label: 'Twitter Creator', step: 'Step 3' },
      ],
    },
    {
      title: 'Technical SEO',
      fields: [
        { key: 'sitemapPriority', label: 'Sitemap Priority', step: 'Step 6' },
        { key: 'sitemapChangeFreq', label: 'Sitemap Change Freq', step: 'Step 6' },
        { key: 'alternateLanguages', label: 'Alternate Languages', step: 'Step 6' },
        { key: 'license', label: 'License', step: 'Step 6' },
        { key: 'lastReviewed', label: 'Last Reviewed', step: 'Step 6' },
      ],
    },
    {
      title: 'Media',
      fields: [
        { key: 'featuredImageId', label: 'Featured Image ID', step: 'Step 4' },
      ],
    },
    {
      title: 'Relations',
      fields: [
        { key: 'tags', label: 'Tags', step: 'Step 1' },
        { key: 'faqs', label: 'FAQs', step: 'Step 5' },
      ],
    },
  ];

  const getFieldValue = (key: string) => {
    const value = formData[key as keyof typeof formData];
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.length > 0 ? `Array(${value.length})` : '[]';
      }
      return JSON.stringify(value).substring(0, 50) + '...';
    }
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return String(value);
  };

  const isFieldSet = (key: string) => {
    const value = formData[key as keyof typeof formData];
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>All Fields Indicator (Temporary - For Finalization)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {fieldGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-sm mb-3">{group.title}</h3>
              <div className="space-y-2">
                {group.fields.map((field) => {
                  const isSet = isFieldSet(field.key);
                  const value = getFieldValue(field.key);
                  const isSystem = field.step === 'System';

                  return (
                    <div
                      key={field.key}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/30"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={isSet ? 'default' : isSystem ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {field.step}
                        </Badge>
                        <span className="text-sm font-mono">{field.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono max-w-md truncate">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
