# AI Monorepo Instructions - Complete Codebase Guide

> **Purpose**: This document provides comprehensive instructions for AI assistants to understand, navigate, and modify this monorepo codebase without introducing errors or bugs.

---

## 📋 Table of Contents

1. [Monorepo Overview](#monorepo-overview)
2. [Package Structure](#package-structure)
3. [Technology Stack](#technology-stack)
4. [File Organization Patterns](#file-organization-patterns)
5. [Database & Prisma](#database--prisma)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Architecture](#api-architecture)
8. [Routing & Middleware](#routing--middleware)
9. [Component Architecture](#component-architecture)
10. [Styling & UI](#styling--ui)
11. [Internationalization](#internationalization)
12. [Build & Deployment](#build--deployment)
13. [Critical Rules & Warnings](#critical-rules--warnings)
14. [Common Patterns](#common-patterns)
15. [Error Prevention Checklist](#error-prevention-checklist)

---

## 🏗️ Monorepo Overview

### Structure

```
modonty-monorepo/
├── admin/              # Admin dashboard application (Next.js App Router)
├── beta/               # Multi-client blog platform (Modonty) - Next.js App Router
├── home/               # Fresh Next.js application (minimal setup)
├── dataLayer/          # Shared Prisma schema and database package
├── pnpm-workspace.yaml # Workspace configuration
├── pnpm-lock.yaml      # ONLY lockfile (at root, NOT in packages)
└── package.json        # Root package.json (minimal, for workspace)
```

### Key Principles

1. **Single Database Schema**: All apps share `dataLayer/prisma/schema.prisma`
2. **Separate Applications**: Admin, Beta, and Home are independent Next.js apps
3. **Shared Database Package**: `@modonty/database` workspace package
4. **One Lockfile**: Only root has `pnpm-lock.yaml` (critical rule)
5. **Independent Deployments**: Each app deploys separately on Vercel
6. **Package Scope**: All packages use `@modonty/*` namespace

---

## 📦 Package Structure

### 1. `admin/` - Admin Dashboard

**Package Name**: `@modonty/admin`

**Purpose**: **ALL admin tasks and management** happen in this package. This is the internal admin dashboard for managing the entire platform.

**Key Characteristics**:
- **ALL Admin Functionality**: Content management, user management, client management, article publishing, analytics, etc.
- **Authentication**: NextAuth v5 (beta) with credentials provider
- **Layout**: RTL (Arabic), dark mode, Tajawal font
- **Routes**: Protected by middleware with route-based permissions
- **Database**: Uses `@modonty/database` workspace package
- **Server Actions**: Primary data mutation method (direct database access)

**Critical Rule**: 
- ✅ **ALL admin tasks** must be in `admin/` package
- ❌ **NO admin functionality** in `beta/` or `home/` packages
- ✅ Admin manages content, users, clients, articles, analytics

**Important Files**:
- `auth.config.ts` - NextAuth configuration
- `proxy.ts` - Middleware for auth and route permissions
- `lib/auth.ts` - NextAuth instance export
- `lib/prisma.ts` - Prisma client singleton
- `app/layout.tsx` - Root layout with RTL support
- `components/ui/` - shadcn/ui components

**Routes Structure**:
```
admin/app/
├── login/              # Public login page
├── no-permissions/     # Shown when user has no route permissions
├── page.tsx            # Dashboard home (protected)
├── users/              # User management
├── applications/       # Job applications management
├── staff/              # Staff management
├── tasks/              # Task management
├── settings/           # Settings pages
└── api/                # API routes
```

### 2. `beta/` - Multi-Client Blog Platform (Modonty)

**Package Name**: `@modonty/beta`

**Purpose**: **End-user facing** multi-client blog platform where readers can browse, read articles, and interact with content. This is a **public-facing application** with user authentication for engagement features.

**Key Characteristics**:
- **End-User Focused**: No admin tasks or management features (all admin in `admin/` package)
- **Public Blog Platform**: Readers browse articles by clients and categories
- **User Authentication**: NextAuth with Google, Facebook, and Email/Password providers
- **User Features**: Profile management, comments, reactions (when logged in)
- **SEO Optimized**: Meta tags, structured data, clean URLs
- **Article Reading**: View published articles, browse by client/category
- **REST API**: All data operations via API endpoints (mobile-ready)
- **Database**: Uses `@modonty/database` workspace package (via API)

**Important**: 
- ❌ **NO admin functionality** - All admin tasks are in `admin/` package
- ✅ **User authentication** - NextAuth with Google, Facebook, Email/Password
- ✅ **Logged-in features** - Comments, reactions, profile updates
- ✅ **Public access** - Anonymous users can browse and read articles

**Important Files**:
- `app/layout.tsx` - Root layout (RTL Arabic support)
- `app/page.tsx` - Home page with article feed
- `components/ArticleCard.tsx` - Article card component
- `components/ArticleFeed.tsx` - Article feed container
- `components/FeedContainer.tsx` - Main feed wrapper
- `lib/db.ts` - Prisma client instance
- `helpers/mockData.ts` - Mock data helpers

**Routes Structure**:
```
beta/app/
├── page.tsx            # Home page (article feed)
├── categories/         # Categories page (browse by category)
├── clients/            # Clients page (browse by client)
├── articles/[slug]/    # Article detail pages (reading view)
├── profile/            # User profile page (authenticated)
├── api/auth/           # NextAuth API routes
└── api/                # REST API endpoints
```

**Key Features**:
- Public article browsing (anonymous users)
- Client-based article filtering
- Category-based article filtering
- Article reading experience
- User authentication (NextAuth: Google, Facebook, Email/Password)
- User profile management
- Comments on articles (authenticated users)
- Reactions on articles (authenticated users)
- SEO optimization
- Mobile-ready API endpoints

**Authentication Providers**:
- Google OAuth
- Facebook OAuth
- Email/Password (credentials)

**User Features** (when logged in):
- Update profile
- Comment on articles
- React to articles (like, etc.)
- View personal activity

**Admin Features** (NOT in beta):
- ❌ Admin dashboard (in `admin/` package)
- ❌ Content management (in `admin/` package)
- ❌ User management (in `admin/` package)
- ❌ Analytics dashboard (in `admin/` package)

### 3. `home/` - Fresh Next.js Application

**Package Name**: `@modonty/home`

**Purpose**: Fresh, minimal Next.js application ready for new development.

**Key Characteristics**:
- **Minimal Setup**: Clean Next.js 16 with React 19
- **TypeScript**: Full TypeScript support
- **Tailwind CSS**: Pre-configured with shadcn/ui setup
- **Database**: Uses `@modonty/database` workspace package
- **Ready for Development**: Basic structure in place

**Important Files**:
- `app/layout.tsx` - Root layout
- `app/page.tsx` - Home page
- `app/globals.css` - Global styles
- `lib/utils.ts` - Utility functions (cn helper)
- `tailwind.config.ts` - Tailwind configuration
- `next.config.ts` - Next.js configuration

**Routes Structure**:
```
home/app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
└── globals.css         # Global styles
```

**Note**: This is a fresh application. Add routes and features as needed.

### 4. `dataLayer/` - Shared Database

**Package Name**: `@modonty/database`

**Purpose**: Centralized Prisma schema shared by all apps (admin, beta, home)

**Key Characteristics**:
- **Modular Schema**: Schema split into multiple files in `prisma/schema/` directory
- **MongoDB**: Uses MongoDB as database provider
- **Workspace Package**: Exported as `@modonty/database`
- **Main Schema**: `prisma/schema/schema.prisma` imports all modules

**Critical Rules**:
- ✅ **ONLY** edit files in `dataLayer/prisma/schema/`
- ❌ **NEVER** create schema files in `admin/`, `beta/`, or `home/`
- ✅ **ALWAYS** run `pnpm prisma:generate` after schema changes
- ✅ **ALWAYS** test all apps after schema changes

**Schema Location**:
```
dataLayer/
└── prisma/
    ├── schema/         # Schema modules directory
    │   ├── schema.prisma    # Main schema file (imports others)
    │   ├── analytics.prisma # Analytics models
    │   ├── auth.prisma      # Authentication models
    │   ├── author.prisma    # Author models
    │   ├── client.prisma    # Client models
    │   ├── content.prisma   # Content/Article models
    │   ├── enums.prisma     # Enum definitions
    │   ├── media.prisma     # Media models
    │   ├── newsletter.prisma # Newsletter models
    │   └── relations.prisma  # Relation definitions
    └── seed.ts         # Database seeding script
```

---

## 🛠️ Technology Stack

### Core Technologies

| Technology | Version | Usage |
|------------|---------|-------|
| **Next.js** | 16.0.10 | App Router for both apps |
| **React** | 19.2.3 | UI framework |
| **TypeScript** | 5.7.2 | Type safety |
| **Prisma** | 6.18.0 | Database ORM |
| **MongoDB** | - | Database provider |
| **NextAuth** | 5.0.0-beta.30 | Authentication (admin only) |
| **next-intl** | 4.5.5 | Internationalization (home only) |
| **Tailwind CSS** | 3.4.17 | Styling |
| **shadcn/ui** | - | UI component library |
| **Zod** | 4.1.12 | Schema validation |
| **pnpm** | - | Package manager (monorepo) |

### UI Libraries

- **shadcn/ui**: Primary UI component library (both apps)
- **Radix UI**: Base components for shadcn/ui
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Additional Libraries

- **Cloudinary**: Image upload and management
- **Resend**: Email sending (admin)
- **MongoDB**: Database driver

---

## 📁 File Organization Patterns

### Admin App Structure

```
admin/
├── actions/              # Server actions
│   ├── auth.ts
│   ├── users.ts
│   ├── applications.ts
│   └── ...
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Dashboard home
│   ├── login/            # Public routes
│   ├── [feature]/        # Feature routes
│   └── api/              # API routes
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin-specific components
│   ├── common/           # Shared components
│   ├── layout/           # Layout components
│   └── [feature]/        # Feature-specific components
├── helpers/              # Utility functions
├── lib/                  # Core libraries
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth instance
│   ├── utils.ts          # Utility functions
│   └── validations/      # Zod schemas
├── types/                # TypeScript type definitions
├── messages/             # Translation files (ar.json)
└── scripts/              # Utility scripts
```

### Home App Structure

```
home/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css        # Global styles
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
└── [config files]          # next.config.ts, tsconfig.json, etc.
```

### Naming Conventions

- **Files**: `kebab-case.tsx` or `PascalCase.tsx` for components
- **Components**: `PascalCase` (e.g., `UserProfile.tsx`)
- **Server Actions**: `camelCase.ts` (e.g., `updateUser.ts`)
- **Helpers**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Types**: `PascalCase` interfaces/types
- **Constants**: `UPPER_SNAKE_CASE`

---

## 🗄️ Database & Prisma

### Schema Location

**ONLY ONE SCHEMA FILE**: `dataLayer/prisma/schema.prisma`

### Key Models

1. **User**: Admin users with roles and permissions
2. **Application**: Job applications from public site
3. **Staff**: Staff members linked to applications
4. **Task**: Task management
5. **UserRoutePermission**: Route-based permissions
6. **Phase1Requirement**: Project requirements tracking

### Prisma Client Usage

**Both apps use the same pattern**:

```typescript
// admin/lib/prisma.ts or home/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Schema Change Workflow

**CRITICAL**: Follow this exact workflow:

1. **Edit schema**: `dataLayer/prisma/schema.prisma`
2. **Generate client**: `cd dataLayer && pnpm prisma:generate`
3. **Test admin**: `cd ../admin && pnpm build`
4. **Test home**: `cd ../home && pnpm build`
5. **Commit**: Only if both apps build successfully

### Database Connection

- **Environment Variable**: `DATABASE_URL` (MongoDB connection string)
- **Provider**: MongoDB
- **Connection**: Shared between both apps

### Important Schema Rules

- ✅ Use `@id @default(auto()) @map("_id") @db.ObjectId` for MongoDB IDs
- ✅ Use `DateTime @default(now())` for timestamps
- ✅ Use `DateTime @updatedAt` for auto-updated timestamps
- ✅ Index frequently queried fields
- ✅ Use enums for status fields (e.g., `ApplicationStatus`)

---

## 🔐 Authentication & Authorization

### Admin App Authentication

**Technology**: NextAuth v5 (beta) with credentials provider

**Key Files**:
- `admin/auth.config.ts` - NextAuth configuration
- `admin/lib/auth.ts` - NextAuth instance
- `admin/proxy.ts` - Middleware for route protection
- `admin/app/api/auth/[...nextauth]/route.ts` - Auth API route

**Authentication Flow**:

1. User submits credentials on `/login`
2. `auth.config.ts` validates against database
3. JWT token created with user data (id, role, email, name)
4. Session stored in JWT (no database session)
5. Middleware (`proxy.ts`) checks session on protected routes
6. Route permissions checked via `UserRoutePermission` model

**Session Structure**:

```typescript
{
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
  }
}
```

**Route Protection**:

- **Middleware**: `admin/proxy.ts` handles all route protection
- **Permission Check**: `hasRoutePermission(route, userId)` function
- **No Permissions**: Redirects to `/no-permissions` if user has no routes
- **Login Redirect**: Redirects to `/login` if not authenticated

**Important Auth Rules**:

- ✅ Session uses JWT strategy (no database sessions)
- ✅ Password comparison is plain text (stored as-is in DB)
- ✅ User must be `isActive: true` to login
- ✅ Last login timestamp updated on successful login
- ✅ Activity logged on login

### Beta App Authentication

**NextAuth Implementation** - User authentication for engagement features

**Authentication Providers**:
- **Google OAuth** - Sign in with Google
- **Facebook OAuth** - Sign in with Facebook
- **Email/Password** - Credentials provider

**Authentication Flow**:
1. Users can browse articles anonymously (public access)
2. Users can sign in via Google, Facebook, or Email/Password
3. Authenticated users can:
   - Update their profile
   - Comment on articles
   - React to articles (like, etc.)
   - View personal activity

**Important**: 
- ✅ **User authentication** - For engagement features (comments, reactions)
- ❌ **NO admin authentication** - All admin tasks are in `admin/` package
- ✅ **Public access** - Anonymous users can browse and read articles
- ✅ **Optional login** - Users choose to log in for interactive features

### Home App Authentication

**No authentication required** - Fresh application, ready for auth setup if needed

---

## 🔌 API Architecture

### API Strategy by App

**Admin App**:
- ✅ **Server Actions** (primary) - Direct database mutations
- ✅ **API Routes** (optional) - Only if specific API needs arise
- Direct Prisma access in server components/actions
- No need for REST API (internal admin tool)

**Beta App**:
- ✅ **REST API** (required) - All data operations via API endpoints
- ✅ **API Routes** in `app/api/` directory
- ✅ **Mobile-Ready** - Designed for future mobile app consumption
- Client components fetch from `/api/*` endpoints
- Standard REST conventions (GET, POST, PUT, DELETE)

**Home App**:
- ✅ **REST API** (required) - All data operations via API endpoints
- ✅ **API Routes** in `app/api/` directory
- ✅ **Mobile-Ready** - Designed for future mobile app consumption
- Client components fetch from `/api/*` endpoints
- Standard REST conventions (GET, POST, PUT, DELETE)

### API Route Structure

**Beta/Home API Routes**:
```
beta/app/api/          (or home/app/api/)
├── articles/
│   ├── route.ts       # GET, POST /api/articles
│   └── [id]/
│       └── route.ts   # GET, PUT, DELETE /api/articles/[id]
├── clients/
│   └── route.ts       # GET, POST /api/clients
├── categories/
│   └── route.ts       # GET /api/categories
└── ...
```

### API Response Format

**Standard API Response**:
```typescript
// Success response
{
  success: true,
  data: { /* response data */ }
}

// Error response
{
  success: false,
  error: "Error message" | { /* error details */ }
}
```

### API Best Practices

1. **✅ Consistent Response Format** - Always use `{ success, data, error }` structure
2. **✅ Error Handling** - Proper HTTP status codes (200, 400, 401, 404, 500)
3. **✅ Input Validation** - Use Zod schemas for request validation
4. **✅ Type Safety** - TypeScript types for request/response
5. **✅ Mobile Compatibility** - RESTful design, JSON responses
6. **✅ CORS** - Configure CORS if needed for mobile apps
7. **✅ Rate Limiting** - Consider rate limiting for public APIs

### API Example Structure

```typescript
// beta/app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const createArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  clientId: z.string(),
});

export async function GET() {
  try {
    const articles = await db.article.findMany({
      where: { status: 'PUBLISHED' },
    });
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createArticleSchema.parse(body);
    
    const article = await db.article.create({ data: validated });
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
```

---

## 🛣️ Routing & Middleware

### Admin App Routing

**Middleware**: `admin/proxy.ts`

**Route Protection Logic**:

1. **Public Routes**: `/login`, `/no-permissions`, `/api/auth/*`
2. **Protected Routes**: Everything else
3. **Permission Check**: After authentication, checks `UserRoutePermission`
4. **Redirect Logic**:
   - Not authenticated → `/login?callbackUrl=/requested-route`
   - No permissions → `/no-permissions`
   - Has permissions → Allow access

**Route Normalization**:

- Routes are normalized before permission check
- Trailing slashes removed
- Query params ignored for permission matching

### Beta App Routing

**Public Blog Routes**: End-user reading and engagement routes

**Structure**:
- `/` - Home page (article feed) - Public
- `/categories` - Categories page (browse articles by category) - Public
- `/clients` - Clients page (browse articles by client) - Public
- `/articles/[slug]` - Article detail pages (reading view) - Public
- `/profile` - User profile page (authenticated)
- `/api/auth/*` - NextAuth API routes (Google, Facebook, Email/Password)
- `/api/*` - REST API endpoints (for client and mobile consumption)

**Authentication Routes**:
- `/api/auth/signin` - Sign in page
- `/api/auth/callback/[provider]` - OAuth callbacks (Google, Facebook)
- `/api/auth/signout` - Sign out

**Middleware**: 
- Public routes accessible to all
- Profile routes require authentication
- Comments/reactions require authentication

**Language**: Arabic (RTL) by default

**API Routes**: All data operations go through `/api/*` endpoints

**Admin Routes** (NOT in beta, all in admin package):
- ❌ `/admin` - Admin dashboard (in `admin/` package)
- ❌ Content management routes (in `admin/` package)
- ❌ User management routes (in `admin/` package)

### Home App Routing

**Fresh Application**: Minimal routing structure

**Structure**:
- `/` - Home page
- `/api/*` - REST API endpoints (for client and mobile consumption)

**Note**: This is a fresh application. Add routes as needed for your use case.

**API Routes**: All data operations go through `/api/*` endpoints (designed for mobile compatibility)

---

## 🧩 Component Architecture

### Data Fetching Architecture

**Important**: Different apps use different data fetching strategies:

1. **Admin App**: 
   - ✅ **Server Actions** (primary) - Direct database access via server actions
   - ✅ **API Routes** (if needed) - For specific use cases
   - Direct Prisma access in server components/actions

2. **Beta App**:
   - ✅ **REST API** (primary) - All data fetching via API endpoints
   - ✅ **API Routes** in `app/api/` directory
   - Designed for future mobile app compatibility
   - Client components fetch from API endpoints

3. **Home App**:
   - ✅ **REST API** (primary) - All data fetching via API endpoints
   - ✅ **API Routes** in `app/api/` directory
   - Designed for future mobile app compatibility
   - Client components fetch from API endpoints

### Component Types

1. **Server Components** (default):
   - No `"use client"` directive
   - Can access database directly (Admin only)
   - Can fetch from API (Beta/Home)
   - No hooks or browser APIs

2. **Client Components**:
   - Must have `"use client"` directive
   - Can use hooks, state, effects
   - Can handle user interactions
   - Fetch data from API endpoints (Beta/Home)

### Component Organization

**UI Components** (`components/ui/`):
- shadcn/ui components
- Reusable, styled components
- Examples: `Button`, `Dialog`, `Input`, `Card`

**Feature Components** (`components/[feature]/`):
- Feature-specific components
- Examples: `UserTable`, `ApplicationCard`

**Layout Components** (`components/layout/`):
- Layout wrappers
- Examples: `DashboardLayout`, `Navigation`

**Common Components** (`components/common/`):
- Shared across features
- Examples: `MetricCard`, `ThemeToggle`

### Component Patterns

**Admin App - Server Action Pattern**:

```typescript
// admin/actions/updateUser.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function updateUser(id: string, data: UserData) {
  // Direct database access via server action
  return await prisma.user.update({
    where: { id },
    data,
  });
}
```

**Admin App - Client Component with Server Action**:

```typescript
// admin/components/UserForm.tsx
'use client';

import { useState } from 'react';
import { updateUser } from '@/actions/updateUser';

export function UserForm() {
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(data: FormData) {
    setLoading(true);
    await updateUser(id, data);
    setLoading(false);
  }
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Beta/Home App - API Route Pattern**:

```typescript
// beta/app/api/articles/route.ts (or home/app/api/articles/route.ts)
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const articles = await db.article.findMany({
    where: { status: 'PUBLISHED' },
  });
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  const data = await request.json();
  const article = await db.article.create({ data });
  return NextResponse.json(article);
}
```

**Beta/Home App - Client Component with API Fetch**:

```typescript
// beta/components/ArticleList.tsx (or home/components/ArticleList.tsx)
'use client';

import { useState, useEffect } from 'react';

export function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
      setLoading(false);
    }
    fetchArticles();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render articles */}</div>;
}
```

### Import Patterns

**Path Aliases** (configured in `tsconfig.json`):
- `@/components` → `components/`
- `@/lib` → `lib/`
- `@/actions` → `actions/`
- `@/helpers` → `helpers/`
- `@/types` → `types/`

**Workspace Imports**:
- `@modonty/database` → `dataLayer` package (for Prisma types)
- `@modonty/admin` → `admin` package
- `@modonty/beta` → `beta` package
- `@modonty/home` → `home` package

---

## 🎨 Styling & UI

### Tailwind CSS Configuration

**Both apps use identical Tailwind config**:
- Dark mode: `class` strategy
- Font: Tajawal (Arabic font)
- Colors: HSL variables (shadcn/ui pattern)
- Brand colors: CSS variables

**Color System**:
- Uses HSL color variables
- Semantic color tokens (primary, secondary, destructive, etc.)
- Brand colors via CSS variables (`--brand-primary`, etc.)

### shadcn/ui Components

**Configuration**:
- Style: `new-york`
- RSC: `true` (React Server Components)
- Base color: `neutral`
- CSS variables: `true`
- Icon library: `lucide`

**Available Components** (both apps):
- `alert`, `alert-dialog`, `badge`, `button`, `card`
- `checkbox`, `collapsible`, `dialog`, `dropdown-menu`
- `input`, `label`, `progress`, `select`, `separator`
- `table`, `textarea`, `tooltip`

### Styling Rules

1. ✅ **Always use Tailwind utilities** - No inline styles
2. ✅ **Use semantic color tokens** - `bg-primary`, `text-destructive`, etc.
3. ✅ **Use shadcn/ui components** - Don't create custom UI from scratch
4. ✅ **RTL Support** - Admin uses RTL (Arabic), Home uses locale-based direction
5. ✅ **Dark Mode** - Both apps support dark mode
6. ❌ **Never hardcode colors** - Use CSS variables or Tailwind tokens

### Font Configuration

**Admin App**:
- Font: Tajawal (Arabic)
- Direction: RTL
- Language: Arabic (`lang="ar" dir="rtl"`)

**Home App**:
- Font: Tajawal (supports Arabic and Latin)
- Direction: Based on locale (RTL for `ar`, LTR for `en`)

---

## 🌍 Internationalization

### Beta App

**Language Support**: Arabic (RTL)
- Layout: RTL (Arabic) by default
- Font: Tajawal
- No internationalization library (single language)

### Admin App

**Translation Files**: `admin/messages/ar.json`
- Currently Arabic only
- Uses simple JSON import (not next-intl)

### Home App

**Language Support**: English (LTR) by default
- Fresh application, ready for i18n setup if needed

---

## 🚀 Build & Deployment

### Build Commands

**Admin App**:
```bash
cd admin
pnpm build  # Runs: prisma generate + next build
```

**Beta App**:
```bash
cd beta
pnpm build  # Runs: prisma generate + next build
```

**Home App**:
```bash
cd home
pnpm build  # Runs: prisma generate + next build
```

**Prisma Generate**:
```bash
cd dataLayer
pnpm prisma:generate
```

**From Root (using workspace scripts)**:
```bash
pnpm build:admin  # Build admin app
pnpm build:beta   # Build beta app
pnpm build:home    # Build home app
pnpm build:all     # Build all apps
```

### Build Process

1. **Prisma Generate**: Must run before building apps
2. **Next.js Build**: Standard Next.js build process
3. **Type Checking**: TypeScript compilation
4. **Output**: `.next` directory in each app

### Deployment (Vercel)

**Three Separate Projects**:

1. **Admin Project**:
   - Root Directory: `admin`
   - Build Command: `cd .. && pnpm install && cd admin && pnpm build`
   - Environment Variables: `DATABASE_URL`, `AUTH_SECRET`, etc.

2. **Beta Project**:
   - Root Directory: `beta`
   - Build Command: `cd .. && pnpm install && cd beta && pnpm build`
   - Environment Variables: `DATABASE_URL`, etc.

3. **Home Project**:
   - Root Directory: `home`
   - Build Command: `cd .. && pnpm install && cd home && pnpm build`
   - Environment Variables: `DATABASE_URL`, etc.

**Auto-Deployment**:
- Pushes to `main` branch trigger deployments
- Changes in `admin/` → Admin redeploys
- Changes in `beta/` → Beta redeploys
- Changes in `home/` → Home redeploys
- Changes in `dataLayer/` → All apps redeploy

### Environment Variables

**Admin App Required**:
- `DATABASE_URL` - MongoDB connection string
- `AUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - NextAuth URL (optional)
- Cloudinary variables (if used)
- Resend API key (if used)

**Beta App Required**:
- `DATABASE_URL` - MongoDB connection string
- `AUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - NextAuth URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `FACEBOOK_CLIENT_ID` - Facebook OAuth app ID
- `FACEBOOK_CLIENT_SECRET` - Facebook OAuth app secret
- Cloudinary variables (if used)

**Home App Required**:
- `DATABASE_URL` - MongoDB connection string
- Cloudinary variables (if used)

---

## ⚠️ Critical Rules & Warnings

### Monorepo Rules

1. **❌ NEVER run `pnpm install` in app folders**
   - ✅ Always run from root: `pnpm install`
   - ✅ Only root should have `pnpm-lock.yaml`

2. **❌ NEVER create schema files in apps**
   - ✅ Only edit: `dataLayer/prisma/schema/` directory
   - ✅ Never create: `admin/prisma/`, `beta/prisma/`, or `home/prisma/`

3. **✅ ALWAYS generate Prisma after schema changes**
   - Run: `cd dataLayer && pnpm prisma:generate`
   - Test both apps build successfully

4. **✅ ALWAYS test all apps after schema changes**
   - Admin: `cd admin && pnpm build`
   - Beta: `cd beta && pnpm build`
   - Home: `cd home && pnpm build`
   - Or from root: `pnpm build:all`

5. **✅ ALWAYS commit from root folder**
   - Even if working in subfolder, commit from root
   - Use: `git add admin/` or `git add home/` for specific packages

### Code Rules

1. **✅ Use shadcn/ui components** - Don't create custom UI from scratch
2. **✅ Admin: Use server actions** - For mutations, prefer server actions
3. **✅ Beta/Home: Use REST API** - All data operations via API endpoints
4. **✅ API Design for Mobile** - Beta/Home APIs should be mobile-friendly (REST, JSON)
5. **✅ Use TypeScript strictly** - No `any`, use proper types
6. **✅ Use semantic colors** - No hardcoded colors
7. **✅ Follow file organization** - Put files in correct folders
8. **✅ Use path aliases** - `@/components` not `../../components`

### Authentication Rules

1. **Admin App**:
   - ✅ All routes except `/login` and `/no-permissions` are protected
   - ✅ Route permissions checked via `UserRoutePermission` model
   - ✅ Session uses JWT (no database sessions)

2. **Beta App**:
   - ✅ No authentication required (public blog platform)
   - ✅ All routes are public

3. **Home App**:
   - ✅ No authentication required
   - ✅ All routes are public

### Database Rules

1. **✅ Single source of truth**: `dataLayer/prisma/schema/` directory
2. **✅ Always generate after changes**: `pnpm prisma:generate`
3. **✅ Test all apps**: After schema changes (admin, beta, home)
4. **✅ Use Prisma client singleton**: Import from `@/lib/prisma` or `@/lib/db`

---

## 🔄 Common Patterns

### Admin App - Server Action Pattern

```typescript
// admin/actions/updateUser.ts
'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function updateUser(id: string, data: unknown) {
  const validated = updateUserSchema.parse(data);
  
  return await prisma.user.update({
    where: { id },
    data: validated,
  });
}
```

### Admin App - Form with Server Action

```typescript
// admin/components/UserForm.tsx
'use client';

import { useState } from 'react';
import { updateUser } from '@/actions/updateUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function UserForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await updateUser(userId, {
        name: formData.get('name'),
        email: formData.get('email'),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <Input name="name" />
      <Input name="email" type="email" />
      <Button type="submit" disabled={loading}>
        Update
      </Button>
    </form>
  );
}
```

### Beta/Home App - API Route Pattern

```typescript
// beta/app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const createArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  clientId: z.string(),
});

export async function GET() {
  try {
    const articles = await db.article.findMany({
      where: { status: 'PUBLISHED' },
      include: { client: true, author: true },
    });
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createArticleSchema.parse(body);
    
    const article = await db.article.create({
      data: validated,
    });
    
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
```

### Beta/Home App - Client Component with API

```typescript
// beta/components/ArticleForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ArticleForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          content: formData.get('content'),
          clientId: formData.get('clientId'),
        }),
      });
      
      const data = await res.json();
      
      if (!data.success) {
        setError(data.error || 'Failed to create article');
        return;
      }
      
      // Handle success (redirect, show message, etc.)
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      <Input name="title" />
      <Input name="content" />
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Article'}
      </Button>
    </form>
  );
}
```

### Admin App - Database Query Pattern

```typescript
// admin/lib/users.ts (server component or server action)
import { prisma } from '@/lib/prisma';

