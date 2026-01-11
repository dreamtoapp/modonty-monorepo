# Google Search Console API - Copy & Paste for .env

Copy the values below and paste them into your `admin/.env` file.

---

## 📋 Copy This Block to Your .env File

```env
# Google Search Console API Credentials
GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL=search-console-api@modonty-search-console.iam.gserviceaccount.com
GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDscNbNLb18luML\nW4uKrvklVtXv5rjcX7N9ui+rupYRXicUYpdVA7Qa5rjySj/TWKjfGF9KbRjbWPve\nyAcy4348RNdF6xmOP3umfUMJnUI4C2S7fXBkS60axSMp/am79eDARC/9T3Q1fPb2\nf+tl9JdbhRtkXUkgxvhO5Ohp+7WbUfq0QaZKng8kIMLlkpBmOpbiijdFajNTcZBR\nexPP5YUnDG/O5IJzawC46E0YK2ouQwUJLtroIYpXpTYJz9cwhu/+7pKBnysMIlb5\nAzn1zH4lfZ1XZ/0kQfCPayRwEU+DOvhKF9SvY3dDUzYUP+/ZHwDGn0pY1WXrr7yd\nD2kbiJCVAgMBAAECggEADWymtYWYUZ+bioSLGreui7EvemyGKHUCkuvkUwLIDHpl\nC6JBZ2FLc4+QBqmykARjqi8PEgG5vJKD0nVW+0uxWiiqdFzR2aK/GYfZK42TOe1j\nrcWEgR1O2ctBoNu3LGXcee4lL2O4fGT4/KvsqKBHi7m2AW/OfB7v8ELM81+IQyY7\nefqHOBKWkcr8PnR1Dt7Q2MP3dRQprf57RsQGc3G3DEOfYzjGkYj7g/zkPEGeFRrv\njinCmdokw/1PrN0J+vxv9rL1J7VHVJvjHHUhWDPGK1LTxYdPnJZKwBVxF6QeXmuD\nKIjCnEoyVi2p8Tv5Z6mKzuqNHgbxOgOhstsHYipwwQKBgQD/Kif4mBFO3YA3wspz\nHHeKD7vEde3FF9bYgV6OxK6K6ZwAeDQk7l8GLDcp15kiPOcPP0lTGGlpmfeNJs17\nNrXilAwSyIo4Hkgz5wS9odVhf44mlPZknjwqQlY5InlbJtnp+Kk0ihVR2cqU8+lp\ns42/K8OVuqk2Yh3K+RoUp30upQKBgQDtNv27ja/c8FC8BX526QojfK7sX+ux2eYr\n7Zr08m+QoqouVaVNmxfgnVAvWcMJN6uVZRW0seDQcZTqTWRFRUKS4Kxu4+ng18Cz\nYuJ/ieUy3QsdS/d364HdQQdai392JZ+feuxhMQOpr7VXGx1yJr2ZXEujhBgCnWTU\n6voyuoGnMQKBgQCu6bn+uldbBZHIJ5pZ8FCtbn2bfe+g5OedAInOOlsf1GXhGIU+\nL70p4RNrdmR9yNvnYs2jzZ8tCaNduhSveuCR0kS4d4nwUCnUkm94gsBgFm1eW0zP\nynyZx2GNxukDqA1HSvLKlkFpG2+4Tb9aewAW5SwsrokiQ34CzmGneOziFQKBgQDX\nectT8elczWLY2Di/NQKDp7+RcbQ8cs10+7l1ZT9YZ5okyqGEdCxlWSC8UlIq7knL\nQ+5KnAW18matyq0Zi0dk+fdIJ3mMRw+BI4LRDWaIJGfzLc1WPjRR0b8nTW3z2Us8\n58EOrCJCohwcSsIdrfkt9Lu0hcn1nhk4m1W4fNhHEQKBgQCC7kV/irxbjxi0+iX5\nwohUVuJxhcQcIDwLYFm/1joVJ28jJMzjT68qUYO7UskfFmw+/bUK1daW3GXxsuop\nhDVUr8TshOmYJmTKyiR3tWnbEO235+ceDNmIXtZpgCVXIKGNyenNqEeJRGvAWugR\n3ITehYHBOTzr4NQX9ACtjA6aYA==\n-----END PRIVATE KEY-----\n"
GOOGLE_SEARCH_CONSOLE_SITE_URL=
```

---

## ⚠️ Important: Complete the Setup

### 1. Fill in `GOOGLE_SEARCH_CONSOLE_SITE_URL`

