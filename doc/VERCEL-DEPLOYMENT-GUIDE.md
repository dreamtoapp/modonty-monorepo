# Vercel Deployment Guide - MODONTY Monorepo

**Complete guide for deploying the MODONTY monorepo (admin, modonty, console) to Vercel**

---

## 📋 Table of Contents

1. [Quick Reference](#-quick-reference)
2. [Prerequisites](#-prerequisites)
3. [Project Configuration](#-project-configuration)
4. [Environment Variables](#-environment-variables)
5. [Deployment Steps](#-deployment-steps)
6. [Database Setup](#-database-setup)
7. [Troubleshooting](#-troubleshooting)
8. [Post-Deployment](#-post-deployment)

---

## ⚡ Quick Reference

### Vercel Project Settings

| Setting | Admin | Modonty | Console |
|---------|-------|---------|---------|
| **Root Directory** | `admin` | `modonty` | `console` |
| **Framework** | Next.js | Next.js | Next.js |
| **Node Version** | `20.x` | `20.x` | `20.x` |
| **Build Command** | `cd ../.. && pnpm install && pnpm build:admin` | `cd ../.. && pnpm install && pnpm build:modonty` | `cd ../.. && pnpm install && pnpm build:console` |
| **Install Command** | `pnpm install` | `pnpm install` | `pnpm install` |
| **Output Directory** | `.next` (auto) | `.next` (auto) | `.next` (auto) |

### Required Environment Variables

**All Apps:**
- `DATABASE_URL` - Database connection string
- `DIRECT_URL` - Direct database connection (if using connection pooling)

**Admin & Modonty Apps:**
- `AUTH_SECRET` - NextAuth secret
- `AUTH_URL` - Auth callback URL
- `NEXTAUTH_URL` - NextAuth public URL
- `NEXTAUTH_SECRET` - NextAuth secret (alternate)

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 🔧 Prerequisites

Before deploying, ensure you have:

- ✅ **Vercel Account** - [Sign up at vercel.com](https://vercel.com)
- ✅ **GitHub/GitLab/Bitbucket Repository** - Monorepo must be in a git repository
- ✅ **Database Connection String** - PostgreSQL/MongoDB/MySQL connection string
- ✅ **Node.js 20+** - Required for pnpm and Next.js
- ✅ **Vercel CLI** (optional) - `npm i -g vercel`

### Monorepo Structure

```
MODONTY/
├── admin/          # Admin dashboard app
├── modonty/        # Main platform app
├── console/        # Console app
├── dataLayer/      # Shared Prisma schema
├── package.json    # Root package.json
└── pnpm-workspace.yaml
```

**Important**: Each app needs to be deployed as a **separate Vercel project** (3 projects total).

---

## ⚙️ Project Configuration

### Build Command Pattern

Since this is a **pnpm monorepo**, you must install from root:

```bash
cd ../.. && pnpm install && pnpm build:[app-name]
```

**Why `cd ../..`?**
- Vercel runs commands from the `Root Directory` (e.g., `admin/`)
- You need to go back to root to run `pnpm install` and access workspace commands

### Configuration Options

#### Option 1: Via Vercel Dashboard (Recommended)

Configure each project in Vercel Dashboard → Project Settings

#### Option 2: Via `vercel.json` (in each app folder) - **RECOMMENDED**

Create `admin/vercel.json`, `modonty/vercel.json`, `console/vercel.json`:

**admin/vercel.json:**
```json
{
  "buildCommand": "cd ../.. && pnpm build:admin",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**modonty/vercel.json:**
```json
{
  "buildCommand": "cd ../.. && pnpm build:modonty",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**console/vercel.json:**
```json
{
  "buildCommand": "cd ../.. && pnpm build:console",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**Why separate installCommand and buildCommand?**
- Vercel runs `installCommand` first, then `buildCommand`
- This allows Vercel to cache the install step separately
- More efficient and follows Vercel's standard build flow

#### Option 3: Via Vercel CLI

```bash
cd /path/to/MODONTY
vercel --cwd admin
vercel --cwd modonty
vercel --cwd console
```

---

## 🔐 Environment Variables

### Setup Instructions

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable:
   - **Name**: Variable name (e.g., `DATABASE_URL`)
   - **Value**: Variable value
   - **Environments**: Select Production, Preview, Development (all three)
3. Click **Save**
4. **Redeploy** for changes to take effect

### Variable List

#### For All Apps:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"
DIRECT_URL="postgresql://user:password@host:5432/dbname"  # If using connection pooling
```

#### Admin App:

```bash
# Auth
AUTH_SECRET="your-secret-key-here"
AUTH_URL="https://admin.yourdomain.com"
NEXTAUTH_URL="https://admin.yourdomain.com"
NEXTAUTH_SECRET="your-nextauth-secret"

# Optional: External services
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

#### Modonty App:

```bash
# Auth
AUTH_SECRET="your-secret-key-here"
AUTH_URL="https://modonty.yourdomain.com"
NEXTAUTH_URL="https://modonty.yourdomain.com"
NEXTAUTH_SECRET="your-nextauth-secret"
```

#### Console App:

```bash
# Add app-specific env vars as needed
```

---

## 🚀 Deployment Steps

### Step 1: Connect Repository

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Choose your Git provider (GitHub/GitLab/Bitbucket)

### Step 2: Deploy Admin App

1. Import repository (if not already done)
2. Configure project:
   - **Name**: `modonty-admin` (or your preferred name)
   - **Framework Preset**: Next.js
   - **Root Directory**: `admin` ⚠️
   - **Build Command**: `cd ../.. && pnpm build:admin` (or use `vercel.json` - recommended)
   - **Output Directory**: Leave empty (auto-detected)
   - **Install Command**: `cd ../.. && pnpm install` ⚠️ **Must navigate to root**
   - **Node.js Version**: `20.x`
3. Add environment variables (see above)
4. Click **Deploy**

### Step 3: Deploy Modonty App

1. Click **"Add New..."** → **"Project"**
2. Import the **same repository**
3. Configure project:
   - **Name**: `modonty-platform`
   - **Framework Preset**: Next.js
   - **Root Directory**: `modonty` ⚠️
   - **Build Command**: `cd ../.. && pnpm build:modonty` (or use `vercel.json` - recommended)
   - **Install Command**: `cd ../.. && pnpm install` ⚠️ **Must navigate to root**
   - **Node.js Version**: `20.x`
4. Add environment variables
5. Click **Deploy**

### Step 4: Deploy Console App

1. Click **"Add New..."** → **"Project"**
2. Import the **same repository**
3. Configure project:
   - **Name**: `modonty-console`
   - **Framework Preset**: Next.js
   - **Root Directory**: `console` ⚠️
   - **Build Command**: `cd ../.. && pnpm build:console` (or use `vercel.json` - recommended)
   - **Install Command**: `cd ../.. && pnpm install` ⚠️ **Must navigate to root**
   - **Node.js Version**: `20.x`
4. Add environment variables
5. Click **Deploy**

### Auto-Deployment

After initial setup:
- ✅ Pushing to GitHub triggers auto-deploy
- ✅ Changing `admin/` → only admin redeploys
- ✅ Changing `modonty/` → only modonty redeploys
- ✅ Changing `console/` → only console redeploys
- ✅ Changing `dataLayer/` → all apps redeploy

---

## 🗄️ Database Setup

### Prisma Configuration

All apps share the same Prisma schema from `dataLayer/`. Ensure Prisma generates correctly during build.

**Prisma schema path** (already configured in each app's `package.json`):

```json
{
  "prisma": {
    "schema": "../dataLayer/prisma/schema/schema.prisma"
  }
}
```

### Build Command with Prisma

If Prisma generation is needed during build, update build command:

```bash
cd ../.. && pnpm install && pnpm prisma:generate && pnpm build:admin
```

**Root `package.json` script** (should already exist):

```json
{
  "scripts": {
    "prisma:generate": "pnpm --filter @modonty/database prisma:generate"
  }
}
```

### Database Migrations

**Option 1: Run before deployment**

```bash
cd dataLayer
npx prisma migrate deploy
```

**Option 2: Add to build command**

```bash
cd ../.. && pnpm install && cd dataLayer && pnpm prisma migrate deploy && cd .. && pnpm build:admin
```

**Option 3: Use deployment hook**

Add to root `package.json`:

```json
{
  "scripts": {
    "postdeploy": "cd dataLayer && prisma migrate deploy"
  }
}
```

---

## 🐛 Troubleshooting

### Build Fails: "Cannot find module"

**Problem**: Monorepo dependencies not resolving

**Solution**:
- Ensure **Install Command** runs from root: `cd ../.. && pnpm install`
- Verify `pnpm-workspace.yaml` is correct
- Check that `package.json` names match workspace filters

### Build Fails: "Prisma Client not generated"

**Problem**: Prisma schema not found or not generated

**Solution**:
- Add Prisma generate to build command:
  ```bash
  cd ../.. && pnpm install && pnpm prisma:generate && pnpm build:admin
  ```
- Verify `DATABASE_URL` environment variable is set
- Check Prisma schema path in `package.json`

### Build Fails: "Workspace package not found"

**Problem**: `@modonty/database` workspace package not found

**Solution**:
- Ensure `dataLayer/package.json` exists with name `@modonty/database`
- Verify `pnpm-workspace.yaml` includes `dataLayer`
- Run install from root: `cd ../.. && pnpm install`

### Build Succeeds but App Doesn't Work

**Problem**: Environment variables missing or incorrect

**Solution**:
- Verify all required env vars are set in Vercel
- Check `AUTH_URL` and `NEXTAUTH_URL` match your domain
- Ensure `DATABASE_URL` is accessible from Vercel's servers

### Build Timeout

**Problem**: Build takes too long

**Solution**:
- Optimize build: remove unnecessary dependencies
- Use Vercel's build cache
- Consider incremental builds
- Check for heavy postinstall scripts

---

## ✅ Post-Deployment

### 1. Verify Deployment

Visit each app's URL:
- Admin: `https://[project-name].vercel.app`
- Modonty: `https://[project-name].vercel.app`
- Console: `https://[project-name].vercel.app`

### 2. Run Database Migrations

```bash
cd dataLayer
npx prisma migrate deploy
```

Or use deployment hooks (see Database Setup section above).

### 3. Set Custom Domains

1. Go to **Project Settings** → **Domains**
2. Add your custom domain:
   - Admin: `admin.yourdomain.com`
   - Modonty: `yourdomain.com` or `modonty.yourdomain.com`
   - Console: `console.yourdomain.com`
3. Configure DNS as instructed by Vercel
4. Update environment variables with new URLs:
   ```bash
   # Update AUTH_URL and NEXTAUTH_URL for each app
   AUTH_URL="https://admin.yourdomain.com"
   NEXTAUTH_URL="https://admin.yourdomain.com"
   ```

### 4. Preview Deployments

Preview deployments are automatically enabled when using Git integration:
- Each PR gets a preview URL
- Environment variables from "Preview" environment are used

---

## ✨ Success Checklist

- [ ] All 3 Vercel projects created
- [ ] Root directories configured correctly (`admin`, `modonty`, `console`)
- [ ] Build commands configured (with `cd ../..`)
- [ ] Environment variables added to all projects
- [ ] Database migrations run
- [ ] Custom domains configured (optional)
- [ ] All apps deployed successfully
- [ ] Apps are accessible and working
- [ ] Preview deployments working (if using Git)

---

## 📚 Additional Resources

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

**Need Help?** Check Vercel's [documentation](https://vercel.com/docs) or your build logs for specific errors.

**Last Updated**: 2024  
**Version**: 2.0 - Refactored and summarized
