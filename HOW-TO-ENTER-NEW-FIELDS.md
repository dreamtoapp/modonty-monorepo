# How to Enter New Organization Fields in the Database

## 📍 **Where to Enter the New Fields**

You can enter all the new Organization fields in **two places**:

### 1. **Create New Client**
**URL Path:** `/clients/new`  
**Full URL:** `http://your-domain/admin/clients/new`

### 2. **Edit Existing Client**
**URL Path:** `/clients/[client-id]/edit`  
**Full URL:** `http://your-domain/admin/clients/[client-id]/edit`

---

## 🎯 **Step-by-Step Instructions**

### **Step 1: Navigate to Client Form**

#### **Option A: Create New Client**
1. Go to the **Clients** page: `/clients`
2. Click the **"+ New Client"** button (top right)
3. You'll be taken to `/clients/new`

#### **Option B: Edit Existing Client**
1. Go to the **Clients** page: `/clients`
2. Find the client you want to edit
3. Click the **"Edit"** button (or click on the client row)
4. You'll be taken to `/clients/[id]/edit`

---

### **Step 2: Find the New Form Sections**

After opening the client form, you'll see **collapsible sections**. The new fields are in **4 new sections** that you need to **expand**:

#### **Section 1: Saudi Arabia Legal & Registration** 🔴
**Location:** Scroll down in the form, after the "SEO & Tracking" section

**Fields in this section:**
- ✅ **Commercial Registration Number (CR)** - *Critical for Saudi businesses*
- ✅ **Legal Form** - Dropdown: LLC, JSC, Sole Proprietorship, etc.
- ✅ **VAT ID (ZATCA)** - VAT registration number
- ✅ **Tax ID** - Tax identification number
- ✅ **License Number** - For regulated sectors
- ✅ **License Authority** - Regulatory authority name

