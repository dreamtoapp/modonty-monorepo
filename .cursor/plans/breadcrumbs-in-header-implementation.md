# Breadcrumbs in Main Header - Implementation Plan

## Overview

Implement a comprehensive breadcrumb navigation system in the admin dashboard header that replaces the "Admin Dashboard" title, automatically generates breadcrumbs based on the current route, handles dynamic routes with entity name fetching using existing server actions, and follows Next.js App Router best practices.

## Decisions

1. **Breadcrumb Position**: Replace "Admin Dashboard" title with breadcrumbs (confirmed)
2. **Entity Fetching**: Use existing server actions with client-side state caching (best practice for Next.js App Router)
3. **Approach**: Client-side component using usePathname, with server actions for data fetching

## Current State Analysis

### Header Component

**File**: `admin/components/admin/header.tsx`

**Current State**:
- Shows "Admin Dashboard" title on left
- User menu, theme toggle, guidelines button on right
- Client component (uses useSession, usePathname)
- Sticky top position (`sticky top-0 z-50`)
- Height: `h-14` (56px)

### Available Server Actions

**Existing Server Actions for Entity Fetching**:
- Articles: `getArticleById(id: string)` - `admin/app/(dashboard)/articles/actions/articles-actions.ts`
- Clients: `getClientById(id: string)` - `admin/app/(dashboard)/clients/actions/clients-actions.ts`
- Categories: `getCategoryById(id: string)` - `admin/app/(dashboard)/categories/actions/categories-actions.ts`
- Tags: `getTagById(id: string)` - `admin/app/(dashboard)/tags/actions/tags-actions.ts`
- Industries: `getIndustryById(id: string)` - `admin/app/(dashboard)/industries/actions/industries-actions.ts`
- Media: `getMediaById(id: string, clientId?: string)` - `admin/app/(dashboard)/media/actions/get-media-by-id.ts`
- Users: `getUserById(id: string)` - `admin/app/(dashboard)/users/actions/users-actions.ts`
- Authors: Only `getModontyAuthor()` exists (singleton, no getAuthorById needed)

### Routes Structure

**Static Routes**:
- `/` - Dashboard
- `/articles` - Articles list
- `/articles/new` - New article
- `/clients` - Clients list
- `/clients/new` - New client
- `/categories` - Categories list
- `/categories/new` - New category
- Similar patterns for: Tags, Industries, Media, Users, Subscribers
- `/analytics` - Analytics
- `/settings` - Settings
- `/export-data` - Export Data
- `/guidelines/*` - Guidelines pages

**Dynamic Routes**:
- `/articles/[id]` - Article view
- `/articles/[id]/edit` - Edit article (redirects to `/articles/[id]/edit/basic`)
- `/articles/[id]/edit/[section]` - Edit article section
- `/clients/[id]` - Client view
- `/clients/[id]/edit` - Edit client
- `/categories/[id]` - Category view
- `/categories/[id]/edit` - Edit category
- Similar patterns for: Tags, Industries, Media, Users

## Implementation Approach

### Best Practices Applied

1. **Use Existing Server Actions**: Leverage existing `get*ById` functions (no new API routes needed)
2. **Client-Side Caching**: Use React state for caching entity names
3. **Optimistic UI**: Show ID while loading, update with name when available
4. **Lazy Fetching**: Fetch entity data only when needed (dynamic routes)
5. **Error Handling**: Fallback to ID if fetch fails
6. **Performance**: Use useMemo and useCallback for optimization

## Component Architecture

### 1. Breadcrumb Component

**File**: `admin/components/admin/breadcrumb.tsx`

**Features**:
- Client component
- Uses usePathname() from next/navigation
- Parses pathname and generates breadcrumb items
- Renders Home icon, links, ChevronRight separators
- Last item is current (non-clickable, different style)
- Responsive design

**Implementation**:
- Parse pathname segments
- Generate breadcrumb items using utility functions
- Fetch entity names for dynamic routes (using hook)
- Render with proper styling and accessibility

### 2. Breadcrumb Utilities

**File**: `admin/components/admin/breadcrumb-utils.ts`

**Functions**:
- `parsePathname(pathname: string): string[]` - Parse route segments
- `generateBreadcrumbs(pathname: string, entityData?: Map<string, string>): BreadcrumbItem[]` - Generate breadcrumb items
- `getRouteLabel(segment: string, index: number, segments: string[]): string` - Get label for route segment
- `detectEntityRoute(segments: string[]): EntityRouteInfo | null` - Detect entity routes

**Route Configuration**:
- Static route labels mapping
- Entity route patterns
- Section labels mapping (for article edit sections)

### 3. Entity Name Hook

**File**: `admin/components/admin/use-entity-name.ts`

**Purpose**:
- Fetch entity names using existing server actions
- Cache results in React state
- Handle loading/error states

