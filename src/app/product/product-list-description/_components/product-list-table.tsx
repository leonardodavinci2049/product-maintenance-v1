"use client";

import { PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProductListDescriptionItem } from "@/services/db/product/types/product-list.types";
import {
  updateAnotacoesAction,
  updateDescricaoVendaAction,
} from "../action/update-description";

interface ProductListTableProps {
  products: ProductListDescriptionItem[];
}

type ProductCategory = {
  ID_TAXONOMY?: number;
  TAXONOMIA?: string;
};

type EditField = "ANOTACOES" | "DESCRICAO_VENDA";

type EditState = {
  productId: number;
  productName: string;
  field: EditField;
  value: string;
};

const FIELD_LABELS: Record<EditField, string> = {
  ANOTACOES: "Anotações (Descrição do Produto)",
  DESCRICAO_VENDA: "Descrição de Venda",
};

function extractCategoryNames(categories: string | null): string {
  if (!categories?.trim()) return "-";

  try {
    const parsed = JSON.parse(categories) as ProductCategory[];
    if (!Array.isArray(parsed)) return "-";

    const names = parsed
      .sort(
        (a, b) =>
          (a.ID_TAXONOMY ?? Number.MAX_SAFE_INTEGER) -
          (b.ID_TAXONOMY ?? Number.MAX_SAFE_INTEGER),
      )
      .map((category) => category.TAXONOMIA?.trim())
      .filter((name): name is string => Boolean(name));

    return names.length > 0 ? names.join(", ") : "-";
  } catch {
    return "-";
  }
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
  const [editState, setEditState] = useState<EditState | null>(null);
  const [isPending, startTransition] = useTransition();

  if (products.length === 0) return null;

  function openEdit(product: ProductListDescriptionItem, field: EditField) {
    setEditState({
      productId: product.ID_PRODUTO,
      productName: product.PRODUTO ?? `#${product.ID_PRODUTO}`,
      field,
      value:
        (field === "ANOTACOES" ? product.ANOTACOES : product.DESCRICAO_VENDA) ??
        "",
    });
  }

  function handleSave() {
    if (!editState) return;

    startTransition(async () => {
      const action =
        editState.field === "ANOTACOES"
          ? updateAnotacoesAction
          : updateDescricaoVendaAction;

      const result = await action(editState.productId, editState.value);

      if (result.success) {
        toast.success("Salvo com sucesso");
        setEditState(null);
      } else {
        toast.error(result.error ?? "Falha ao salvar");
      }
    });
  }

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

                <p className="mt-1 text-[10px] leading-4 text-muted-foreground whitespace-normal wrap-break-word">
                  {extractCategoryNames(product.CATEGORIAS)}
                </p>

                <div className="mt-2 space-y-1.5">
                  <div className="flex items-start gap-1">
                    <div className="flex-1">
                      <span className="text-[10px] font-medium text-foreground/80">
                        Anotações:{" "}
                      </span>
                      <span className="text-[10px] leading-4 text-muted-foreground whitespace-normal wrap-break-word">
                        {truncateDescription(product.ANOTACOES, 150)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEdit(product, "ANOTACOES")}
                      className="shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors"
                      title="Editar anotações"
                    >
                      <HugeiconsIcon
                        icon={PencilEdit01Icon}
                        size={12}
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="flex-1">
                      <span className="text-[10px] font-medium text-foreground/80">
                        Desc. Venda:{" "}
                      </span>
                      <span className="text-[10px] leading-4 text-muted-foreground whitespace-normal wrap-break-word">
                        {truncateDescription(product.DESCRICAO_VENDA, 150)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEdit(product, "DESCRICAO_VENDA")}
                      className="shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors"
                      title="Editar descrição de venda"
                    >
                      <HugeiconsIcon
                        icon={PencilEdit01Icon}
                        size={12}
                        strokeWidth={2}
                      />
                    </button>
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
              <TableHead className="w-75 min-w-75 max-w-75">Produto</TableHead>
              <TableHead className="w-50 min-w-50 max-w-50">
                Categorias
              </TableHead>
              <TableHead className="w-full">Anotações / Desc. Venda</TableHead>
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
                <TableCell className="align-top w-75 min-w-75 max-w-75 whitespace-normal wrap-break-word">
                  <div className="space-y-0.5">
                    <p className="font-medium leading-5 text-foreground whitespace-normal wrap-break-word">
                      {product.PRODUTO ?? "-"}
                    </p>
                    {(product.REF || product.MODELO) && (
                      <p className="text-xs text-muted-foreground whitespace-normal wrap-break-word">
                        {product.REF && `Ref: ${product.REF}`}
                        {product.REF && product.MODELO && " • "}
                        {product.MODELO}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="align-top w-50 min-w-50 max-w-50 text-sm text-muted-foreground whitespace-normal wrap-break-word">
                  {extractCategoryNames(product.CATEGORIAS)}
                </TableCell>
                <TableCell className="align-top text-sm text-muted-foreground whitespace-normal wrap-break-word">
                  <div className="space-y-2">
                    <div className="flex items-start gap-1.5">
                      <div className="flex-1">
                        <span className="text-xs font-medium text-foreground/70 block">
                          Anotações
                        </span>
                        <span className="whitespace-normal wrap-break-word">
                          {truncateDescription(product.ANOTACOES)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEdit(product, "ANOTACOES")}
                        className="mt-0.5 shrink-0 text-muted-foreground/40 hover:text-foreground transition-colors"
                        title="Editar anotações"
                      >
                        <HugeiconsIcon
                          icon={PencilEdit01Icon}
                          size={14}
                          strokeWidth={2}
                        />
                      </button>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="flex-1">
                        <span className="text-xs font-medium text-foreground/70 block">
                          Desc. Venda
                        </span>
                        <span className="whitespace-normal wrap-break-word">
                          {truncateDescription(product.DESCRICAO_VENDA)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEdit(product, "DESCRICAO_VENDA")}
                        className="mt-0.5 shrink-0 text-muted-foreground/40 hover:text-foreground transition-colors"
                        title="Editar descrição de venda"
                      >
                        <HugeiconsIcon
                          icon={PencilEdit01Icon}
                          size={14}
                          strokeWidth={2}
                        />
                      </button>
                    </div>
                  </div>
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

      {/* Edit Dialog */}
      <Dialog
        open={editState !== null}
        onOpenChange={(open) => {
          if (!open && !isPending) setEditState(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Editar {editState ? FIELD_LABELS[editState.field] : ""}
            </DialogTitle>
            <DialogDescription>{editState?.productName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="edit-field">
              {editState ? FIELD_LABELS[editState.field] : ""}
            </Label>
            <textarea
              id="edit-field"
              rows={8}
              value={editState?.value ?? ""}
              onChange={(e) =>
                setEditState((prev) =>
                  prev ? { ...prev, value: e.target.value } : prev,
                )
              }
              disabled={isPending}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              placeholder="Digite o conteúdo..."
            />
          </div>
          <DialogFooter showCloseButton>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
