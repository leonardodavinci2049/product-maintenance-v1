"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ProductListItem } from "@/services/db/product/types/product-list.types";

interface ProductListTableProps {
  products: ProductListItem[];
}

function formatPrice(value: number | null): string {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function ProductListTable({ products }: ProductListTableProps) {
  if (products.length === 0) return null;

  return (
    <>
      {/* Mobile: Card layout */}
      <div className="-mx-2 space-y-1 py-1 md:hidden">
        {products.map((product) => (
          <Card
            key={product.ID_PRODUTO}
            className="group gap-0 overflow-hidden rounded-xl border border-border/50 bg-card/95 py-0 shadow-xs transition-all hover:shadow-sm dark:bg-zinc-900/80"
          >
            <CardContent className="px-3 py-2">
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    #{product.ID_PRODUTO}
                  </span>
                  {product.ESTOQUE_LOJA === 0 ? (
                    <Badge
                      variant="destructive"
                      className="h-5 rounded-md px-1.5 text-[10px]"
                    >
                      Ruptura
                    </Badge>
                  ) : (
                    <span
                      className={cn(
                        "shrink-0 text-[10px] font-medium",
                        (product.ESTOQUE_LOJA ?? 0) < 10
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400",
                      )}
                    >
                      Estoque: {product.ESTOQUE_LOJA ?? 0}
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-[13px] font-semibold leading-5 text-foreground wrap-break-word">
                  {product.PRODUTO ?? "-"}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] leading-4 text-muted-foreground">
                  {product.REF && <span>Ref: {product.REF}</span>}
                  {product.MARCA && <span>{product.MARCA}</span>}
                  {product.TIPO && <span>{product.TIPO}</span>}
                </div>

                <div className="mt-1.5 flex items-center gap-3 text-[10px] tabular-nums">
                  <div className="flex items-center gap-0.5">
                    <span className="text-muted-foreground">Var.</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(product.VL_VAREJO)}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-muted-foreground">Rev.</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatPrice(product.VL_ATACADO)}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-muted-foreground">Corp.</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      {formatPrice(product.VL_CORPORATIVO)}
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <Button asChild size="xs" variant="outline" className="h-6">
                    <Link href={`/product/${product.ID_PRODUTO}`}>
                      Ver detalhes
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="w-36">Marca / Tipo</TableHead>
              <TableHead className="w-24">Estoque</TableHead>
              <TableHead className="w-28">Varejo</TableHead>
              <TableHead className="w-28">Atacado</TableHead>
              <TableHead className="w-28">Corp.</TableHead>
              <TableHead className="w-28 text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.ID_PRODUTO}>
                <TableCell>
                  <span className="font-mono text-sm text-muted-foreground">
                    #{product.ID_PRODUTO}
                  </span>
                </TableCell>
                <TableCell className="align-top">
                  <div className="space-y-0.5">
                    <p className="font-medium leading-5 text-foreground wrap-break-word">
                      {product.PRODUTO ?? "-"}
                    </p>
                    {(product.REF || product.MODELO) && (
                      <p className="text-xs text-muted-foreground">
                        {product.REF && `Ref: ${product.REF}`}
                        {product.REF && product.MODELO && " • "}
                        {product.MODELO}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <div className="space-y-0.5 text-sm text-muted-foreground">
                    {product.MARCA && <p>{product.MARCA}</p>}
                    {product.TIPO && <p className="text-xs">{product.TIPO}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      product.ESTOQUE_LOJA === 0
                        ? "text-destructive"
                        : (product.ESTOQUE_LOJA ?? 0) < 10
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-foreground",
                    )}
                  >
                    {product.ESTOQUE_LOJA ?? 0}
                  </span>
                  {product.ESTOQUE_LOJA === 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Ruptura
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {formatPrice(product.VL_VAREJO)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {formatPrice(product.VL_ATACADO)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    {formatPrice(product.VL_CORPORATIVO)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="xs" variant="outline">
                    <Link href={`/product/${product.ID_PRODUTO}`}>
                      Ver detalhes
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
