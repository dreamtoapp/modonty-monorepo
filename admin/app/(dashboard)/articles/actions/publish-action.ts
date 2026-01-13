'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ArticleStatus } from '@prisma/client';
import type { ArticleFormData, FormSubmitResult } from '@/lib/types/form-types';
import { createArticle } from './articles-actions';
import { validateFullPage } from '@/lib/seo/page-validator';

/**
 * Validate article form data before publishing
 */
async function validateArticleData(formData: ArticleFormData): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!formData.title || formData.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!formData.slug || formData.slug.trim().length === 0) {
    errors.push('Slug is required');
  }

  if (!formData.content || formData.content.trim().length === 0) {
    errors.push('Content is required');
  }

  if (!formData.clientId) {
    errors.push('Client is required');
  }

  if (!formData.authorId) {
    errors.push('Author is required');
  }

  // SEO validation
  if (!formData.seoTitle) {
    warnings.push('SEO title is recommended for better search visibility');
  }

  if (!formData.seoDescription) {
    warnings.push('SEO description is recommended for better search visibility');
  }

  if (formData.seoDescription && formData.seoDescription.length > 160) {
    warnings.push('SEO description should be 155-160 characters for optimal display');
  }

  // Content quality validation
  if (formData.content && formData.content.length < 300) {
    warnings.push('Article content is quite short. Consider adding more detailed content');
  }

  // Featured image validation
  if (!formData.featuredImageId) {
    warnings.push('Featured image is recommended for better social media sharing');
  }


  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Publish article action
 * Validates form data, saves to DB as WRITING, then updates to PUBLISHED
 */
export async function publishArticle(
  formData: ArticleFormData
): Promise<FormSubmitResult> {
  try {
    // Step 1: Validate form data
    const validation = await validateArticleData(formData);
    
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join('; ')}`,
      };
    }

    // Step 2: Create article as WRITING first
    const createResult = await createArticle({
      ...formData,
      status: ArticleStatus.WRITING,
    });

    if (!createResult.success || !createResult.article) {
      return {
        success: false,
        error: createResult.error || 'Failed to create article',
      };
    }

    const finalArticleId = createResult.article.id;

    // Step 3: Update article status to PUBLISHED
    const now = new Date();
    const publishedArticle = await db.article.update({
      where: { id: finalArticleId },
      data: {
        status: ArticleStatus.PUBLISHED,
        datePublished: formData.datePublished || now,
        ogArticlePublishedTime: formData.datePublished || now,
        ogArticleModifiedTime: now,
      },
    });

    // Step 4: Revalidate paths
    revalidatePath('/articles');
    revalidatePath(`/articles/${publishedArticle.id}`);
    revalidatePath(`/articles/${publishedArticle.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error publishing article:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to publish article';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Publish article by ID (simplified version for preview page)
 * Updates status from WRITING/DRAFT to PUBLISHED
 */
export async function publishArticleById(articleId: string): Promise<FormSubmitResult> {
  try {
    const article = await db.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return {
        success: false,
        error: 'Article not found',
      };
    }

    // Validate article can be published
    if (!article.title || !article.slug || !article.content) {
      return {
        success: false,
        error: 'Article is missing required fields (title, slug, or content)',
      };
    }

    // Run validation if article exists
    try {
      const validationResult = await validateFullPage('article', articleId, {
        includeMetadata: true,
      });

      // Check if there are critical issues
      if (validationResult.issues.critical.length > 0) {
        return {
          success: false,
          error: `Article has ${validationResult.issues.critical.length} critical validation issue(s) that must be fixed before publishing`,
        };
      }
    } catch (error) {
      console.warn('Could not run full page validation:', error);
    }

    // Update status to PUBLISHED
    const now = new Date();
    await db.article.update({
      where: { id: articleId },
      data: {
        status: ArticleStatus.PUBLISHED,
        datePublished: article.datePublished || now,
        ogArticlePublishedTime: article.ogArticlePublishedTime || now,
        ogArticleModifiedTime: now,
      },
    });

    // Revalidate paths
    revalidatePath('/articles');
    revalidatePath(`/articles/${articleId}`);
    revalidatePath(`/articles/${article.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error publishing article by ID:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to publish article';
    return {
      success: false,
      error: errorMessage,
    };
  }
}