import { connection } from "next/server";
import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { createLogger } from "@/core/logger";
import { getCategoryList } from "@/services/db/category/category.service";
import { CategoryListContent } from "./_components";

const logger = createLogger("CategoryListPage");

type SearchParams = Promise<{
  search?: string;
}>;

async function CategoryListLoader({
  searchParamsPromise,
}: {
  searchParamsPromise: SearchParams;
}) {
  const searchParams = await searchParamsPromise;

  await connection();

  let categories: Awaited<ReturnType<typeof getCategoryList>> = [];

  try {
    categories = await getCategoryList({
      search: searchParams.search,
    });
  } catch (error) {
    logger.error("Erro ao carregar lista de categorias", error);
  }

  return (
    <>
      <p className="text-sm text-muted-foreground">
        {categories.length} categoria{categories.length !== 1 ? "s" : ""}{" "}
        encontrada
        {categories.length !== 1 ? "s" : ""}
      </p>

      <CategoryListContent
        categories={categories}
        initialFilters={{ searchTerm: searchParams.search ?? "" }}
      />
    </>
  );
}

export default function CategoryListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main mx-auto flex w-full flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Lista de Categorias
        </h1>

        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <CategoryListLoader searchParamsPromise={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
