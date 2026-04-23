"use client";

import Link from "next/link";

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
import type { ProductListDescriptionItem } from "@/services/db/product/types/product-list.types";

interface ProductListTableProps {
  products: ProductListDescriptionItem[];
}

function truncateDescription(
  description: string | null,
  maxLength = 400,
): string {
  if (!description?.trim()) return "-";

  return description.length > maxLength
    ? description.slice(0, maxLength)
    : description;
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
                </div>

                <p className="mt-0.5 text-[13px] font-semibold leading-5 text-foreground wrap-break-word">
                  {product.PRODUTO ?? "-"}
                </p>

                <div className="mt-2 text-[10px] leading-4 text-muted-foreground whitespace-normal wrap-break-word">
                  {truncateDescription(product.ANOTACOES)}
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
              <TableHead>Description</TableHead>
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
                <TableCell className="align-top text-sm text-muted-foreground whitespace-normal wrap-break-word">
                  {truncateDescription(product.ANOTACOES)}
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
