'use client';

import { useState, useEffect } from 'react';
import { useArticleForm } from '../article-form-context';
import { Card, CardContent } from '@/components/ui/card';
import { JsonLdPreview } from '../jsonld-preview';
import { getArticleJsonLd, regenerateArticleJsonLd } from '../../actions/jsonld-actions';
import { useRouter } from 'next/navigation';
import type { ValidationReport } from '@/lib/seo/jsonld-validator';

export function JsonLdSection() {
  const { articleId } = useArticleForm();
  const router = useRouter();
  const [jsonLdData, setJsonLdData] = useState<{
    jsonLd: object | null;
    validationReport: ValidationReport | null;
  } | null>(null);
  const [isGeneratingJsonLd, setIsGeneratingJsonLd] = useState(false);
  const [jsonLdLastGenerated, setJsonLdLastGenerated] = useState<Date | null>(null);

  // Fetch JSON-LD data when article has ID
  useEffect(() => {
    if (articleId) {
      fetchJsonLdData();
    }
  }, [articleId]);

  const fetchJsonLdData = async () => {
    if (!articleId) return;
    try {
      const data = await getArticleJsonLd(articleId);
      setJsonLdData(data);
    } catch (error) {
      console.error('Failed to fetch JSON-LD data:', error);
    }
  };

  const handleRegenerateJsonLd = async () => {
    if (!articleId) return;
    setIsGeneratingJsonLd(true);
    try {
      const result = await regenerateArticleJsonLd(articleId);
      if (result.success) {
        setJsonLdData({
          jsonLd: result.jsonLd || null,
          validationReport: result.validationReport || null,
        });
        setJsonLdLastGenerated(new Date());
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to regenerate JSON-LD:', error);
    } finally {
      setIsGeneratingJsonLd(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <JsonLdPreview
          jsonLd={jsonLdData?.jsonLd || null}
          validationReport={jsonLdData?.validationReport || null}
          isGenerating={isGeneratingJsonLd}
          lastGenerated={jsonLdLastGenerated}
          articleId={articleId}
          onRegenerate={handleRegenerateJsonLd}
          onAutoFix={() => {
            fetchJsonLdData();
            router.refresh();
          }}
        />
      </CardContent>
    </Card>
  );
}
