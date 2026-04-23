import { Search, Tags } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CategoryListEmptyStateProps {
  hasSearch: boolean;
}

export function CategoryListEmptyState({
  hasSearch,
}: CategoryListEmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center rounded-3xl border-dashed border-border/70 bg-muted/10 py-16 dark:bg-muted/5">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        {hasSearch ? (
          <Search className="h-10 w-10 text-primary" />
        ) : (
          <Tags className="h-10 w-10 text-primary" />
        )}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-foreground">
        {hasSearch
          ? "Nenhuma categoria encontrada"
          : "Nenhuma categoria cadastrada"}
      </h3>
      <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
        {hasSearch
          ? "Não encontramos categorias para o termo informado. Tente ajustar a busca."
          : "Não há categorias disponíveis para o cliente configurado."}
      </p>
    </Card>
  );
}
