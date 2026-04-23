"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { DEFAULT_PRODUCT_STATUS_FILTER } from "@/services/db/product/types/product-filter.types";
import type { ProductListMetaItem } from "@/services/db/product/types/product-list.types";
import { ProductListEmptyState } from "./product-list-empty-state";
import {
  type ProductFilters,
  ProductListFilters,
} from "./product-list-filters";
import { ProductListTable } from "./product-list-table";

interface ProductListContentProps {
  products: ProductListMetaItem[];
  initialFilters: ProductFilters;
}

export function ProductListContent({
  products,
  initialFilters,
}: ProductListContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const updateUrl = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router],
  );

  const handleFiltersChange = useCallback(
    (newFilters: ProductFilters) => {
      const params = new URLSearchParams();
      if (newFilters.searchTerm) params.set("search", newFilters.searchTerm);
      if (newFilters.inativo !== DEFAULT_PRODUCT_STATUS_FILTER) {
        params.set("inativo", newFilters.inativo);
      }
      updateUrl(params);
    },
    [updateUrl],
  );

  const handleResetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname);
    });
  }, [pathname, router]);

  const hasActiveFilters =
    initialFilters.searchTerm.length > 0 ||
    initialFilters.inativo !== DEFAULT_PRODUCT_STATUS_FILTER;

  return (
    <>
      <ProductListFilters
        filters={initialFilters}
        onFiltersChange={handleFiltersChange}
        onResetFilters={handleResetFilters}
        isLoading={isPending}
      />

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-sm sm:rounded-[28px]">
        {isPending && (
          <div className="relative">
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-lg font-medium">
                    Pesquisando produtos...
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Aguarde enquanto carregamos os resultados
                </p>
              </div>
            </div>
            <div className="opacity-50">
              <ProductListTable products={products} />
            </div>
          </div>
        )}

        {!isPending && products.length > 0 && (
          <ProductListTable products={products} />
        )}

        {!isPending && products.length === 0 && (
          <div className="p-6">
            <ProductListEmptyState hasSearch={hasActiveFilters} />
          </div>
        )}
      </div>
    </>
  );
}
