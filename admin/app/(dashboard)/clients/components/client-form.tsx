"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea, FormSelect, FormNativeSelect } from "@/components/admin/form-field";
import { SelectItem } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { slugify } from "@/lib/utils";
import { SubscriptionTierCards } from "./subscription-tier-cards";
import { CharacterCounter } from "./character-counter";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ClientFormProps {
  initialData?: any;
  industries?: Array<{ id: string; name: string }>;
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function ClientForm({ initialData, industries = [], onSubmit }: ClientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState({
    basic: true,
    business: false,
    subscription: false,
    contact: false,
    seo: false,
  });

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    legalName: initialData?.legalName || "",
    url: initialData?.url || "",
    logo: initialData?.logo || "",
    ogImage: initialData?.ogImage || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    sameAs: initialData?.sameAs?.join("\n") || "",
    businessBrief: initialData?.businessBrief || "",
    industryId: initialData?.industryId || initialData?.industry?.id || "",
    targetAudience: initialData?.targetAudience || "",
    contentPriorities: initialData?.contentPriorities?.join(", ") || "",
    foundingDate: initialData?.foundingDate
      ? new Date(initialData.foundingDate).toISOString().split("T")[0]
      : "",
    gtmId: initialData?.gtmId || "",
    subscriptionTier: initialData?.subscriptionTier || "",
    subscriptionStartDate: initialData?.subscriptionStartDate
      ? new Date(initialData.subscriptionStartDate).toISOString().split("T")[0]
      : "",
    subscriptionEndDate: initialData?.subscriptionEndDate
      ? new Date(initialData.subscriptionEndDate).toISOString().split("T")[0]
      : "",
    subscriptionStatus: initialData?.subscriptionStatus || "PENDING",
    paymentStatus: initialData?.paymentStatus || "PENDING",
  });

  useEffect(() => {
    const newSlug = slugify(formData.name);
    setFormData((prev) => ({ ...prev, slug: newSlug }));
  }, [formData.name]);

  const getArticlesPerMonth = (tier: string): number => {
    switch (tier) {
      case "BASIC":
        return 2;
      case "STANDARD":
        return 4;
      case "PRO":
        return 8;
      case "PREMIUM":
        return 12;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (formData.subscriptionTier && formData.subscriptionStartDate) {
      const startDate = new Date(formData.subscriptionStartDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 18);
      setFormData((prev) => ({
        ...prev,
        subscriptionEndDate: endDate.toISOString().split("T")[0],
      }));
    }
  }, [formData.subscriptionTier, formData.subscriptionStartDate]);

  const articlesPerMonth = getArticlesPerMonth(formData.subscriptionTier);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.businessBrief || formData.businessBrief.trim().length < 100) {
      setError("Business Brief is required and must be at least 100 characters long");
      setLoading(false);
      setOpenSections((prev) => ({ ...prev, business: true }));
      return;
    }

    if (formData.gtmId && !/^GTM-[A-Z0-9]+$/.test(formData.gtmId)) {
      setError("GTM ID must be in format GTM-XXXXXXX");
      setLoading(false);
      setOpenSections((prev) => ({ ...prev, seo: true }));
      return;
    }

    const result = await onSubmit({
      ...formData,
      sameAs: formData.sameAs
        ? formData.sameAs.split("\n").map((s: string) => s.trim()).filter(Boolean)
        : [],
      contentPriorities: formData.contentPriorities
        ? formData.contentPriorities.split(",").map((p: string) => p.trim()).filter(Boolean)
        : [],
      foundingDate: formData.foundingDate ? new Date(formData.foundingDate) : null,
      subscriptionStartDate: formData.subscriptionStartDate
        ? new Date(formData.subscriptionStartDate)
        : null,
      subscriptionEndDate: formData.subscriptionEndDate
        ? new Date(formData.subscriptionEndDate)
        : null,
      articlesPerMonth: articlesPerMonth,
      subscriptionTier: formData.subscriptionTier || null,
      subscriptionStatus: formData.subscriptionStatus || "PENDING",
      paymentStatus: formData.paymentStatus || "PENDING",
    });

    if (result.success) {
      router.push("/clients");
      router.refresh();
    } else {
      setError(result.error || "Failed to save client");
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        <Collapsible open={openSections.basic} onOpenChange={() => toggleSection("basic")}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle>Basic Information</CardTitle>
                {openSections.basic ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <FormInput
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  hint={
                    formData.slug && formData.slug.trim()
                      ? `Slug: ${formData.slug}`
                      : "Slug will be generated from name"
                  }
                  required
                />
                <input type="hidden" name="slug" value={formData.slug} />
                <FormInput
                  label="Legal Name"
                  name="legalName"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                />
                <FormInput
                  label="URL"
                  name="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
                <FormInput
                  label="Logo URL"
                  name="logo"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={openSections.business} onOpenChange={() => toggleSection("business")}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle>Business Details</CardTitle>
                {openSections.business ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <div>
                  <FormTextarea
                    label="Business Brief"
                    name="businessBrief"
                    value={formData.businessBrief}
                    onChange={(e) => setFormData({ ...formData, businessBrief: e.target.value })}
                    rows={6}
                    required
                    placeholder="Describe the client's business, products/services, target audience, and unique selling points. This helps content writers create relevant, customized content. (Minimum 100 characters)"
                  />
                  <div className="mt-1">
                    <CharacterCounter
                      current={formData.businessBrief.length}
                      min={100}
                      className="ml-1"
                    />
                  </div>
                </div>
                <FormNativeSelect
                  label="Industry"
                  name="industryId"
                  value={formData.industryId}
                  onChange={(e) => setFormData({ ...formData, industryId: e.target.value })}
                  placeholder="Select an industry"
                >
                  {industries.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </FormNativeSelect>
                <FormTextarea
                  label="Target Audience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  rows={3}
                  placeholder="Describe the target audience for this client"
                />
                <FormInput
                  label="Content Priorities (comma-separated)"
                  name="contentPriorities"
                  value={formData.contentPriorities}
                  onChange={(e) => setFormData({ ...formData, contentPriorities: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <FormInput
                  label="Founding Date"
                  name="foundingDate"
                  type="date"
                  value={formData.foundingDate}
                  onChange={(e) => setFormData({ ...formData, foundingDate: e.target.value })}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible
          open={openSections.subscription}
          onOpenChange={() => toggleSection("subscription")}
        >
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle>Subscription & Billing</CardTitle>
                {openSections.subscription ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6 pt-0">
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Subscription Tier <span className="text-destructive">*</span>
                  </label>
                  <SubscriptionTierCards
                    selectedTier={formData.subscriptionTier}
                    onSelect={(tier) => setFormData({ ...formData, subscriptionTier: tier })}
                  />
                </div>
                <FormInput
                  label="Subscription Start Date"
                  name="subscriptionStartDate"
                  type="date"
                  value={formData.subscriptionStartDate}
                  onChange={(e) => setFormData({ ...formData, subscriptionStartDate: e.target.value })}
                />
                <FormInput
                  label="Subscription End Date"
                  name="subscriptionEndDate"
                  type="date"
                  value={formData.subscriptionEndDate}
                  onChange={(e) => setFormData({ ...formData, subscriptionEndDate: e.target.value })}
                  hint="Automatically calculated (18 months from start date)"
                />
                {articlesPerMonth > 0 && (
                  <div className="rounded-md border bg-muted p-4">
                    <p className="text-sm font-medium">Articles Per Month: {articlesPerMonth}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Automatically calculated from subscription tier
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormSelect
                    label="Subscription Status"
                    name="subscriptionStatus"
                    value={formData.subscriptionStatus}
                    onValueChange={(value) => setFormData({ ...formData, subscriptionStatus: value })}
                  >
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </FormSelect>
                  <FormSelect
                    label="Payment Status"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                  >
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                  </FormSelect>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={openSections.contact} onOpenChange={() => toggleSection("contact")}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle>Contact & Branding</CardTitle>
                {openSections.contact ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <FormInput
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <FormTextarea
                  label="Social Profiles (one per line)"
                  name="sameAs"
                  value={formData.sameAs}
                  onChange={(e) => setFormData({ ...formData, sameAs: e.target.value })}
                  rows={4}
                  placeholder="https://linkedin.com/company/example&#10;https://twitter.com/example"
                />
                <FormInput
                  label="OG Image URL"
                  name="ogImage"
                  value={formData.ogImage}
                  onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={openSections.seo} onOpenChange={() => toggleSection("seo")}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle>SEO & Tracking</CardTitle>
                {openSections.seo ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <FormInput
                  label="SEO Title"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                />
                <div>
                  <FormTextarea
                    label="SEO Description"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    rows={3}
                  />
                  <div className="mt-1">
                    <CharacterCounter
                      current={formData.seoDescription.length}
                      max={160}
                      className="ml-1"
                    />
                  </div>
                </div>
                <FormInput
                  label="Google Tag Manager ID"
                  name="gtmId"
                  value={formData.gtmId}
                  onChange={(e) => setFormData({ ...formData, gtmId: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                  hint="GTM ID allows clients to see article performance in their own Google Analytics"
                  error={
                    formData.gtmId && !/^GTM-[A-Z0-9]+$/.test(formData.gtmId)
                      ? "GTM ID must be in format GTM-XXXXXXX"
                      : undefined
                  }
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Client" : "Create Client"}
          </Button>
        </div>
      </div>
    </form>
  );
}