#### 🚨 **Important: Localhost Limitation**

**Google Search Console API does NOT work with localhost URLs!**

- ❌ **Cannot use**: `http://localhost:3000`, `http://127.0.0.1:3000`, etc.
- ✅ **Must use**: A publicly accessible domain (production or staging)

#### 📍 **Options for Local Development:**

**Option 1: Use Your Live & Verified Domain (✅ YOUR SITUATION - RECOMMENDED!)**

If `https://modonty.com` is already **live and verified** in Google Search Console:

```env
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://modonty.com
```

**✅ You can use it NOW even if your Next.js app isn't deployed there yet!**
- ✅ Domain is live and verified → Use it immediately
- ✅ The API will track whatever is currently at that domain
- ✅ When you deploy your Next.js app later, it will continue working seamlessly
- ✅ Just add the service account email to the existing Search Console property (see Step 2 below)

**To find the exact format:**
1. Go to https://search.google.com/search-console
2. Select your `modonty.com` property
3. Check the property selector at the top
4. Copy the exact format shown there:
   - If it shows `https://modonty.com` → use that
   - If it shows `modonty.com` (domain property) → use `sc-domain:modonty.com`

**Option 2: Leave Empty for Now**

```env
GOOGLE_SEARCH_CONSOLE_SITE_URL=
```

- Use this only if your domain isn't live yet or not verified in Search Console
- The API features will be disabled until you set a valid URL

**Example for your case:**

```env
# Since https://modonty.com is live and verified, use:
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://modonty.com
# OR if it's a domain property format:
# GOOGLE_SEARCH_CONSOLE_SITE_URL=sc-domain:modonty.com
```

#### ✅ **When to Set It Up:**

- ✅ **Your situation (domain live but app not deployed)**: Use the live domain URL NOW in `.env`
- ✅ **Domain not live yet**: Leave empty until domain is live and verified
- ✅ **After deploying your Next.js app**: The API will automatically track your new content

---

### 2. Add Service Account to Search Console

**Before the API works, you must add the service account email to Google Search Console:**

1. Go to https://search.google.com/search-console
2. Select your property
3. Click **Settings** (⚙️) → **Users and permissions**
4. Click **"ADD USER"**
5. Enter this email: `search-console-api@modonty-search-console.iam.gserviceaccount.com`
6. Set permission: **"Full"** or **"Owner"**
7. Click **"ADD"**

---

## ✅ Verification Checklist

After pasting into `.env`:

