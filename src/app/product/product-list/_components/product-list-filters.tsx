"use client";

import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export type ProductFilters = {
  searchTerm: string;
  inativo: 0 | 1;
};

interface ProductListFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export function ProductListFilters({
  filters,
  onFiltersChange,
  onResetFilters,
  isLoading = false,
}: ProductListFiltersProps) {
  const [searchInputValue, setSearchInputValue] = useState(filters.searchTerm);

  useEffect(() => {
    setSearchInputValue(filters.searchTerm);
  }, [filters.searchTerm]);

  const handleSearch = () => {
    if (searchInputValue.trim() !== filters.searchTerm) {
      onFiltersChange({ ...filters, searchTerm: searchInputValue.trim() });
    }
  };

  const handleClearSearch = () => {
    setSearchInputValue("");
    if (filters.searchTerm !== "") {
      onFiltersChange({ ...filters, searchTerm: "" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleInativoChange = (checked: boolean) => {
    onFiltersChange({ ...filters, inativo: checked ? 1 : 0 });
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
              placeholder="Buscar por nome ou ID..."
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

      <div className="flex items-center justify-between gap-3 rounded-3xl border border-border/60 bg-card/60 px-4 py-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <label
            htmlFor="inativo-filter"
            className="cursor-pointer text-sm font-medium"
          >
            Exibir inativos
          </label>
          <Switch
            id="inativo-filter"
            checked={filters.inativo === 1}
            onCheckedChange={handleInativoChange}
            disabled={isLoading}
          />
        </div>

        {(filters.searchTerm || filters.inativo === 1) && (
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
        )}
      </div>
    </div>
  );
}
