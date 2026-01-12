'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { ArticleMultiSelect } from './article-multi-select';
import { getArticlesForSelection } from '../actions/articles-actions';

export interface RelatedArticleItem {
  relatedId: string;
  relationshipType?: 'related' | 'similar' | 'recommended';
  weight?: number;
}

interface RelatedArticlesBuilderProps {
  relatedArticles: RelatedArticleItem[];
  onChange: (articles: RelatedArticleItem[]) => void;
  excludeArticleId?: string;
}

interface ArticleInfo {
  id: string;
  title: string;
  slug: string;
  clientName: string;
}

export function RelatedArticlesBuilder({
  relatedArticles,
  onChange,
  excludeArticleId,
}: RelatedArticlesBuilderProps) {
  const [availableArticles, setAvailableArticles] = useState<ArticleInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const articles = await getArticlesForSelection(excludeArticleId);
        setAvailableArticles(articles);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [excludeArticleId]);

  const selectedArticleIds = relatedArticles.map((rel) => rel.relatedId);
  const selectedArticlesMap = new Map(
    availableArticles
      .filter((article) => selectedArticleIds.includes(article.id))
      .map((article) => [article.id, article])
  );

  const handleAddArticles = (articleIds: string[]) => {
    // Create a map of existing related articles by relatedId
    const existingMap = new Map(
      relatedArticles.map((rel) => [rel.relatedId, rel])
    );

    // Update the list: keep existing items, add new ones, remove deselected ones
    const updatedArticles = articleIds.map((id) => {
      const existing = existingMap.get(id);
      if (existing) {
        return existing; // Keep existing item with its relationshipType and weight
      }
      // Add new item with defaults
      return {
        relatedId: id,
        relationshipType: 'related' as const,
        weight: 1.0,
      };
    });

    onChange(updatedArticles);
  };

  const handleRemoveArticle = (relatedId: string) => {
    onChange(relatedArticles.filter((rel) => rel.relatedId !== relatedId));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">المقالات ذات الصلة</h4>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">إضافة مقالات ذات صلة</label>
        {loading ? (
          <div className="text-sm text-muted-foreground">جاري التحميل...</div>
        ) : (
          <ArticleMultiSelect
            availableArticles={availableArticles}
            selectedArticleIds={selectedArticleIds}
            onChange={handleAddArticles}
            placeholder="اختر المقالات المرتبطة"
          />
        )}
      </div>

      {relatedArticles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          لا توجد مقالات مرتبطة. استخدم القائمة أعلاه لإضافة مقالات ذات صلة.
        </div>
      ) : (
        <div className="space-y-2">
          {relatedArticles.map((rel) => {
            const article = selectedArticlesMap.get(rel.relatedId);
            if (!article) return null;

            return (
              <Card key={rel.relatedId}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="font-medium">{article.title}</div>
                    <div className="text-sm text-muted-foreground">{article.clientName}</div>
                    {rel.relationshipType && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {rel.relationshipType === 'similar' ? 'مشابه' : rel.relationshipType === 'recommended' ? 'موصى به' : 'ذو صلة'}
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveArticle(rel.relatedId)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
