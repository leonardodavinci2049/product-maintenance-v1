import { connection } from "next/server";
import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { createLogger } from "@/core/logger";
import { getProductListDescription } from "@/services/db/product/product.service";
import { parseProductStatusFilter } from "@/services/db/product/types/product-filter.types";
import { ProductListContent } from "./_components";

const logger = createLogger("ProductListPage");

type SearchParams = Promise<{
  search?: string;
  inativo?: string;
}>;

async function ProductListLoader({
  searchParamsPromise,
}: {
  searchParamsPromise: SearchParams;
}) {
  const searchParams = await searchParamsPromise;
  const inativo = parseProductStatusFilter(searchParams.inativo);

  await connection();

  let products: Awaited<ReturnType<typeof getProductListDescription>> = [];

  try {
    products = await getProductListDescription({
      inativo,
      search: searchParams.search,
    });
  } catch (error) {
    logger.error("Erro ao carregar lista de produtos", error);
  }

  return (
    <>
      <p className="text-sm text-muted-foreground">
        {products.length} produto{products.length !== 1 ? "s" : ""} encontrado
        {products.length !== 1 ? "s" : ""}
      </p>

      <ProductListContent
        products={products}
        initialFilters={{ searchTerm: searchParams.search ?? "", inativo }}
      />
    </>
  );
}

export default function ProductListDescriptionPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main mx-auto flex w-full max-w-350 flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Lista de Produtos</h1>

        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <ProductListLoader searchParamsPromise={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