**Approach**:
- Create unified function to call appropriate server action based on type
- Use React state for caching (Map<string, string>)
- Fetch only when needed
- Return cached data if available

## Route Configuration

### Static Route Labels

```typescript
const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  'articles': 'Articles',
  'clients': 'Clients',
  'categories': 'Categories',
  'industries': 'Industries',
  'tags': 'Tags',
  'authors': 'Authors',
  'media': 'Media',
  'users': 'Users',
  'subscribers': 'Subscribers',
  'analytics': 'Analytics',
  'settings': 'Settings',
  'export-data': 'Export Data',
  'guidelines': 'Guidelines',
  'new': 'New',
  'edit': 'Edit',
  'preview': 'Preview',
};
```

### Section Labels (Article Edit)

```typescript
const sectionLabels: Record<string, string> = {
  'basic': 'Basic',
  'content': 'Content',
  'seo': 'SEO',
  'media': 'Media',
  'tags': 'Tags',
  'seo-validation': 'SEO Validation',
  'jsonld': 'JSON-LD',
};
```

### Entity Route Detection

```typescript
interface EntityRouteInfo {
  type: 'article' | 'client' | 'category' | 'tag' | 'industry' | 'media' | 'user';
  id: string;
  action?: 'view' | 'edit' | 'preview';
  section?: string;
}

// Patterns:
// /articles/[id] -> { type: 'article', id, action: 'view' }
// /articles/[id]/edit -> { type: 'article', id, action: 'edit' }
// /articles/[id]/edit/[section] -> { type: 'article', id, action: 'edit', section }
```

## Breadcrumb Examples

### Static Routes

**Route**: `/articles`
**Breadcrumbs**: Home → Articles

**Route**: `/articles/new`
**Breadcrumbs**: Home → Articles → New

**Route**: `/clients`
**Breadcrumbs**: Home → Clients

### Dynamic Routes (with entity fetching)

**Route**: `/articles/507f1f77bcf86cd799439011`
**Breadcrumbs**: Home → Articles → "Article Title" (fetch using getArticleById)

**Route**: `/articles/507f1f77bcf86cd799439011/edit`
**Breadcrumbs**: Home → Articles → "Article Title" → Edit (fetch using getArticleById)

**Route**: `/articles/507f1f77bcf86cd799439011/edit/basic`
**Breadcrumbs**: Home → Articles → "Article Title" → Edit → Basic (fetch using getArticleById)

**Route**: `/clients/507f1f77bcf86cd799439012/edit`
**Breadcrumbs**: Home → Clients → "Client Name" → Edit (fetch using getClientById)

## Implementation Steps

### Phase 1: Core Infrastructure

1. **Create Breadcrumb Utilities**
   - File: `admin/components/admin/breadcrumb-utils.ts`
   - Route mapping functions
   - Pathname parsing
   - Label generation for static routes
   - Entity route detection

2. **Create Entity Name Hook**
   - File: `admin/components/admin/use-entity-name.ts`
   - Unified function to call server actions
   - State-based caching
   - Loading/error handling

3. **Create Breadcrumb Component**
   - File: `admin/components/admin/breadcrumb.tsx`
   - Client component with usePathname
   - Generate breadcrumbs using utilities
   - Fetch entity names using hook
   - Render with proper styling and accessibility

4. **Update Header Component**
   - File: `admin/components/admin/header.tsx`
   - Replace "Admin Dashboard" title with Breadcrumb component
   - Adjust layout (breadcrumbs on left, actions on right)
   - Maintain existing functionality (user menu, theme, guidelines)

### Phase 2: Entity Data Integration

5. **Integrate Server Actions**
   - Use existing getArticleById, getClientById, etc.
   - Create unified fetch function in hook
   - Handle different entity types
   - Cache results

6. **Handle Dynamic Routes**
   - Detect entity routes from pathname
   - Fetch entity names when needed
   - Show loading state (ID or skeleton)
   - Update breadcrumbs when data loads

7. **Handle Special Routes**
   - Edit sections (`/articles/[id]/edit/[section]`)
   - Preview routes
   - Nested routes
   - Guidelines pages

### Phase 3: Optimization & Polish

8. **Performance Optimization**
   - Use useMemo for breadcrumb generation
   - Use useCallback for entity fetching
   - Debounce if needed
   - Optimize re-renders

9. **Error Handling**
   - Handle missing entities gracefully
   - Show fallback labels (e.g., "Article [ID]" if not found)
   - Handle API errors
   - Log errors for debugging

10. **Testing & Refinement**
    - Test all routes
    - Verify responsive design
    - Verify accessibility
    - Polish styling and animations

## Files to Create/Modify

### Create

1. **admin/components/admin/breadcrumb.tsx**
   - Main breadcrumb component
   - ~200-250 lines

