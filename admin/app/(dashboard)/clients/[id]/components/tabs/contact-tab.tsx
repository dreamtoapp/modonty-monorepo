"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Users } from "lucide-react";

interface ContactTabProps {
  client: {
    email: string | null;
    phone: string | null;
    contactType: string | null;
    addressStreet: string | null;
    addressCity: string | null;
    addressCountry: string | null;
    addressPostalCode: string | null;
    addressRegion: string | null;
    addressNeighborhood: string | null;
    addressBuildingNumber: string | null;
    addressAdditionalNumber: string | null;
  };
}

export function ContactTab({ client }: ContactTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {client.email && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Email</p>
              </div>
              <a
                href={`mailto:${client.email}`}
                className="text-sm text-primary hover:underline font-medium"
              >
                {client.email}
              </a>
            </div>
          )}
          {client.phone && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Phone</p>
              </div>
              <a
                href={`tel:${client.phone}`}
                className="text-sm text-primary hover:underline font-medium"
              >
                {client.phone}
              </a>
            </div>
          )}
          {client.contactType && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Contact Type</p>
              </div>
              <p className="text-sm font-medium">{client.contactType}</p>
            </div>
          )}
          {(client.addressStreet ||
            client.addressCity ||
            client.addressCountry ||
            client.addressPostalCode ||
            client.addressRegion ||
            client.addressNeighborhood ||
            client.addressBuildingNumber) && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Address</p>
                </div>
                <div className="space-y-1">
                  {client.addressStreet && (
                    <p className="text-sm">{client.addressStreet}</p>
                  )}
                  {client.addressNeighborhood && (
                    <p className="text-sm text-muted-foreground">Neighborhood: {client.addressNeighborhood}</p>
                  )}
                  {(client.addressBuildingNumber || client.addressAdditionalNumber) && (
                    <p className="text-sm text-muted-foreground">
                      Building: {client.addressBuildingNumber || ""}
                      {client.addressAdditionalNumber ? `-${client.addressAdditionalNumber}` : ""}
                    </p>
                  )}
                  <p className="text-sm">
                    {[
                      client.addressCity,
                      client.addressRegion,
                      client.addressCountry,
                      client.addressPostalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            )}
          {!client.email && !client.phone && !client.contactType &&
           !client.addressStreet && !client.addressCity && !client.addressCountry && !client.addressPostalCode &&
           !client.addressRegion && !client.addressNeighborhood && !client.addressBuildingNumber && (
            <p className="text-sm text-muted-foreground text-center py-8">No contact information available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
