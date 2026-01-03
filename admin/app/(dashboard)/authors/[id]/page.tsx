import { redirect } from "next/navigation";
import { getAuthorById, getAuthorArticles } from "../actions/authors-actions";
import { PageHeader } from "@/components/shared/page-header";
import { AuthorView } from "./components/author-view";
import { AuthorArticles } from "./components/author-articles";
import { DeleteAuthorButton } from "./components/delete-author-button";

export default async function AuthorViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [author, articles] = await Promise.all([
    getAuthorById(id),
    getAuthorArticles(id),
  ]);

  if (!author) {
    redirect("/authors");
  }

  return (
    <div className="container mx-auto max-w-[1128px]">
      <PageHeader
        title="Author Details"
        description="View author information and articles"
      />
      <div className="mb-6">
        <DeleteAuthorButton authorId={id} />
      </div>
      <div className="space-y-6">
        <AuthorView author={author} />
        <AuthorArticles articles={articles} authorId={id} />
      </div>
    </div>
  );
}
