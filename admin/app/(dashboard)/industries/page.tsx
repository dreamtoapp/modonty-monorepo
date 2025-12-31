import { getIndustries } from "./actions/industries-actions";
import { PageHeader } from "@/components/shared/page-header";
import { IndustryTable } from "./components/industry-table";

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Industries"
        description="Manage all industries in the system"
        actionLabel="New Industry"
        actionHref="/industries/new"
      />
      <IndustryTable industries={industries} />
    </div>
  );
}
