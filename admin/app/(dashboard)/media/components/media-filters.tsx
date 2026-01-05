"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaFiltersProps {
  clients: Array<{ id: string; name: string }>;
  defaultClientId?: string;
}

export function MediaFilters({ clients, defaultClientId }: MediaFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientId, setClientId] = useState(searchParams.get("clientId") || defaultClientId || "all");
  const [mimeType, setMimeType] = useState(searchParams.get("mimeType") || "all");
  const [used, setUsed] = useState(searchParams.get("used") || "all");
  const [isExpanded, setIsExpanded] = useState(false);

  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`/media?${newParams.toString()}`);
  };

  const handleClientChange = (value: string) => {
    setClientId(value);
    updateURL({ clientId: value, page: "1" });
  };

  const handleMimeTypeChange = (value: string) => {
    setMimeType(value);
    updateURL({ mimeType: value, page: "1" });
  };

  const handleUsedChange = (value: string) => {
    setUsed(value);
    updateURL({ used: value, page: "1" });
  };

  const clearFilters = () => {
    setClientId("all");
    setMimeType("all");
    setUsed("all");
    router.push("/media");
  };

  const hasActiveFilters = clientId !== "all" || mimeType !== "all" || used !== "all";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-base font-semibold hover:text-primary transition-colors"
            >
              Filters
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Client Filter */}
            <div className="space-y-2">
              <Label htmlFor="client-filter">Client</Label>
              <Select value={clientId} onValueChange={handleClientChange}>
                <SelectTrigger id="client-filter">
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* MIME Type Filter */}
            <div className="space-y-2">
              <Label htmlFor="mime-type-filter">Type</Label>
              <Select value={mimeType} onValueChange={handleMimeTypeChange}>
                <SelectTrigger id="mime-type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Usage Filter */}
            <div className="space-y-2">
              <Label htmlFor="used-filter">Usage</Label>
              <Select value={used} onValueChange={handleUsedChange}>
                <SelectTrigger id="used-filter">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="unused">Unused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
