import { CheckSquare, Receipt, Ruler } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductDetail } from "@/services/db/product/types/product-list.types";

interface ProductViewSpecsProps {
  product: ProductDetail;
}

export function ProductViewSpecs({ product }: ProductViewSpecsProps) {
  const hasGeneralData = product.ETIQUETA || product.REF || product.MODELO;
  const hasPhysicalData =
    product.TEMPODEGARANTIA_DIA ||
    product.PESO_GR ||
    product.COMPRIMENTO_MM ||
    product.LARGURA_MM ||
    product.ALTURA_MM ||
    product.DIAMETRO_MM;
  const hasTaxData =
    product.CFOP ||
    product.CST ||
    product.EAN ||
    product.NCM ||
    product.NBM ||
    product.PPB ||
    product.TEMP;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <CheckSquare className="w-4 h-4" /> Dados Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            {product.ETIQUETA && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">Rótulo:</dt>
                <dd className="font-medium text-right">{product.ETIQUETA}</dd>
              </div>
            )}
            {product.REF && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">Referência:</dt>
                <dd className="font-medium text-right">{product.REF}</dd>
              </div>
            )}
            {product.MODELO && (
              <div className="grid grid-cols-2 gap-2 pb-2">
                <dt className="text-muted-foreground">Modelo:</dt>
                <dd className="font-medium text-right">{product.MODELO}</dd>
              </div>
            )}
            {!hasGeneralData && (
              <div className="text-muted-foreground text-center py-4">
                Sem dados gerais
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Ruler className="w-4 h-4" /> Características
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            {product.TEMPODEGARANTIA_DIA && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">Garantia:</dt>
                <dd className="font-medium text-right">
                  {product.TEMPODEGARANTIA_DIA} dias
                </dd>
              </div>
            )}
            {product.PESO_GR && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">Peso:</dt>
                <dd className="font-medium text-right">
                  {product.PESO_GR >= 1000
                    ? `${(product.PESO_GR / 1000).toFixed(2)} kg`
                    : `${product.PESO_GR} g`}
                </dd>
              </div>
            )}
            {product.COMPRIMENTO_MM && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">Comprimento:</dt>
                <dd className="font-medium text-right">
                  {product.COMPRIMENTO_MM >= 10
                    ? `${(product.COMPRIMENTO_MM / 10).toFixed(1)} cm`
                    : `${product.COMPRIMENTO_MM} mm`}
                </dd>
              </div>
            )}
            {product.LARGURA_MM && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">Largura:</dt>
                <dd className="font-medium text-right">
                  {product.LARGURA_MM >= 10
                    ? `${(product.LARGURA_MM / 10).toFixed(1)} cm`
                    : `${product.LARGURA_MM} mm`}
                </dd>
              </div>
            )}
            {product.ALTURA_MM && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">Altura:</dt>
                <dd className="font-medium text-right">
                  {product.ALTURA_MM >= 10
                    ? `${(product.ALTURA_MM / 10).toFixed(1)} cm`
                    : `${product.ALTURA_MM} mm`}
                </dd>
              </div>
            )}
            {product.DIAMETRO_MM && (
              <div className="grid grid-cols-2 gap-2 pb-2">
                <dt className="text-muted-foreground">Diâmetro:</dt>
                <dd className="font-medium text-right">
                  {product.DIAMETRO_MM >= 10
                    ? `${(product.DIAMETRO_MM / 10).toFixed(1)} cm`
                    : `${product.DIAMETRO_MM} mm`}
                </dd>
              </div>
            )}
            {!hasPhysicalData && (
              <div className="text-muted-foreground text-center py-4">
                Sem características físicas
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Receipt className="w-4 h-4" /> Dados Fiscais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            {product.CFOP && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">CFOP:</dt>
                <dd className="font-medium text-right">{product.CFOP}</dd>
              </div>
            )}
            {product.CST && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">CST:</dt>
                <dd className="font-medium text-right">{product.CST}</dd>
              </div>
            )}
            {product.EAN && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">EAN:</dt>
                <dd className="font-medium text-right">{product.EAN}</dd>
              </div>
            )}
            {product.NCM && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">NCM:</dt>
                <dd className="font-medium text-right">{product.NCM}</dd>
              </div>
            )}
            {product.NBM && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">NBM:</dt>
                <dd className="font-medium text-right">{product.NBM}</dd>
              </div>
            )}
            {product.PPB && (
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <dt className="text-muted-foreground">PPB:</dt>
                <dd className="font-medium text-right">{product.PPB}</dd>
              </div>
            )}
            {product.TEMP && (
              <div className="grid grid-cols-2 gap-2 pb-2">
                <dt className="text-muted-foreground">TEMP:</dt>
                <dd className="font-medium text-right">{product.TEMP}</dd>
              </div>
            )}
            {!hasTaxData && (
              <div className="text-muted-foreground text-center py-4">
                Sem dados fiscais
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
