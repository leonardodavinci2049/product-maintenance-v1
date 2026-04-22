import { Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductDetail } from "@/services/db/product/types/product-list.types";
import { formatCurrency } from "@/utils/common-utils";

interface ProductViewPricingProps {
  product: ProductDetail;
}

export function ProductViewPricing({ product }: ProductViewPricingProps) {
  return (
    <Card className="bg-slate-50/50 dark:bg-slate-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Tag className="w-5 h-5" /> Preços
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Varejo</span>
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(product.VL_VAREJO ?? 0)}
          </span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-8 pt-2 border-t">
          {(product.VL_ATACADO ?? 0) > 0 && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Atacado</span>
              <span className="text-lg font-semibold">
                {formatCurrency(product.VL_ATACADO ?? 0)}
              </span>
            </div>
          )}

          {(product.VL_CORPORATIVO ?? 0) > 0 && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Corporativo</span>
              <span className="text-lg font-semibold">
                {formatCurrency(product.VL_CORPORATIVO ?? 0)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
