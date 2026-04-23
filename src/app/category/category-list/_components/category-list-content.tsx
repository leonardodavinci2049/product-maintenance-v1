"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { CategoryListItem } from "@/services/db/category/types/category-list.types";
import { CategoryListEmptyState } from "./category-list-empty-state";
import {
  type CategoryFilters,
  CategoryListFilters,
} from "./category-list-filters";
import { CategoryListTable } from "./category-list-table";

interface CategoryListContentProps {
  categories: CategoryListItem[];
  initialFilters: CategoryFilters;
}

export function CategoryListContent({
  categories,
  initialFilters,
}: CategoryListContentProps) {
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
    (newFilters: CategoryFilters) => {
      const params = new URLSearchParams();
      if (newFilters.searchTerm) params.set("search", newFilters.searchTerm);
      updateUrl(params);
    },
    [updateUrl],
  );

  const handleResetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname);
    });
  }, [pathname, router]);

  const hasActiveFilters = initialFilters.searchTerm.length > 0;

  return (
    <>
      <CategoryListFilters
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
                    Pesquisando categorias...
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Aguarde enquanto carregamos os resultados
                </p>
              </div>
            </div>
            <div className="opacity-50">
              <CategoryListTable categories={categories} />
            </div>
          </div>
        )}

        {!isPending && categories.length > 0 && (
          <CategoryListTable categories={categories} />
        )}

        {!isPending && categories.length === 0 && (
          <div className="p-6">
            <CategoryListEmptyState hasSearch={hasActiveFilters} />
          </div>
        )}
      </div>
    </>
  );
}
