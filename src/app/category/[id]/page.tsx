import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { z } from "zod";

import { createLogger } from "@/core/logger";
import { getCategoryById } from "@/services/db/category/category.service";
import {
  CategoryDetailView,
  CategoryDetailViewSkeleton,
} from "./_components/CategoryDetailView";

const logger = createLogger("CategoryDetailPage");

const CategoryPageParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID deve ser um número válido")
    .transform(Number),
});

type CategoryDetailsPageProps = {
  params: Promise<{ id: string }>;
};

async function CategoryDetailsLoader({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const routeParams = await paramsPromise;

  const parsed = CategoryPageParamsSchema.safeParse({ id: routeParams.id });
  if (!parsed.success) {
    logger.error("Invalid category ID parameter:", parsed.error);
    notFound();
  }

  const categoryId = parsed.data.id;

  await connection();

  const category = await getCategoryById(categoryId);

  if (!category) {
    logger.warn(`Category not found for ID: ${categoryId}`);
    notFound();
  }

  return (
    <div className="mx-auto flex flex-1 flex-col w-full">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-6 py-6">
          <div className="px-4 lg:px-6">
            <CategoryDetailView category={category} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryDetailsPage({
  params,
}: CategoryDetailsPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main mx-auto flex w-full flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Detalhes da Categoria
        </h1>

        <Suspense
          fallback={
            <div className="px-4 lg:px-6">
              <CategoryDetailViewSkeleton />
            </div>
          }
        >
          <CategoryDetailsLoader paramsPromise={params} />
        </Suspense>
      </div>
    </div>
  );
}
