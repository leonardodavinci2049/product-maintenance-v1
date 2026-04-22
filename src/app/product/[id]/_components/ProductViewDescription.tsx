import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductDetail } from "@/services/db/product/types/product-list.types";
import { SafeHtmlContent } from "./SafeHtmlContent";

interface ProductViewDescriptionProps {
  product: ProductDetail;
}

export function ProductViewDescription({
  product,
}: ProductViewDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" /> Detalhes do Produto
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {product.DESCRICAO_VENDA || product.ANOTACOES ? (
          <>
            {product.DESCRICAO_VENDA && (
              <blockquote className="border-l-4 border-primary pl-4 py-1 italic text-muted-foreground">
                {product.DESCRICAO_VENDA}
              </blockquote>
            )}

            {product.ANOTACOES && (
              <SafeHtmlContent
                html={product.ANOTACOES}
                className="prose-sm sm:prose-base text-sm"
              />
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">
            Nenhuma descrição disponível para este produto.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