**How to access:**
1. Look for the card with title: **"Saudi Arabia Legal & Registration"**
2. Click on it to expand (it's collapsed by default)
3. Fill in the fields

---

#### **Section 2: Enhanced Address (National Address Format)** 🏠
**Location:** After "Saudi Arabia Legal & Registration" section

**Fields in this section:**
- ✅ **Street Address**
- ✅ **Neighborhood** - District/neighborhood (National Address)
- ✅ **Building Number** - Building number (National Address)
- ✅ **Additional Number** - Additional number (National Address)
- ✅ **City**
- ✅ **Region/Province** - Dropdown with 13 Saudi regions
- ✅ **Postal Code** - 9-digit postal code
- ✅ **Country** - Default: SA (Saudi Arabia)

**How to access:**
1. Look for the card with title: **"Enhanced Address (National Address Format)"**
2. Click on it to expand (it's collapsed by default)
3. Fill in the address fields

---

#### **Section 3: Business Classification** 📊
**Location:** After "Enhanced Address" section

**Fields in this section:**
- ✅ **Organization Type** - Dropdown: Organization, Corporation, LocalBusiness, NonProfit, etc.
- ✅ **Business Activity Code** - Local business activity classification
- ✅ **ISIC V4 Code** - International Standard Industrial Classification
- ✅ **Number of Employees** - Employee count (e.g., "50" or "10-50")

**How to access:**
1. Look for the card with title: **"Business Classification"**
2. Click on it to expand (it's collapsed by default)
3. Fill in the classification fields

---

#### **Section 4: Additional Properties** ⭐
**Location:** After "Business Classification" section

**Fields in this section:**
- ✅ **Alternate Name** - Alternative names (Arabic name, trade name)
- ✅ **Slogan** - Company slogan/motto
- ✅ **Keywords** - Comma-separated keywords for classification
- ✅ **Knows Language** - Comma-separated languages (e.g., "Arabic, English")

**How to access:**
1. Look for the card with title: **"Additional Properties"**
2. Click on it to expand (it's collapsed by default)
3. Fill in the additional fields

---

## 📋 **Complete Field List**

### **Saudi Arabia Legal & Registration Section:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Commercial Registration Number | Text | Recommended | `1234567890` |
| Legal Form | Dropdown | Recommended | `LLC` |
| VAT ID (ZATCA) | Text | Optional | `310123456789003` |
| Tax ID | Text | Optional | `123456789012345` |
| License Number | Text | Optional | `HC-2023-12345` |
| License Authority | Text | Optional | `Ministry of Health` |

### **Enhanced Address Section:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Street Address | Text | Optional | `King Fahd Road, Al Olaya` |
| Neighborhood | Text | Optional | `Al Olaya District` |
| Building Number | Text | Optional | `1234` |
| Additional Number | Text | Optional | `5678` |
| City | Text | Optional | `Riyadh` |
| Region/Province | Dropdown | Optional | `Riyadh` |
| Postal Code | Text | Optional | `12211-1234` |
| Country | Text | Optional | `SA` |

### **Business Classification Section:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Organization Type | Dropdown | Optional | `Corporation` |
| Business Activity Code | Text | Optional | `6201` |
| ISIC V4 Code | Text | Optional | `6201` |
| Number of Employees | Text | Optional | `50-100` |

### **Additional Properties Section:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Alternate Name | Text | Optional | `شركة المثال` |
| Slogan | Text | Optional | `Innovation for Tomorrow` |
| Keywords | Text (comma-separated) | Optional | `technology, software, SaaS` |
| Knows Language | Text (comma-separated) | Optional | `Arabic, English` |

---

## ✅ **Verification Steps**

After entering the fields:

1. **Click "Create Client" or "Update Client"** button at the bottom
2. **Check the SEO Doctor panel** (right side) - it will validate your entries
3. **View the client** - Go to `/clients/[id]` to see the data displayed
4. **Check JSON-LD** - The structured data will be generated automatically

---

## 🔍 **Where to View the Data**

### **In Admin Panel:**
1. **Client Detail Page:** `/clients/[id]`
   - Go to **"Basic Info"** tab to see:
     - Alternate Name, Slogan, Organization Type
     - Saudi Arabia Legal & Registration section
     - Business Classification section
     - Parent Organization (if set)
     - Keywords and Languages Supported
   
   - Go to **"Contact"** tab to see:
     - Enhanced Address with National Address format

### **In Database:**
All fields are saved in the `clients` collection in MongoDB with these field names:
- `commercialRegistrationNumber`
- `vatID`
- `taxID`
- `legalForm`
- `addressRegion`
- `addressNeighborhood`
- `addressBuildingNumber`
- `addressAdditionalNumber`
- `businessActivityCode`
- `isicV4`
- `numberOfEmployees`
- `licenseNumber`
- `licenseAuthority`
- `alternateName`
- `slogan`
- `keywords` (array)
- `knowsLanguage` (array)
- `organizationType`
- `parentOrganizationId`

### **In JSON-LD Structured Data:**
The data automatically appears in the Organization JSON-LD schema when:
- Viewing client pages
- Generating SEO metadata
- Using the API endpoints

---

## 🚨 **Important Notes**

1. **All new fields are OPTIONAL** - You don't have to fill all of them
2. **Sections are collapsed by default** - You need to click to expand them
3. **Commercial Registration Number is CRITICAL** for Saudi businesses - Highly recommended
4. **National Address format** is optimized for Saudi Arabia local SEO
5. **SEO Doctor** will validate your entries in real-time (right panel)

---

## 🎯 **Quick Access Checklist**

- [ ] Navigate to `/clients/new` or `/clients/[id]/edit`
- [ ] Expand **"Saudi Arabia Legal & Registration"** section
- [ ] Expand **"Enhanced Address (National Address Format)"** section
- [ ] Expand **"Business Classification"** section
- [ ] Expand **"Additional Properties"** section
- [ ] Fill in the fields
- [ ] Click **"Create Client"** or **"Update Client"**
- [ ] Verify data in client detail page
- [ ] Check JSON-LD output

---

## 📞 **Need Help?**

If you can't find the sections:
1. Make sure you're on the correct page (`/clients/new` or `/clients/[id]/edit`)
2. Scroll down - the sections are after the "SEO & Tracking" section
3. Look for collapsible cards with icons (Building2 icon)
4. Click on the card headers to expand them

---

**Last Updated:** After Organization schema enhancement implementation  
**Status:** Ready to Use ✅
