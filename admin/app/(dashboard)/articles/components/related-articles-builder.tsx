'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { ArticleSelectionTable } from './article-selection-table';
import { getArticlesForSelection, ArticleSelectionItem } from '../actions/articles-actions';
import { useArticleForm } from './article-form-context';

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

export function RelatedArticlesBuilder({
  relatedArticles,
  onChange,
  excludeArticleId,
}: RelatedArticlesBuilderProps) {
  const { categories, tags, formData } = useArticleForm();
  const [availableArticles, setAvailableArticles] = useState<ArticleSelectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    formData.categoryId || undefined
  );
  const [tagFilter, setTagFilter] = useState<string[]>(formData.tags || []);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        const articles = await getArticlesForSelection({
          excludeArticleId,
          categoryId: categoryFilter,
          tagIds: tagFilter.length > 0 ? tagFilter : undefined,
          search: searchQuery || undefined,
        });
        setAvailableArticles(articles);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoading(false);
      }
    }
    const timeoutId = setTimeout(loadArticles, 300);
    return () => clearTimeout(timeoutId);
  }, [excludeArticleId, categoryFilter, tagFilter, searchQuery]);

  const selectedArticleIds = relatedArticles.map((rel) => rel.relatedId);
  const selectedArticlesMap = useMemo(
    () =>
      new Map(
        availableArticles
          .filter((article) => selectedArticleIds.includes(article.id))
          .map((article) => [article.id, article])
      ),
    [availableArticles, selectedArticleIds]
  );

  const handleSelectionChange = (articleIds: string[]) => {
    const existingMap = new Map(
      relatedArticles.map((rel) => [rel.relatedId, rel])
    );

    const updatedArticles = articleIds.map((id) => {
      const existing = existingMap.get(id);
      if (existing) {
        return existing;
      }
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

  const handleRelationshipTypeChange = (relatedId: string, relationshipType: 'related' | 'similar' | 'recommended') => {
    onChange(
      relatedArticles.map((rel) =>
        rel.relatedId === relatedId ? { ...rel, relationshipType } : rel
      )
    );
  };

  const handleWeightChange = (relatedId: string, weight: number) => {
    const clampedWeight = Math.max(0, Math.min(1, weight));
    onChange(
      relatedArticles.map((rel) =>
        rel.relatedId === relatedId ? { ...rel, weight: clampedWeight } : rel
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-4 block">اختيار المقالات ذات الصلة</Label>
        <ArticleSelectionTable
          articles={availableArticles}
          selectedArticleIds={selectedArticleIds}
          onSelectionChange={handleSelectionChange}
          categories={categories}
          tags={tags}
          loading={loading}
          onCategoryFilterChange={setCategoryFilter}
          onTagFilterChange={setTagFilter}
          onSearchChange={setSearchQuery}
          defaultCategoryId={formData.categoryId || undefined}
          defaultTagIds={formData.tags || []}
          relatedArticles={relatedArticles}
        />
      </div>

      {relatedArticles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-semibold">
              المقالات المحددة ({relatedArticles.length})
            </Label>
          </div>
          <div className="space-y-3">
            {relatedArticles.map((rel) => {
              const article = selectedArticlesMap.get(rel.relatedId);
              if (!article) return null;

              return (
                <Card key={rel.relatedId}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="font-medium">{article.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            {article.categoryName && (
                              <Badge variant="outline" className="text-xs">
                                {article.categoryName}
                              </Badge>
                            )}
                            <span>{article.clientName}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">نوع العلاقة</Label>
                            <Select
                              value={rel.relationshipType || 'related'}
                              onValueChange={(value) =>
                                handleRelationshipTypeChange(
                                  rel.relatedId,
                                  value as 'related' | 'similar' | 'recommended'
                                )
                              }
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="related">ذو صلة</SelectItem>
                                <SelectItem value="similar">مشابه</SelectItem>
                                <SelectItem value="recommended">موصى به</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">
                              الوزن ({rel.weight?.toFixed(2) || '1.00'})
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={rel.weight || 1.0}
                                onChange={(e) =>
                                  handleWeightChange(
                                    rel.relatedId,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="h-9"
                              />
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{
                                    width: `${((rel.weight || 1.0) * 100).toFixed(0)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveArticle(rel.relatedId)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {relatedArticles.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm font-medium mb-1">لا توجد مقالات محددة</p>
          <p className="text-xs">استخدم الجدول أعلاه لاختيار المقالات ذات الصلة</p>
        </div>
      )}
    </div>
  );
}
