# SEO Metadata & JSON-LD Storage - Technical Report

## Executive Summary

This report analyzes the current implementation of SEO metadata and JSON-LD generation, and proposes storing pre-generated Next.js Metadata objects and JSON-LD structured data in the database to improve performance and consistency.

---

## Current State Analysis

### 1. JSON-LD Implementation

**Status:** Partially Implemented

**Current Behavior:**
- JSON-LD generation function exists: `generateAndSaveJsonLd()` in `admin/lib/seo/jsonld-storage.ts`
- Database schema includes JSON-LD fields:
  - `jsonLdStructuredData` (String) - Cached JSON-LD string
  - `jsonLdLastGenerated` (DateTime) - Generation timestamp
  - `jsonLdValidationReport` (Json) - Validation results
  - `articleBodyText` (String) - Plain text for schema.org
- Article page (`beta/app/articles/[slug]/page.tsx`) already uses cached JSON-LD if available (lines 179-186)
- **Issue:** JSON-LD is NOT generated during article creation - only manually or during edit

**Code Reference:**
- Generation: `admin/lib/seo/jsonld-storage.ts:92-190`
- Usage: `beta/app/articles/[slug]/page.tsx:179-186`

---

### 2. Next.js Metadata Implementation

**Status:** Generated On-The-Fly

**Current Behavior:**
- Metadata is generated on every page request via `generateMetadata()` function
- Function located in `beta/app/articles/[slug]/page.tsx:37-101`
- Uses `generateMetadataFromSEO()` helper from `beta/lib/seo.ts:21-104`
- Requires database query with multiple relations (client, author, category, featuredImage)
- **Issue:** No caching - metadata generated on every request

**Performance Impact:**
- Database query with 4+ relations on every page load
- Metadata generation computation on every request
- No consistency guarantee (could change between requests)

**Code Reference:**
- Generation: `beta/app/articles/[slug]/page.tsx:37-101`
- Helper: `beta/lib/seo.ts:21-104`
- Preview Logic: `admin/app/(dashboard)/articles/components/steps/seo-step.tsx:308-354`

---

### 3. Technical SEO Step Preview

**Status:** Preview Only (Not Saved)

**Current Behavior:**
- Technical SEO step shows preview of Next.js Metadata object
- Generated in `admin/app/(dashboard)/articles/components/steps/seo-step.tsx:308-354`
- Logic matches what should be stored
- **Issue:** This preview is NOT saved to database - only displayed

**Code Reference:**
- Preview: `admin/app/(dashboard)/articles/components/steps/seo-step.tsx:308-354`

---

## Proposed Solution

### Objective

Store pre-generated SEO data in database to:
1. Eliminate on-the-fly generation during page rendering
2. Ensure consistency between admin preview and frontend output
3. Improve page load performance
4. Reduce database queries during page rendering

### Components to Store

1. **Next.js Metadata Object** (New)
   - Format: Next.js `Metadata` type (JSON)
   - Size: ~1-2KB per article
   - Generated from: Article data + client + author + category + featured image

2. **JSON-LD Structured Data** (Enhancement)
   - Format: JSON-LD string (already exists)
   - Size: ~3-5KB per article
   - Generated from: Complete article knowledge graph
   - **Enhancement:** Generate during article creation (currently only on edit)

---

## Technical Architecture

### Data Flow (Current vs Proposed)

#### Current Flow (On-The-Fly Generation)

```
Page Request
    ↓
generateMetadata() called
    ↓
Database Query (article + relations)
    ↓
generateMetadataFromSEO() computation
    ↓
Return Metadata
    ↓
Page Rendered
```

**Issues:**
- Query + computation on every request
- No caching
- Potential inconsistency

#### Proposed Flow (Pre-Generated Storage)

```
Article Save
    ↓
Generate Metadata Object
    ↓
Generate JSON-LD
    ↓
Store Both in Database
    ↓
[Later...]
    ↓
Page Request
    ↓
Fetch Pre-Generated Metadata
    ↓
Return Metadata (no computation)
    ↓
Page Rendered
```

**Benefits:**
- No computation on page load
- Single simple query
- Guaranteed consistency

---

## Database Schema Changes

### New Field Required

