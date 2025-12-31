import { redirect } from "next/navigation";
import { getCategoryById, getCategories, updateCategory } from "../actions/categories-actions";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryForm } from "../components/category-form";
import { DeleteCategoryButton } from "./components/delete-category-button";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, categories] = await Promise.all([getCategoryById(id), getCategories()]);

  if (!category) {
    redirect("/categories");
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Edit Category</h1>
          <p className="text-muted-foreground mt-1">Update category information</p>
        </div>
        <DeleteCategoryButton categoryId={id} />
      </div>
      <CategoryForm
        initialData={category}
        categories={categories}
        onSubmit={(data) => updateCategory(id, data)}
      />
    </div>
  );
}
