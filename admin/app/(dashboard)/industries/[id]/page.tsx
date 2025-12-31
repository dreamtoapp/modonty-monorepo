import { redirect } from "next/navigation";
import { getIndustryById, updateIndustry } from "../actions/industries-actions";
import { PageHeader } from "@/components/shared/page-header";
import { IndustryForm } from "../components/industry-form";
import { DeleteIndustryButton } from "./components/delete-industry-button";

export default async function EditIndustryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const industry = await getIndustryById(id);

  if (!industry) {
    redirect("/industries");
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Edit Industry</h1>
          <p className="text-muted-foreground mt-1">Update industry information</p>
        </div>
        <DeleteIndustryButton industryId={id} />
      </div>
      <IndustryForm initialData={industry} onSubmit={(data) => updateIndustry(id, data)} />
    </div>
  );
}
