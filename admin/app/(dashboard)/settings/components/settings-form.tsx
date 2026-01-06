"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { getAllSettings, updateAllSettings, type AllSettings } from "../actions/settings-actions";
import {
  Code,
  Activity,
  Share2,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

export function SettingsForm() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AllSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [openSections, setOpenSections] = useState({
    seo: true,
    gtm: false,
    hotjar: false,
    social: false,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getAllSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const result = await updateAllSettings(settings);
      if (result.success) {
        toast({
          title: "Settings saved",
          description: "All settings have been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="text-center py-8">Failed to load settings</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SEO Settings - Collapsible */}
      <Collapsible
        open={openSections.seo}
        onOpenChange={(open) => setOpenSections({ ...openSections, seo: open })}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>
                      Configure SEO field length limits for titles, descriptions, and social cards
                    </CardDescription>
                  </div>
                </div>
                {openSections.seo ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6 pt-0">
              {/* SEO Title Settings */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">SEO Title</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Google recommends 50-60 characters (optimal), but can display up to ~70 characters (may truncate).
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seoTitleMin">Minimum Length</Label>
                      <Input
                        id="seoTitleMin"
                        type="number"
                        min="1"
                        value={settings.seoTitleMin}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            seoTitleMin: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoTitleMax">Maximum Length</Label>
                      <Input
                        id="seoTitleMax"
                        type="number"
                        min="1"
                        value={settings.seoTitleMax}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            seoTitleMax: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="seoTitleRestrict"
                      checked={settings.seoTitleRestrict}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          seoTitleRestrict: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="seoTitleRestrict" className="cursor-pointer text-sm">
                      Restrict (hard block) - When enabled, forms will prevent submission if title exceeds maximum
                    </Label>
                  </div>
                </div>

                <Separator />

                {/* SEO Description Settings */}
                <div>
                  <h4 className="text-sm font-medium mb-2">SEO Description</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Google recommends 150-160 characters (optimal), but can display up to ~320 characters (may truncate).
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seoDescriptionMin">Minimum Length</Label>
                      <Input
                        id="seoDescriptionMin"
                        type="number"
                        min="1"
                        value={settings.seoDescriptionMin}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            seoDescriptionMin: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoDescriptionMax">Maximum Length</Label>
                      <Input
                        id="seoDescriptionMax"
                        type="number"
                        min="1"
                        value={settings.seoDescriptionMax}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            seoDescriptionMax: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="seoDescriptionRestrict"
                      checked={settings.seoDescriptionRestrict}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          seoDescriptionRestrict: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="seoDescriptionRestrict" className="cursor-pointer text-sm">
                      Restrict (hard block) - When enabled, forms will prevent submission if description exceeds maximum
                    </Label>
                  </div>
                </div>

                <Separator />

                {/* Twitter Settings */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Twitter/X Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitterTitleMax">Title Max Length</Label>
                      <Input
                        id="twitterTitleMax"
                        type="number"
                        min="1"
                        value={settings.twitterTitleMax}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            twitterTitleMax: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="twitterTitleRestrict"
                          checked={settings.twitterTitleRestrict}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              twitterTitleRestrict: checked === true,
                            })
                          }
                        />
                        <Label htmlFor="twitterTitleRestrict" className="cursor-pointer text-xs">
                          Restrict
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitterDescriptionMax">Description Max Length</Label>
                      <Input
                        id="twitterDescriptionMax"
                        type="number"
                        min="1"
                        value={settings.twitterDescriptionMax}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            twitterDescriptionMax: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="twitterDescriptionRestrict"
                          checked={settings.twitterDescriptionRestrict}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              twitterDescriptionRestrict: checked === true,
                            })
                          }
                        />
                        <Label htmlFor="twitterDescriptionRestrict" className="cursor-pointer text-xs">
                          Restrict
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* OG Settings */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Open Graph Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ogTitleMax">Title Max Length</Label>
                      <Input
                        id="ogTitleMax"
                        type="number"
                        min="1"
                        value={settings.ogTitleMax}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ogTitleMax: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="ogTitleRestrict"
                          checked={settings.ogTitleRestrict}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              ogTitleRestrict: checked === true,
                            })
                          }
                        />
                        <Label htmlFor="ogTitleRestrict" className="cursor-pointer text-xs">
                          Restrict
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ogDescriptionMax">Description Max Length</Label>
                      <Input
                        id="ogDescriptionMax"
                        type="number"
                        min="1"
                        value={settings.ogDescriptionMax}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ogDescriptionMax: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="ogDescriptionRestrict"
                          checked={settings.ogDescriptionRestrict}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              ogDescriptionRestrict: checked === true,
                            })
                          }
                        />
                        <Label htmlFor="ogDescriptionRestrict" className="cursor-pointer text-xs">
                          Restrict
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* GTM Settings - Collapsible */}
      <Collapsible
        open={openSections.gtm}
        onOpenChange={(open) => setOpenSections({ ...openSections, gtm: open })}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <CardTitle>Google Tag Manager (GTM)</CardTitle>
                    <CardDescription>
                      Configure global GTM container ID for platform-wide tracking
                    </CardDescription>
                  </div>
                </div>
                {openSections.gtm ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2">
                <Label htmlFor="gtmContainerId">GTM Container ID</Label>
                <Input
                  id="gtmContainerId"
                  type="text"
                  placeholder="GTM-XXXXXXX"
                  value={settings.gtmContainerId || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      gtmContainerId: e.target.value || null,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Enter your Google Tag Manager container ID (format: GTM-XXXXXXX)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gtmEnabled"
                  checked={settings.gtmEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      gtmEnabled: checked === true,
                    })
                  }
                />
                <Label htmlFor="gtmEnabled" className="cursor-pointer">
                  Enable GTM - When enabled, GTM script will be loaded on all pages
                </Label>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* HOTjar Settings - Collapsible */}
      <Collapsible
        open={openSections.hotjar}
        onOpenChange={(open) => setOpenSections({ ...openSections, hotjar: open })}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <CardTitle>HOTjar</CardTitle>
                    <CardDescription>
                      Configure HOTjar site ID for user behavior analytics and heatmaps
                    </CardDescription>
                  </div>
                </div>
                {openSections.hotjar ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2">
                <Label htmlFor="hotjarSiteId">HOTjar Site ID</Label>
                <Input
                  id="hotjarSiteId"
                  type="text"
                  placeholder="1234567"
                  value={settings.hotjarSiteId || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hotjarSiteId: e.target.value || null,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Enter your HOTjar site ID (numeric ID from your HOTjar dashboard)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hotjarEnabled"
                  checked={settings.hotjarEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      hotjarEnabled: checked === true,
                    })
                  }
                />
                <Label htmlFor="hotjarEnabled" className="cursor-pointer">
                  Enable HOTjar - When enabled, HOTjar script will be loaded on all pages
                </Label>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Social Media Settings - Collapsible */}
      <Collapsible
        open={openSections.social}
        onOpenChange={(open) => setOpenSections({ ...openSections, social: open })}
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Share2 className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <CardTitle>Social Media</CardTitle>
                    <CardDescription>
                      Configure platform-wide social media profile links
                    </CardDescription>
                  </div>
                </div>
                {openSections.social ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl">Facebook URL</Label>
                  <Input
                    id="facebookUrl"
                    type="url"
                    placeholder="https://facebook.com/yourpage"
                    value={settings.facebookUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        facebookUrl: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                  <Input
                    id="twitterUrl"
                    type="url"
                    placeholder="https://twitter.com/yourhandle"
                    value={settings.twitterUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        twitterUrl: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedInUrl"
                    type="url"
                    placeholder="https://linkedin.com/company/yourcompany"
                    value={settings.linkedInUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        linkedInUrl: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">Instagram URL</Label>
                  <Input
                    id="instagramUrl"
                    type="url"
                    placeholder="https://instagram.com/yourhandle"
                    value={settings.instagramUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        instagramUrl: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">YouTube URL</Label>
                  <Input
                    id="youtubeUrl"
                    type="url"
                    placeholder="https://youtube.com/@yourchannel"
                    value={settings.youtubeUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        youtubeUrl: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktokUrl">TikTok URL</Label>
                  <Input
                    id="tiktokUrl"
                    type="url"
                    placeholder="https://tiktok.com/@yourhandle"
                    value={settings.tiktokUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tiktokUrl: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    placeholder="https://github.com/yourusername"
                    value={settings.githubUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        githubUrl: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pinterestUrl">Pinterest URL</Label>
                  <Input
                    id="pinterestUrl"
                    type="url"
                    placeholder="https://pinterest.com/yourprofile"
                    value={settings.pinterestUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pinterestUrl: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="snapchatUrl">Snapchat URL</Label>
                  <Input
                    id="snapchatUrl"
                    type="url"
                    placeholder="https://snapchat.com/add/yourhandle"
                    value={settings.snapchatUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        snapchatUrl: e.target.value || null,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </form>
  );
}
