# Monorepo Setup Guide - Simple & Clear

**Easy guide for working with your monorepo project. Step-by-step instructions for everything you need.**

---

## 📑 What's in This Guide

1. [Quick Commands](#-quick-commands-you-need)
2. [What is a Monorepo?](#-what-is-a-monorepo)
3. [Git Basics](#-git-basics-simple-steps)
4. [Prisma Schema](#-prisma-schema-how-it-works)
5. [Vercel Deployment](#-vercel-deployment-simple-setup)
6. [Common Tasks](#-common-tasks-step-by-step)
7. [Problems & Solutions](#-problems--solutions)

---

## ⚡ Quick Commands You Need

**Copy and paste these commands when you need them:**

```bash
# Go to your project folder
cd jbr-monorepo

# Install all packages
pnpm install

# Generate Prisma Client (do this after changing schema)
cd dataLayer
pnpm prisma:generate

# Run your app locally
cd admin
pnpm dev

# Build your app (test if it works)
cd admin
pnpm build

# Git - save your changes
git add .
git commit -m "What you changed"
git push origin main
```

---

## 📦 What is a Monorepo?

**Simple explanation:** A monorepo is one folder that contains multiple apps.

### Your Project Structure

```
jbr-monorepo/              ← Main folder (this is your monorepo)
│
├── pnpm-lock.yaml         ← ONLY lockfile (at root, NOT in apps)
├── pnpm-workspace.yaml    ← Workspace configuration
│
├── admin/                 ← Admin app (one website)
│   ├── package.json
│   └── (all admin files)
│   ❌ NO pnpm-lock.yaml here!
│
├── home/                  ← Home app (another website)
│   ├── package.json
│   └── (all home files)
│   ❌ NO pnpm-lock.yaml here!
│
└── dataLayer/             ← Shared database (both apps use this)
    ├── package.json
    └── prisma/
        └── schema.prisma ← Database structure (ONLY edit this file)
```

### Important Rules

1. **One Git repository** = All apps together
2. **One database schema** = Both apps use the same database
3. **Separate Vercel projects** = Each app deploys separately
4. **One lockfile only** = Only root has `pnpm-lock.yaml` (apps should NOT have their own)

---

## 🔄 Git Basics - Simple Steps

### What is Git?

Git saves your code changes. Think of it like "Save" but for your entire project.

### First Time Setup

**Step 1: Check if Git is ready**

```bash
cd jbr-monorepo
git status
```

**If it says "not a git repository":**

```bash
# Initialize Git
git init

# Add all files
git add .

# Save everything
git commit -m "First commit - project setup"

# Connect to GitHub (create repo on github.com first)
git remote add origin https://github.com/YOUR_USERNAME/jbr-monorepo.git
git branch -M main
git push -u origin main
```

### Daily Git Workflow (3 Simple Steps)

**Every day when you work:**

```bash
# Step 1: Get latest changes from GitHub
cd jbr-monorepo
git pull origin main

# Step 2: Make your changes
# (edit files, add features, fix bugs)

# Step 3: Save and upload your changes
git add .
git commit -m "Add login button"  # Describe what you did
git push origin main
```

### ⚠️ Important: Where to Commit From

**Rule: Always commit from the root folder, even if you worked in a subfolder.**

**You can work anywhere:**

- ✅ Edit files in `home/` folder
- ✅ Edit files in `admin/` folder
- ✅ Edit files in `dataLayer/` folder

**But always commit from root:**

- ✅ Go back to root folder (`jbr-monorepo`)
- ✅ Then run `git add`, `git commit`, `git push`

**Example - Working in home folder:**

```bash
# Step 1: Start at root
cd jbr-monorepo
git pull origin main

# Step 2: Go to home folder and work
cd home
# Make your changes here
# Edit files, add features, etc.

# Step 3: Test your changes
pnpm dev  # Test locally

# Step 4: Go BACK to root to commit
cd ..  # Go back to root (jbr-monorepo)
git add .
git commit -m "Add new feature to home app"
git push origin main
```

**Why commit from root?**

1. Git repository is at root - `.git` folder is in `jbr-monorepo/`
2. See all changes - You can see changes across all apps
3. Standard practice - This is how monorepos work

**Quick tip - Commit specific folders:**

```bash
# From root folder
cd jbr-monorepo

# Commit only home changes
git add home/
git commit -m "Update home app"
git push origin main

# Or commit only admin changes
git add admin/
git commit -m "Update admin app"
git push origin main
```

### Git Commands Explained

| Command                   | What It Does              | When to Use          |
| ------------------------- | ------------------------- | -------------------- |
| `git pull`                | Download latest code      | Start of each day    |
| `git add .`               | Mark files to save        | After making changes |
| `git commit -m "message"` | Save changes with message | After `git add`      |
| `git push`                | Upload to GitHub          | After `git commit`   |
| `git status`              | See what changed          | Anytime to check     |

### Good Commit Messages

**Write clear messages about what you changed:**

✅ Good:

- `"Add user login page"`
- `"Fix button not working"`
- `"Update database schema"`

❌ Bad:

- `"fix"`
- `"update"`
- `"changes"`

---

## 🗄️ Prisma Schema - How It Works

### What is Prisma Schema?

The schema file defines your database structure. **Both apps use the same schema.**

### Simple Diagram

```
dataLayer/prisma/schema.prisma  ← You edit THIS file
           ↓
    (Prisma generates code)
           ↓
    ┌──────┴──────┐
    ↓             ↓
admin/         home/
(both use same database)
```

### How to Update Schema (5 Steps)

**When you need to add a new field or table:**

```bash
# Step 1: Edit the schema file
# Open: dataLayer/prisma/schema.prisma
# Add your new field or model

# Step 2: Generate the code
cd dataLayer
pnpm prisma:generate

# Step 3: Test that admin app still works
cd ../admin
pnpm build

# Step 4: Test that home app still works
cd ../home
pnpm build

# Step 5: Save your changes
cd ..
git add dataLayer/prisma/schema.prisma
git commit -m "Schema: add user email field"
git push origin main
```

### Important Rules

1. ✅ **ONLY edit**: `dataLayer/prisma/schema.prisma`
2. ❌ **NEVER create** schema files in `admin/` or `home/`
3. ✅ **Always run** `pnpm prisma:generate` after editing schema
4. ✅ **Test both apps** before committing

### Common Prisma Commands

```bash
# Generate Prisma Client (do this after editing schema)
cd dataLayer
pnpm prisma:generate

# Open database viewer (see your data)
cd dataLayer
pnpm prisma:studio
```

---

## 🚀 Vercel Deployment - Simple Setup

### What is Vercel?

Vercel hosts your apps online so people can use them.

### Important: You Need 2 Separate Projects

- **Project 1**: For `admin` app
- **Project 2**: For `home` app

Both connect to the same GitHub repository, but they're separate projects.

### Setup Admin App on Vercel

**Step-by-step:**

1. **Go to Vercel**

   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"

2. **Connect GitHub**

   - Select your `jbr-monorepo` repository
   - Click "Import"

3. **Configure Settings**

   - **Project Name**: `jbr-admin` (or any name you want)
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `admin` ⚠️ **VERY IMPORTANT!**
   - **Build Command**: Leave default (or use: `cd .. && pnpm install && cd admin && pnpm build`)
   - **Output Directory**: `.next`

4. **Add Environment Variables**

   - Click "Environment Variables"
   - Add `DATABASE_URL` (your database connection string)
   - Add any other variables your app needs

5. **Deploy**
   - Click "Deploy"
   - Wait for it to finish

### Setup Home App on Vercel

**Same steps, but:**

- **Project Name**: `jbr-home`
- **Root Directory**: `home` ⚠️ **VERY IMPORTANT!**

### After Setup

- ✅ Both apps will **auto-deploy** when you push to GitHub
- ✅ If you change `admin/` folder → only admin redeploys
- ✅ If you change `home/` folder → only home redeploys
- ✅ If you change `dataLayer/` → both apps redeploy

### Environment Variables

**Add these in BOTH Vercel projects:**

- `DATABASE_URL` (same for both - they share the database)
- Any other variables your apps need

**How to add:**

1. Go to Project Settings
2. Click "Environment Variables"
3. Add variable name and value
4. Click "Save"

---

## 🎯 Common Tasks - Step by Step

### Task 1: Add a New Feature to Admin App

```bash
# Step 1: Get latest code
cd jbr-monorepo
git pull origin main

# Step 2: Make your changes
# Edit files in admin/ folder

# Step 3: Test locally
cd admin
pnpm dev
# Open browser, test your feature

# Step 4: Build to make sure it works
pnpm build

# Step 5: Save and upload
cd ..
git add admin/
git commit -m "Add user profile page to admin"
git push origin main

# Step 6: Vercel automatically deploys admin app
```

### Task 2: Update Database Schema

```bash
# Step 1: Edit schema
# Open: dataLayer/prisma/schema.prisma
# Add your new field or model

# Step 2: Generate Prisma Client
cd dataLayer
pnpm prisma:generate

# Step 3: Test admin app
cd ../admin
pnpm build

# Step 4: Test home app
cd ../home
pnpm build

# Step 5: Save changes
cd ..
git add dataLayer/prisma/schema.prisma
git commit -m "Schema: add user phone number"
git push origin main

# Step 6: Both apps automatically redeploy on Vercel
```

### Task 3: Fix a Bug

```bash
# Step 1: Get latest code
cd jbr-monorepo
git pull origin main

# Step 2: Find and fix the bug
# Edit the file with the bug

# Step 3: Test the fix
cd admin  # or home, depending on where the bug is
pnpm dev
# Test that the bug is fixed

# Step 4: Save and upload
cd ..
git add .
git commit -m "Fix: login button not working"
git push origin main

# Step 5: Vercel automatically redeploys
```

### Task 4: Start Working on a New Day

```bash
# Step 1: Go to project folder
cd jbr-monorepo

# Step 2: Get latest changes
git pull origin main

# Step 3: Install any new packages (if needed)
pnpm install

# Step 4: Start coding!
```

---

## 🔧 Problems & Solutions

### Problem: `pnpm install` doesn't work

**Solution:**

```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm -rf admin/node_modules
rm -rf home/node_modules
rm -rf dataLayer/node_modules

# Also remove duplicate lockfiles (should only be at root)
rm -f admin/pnpm-lock.yaml
rm -f home/pnpm-lock.yaml
rm -f dataLayer/pnpm-lock.yaml

# Reinstall from root (creates only one lockfile at root)
cd jbr-monorepo
pnpm install
```

### Problem: Prisma Client not found

**Solution:**

```bash
# Generate Prisma Client
cd dataLayer
pnpm prisma:generate
```

### Problem: Build warning about multiple lockfiles

**Warning message:**

```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
We detected multiple lockfiles...
```

**Why this happens:**

- In a monorepo, only the **root** should have `pnpm-lock.yaml`
- If `admin/` or `home/` have their own lockfiles, Next.js gets confused

**Solution:**

```bash
# Delete lockfiles in app folders (they shouldn't exist)
rm admin/pnpm-lock.yaml
rm home/pnpm-lock.yaml

# Reinstall from root (this creates only one lockfile at root)
cd jbr-monorepo
pnpm install
```

**Important Rule:** In monorepo, only the root folder should have `pnpm-lock.yaml`. Individual apps should NOT have their own lockfiles.

### Problem: Vercel build fails

**Check these:**

1. ✅ Is Root Directory set correctly? (`admin` or `home`)
2. ✅ Are environment variables added?
3. ✅ Does it build locally? (`cd admin && pnpm build`)

**Solution:**

```bash
# Test build locally first
cd admin
pnpm build

# If it works locally, check Vercel settings
# Make sure Root Directory matches folder name
```

### Problem: Git says "conflicts"

**Solution:**

```bash
# Get latest code
git pull origin main

# If conflicts appear:
# 1. Open the conflicted files
# 2. Look for <<<<<<< and >>>>>>>
# 3. Keep the code you want
# 4. Remove the conflict markers
# 5. Save the file

# Then:
git add .
git commit -m "Resolve conflicts"
git push origin main
```

### Problem: Schema changes not working

**Solution:**

```bash
# Regenerate Prisma Client
cd dataLayer
pnpm prisma:generate

# Rebuild apps
cd ../admin && pnpm build
cd ../home && pnpm build
```

---

## ✅ Quick Checklists

### Before You Start Coding

- [ ] `git pull origin main` (get latest code)
- [ ] `pnpm install` (if new packages added)
- [ ] Check: Only root has `pnpm-lock.yaml` (no lockfiles in `admin/` or `home/`)

### Before Saving Your Code

- [ ] Test your changes locally (`pnpm dev`)
- [ ] Build works (`pnpm build`)
- [ ] Write clear commit message

### Before Pushing to GitHub

- [ ] `git add .` (mark files to save)
- [ ] `git commit -m "clear message"` (save)
- [ ] `git push origin main` (upload)

### When You Change Schema

- [ ] Edit `dataLayer/prisma/schema.prisma`
- [ ] Run `pnpm prisma:generate`
- [ ] Test both apps build
- [ ] Commit and push

---

## 🎓 Remember These 6 Things

1. **One Git repo** = All your apps together
2. **One schema file** = `dataLayer/prisma/schema.prisma` (ONLY edit this)
3. **One lockfile** = Only root has `pnpm-lock.yaml` (apps should NOT have their own)
4. **Always generate** Prisma Client after schema changes
5. **Test locally** before pushing to GitHub
6. **Work from root folder** (`jbr-monorepo`) for Git commands

---

## 📚 Need Help?

**Common Questions:**

**Q: Where do I edit the database structure?**  
A: Only in `dataLayer/prisma/schema.prisma`

**Q: How do I test my changes?**  
A: `cd admin && pnpm dev` (or `cd home && pnpm dev`)

**Q: How do I save my code?**  
A: `git add .` → `git commit -m "message"` → `git push origin main`

**Q: Why do I need 2 Vercel projects?**  
A: Because you have 2 apps (admin and home), each needs its own project

**Q: What happens when I push to GitHub?**  
A: Vercel automatically deploys your apps

**Q: Why do I get a warning about multiple lockfiles?**  
A: Only the root folder should have `pnpm-lock.yaml`. Delete any lockfiles in `admin/` or `home/` folders, then run `pnpm install` from root.

**Q: Can apps have their own lockfiles?**  
A: No! In a monorepo, only the root should have `pnpm-lock.yaml`. This prevents build warnings and keeps everything clean.

---

**Last Updated**: 2024  
**Version**: 2.0 - Simplified for Beginners