export async function getUsers() {
  return await prisma.user.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
```

### Beta/Home App - API Query Pattern

```typescript
// beta/app/api/users/route.ts (or home/app/api/users/route.ts)
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const users = await db.user.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  
  return NextResponse.json({ success: true, data: users });
}
```

### Beta/Home App - Client Fetch Pattern

```typescript
// beta/components/UserList.tsx (or home/components/UserList.tsx)
'use client';

import { useState, useEffect } from 'react';

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render users */}</div>;
}
```

### Error Handling Pattern

```typescript
'use server';

import { prisma } from '@/lib/prisma';

export async function safeAction(data: unknown) {
  try {
    // Action logic
    return { success: true, data };
  } catch (error) {
    console.error('Action failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

### Type Safety Pattern

```typescript
// types/user.ts
import { User, UserRole } from '@prisma/client';

export type UserWithRole = User & {
  role: UserRole;
};

// Usage
import type { UserWithRole } from '@/types/user';

export async function getUser(id: string): Promise<UserWithRole | null> {
  return await prisma.user.findUnique({
    where: { id },
    include: { /* relations */ },
  });
}
```

---

## ✅ Error Prevention Checklist

### Before Making Changes

- [ ] **Identify which package** you're editing (admin/home/dataLayer)
- [ ] **Check if file is shared** (schema.prisma affects both apps)
- [ ] **Verify file path** is correct
- [ ] **Understand dependencies** (what imports this file?)
- [ ] **Check authentication** (is route protected?)
- [ ] **Review similar patterns** (how is this done elsewhere?)

### When Editing Schema

- [ ] **Only edit** files in `dataLayer/prisma/schema/` directory
- [ ] **Run** `pnpm prisma:generate` after changes
- [ ] **Test admin build**: `cd admin && pnpm build`
- [ ] **Test beta build**: `cd beta && pnpm build`
- [ ] **Test home build**: `cd home && pnpm build`
- [ ] **Or test all**: `pnpm build:all` from root
- [ ] **Check for breaking changes** (removed fields, changed types)

### When Adding Components

- [ ] **Use shadcn/ui** if component exists
- [ ] **Place in correct folder** (ui/common/[feature]/layout)
- [ ] **Add "use client"** only if needed (state, hooks, events)
- [ ] **Use path aliases** (`@/components` not relative paths)
- [ ] **Follow naming conventions** (PascalCase for components)

### When Adding Routes

- [ ] **Admin**: Check if route needs protection (add to middleware)
- [ ] **Admin**: Check if route needs permissions (add to UserRoutePermission)
- [ ] **Beta**: 
  - Public routes (browse articles) - No auth needed
  - Protected routes (profile, comments) - Require authentication
  - NO admin routes (all admin in `admin/` package)
- [ ] **Home**: Fresh app, add routes as needed

### When Using Database

- [ ] **Import from** `@/lib/prisma` (singleton pattern)
- [ ] **Use proper types** from `@prisma/client`
- [ ] **Handle errors** (try/catch, null checks)
- [ ] **Use transactions** for multiple operations
- [ ] **Index queries** (check if fields are indexed)

### Before Committing

- [ ] **Build succeeds** (all apps if schema changed)
- [ ] **No TypeScript errors**
- [ ] **No linting errors**
- [ ] **Test locally** (`pnpm dev:admin`, `pnpm dev:beta`, `pnpm dev:home`)
- [ ] **Check file paths** (correct package: admin/beta/home/dataLayer)
- [ ] **Verify imports** (path aliases, workspace imports)

---

## 📚 Additional Resources

### Key Documentation Files

- `MONOREPO-SETUP.md` - Setup and workflow guide
- `admin/ENV_SETUP.md` - Environment variables setup
- `admin/doc/README.md` - Admin app documentation
- `home/README.md` - Home app documentation

### Important Scripts

**Root**:
- `pnpm install` - Install all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all packages
- `pnpm dev:admin` - Run admin dev server
- `pnpm dev:beta` - Run beta dev server
- `pnpm dev:home` - Run home dev server
- `pnpm build:all` - Build all apps
- `pnpm prisma:generate` - Generate Prisma client

**Admin**:
- `pnpm dev` - Development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

**Beta**:
- `pnpm dev` - Development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm seed` - Seed database
- `pnpm seed:clear` - Clear and seed database

**Home**:
- `pnpm dev` - Development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

**DataLayer**:
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm prisma:format` - Format schema files
- `pnpm prisma:validate` - Validate schema
- `pnpm seed` - Seed database
- `pnpm seed:clear` - Clear and seed database

---

## 🎯 Quick Reference

### Package Identification

| Path | Package | Purpose |
|------|---------|---------|
| `admin/` | `@modonty/admin` | Admin dashboard |
| `beta/` | `@modonty/beta` | Multi-client blog platform (Modonty) |
| `home/` | `@modonty/home` | Fresh Next.js application |
| `dataLayer/` | `@modonty/database` | Shared database |

### Critical File Locations

| File | Location | Purpose |
|------|----------|---------|
| Prisma Schema | `dataLayer/prisma/schema/` | **ONLY** schema directory |
| Admin Auth | `admin/auth.config.ts` | NextAuth config |
| Admin Middleware | `admin/proxy.ts` | Route protection |
| Beta DB Client | `beta/lib/db.ts` | Prisma client |
| Home DB Client | `home/lib/db.ts` (if exists) | Prisma client |
| Admin DB Client | `admin/lib/prisma.ts` | Prisma client |

### Common Commands

```bash
# Install dependencies
pnpm install

# Generate Prisma client
cd dataLayer && pnpm prisma:generate

# Run apps from root
pnpm dev:admin  # Run admin app
pnpm dev:beta   # Run beta app
pnpm dev:home   # Run home app

# Or run from package directory
cd admin && pnpm dev
cd beta && pnpm dev
cd home && pnpm dev

# Build all apps
pnpm build:all

# Build individual apps
cd admin && pnpm build
cd beta && pnpm build
cd home && pnpm build
```

---

## 🔍 Debugging Tips

### Common Issues

1. **Prisma Client not found**
   - Solution: Run `cd dataLayer && pnpm prisma:generate`

2. **Build fails after schema change**
   - Solution: Generate Prisma client, then rebuild both apps

3. **Type errors after schema change**
   - Solution: Restart TypeScript server, regenerate Prisma client

4. **Route not protected**
   - Solution: Check `admin/proxy.ts` middleware configuration

5. **Permission denied**
   - Solution: Check `UserRoutePermission` model, verify user has route assigned

6. **Import errors**
   - Solution: Check path aliases in `tsconfig.json`, use `@/` prefix

---

## 📝 Final Notes

This document should be your **first reference** when working with this codebase. Always:

1. ✅ **Read this document first** before making changes
2. ✅ **Follow the patterns** established in the codebase
3. ✅ **Test all apps** after schema changes (admin, beta, home)
4. ✅ **Use TypeScript strictly** - no `any` types
5. ✅ **Use shadcn/ui** for UI components
6. ✅ **Follow file organization** patterns
7. ✅ **Respect monorepo rules** - one lockfile, shared schema
8. ✅ **Identify correct package** - admin, beta, home, or dataLayer

**Remember**: This is a production monorepo with live users. Every change must be:
- ✅ **Surgical** - Only touch what's needed
- ✅ **Tested** - Build and test before committing
- ✅ **Safe** - No breaking changes without migration
- ✅ **Documented** - Clear commit messages

---

**Last Updated**: 2024
**Version**: 1.0
**Maintained By**: AI Assistant Instructions