2. **admin/components/admin/breadcrumb-utils.ts**
   - Utility functions for route mapping
   - Route configuration
   - Pathname parsing
   - Entity route detection
   - ~200-250 lines

3. **admin/components/admin/use-entity-name.ts**
   - Hook for fetching entity names using server actions
   - Caching logic
   - Loading/error states
   - ~150-200 lines

### Modify

1. **admin/components/admin/header.tsx**
   - Replace "Admin Dashboard" title with Breadcrumb component
   - Update layout/styling
   - Maintain existing functionality
   - ~20-30 lines changed

## Detailed Implementation

### Breadcrumb Component Structure

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';
import { generateBreadcrumbs } from './breadcrumb-utils';
import { useEntityName } from './use-entity-name';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export function Breadcrumb() {
  const pathname = usePathname();
  const { entityNames, isLoading } = useEntityName(pathname);
  
  const items = useMemo(() => {
    return generateBreadcrumbs(pathname, entityNames);
  }, [pathname, entityNames]);

  if (items.length === 0) {
    return null; // Don't show if no items
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      <Link 
        href="/" 
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Go to dashboard"
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            {isLast ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
```

### Breadcrumb Utilities Structure

```typescript
export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface EntityRouteInfo {
  type: 'article' | 'client' | 'category' | 'tag' | 'industry' | 'media' | 'user';
  id: string;
  action?: 'view' | 'edit' | 'preview';
  section?: string;
}

const routeLabels: Record<string, string> = {
  'articles': 'Articles',
  'clients': 'Clients',
  // ... etc
};

const sectionLabels: Record<string, string> = {
  'basic': 'Basic',
  'content': 'Content',
  // ... etc
};

export function parsePathname(pathname: string): string[] {
  return pathname.split('/').filter(Boolean);
}

export function detectEntityRoute(segments: string[]): EntityRouteInfo | null {
  // Detect patterns like: /articles/[id], /articles/[id]/edit, /articles/[id]/edit/[section]
  // Return entity type, ID, action, section
}

export function isObjectId(str: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(str);
}

export function generateBreadcrumbs(
  pathname: string,
  entityNames?: Map<string, string>
): BreadcrumbItem[] {
  const segments = parsePathname(pathname);
  const items: BreadcrumbItem[] = [];
  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    // Check if this is an entity ID (ObjectId pattern)
    if (isObjectId(segment) && i > 0) {
      const entityType = segments[i - 1];
      const cacheKey = `${entityType}:${segment}`;
      const entityName = entityNames?.get(cacheKey);
      
      items.push({
        label: entityName || `${capitalize(entityType)} ${segment.slice(0, 8)}...`,
        href: currentPath,
      });
    } else if (segment === 'edit' && i > 1) {
      // Edit route
      items.push({
        label: 'Edit',
        href: currentPath,
      });
    } else if (i > 2 && segments[i - 1] === 'edit' && segments[i - 2] && isObjectId(segments[i - 2])) {
      // Edit section route
      const sectionLabel = sectionLabels[segment] || capitalize(segment);
      items.push({
        label: sectionLabel,
        href: currentPath,
      });
    } else {
      // Regular segment
      const label = routeLabels[segment] || capitalize(segment);
      items.push({
        label,
        href: currentPath,
      });
    }
  }
  
  return items;
}
```

### Entity Name Hook Structure

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getArticleById } from '@/app/(dashboard)/articles/actions/articles-actions';
import { getClientById } from '@/app/(dashboard)/clients/actions/clients-actions';
import { getCategoryById } from '@/app/(dashboard)/categories/actions/categories-actions';
import { getTagById } from '@/app/(dashboard)/tags/actions/tags-actions';
import { getIndustryById } from '@/app/(dashboard)/industries/actions/industries-actions';
import { getMediaById } from '@/app/(dashboard)/media/actions/get-media-by-id';
import { getUserById } from '@/app/(dashboard)/users/actions/users-actions';

interface EntityCache {
  [key: string]: string; // "type:id" -> name
}

export function useEntityName(pathname: string) {
  const [cache, setCache] = useState<EntityCache>({});
  const [loading, setLoading] = useState<Set<string>>(new Set());

  const fetchEntityName = useCallback(async (type: string, id: string): Promise<string | undefined> => {
    const cacheKey = `${type}:${id}`;
    
    // Return cached if available
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    
    // Don't fetch if already loading
    if (loading.has(cacheKey)) {
      return undefined;
    }
    
    setLoading(prev => new Set(prev).add(cacheKey));
    
    try {
      let entity: any = null;
      
      // Call appropriate server action based on type
      switch (type) {
        case 'article':
          entity = await getArticleById(id);
          break;
        case 'client':
          entity = await getClientById(id);
          break;
        case 'category':
          entity = await getCategoryById(id);
          break;
        case 'tag':
          entity = await getTagById(id);
          break;
        case 'industry':
          entity = await getIndustryById(id);
          break;
        case 'media':
          entity = await getMediaById(id);
          break;
        case 'user':
          entity = await getUserById(id);
          break;
        default:
          return undefined;
      }
      
      if (entity) {
        // Extract name based on entity type
        const name = entity.name || entity.title || entity.email || id;
        setCache(prev => ({ ...prev, [cacheKey]: name }));
        return name;
      }
    } catch (error) {
      console.error(`Failed to fetch ${type} name:`, error);
    } finally {
      setLoading(prev => {
        const next = new Set(prev);
        next.delete(cacheKey);
        return next;
      });
    }
    
    return undefined;
  }, [cache, loading]);

  // Extract entity routes from pathname and fetch names
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    
    for (let i = 0; i < segments.length; i++) {
      if (isObjectId(segments[i]) && i > 0) {
        const entityType = segments[i - 1];
        const entityId = segments[i];
        fetchEntityName(entityType, entityId);
      }
    }
  }, [pathname, fetchEntityName]);

  // Convert cache to Map for efficient lookups
  const entityNames = new Map(Object.entries(cache));

  return { entityNames, isLoading: loading.size > 0 };
}

function isObjectId(str: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(str);
}
```

### Header Integration

**Updated Header Layout**:

```typescript
// admin/components/admin/header.tsx

export function Header() {
  // ... existing code ...

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="flex h-14 items-center justify-between px-6">
        <Breadcrumb /> {/* Replace "Admin Dashboard" title */}
        <div className="flex items-center gap-4">
          {/* Existing: Guidelines, Theme, User Menu */}
        </div>
      </div>
    </header>
  );
}
```

## Data Fetching Strategy

### Approach: Server Actions with Client-Side Caching

**Implementation**:
- Use existing server actions (getArticleById, getClientById, etc.)
- Create unified hook to call appropriate server action
- Cache results in React state (Map<string, string>)
- Fetch on-demand (when breadcrumb component mounts)
- Show optimistic UI (show ID, update with name)

**Best Practices Applied**:
- Use server actions (Next.js App Router best practice)
- Client-side caching (React state)
- Lazy loading (fetch only when needed)
- Optimistic UI (show ID first)
- Error handling (fallback to ID)
- Performance (useMemo, useCallback)

## Error Handling

### Scenarios

1. **Entity Not Found**
   - Show: "Article [ID]" or "Client [ID]"
   - Don't break navigation
   - Log error for debugging

2. **API Error**
   - Show fallback (ID)
   - Don't block breadcrumb rendering
   - Handle gracefully

3. **Loading State**
   - Show ID while loading
   - Update when data arrives
   - Smooth transition

## Accessibility

- Use `<nav>` element with `aria-label="Breadcrumb"`
- Use `aria-current="page"` for current page
- Proper link labels
- Keyboard navigation support
- Screen reader friendly

## Testing Checklist

### Routes to Test

- [ ] `/` - Dashboard (Home only or hidden)
- [ ] `/articles` - Articles list
- [ ] `/articles/new` - New article
- [ ] `/articles/[id]` - Article view (with title fetch)
- [ ] `/articles/[id]/edit` - Edit article (with title fetch)
- [ ] `/articles/[id]/edit/basic` - Edit section (with title fetch)
- [ ] `/clients` - Clients list
- [ ] `/clients/new` - New client
- [ ] `/clients/[id]` - Client view (with name fetch)
- [ ] `/clients/[id]/edit` - Edit client (with name fetch)
- [ ] Similar for categories, tags, industries, media, users
- [ ] `/analytics` - Analytics
- [ ] `/settings` - Settings
- [ ] `/export-data` - Export Data
- [ ] `/guidelines/*` - Guidelines pages

### Functionality to Test

- [ ] Breadcrumbs generate correctly for all routes
- [ ] Entity names fetch and display correctly
- [ ] Loading states work (shows ID, then name)
- [ ] Caching works (doesn't re-fetch same entity)
- [ ] Error handling (shows ID if fetch fails)
- [ ] Links navigate correctly
- [ ] Current page is non-clickable
- [ ] Responsive design works
- [ ] Accessibility (keyboard, screen readers)
- [ ] Performance (no unnecessary re-renders)

## Benefits

1. **Better Navigation**: Clear hierarchy, easy to understand location
2. **Quick Navigation**: Click to go back to parent pages
3. **Professional UI**: Modern admin dashboards use breadcrumbs
4. **Space Efficient**: Replaces title, uses same space
5. **Accessibility**: Better for screen readers and keyboard navigation
6. **User Experience**: Reduces confusion, especially in deep navigation
