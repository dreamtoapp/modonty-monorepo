"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface BusinessTabProps {
  client: {
    businessBrief: string | null;
    industry: {
      id: string;
      name: string;
    } | null;
    targetAudience: string | null;
    contentPriorities: string[];
    foundingDate: Date | null;
  };
}

export function BusinessTab({ client }: BusinessTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {client.businessBrief && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Business Brief</p>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{client.businessBrief}</p>
            </div>
          )}
          {client.industry && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Industry</p>
              <p className="text-sm font-medium">{client.industry.name}</p>
            </div>
          )}
          {client.targetAudience && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Target Audience</p>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{client.targetAudience}</p>
            </div>
          )}
          {client.contentPriorities && client.contentPriorities.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Content Priorities</p>
              <div className="flex flex-wrap gap-2">
                {client.contentPriorities.map((priority, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {priority}
                  </span>
                ))}
              </div>
            </div>
          )}
          {client.foundingDate && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Founding Date</p>
              <p className="text-sm font-medium">{format(new Date(client.foundingDate), "MMM d, yyyy")}</p>
            </div>
          )}
          {!client.businessBrief && !client.industry && !client.targetAudience && 
           client.contentPriorities.length === 0 && !client.foundingDate && (
            <p className="text-sm text-muted-foreground text-center py-8">No business details available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