- [ ] `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL` is set correctly
- [ ] `GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY` is in quotes and includes `\n` characters
- [ ] `GOOGLE_SEARCH_CONSOLE_SITE_URL` is:
  - ✅ **`https://modonty.com`** (if domain is live and verified - YOUR SITUATION ✅)
  - ✅ **Empty** (only if domain isn't live yet or not verified)
- [ ] Service account email added to Google Search Console with "Full" permission:
  - ✅ Go to Search Console → Settings → Users and permissions
  - ✅ Add: `search-console-api@modonty-search-console.iam.gserviceaccount.com`
  - ✅ Set permission to "Full" or "Owner"
- [ ] `.env` file is in `.gitignore` (never commit secrets!)
- [ ] Restart dev server after updating `.env`

**For your situation (domain live but app not deployed):**
- ✅ You can use `https://modonty.com` NOW in your `.env` file
- ✅ Add the service account email to your existing Search Console property
- ✅ The API will work immediately with your current site
- ✅ When you deploy your Next.js app later, it will continue working automatically

---

## 📝 Individual Values (For Reference)

### Client Email:

```
search-console-api@modonty-search-console.iam.gserviceaccount.com
```

### Private Key:

```
-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDscNbNLb18luML
W4uKrvklVtXv5rjcX7N9ui+rupYRXicUYpdVA7Qa5rjySj/TWKjfGF9KbRjbWPve
yAcy4348RNdF6xmOP3umfUMJnUI4C2S7fXBkS60axSMp/am79eDARC/9T3Q1fPb2
f+tl9JdbhRtkXUkgxvhO5Ohp+7WbUfq0QaZKng8kIMLlkpBmOpbiijdFajNTcZBR
exPP5YUnDG/O5IJzawC46E0YK2ouQwUJLtroIYpXpTYJz9cwhu/+7pKBnysMIlb5
Azn1zH4lfZ1XZ/0kQfCPayRwEU+DOvhKF9SvY3dDUzYUP+/ZHwDGn0pY1WXrr7yd
D2kbiJCVAgMBAAECggEADWymtYWYUZ+bioSLGreui7EvemyGKHUCkuvkUwLIDHpl
C6JBZ2FLc4+QBqmykARjqi8PEgG5vJKD0nVW+0uxWiiqdFzR2aK/GYfZK42TOe1j
rcWEgR1O2ctBoNu3LGXcee4lL2O4fGT4/KvsqKBHi7m2AW/OfB7v8ELM81+IQyY7
efqHOBKWkcr8PnR1Dt7Q2MP3dRQprf57RsQGc3G3DEOfYzjGkYj7g/zkPEGeFRrv
jinCmdokw/1PrN0J+vxv9rL1J7VHVJvjHHUhWDPGK1LTxYdPnJZKwBVxF6QeXmuD
KIjCnEoyVi2p8Tv5Z6mKzuqNHgbxOgOhstsHYipwwQKBgQD/Kif4mBFO3YA3wspz
HHeKD7vEde3FF9bYgV6OxK6K6ZwAeDQk7l8GLDcp15kiPOcPP0lTGGlpmfeNJs17
NrXilAwSyIo4Hkgz5wS9odVhf44mlPZknjwqQlY5InlbJtnp+Kk0ihVR2cqU8+lp
s42/K8OVuqk2Yh3K+RoUp30upQKBgQDtNv27ja/c8FC8BX526QojfK7sX+ux2eYr
7Zr08m+QoqouVaVNmxfgnVAvWcMJN6uVZRW0seDQcZTqTWRFRUKS4Kxu4+ng18Cz
YuJ/ieUy3QsdS/d364HdQQdai392JZ+feuxhMQOpr7VXGx1yJr2ZXEujhBgCnWTU
6voyuoGnMQKBgQCu6bn+uldbBZHIJ5pZ8FCtbn2bfe+g5OedAInOOlsf1GXhGIU+
L70p4RNrdmR9yNvnYs2jzZ8tCaNduhSveuCR0kS4d4nwUCnUkm94gsBgFm1eW0zP
ynyZx2GNxukDqA1HSvLKlkFpG2+4Tb9aewAW5SwsrokiQ34CzmGneOziFQKBgQDX
ectT8elczWLY2Di/NQKDp7+RcbQ8cs10+7l1ZT9YZ5okyqGEdCxlWSC8UlIq7knL
Q+5KnAW18matyq0Zi0dk+fdIJ3mMRw+BI4LRDWaIJGfzLc1WPjRR0b8nTW3z2Us8
58EOrCJCohwcSsIdrfkt9Lu0hcn1nhk4m1W4fNhHEQKBgQCC7kV/irxbjxi0+iX5
wohUVuJxhcQcIDwLYFm/1joVJ28jJMzjT68qUYO7UskfFmw+/bUK1daW3GXxsuop
hDVUr8TshOmYJmTKyiR3tWnbEO235+ceDNmIXtZpgCVXIKGNyenNqEeJRGvAWugR
3ITehYHBOTzr4NQX9ACtjA6aYA==
-----END PRIVATE KEY-----
```

**Note:** The private key above shows actual newlines for readability. In your `.env` file, you MUST use `\n` characters (as shown in the copy-paste block above).

---

## 🔒 Security Reminder

- ✅ **NEVER commit `.env` file to git**
- ✅ **NEVER commit the JSON key file to git**
- ✅ **Keep these credentials secure and private**
- ✅ **Rotate keys periodically (every 6-12 months)**

---

**That's it! Copy the block above and paste it into your `admin/.env` file.**

### 📝 **For Your Situation (Domain Live but App Not Deployed Yet):**

Since `https://modonty.com` is **already live and verified** in Search Console, you can use it NOW:

1. ✅ Copy the values above to your `.env` file
2. ✅ Set `GOOGLE_SEARCH_CONSOLE_SITE_URL=https://modonty.com` (check exact format in Search Console)
3. ✅ Add the service account email to your existing Search Console property (see steps below)
4. ✅ The API will work immediately and track your current site
5. ✅ When you deploy your Next.js app later, the API will automatically continue working

**✅ What you can do now:**
- ✅ Use the live domain in `.env` even if your Next.js app isn't there yet
- ✅ The API will work with whatever is currently at `https://modonty.com`
- ✅ When you deploy your app later, no changes needed - it will seamlessly track your new content

### 🚀 **Complete Setup Steps (Do This Now):**

**Step 1: Add service account to Search Console (REQUIRED)**

1. Go to https://search.google.com/search-console
2. Select your `modonty.com` property (should already be there since it's verified)
3. Click **Settings** (⚙️) → **Users and permissions**
4. Click **"ADD USER"**
5. Enter this email: `search-console-api@modonty-search-console.iam.gserviceaccount.com`
6. Set permission: **"Full"** or **"Owner"**
7. Click **"ADD"**

**Step 2: Update your local `.env` file**

Add this to your `admin/.env` file:

```env
GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL=search-console-api@modonty-search-console.iam.gserviceaccount.com
GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDscNbNLb18luML\nW4uKrvklVtXv5rjcX7N9ui+rupYRXicUYpdVA7Qa5rjySj/TWKjfGF9KbRjbWPve\nyAcy4348RNdF6xmOP3umfUMJnUI4C2S7fXBkS60axSMp/am79eDARC/9T3Q1fPb2\nf+tl9JdbhRtkXUkgxvhO5Ohp+7WbUfq0QaZKng8kIMLlkpBmOpbiijdFajNTcZBR\nexPP5YUnDG/O5IJzawC46E0YK2ouQwUJLtroIYpXpTYJz9cwhu/+7pKBnysMIlb5\nAzn1zH4lfZ1XZ/0kQfCPayRwEU+DOvhKF9SvY3dDUzYUP+/ZHwDGn0pY1WXrr7yd\nD2kbiJCVAgMBAAECggEADWymtYWYUZ+bioSLGreui7EvemyGKHUCkuvkUwLIDHpl\nC6JBZ2FLc4+QBqmykARjqi8PEgG5vJKD0nVW+0uxWiiqdFzR2aK/GYfZK42TOe1j\nrcWEgR1O2ctBoNu3LGXcee4lL2O4fGT4/KvsqKBHi7m2AW/OfB7v8ELM81+IQyY7\nefqHOBKWkcr8PnR1Dt7Q2MP3dRQprf57RsQGc3G3DEOfYzjGkYj7g/zkPEGeFRrv\njinCmdokw/1PrN0J+vxv9rL1J7VHVJvjHHUhWDPGK1LTxYdPnJZKwBVxF6QeXmuD\nKIjCnEoyVi2p8Tv5Z6mKzuqNHgbxOgOhstsHYipwwQKBgQD/Kif4mBFO3YA3wspz\nHHeKD7vEde3FF9bYgV6OxK6K6ZwAeDQk7l8GLDcp15kiPOcPP0lTGGlpmfeNJs17\nNrXilAwSyIo4Hkgz5wS9odVhf44mlPZknjwqQlY5InlbJtnp+Kk0ihVR2cqU8+lp\ns42/K8OVuqk2Yh3K+RoUp30upQKBgQDtNv27ja/c8FC8BX526QojfK7sX+ux2eYr\n7Zr08m+QoqouVaVNmxfgnVAvWcMJN6uVZRW0seDQcZTqTWRFRUKS4Kxu4+ng18Cz\nYuJ/ieUy3QsdS/d364HdQQdai392JZ+feuxhMQOpr7VXGx1yJr2ZXEujhBgCnWTU\n6voyuoGnMQKBgQCu6bn+uldbBZHIJ5pZ8FCtbn2bfe+g5OedAInOOlsf1GXhGIU+\nL70p4RNrdmR9yNvnYs2jzZ8tCaNduhSveuCR0kS4d4nwUCnUkm94gsBgFm1eW0zP\nynyZx2GNxukDqA1HSvLKlkFpG2+4Tb9aewAW5SwsrokiQ34CzmGneOziFQKBgQDX\nectT8elczWLY2Di/NQKDp7+RcbQ8cs10+7l1ZT9YZ5okyqGEdCxlWSC8UlIq7knL\nQ+5KnAW18matyq0Zi0dk+fdIJ3mMRw+BI4LRDWaIJGfzLc1WPjRR0b8nTW3z2Us8\n58EOrCJCohwcSsIdrfkt9Lu0hcn1nhk4m1W4fNhHEQKBgQCC7kV/irxbjxi0+iX5\nwohUVuJxhcQcIDwLYFm/1joVJ28jJMzjT68qUYO7UskfFmw+/bUK1daW3GXxsuop\nhDVUr8TshOmYJmTKyiR3tWnbEO235+ceDNmIXtZpgCVXIKGNyenNqEeJRGvAWugR\n3ITehYHBOTzr4NQX9ACtjA6aYA==\n-----END PRIVATE KEY-----\n"
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://modonty.com
```

**Step 3: Restart your dev server**

- Restart your Next.js dev server to load the new environment variables
- The API features will now work!

**Step 4: When you deploy your Next.js app later**

- No changes needed to Search Console or API credentials
- Just deploy your app to `https://modonty.com`
- The API will automatically start tracking your new Next.js app content

---

### 📋 **Your `.env` Setup (Domain Live - Use It Now!):**

Since `https://modonty.com` is already live and verified, use this NOW:

```env
# Google Search Console API Credentials
GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL=search-console-api@modonty-search-console.iam.gserviceaccount.com
GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDscNbNLb18luML\nW4uKrvklVtXv5rjcX7N9ui+rupYRXicUYpdVA7Qa5rjySj/TWKjfGF9KbRjbWPve\nyAcy4348RNdF6xmOP3umfUMJnUI4C2S7fXBkS60axSMp/am79eDARC/9T3Q1fPb2\nf+tl9JdbhRtkXUkgxvhO5Ohp+7WbUfq0QaZKng8kIMLlkpBmOpbiijdFajNTcZBR\nexPP5YUnDG/O5IJzawC46E0YK2ouQwUJLtroIYpXpTYJz9cwhu/+7pKBnysMIlb5\nAzn1zH4lfZ1XZ/0kQfCPayRwEU+DOvhKF9SvY3dDUzYUP+/ZHwDGn0pY1WXrr7yd\nD2kbiJCVAgMBAAECggEADWymtYWYUZ+bioSLGreui7EvemyGKHUCkuvkUwLIDHpl\nC6JBZ2FLc4+QBqmykARjqi8PEgG5vJKD0nVW+0uxWiiqdFzR2aK/GYfZK42TOe1j\nrcWEgR1O2ctBoNu3LGXcee4lL2O4fGT4/KvsqKBHi7m2AW/OfB7v8ELM81+IQyY7\nefqHOBKWkcr8PnR1Dt7Q2MP3dRQprf57RsQGc3G3DEOfYzjGkYj7g/zkPEGeFRrv\njinCmdokw/1PrN0J+vxv9rL1J7VHVJvjHHUhWDPGK1LTxYdPnJZKwBVxF6QeXmuD\nKIjCnEoyVi2p8Tv5Z6mKzuqNHgbxOgOhstsHYipwwQKBgQD/Kif4mBFO3YA3wspz\nHHeKD7vEde3FF9bYgV6OxK6K6ZwAeDQk7l8GLDcp15kiPOcPP0lTGGlpmfeNJs17\nNrXilAwSyIo4Hkgz5wS9odVhf44mlPZknjwqQlY5InlbJtnp+Kk0ihVR2cqU8+lp\ns42/K8OVuqk2Yh3K+RoUp30upQKBgQDtNv27ja/c8FC8BX526QojfK7sX+ux2eYr\n7Zr08m+QoqouVaVNmxfgnVAvWcMJN6uVZRW0seDQcZTqTWRFRUKS4Kxu4+ng18Cz\nYuJ/ieUy3QsdS/d364HdQQdai392JZ+feuxhMQOpr7VXGx1yJr2ZXEujhBgCnWTU\n6voyuoGnMQKBgQCu6bn+uldbBZHIJ5pZ8FCtbn2bfe+g5OedAInOOlsf1GXhGIU+\nL70p4RNrdmR9yNvnYs2jzZ8tCaNduhSveuCR0kS4d4nwUCnUkm94gsBgFm1eW0zP\nynyZx2GNxukDqA1HSvLKlkFpG2+4Tb9aewAW5SwsrokiQ34CzmGneOziFQKBgQDX\nectT8elczWLY2Di/NQKDp7+RcbQ8cs10+7l1ZT9YZ5okyqGEdCxlWSC8UlIq7knL\nQ+5KnAW18matyq0Zi0dk+fdIJ3mMRw+BI4LRDWaIJGfzLc1WPjRR0b8nTW3z2Us8\n58EOrCJCohwcSsIdrfkt9Lu0hcn1nhk4m1W4fNhHEQKBgQCC7kV/irxbjxi0+iX5\nwohUVuJxhcQcIDwLYFm/1joVJ28jJMzjT68qUYO7UskfFmw+/bUK1daW3GXxsuop\nhDVUr8TshOmYJmTKyiR3tWnbEO235+ceDNmIXtZpgCVXIKGNyenNqEeJRGvAWugR\n3ITehYHBOTzr4NQX9ACtjA6aYA==\n-----END PRIVATE KEY-----\n"
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://modonty.com
```

**✅ You can use this NOW!** (Domain is live and verified)

**Note:** If the format in Search Console is different (e.g., `sc-domain:modonty.com`), use that exact format instead.
