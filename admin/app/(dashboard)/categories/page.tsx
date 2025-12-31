import { getCategories } from "./actions/categories-actions";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryTable } from "./components/category-table";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Categories"
        description="Manage all categories in the system"
        actionLabel="New Category"
        actionHref="/categories/new"
      />
      <CategoryTable categories={categories} />
    </div>
  );
}
