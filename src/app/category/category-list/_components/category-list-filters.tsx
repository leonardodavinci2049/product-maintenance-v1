"use client";

import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CategoryFilters = {
  searchTerm: string;
};

interface CategoryListFiltersProps {
  filters: CategoryFilters;
  onFiltersChange: (filters: CategoryFilters) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export function CategoryListFilters({
  filters,
  onFiltersChange,
  onResetFilters,
  isLoading = false,
}: CategoryListFiltersProps) {
  const [searchInputValue, setSearchInputValue] = useState(filters.searchTerm);

  useEffect(() => {
    setSearchInputValue(filters.searchTerm);
  }, [filters.searchTerm]);

  const handleSearch = () => {
    if (searchInputValue.trim() !== filters.searchTerm) {
      onFiltersChange({ searchTerm: searchInputValue.trim() });
    }
  };

  const handleClearSearch = () => {
    setSearchInputValue("");
    if (filters.searchTerm !== "") {
      onFiltersChange({ searchTerm: "" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center w-full max-w-xl lg:max-w-2xl">
          <div className="relative flex-1 group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4.5 w-4.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            </div>
            <Input
              placeholder="Buscar por taxonomy ou ID..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-11 rounded-r-none border-r-0 pl-10 pr-9 text-sm shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary"
              disabled={isLoading}
            />
            {searchInputValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            onClick={handleSearch}
            disabled={
              isLoading || searchInputValue.trim() === filters.searchTerm
            }
            className="h-11 rounded-l-none px-4 sm:px-5 gap-2 shadow-sm shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="hidden sm:inline text-sm">Pesquisar</span>
          </Button>
        </div>
      </div>

      {filters.searchTerm && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-muted-foreground hover:text-foreground text-xs"
            disabled={isLoading}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
