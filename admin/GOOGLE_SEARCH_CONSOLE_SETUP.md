# Google Search Console API Setup Guide

Complete step-by-step guide to get your Google Search Console API credentials.

---

## 📋 Prerequisites

- Google account (gmail.com or Google Workspace)
- Your website URL (e.g., `https://example.com`)
- Access to Google Cloud Console
- Access to Google Search Console

---

## 🔧 Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click the project dropdown at the top (next to "Google Cloud")
   - Click **"New Project"**
   - Enter project name: `Modonty Search Console` (or your preferred name)
   - Click **"Create"**
   - Wait for project creation (takes 10-30 seconds)
   - Select your new project from the dropdown

---

## 🚀 Step 2: Enable Search Console API

1. **Navigate to APIs & Services**

   - In the left sidebar, click **"APIs & Services"** → **"Library"**
   - Or visit: https://console.cloud.google.com/apis/library

2. **Search for Search Console API**

   - In the search box, type: `Google Search Console API`
   - Click on **"Google Search Console API"**

3. **Enable the API**
   - Click the **"ENABLE"** button
   - Wait for the API to enable (takes 10-20 seconds)
   - You'll see "API enabled" confirmation

---

## 🔑 Step 3: Create a Service Account

1. **Go to Service Accounts**

   - In the left sidebar, click **"APIs & Services"** → **"Credentials"**
   - Or visit: https://console.cloud.google.com/apis/credentials

2. **Create Service Account**

   - Click **"+ CREATE CREDENTIALS"** at the top
   - Select **"Service account"**

3. **Fill Service Account Details**

   - **Service account name**: `search-console-api` (or your preferred name)
   - **Service account ID**: Auto-generated (you can change if needed)
   - Click **"CREATE AND CONTINUE"**

4. **Grant Roles (Optional)**

   - For Search Console API, you don't need to grant roles here
   - Click **"CONTINUE"**

5. **Grant Access to Users (Optional)**
   - Skip this step (not needed)
   - Click **"DONE"**

---

## 📥 Step 4: Create and Download JSON Key

1. **Find Your Service Account**

   - In the credentials page, you'll see your service account listed
   - Click on the service account email (e.g., `search-console-api@your-project.iam.gserviceaccount.com`)

2. **Create Key**

   - Click the **"KEYS"** tab at the top
   - Click **"ADD KEY"** → **"Create new key"**
   - Select **"JSON"** format
   - Click **"CREATE"**
   - **Important**: The JSON file will download automatically to your computer
   - **Keep this file safe** - you can't download it again!

3. **Save the JSON File**
   - Save it in a secure location (e.g., `admin/.secrets/search-console-key.json`)
   - **⚠️ NEVER commit this file to git!** (should be in `.gitignore`)

---

## 🔓 Step 5: Extract Credentials from JSON

Open the downloaded JSON file. It looks like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "search-console-api@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### Extract Values:

1. **`client_email`** (line 6)

   - Copy the entire value: `search-console-api@your-project.iam.gserviceaccount.com`
   - This goes in: `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL`

2. **`private_key`** (line 5)

   - Copy the entire value including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
   - Keep the `\n` characters (they represent newlines)
   - This goes in: `GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY`

3. **Site URL** (you'll get this in the next step)
   - Format: `https://example.com` or `sc-domain:example.com`
   - This goes in: `GOOGLE_SEARCH_CONSOLE_SITE_URL`

---

## 🔗 Step 6: Add Service Account to Google Search Console

1. **Open Google Search Console**

   - Visit: https://search.google.com/search-console
   - Sign in with your Google account

2. **Select or Add Property**

   - If you already have your site added, select it
   - If not, click **"Add property"** → Enter your website URL → Verify ownership

3. **Go to Settings**

   - Click the gear icon (⚙️) in the left sidebar
   - Click **"Users and permissions"**

4. **Add User**

   - Click **"ADD USER"** button
   - Enter the **service account email** (from Step 5, the `client_email`)
   - Set permission: **"Full"** or **"Owner"** (minimum: **"Full"** for API access)
   - Click **"ADD"**

5. **Verify Access**
   - The service account email should appear in the users list
   - Status should show as "Full" or "Owner"

---

## 🌐 Step 7: Get Your Site URL

The site URL format depends on how you added it to Search Console:

1. **If you added it as a URL prefix** (e.g., `https://example.com`):

   - Use: `https://example.com`

2. **If you added it as a domain** (e.g., `example.com`):

   - Use: `sc-domain:example.com`

3. **Find it in Search Console**:
   - Look at the property selector at the top of Search Console
   - Copy the exact format shown there

---

## ⚙️ Step 8: Update Your .env File

Open `admin/.env` and add these three variables:

```env
# Google Search Console API Credentials
GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL=search-console-api@your-project.iam.gserviceaccount.com
GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://example.com
```

### ⚠️ Important Notes:

1. **Private Key Format**:

   - Keep the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
   - Keep the `\n` characters (don't replace with actual newlines)
   - Wrap in double quotes if there are spaces or special characters

2. **Site URL Format**:

   - Must match exactly how it appears in Search Console
   - If domain property: use `sc-domain:example.com`
   - If URL prefix: use `https://example.com`

3. **Security**:
   - Never commit `.env` file to git
   - Store the JSON key file securely
   - Rotate keys if compromised

---

## ✅ Step 9: Verify Setup

1. **Check Environment Variables**:

   ```bash
   # In admin directory
   node -e "console.log(process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL)"
   ```

2. **Test API Connection** (if you have test script):

   - The code in `admin/lib/seo/search-console-api.ts` will automatically use these credentials
   - Check your admin dashboard for Search Console data

3. **Common Issues**:
   - **"Invalid credentials"**: Check that private key includes `\n` characters
   - **"Permission denied"**: Verify service account email is added to Search Console with "Full" permission
   - **"Site not found"**: Check that `GOOGLE_SEARCH_CONSOLE_SITE_URL` matches exactly in Search Console

---

## 🔒 Security Best Practices

1. ✅ **Never commit secrets to git**

   - Add `.env` to `.gitignore`
   - Add JSON key files to `.gitignore`
   - Use environment variables in production

2. ✅ **Rotate keys periodically**

   - Create new keys every 6-12 months
   - Delete old unused keys

3. ✅ **Limit permissions**

   - Service account only needs Search Console API access
   - No other Google Cloud permissions needed

4. ✅ **Monitor usage**
   - Check Google Cloud Console for API usage
   - Set up billing alerts if needed

---

## 📚 Additional Resources

- **Google Search Console API Docs**: https://developers.google.com/webmaster-tools/search-console-api-original
- **Service Account Guide**: https://cloud.google.com/iam/docs/service-accounts
- **API Reference**: https://developers.google.com/webmaster-tools/search-console-api-original/v1/urlInspection/index/inspect

---

## ❓ Troubleshooting

### Error: "Invalid credentials"

- Check that `private_key` includes `\n` characters
- Verify the key hasn't been corrupted (check quotes)
- Try regenerating the key

### Error: "Permission denied" or "Forbidden"

- Verify service account email is added to Search Console
- Check that permission is set to "Full" or "Owner"
- Wait a few minutes after adding (propagation delay)

### Error: "Site not found"

- Verify `GOOGLE_SEARCH_CONSOLE_SITE_URL` matches exactly
- Check if you used URL prefix vs domain property format
- Verify the site is verified in Search Console

### API Not Enabled

- Go to APIs & Services → Library
- Search for "Google Search Console API"
- Click "Enable" if not already enabled

---

**Need Help?** Check the code implementation in `admin/lib/seo/search-console-api.ts` for reference.