**Article Model:**
```prisma
model Article {
  // ... existing fields ...
  
  // Next.js Metadata Cache (NEW)
  nextjsMetadata Json? // Cached Next.js Metadata object
  nextjsMetadataLastGenerated DateTime? // When metadata was last generated
  
  // JSON-LD (EXISTING - enhance to generate on create)
  jsonLdStructuredData String? @db.String
  jsonLdLastGenerated DateTime?
  // ... other JSON-LD fields ...
}
```

**Storage Size:**
- `nextjsMetadata`: ~1-2KB JSON per article
- `jsonLdStructuredData`: ~3-5KB string per article
- Total: ~4-7KB per article (minimal impact)

---

## Implementation Strategy

### Phase 1: Schema & Generation

1. Add `nextjsMetadata` and `nextjsMetadataLastGenerated` to Article schema
2. Create `generateNextjsMetadata()` function (extract logic from SEO step)
3. Integrate into `createArticle()` action
4. Integrate into `updateArticle()` action

### Phase 2: Page Rendering

1. Update `generateMetadata()` in article page to use stored metadata
2. Add fallback to on-the-fly generation if stored metadata missing
3. Ensure backward compatibility

### Phase 3: JSON-LD Enhancement

1. Call `generateAndSaveJsonLd()` during article creation
2. Ensure error handling doesn't block article save
3. Add logging for generation failures

---

## Performance Analysis

### Current Performance (On-The-Fly)

**Per Page Request:**
- Database query: ~50-100ms (with relations)
- Metadata generation: ~5-10ms
- Total: ~55-110ms per request

**At Scale (1000 requests/min):**
- Database load: 1000 queries/min
- CPU usage: Continuous computation
- Response time: Variable (55-110ms)

### Proposed Performance (Pre-Generated)

**Per Page Request:**
- Database query: ~10-20ms (simple select)
- Metadata retrieval: ~0ms (already computed)
- Total: ~10-20ms per request

**At Scale (1000 requests/min):**
- Database load: 1000 simple queries/min
- CPU usage: Minimal (no computation)
- Response time: Consistent (~10-20ms)

**Improvement:**
- **~70-80% faster** page metadata generation
- **~80% reduction** in database query complexity
- **Consistent** response times

---

## Risk Assessment

### Low Risk

- **Storage overhead:** Minimal (~4-7KB per article)
- **Backward compatibility:** Fallback ensures old articles work
- **Type safety:** JSON validation can be added

### Medium Risk

- **Cache invalidation:** Need to regenerate when related data changes
  - Solution: Regenerate on article update, add triggers for client/author changes
- **Staleness:** Stored metadata might become outdated
  - Solution: Regenerate on every article update

### Mitigation Strategies

1. **Hybrid Approach:** Use stored metadata if available, fallback to generation
2. **Version Tracking:** Add metadata version field for future migrations
3. **Error Handling:** Don't block article save if metadata generation fails
4. **Logging:** Track generation failures for monitoring

---

## Compatibility Considerations

### Next.js Metadata Type

- Next.js `Metadata` type is stable
- Changes are backward compatible
- Can add version field if needed

### JSON-LD Schema

- Schema.org is stable
- Already versioned in database (`jsonLdVersion` field)
- Validation ensures correctness

---

## Migration Strategy

### Existing Articles

**Option 1: Lazy Migration**
- Generate metadata on first page load
- Store for future use
- No upfront cost

**Option 2: Background Migration**
- Background job to generate metadata for all articles
- Run during low-traffic periods
- Complete migration over time

**Recommendation:** Option 1 (Lazy Migration) - simpler, no upfront cost

---

## Success Metrics

### Performance
- Page metadata generation time: < 20ms (target)
- Database query reduction: 80% fewer relations needed
- Consistent response times

### Reliability
- Zero metadata generation failures blocking article saves
- 100% backward compatibility with existing articles
- Fallback works for all edge cases

### Maintainability
- Clear separation: generation logic in one place
- Easy to debug: stored metadata visible in database
- Testable: can test generation independently

---

## Conclusion

Storing pre-generated Next.js Metadata and JSON-LD in the database provides significant performance improvements with minimal risk. The hybrid approach (use stored if available, fallback to generation) ensures backward compatibility and reliability.

**Recommendation:** Proceed with implementation using the hybrid approach.

---

**Report Date:** 2025-01-27  
**Status:** Ready for Implementation  
**Risk Level:** Low-Medium (with mitigation strategies)
