import { CategoryPage } from "@/components/CategoryPage/CategoryPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CategoryPage slug={resolvedParams.slug} />;
}
