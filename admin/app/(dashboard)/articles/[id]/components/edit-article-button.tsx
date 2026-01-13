"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EditArticleButton() {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "Coming soon",
      description: "Edit functionality will be available soon.",
    });
  };

  return (
    <Button variant="outline" size="icon" onClick={handleClick} title="Edit article">
      <Edit className="h-4 w-4" />
    </Button>
  );
}
