# Prisma Schema Optimizations Summary

## Key Decisions & Optimizations Made

### 1. Referential Actions (onDelete/onUpdate)

**Decision**: Removed all `onDelete: Cascade` actions for MongoDB best practices.

**Rationale**:
- MongoDB doesn't natively support referential actions
- Prisma emulates them at application level (less reliable)
- Better to handle cascades manually with transactions

**Current State**:
- ✅ All simple relations: **No referential actions** (clean, simple)
- ✅ Self-relations & cyclic relations: **`onDelete: NoAction, onUpdate: NoAction`** (required by Prisma)

**Files Updated**:
- `content.prisma` - Removed cascades, kept NoAction for self/cyclic relations
- `relations.prisma` - Changed to NoAction
- `analytics.prisma` - Changed to NoAction
- `media.prisma` - Changed to NoAction
- `auth.prisma` - Removed cascades
- `newsletter.prisma` - Removed cascades

### 2. Analytics Model Optimization

**Decision**: Converted from aggregate counters to pure event-based tracking.

**Changes**:
- ❌ Removed: `pageViews Int`, `uniqueVisitors Int` (counter fields)
- ✅ Added: `sessionId String?`, `userId String? @db.ObjectId` (for unique tracking)
- ✅ Changed: `avgTimeOnPage` → `timeOnPage` (per-event)
- ✅ Changed: `bounceRate Float` → `bounced Boolean` (per-event)
- ✅ Added: `userAgent String?`, `ipAddress String?` (tracking fields)

**How It Works**:
- Each view = one Analytics record
- Total views = `count({ where: { articleId } })`
- Unique visitors = `groupBy sessionId`
- All metrics are per-event (not aggregated)

### 3. Unique Constraints with Optional Fields

**Issue Found**: 
- `Author.userId String? @unique` - MongoDB doesn't allow multiple nulls
- `User.email String? @unique` - Same limitation

**Status**: ⚠️ **Not Fixed Yet** - Needs decision:
- Option 1: Remove `@unique` if multiple nulls needed
- Option 2: Make field required if uniqueness critical
- Option 3: Use sparse indexes (manual MongoDB setup)

**Impact**: Seed script can only create 1 author without userId

### 4. Article Model Size

**Decision**: Keep Article model as single large model (60+ fields).

**Rationale**:
- Fields accessed together (content + SEO)
- Well under 16MB limit (even with all fields)
- MongoDB best practice: denormalize what's accessed together
- No performance issues yet

**Future Consideration**: Split SEO metadata only if performance issues arise.

### 5. Multi-File Schema Structure

**Status**: ✅ Correctly configured

**Structure**:
```
prisma/schema/
├── schema.prisma      (generator + datasource)
├── enums.prisma       (enums)
├── auth.prisma        (User, Account, Session)
├── author.prisma      (Author)
├── client.prisma      (Client)
├── content.prisma     (Article, Category, Tag, etc.)
├── media.prisma       (Media)
├── analytics.prisma   (Analytics)
├── relations.prisma   (FAQ, RelatedArticle)
└── newsletter.prisma  (Subscriber)
```

**Configuration**: `package.json` has `"schema": "./prisma/schema"`

### 6. Seed Script

**Status**: ✅ Complete and functional

**Features**:
- Seeds 100 articles (for infinite scroll testing)
- Creates 4 clients, 8 authors, 4 categories, 20 tags
- Generates 100 media files, analytics events, FAQs, related articles
- Event-based analytics tracking
- Arabic content distributed across dates (6 months)

**Usage**:
```bash
npm run seed        # Seed without clearing
npm run seed:clear  # Clear database first, then seed
```

## MongoDB Best Practices Applied

1. ✅ **No emulated cascades** - Handle manually in code
2. ✅ **Event-based analytics** - One record per event
3. ✅ **Proper indexes** - All query patterns indexed
4. ✅ **ObjectId usage** - Correct `@db.ObjectId` annotations
5. ✅ **Multi-file schema** - Organized by domain
6. ✅ **Simple relations** - No unnecessary referential actions

## Known Limitations

1. ⚠️ **Unique constraints with nulls** - Author.userId, User.email
2. ⚠️ **No Prisma Migrate** - Use `prisma db push` for MongoDB
3. ⚠️ **Referential actions** - Only NoAction for self/cyclic relations (Prisma requirement)

## Files Modified

- `prisma/schema/analytics.prisma` - Optimized for event-based tracking
- `prisma/schema/content.prisma` - Removed cascades
- `prisma/schema/relations.prisma` - Changed to NoAction
- `prisma/schema/media.prisma` - Changed to NoAction
- `prisma/schema/auth.prisma` - Removed cascades
- `prisma/schema/newsletter.prisma` - Removed cascades
- `prisma/seed.ts` - Updated for new Analytics model
- `lib/db.ts` - Prisma client singleton
- `package.json` - Added seed scripts

## Next Steps (If Needed)

1. Fix unique constraint issues (Author.userId, User.email)
2. Implement manual cascade deletion logic in application code
3. Create analytics tracking functions (see ANALYTICS_USAGE.md)
4. Add cleanup/archiving for old analytics data



