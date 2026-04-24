"use client";

import { PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  updateCategoryAnotacoesAction,
  updateCategoryMetaDescriptionAction,
  updateCategoryMetaTitleAction,
} from "@/app/category/action/update-category";
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
import type { CategoryListItem } from "@/services/db/category/types/category-list.types";
import {
  getDescriptionCategoria,
  getTitleCategoria,
} from "@/utils/meta-tag-generation-algorithm/seo-meta-category";

interface CategoryListTableProps {
  categories: CategoryListItem[];
}

type EditField = "META_TITLE" | "META_DESCRIPTION" | "ANOTACOES";

type EditState = {
  categoryId: number;
  taxonomyName: string;
  field: EditField;
  value: string;
  categoryLevels: [string, string, string];
};

const FIELD_LABELS: Record<EditField, string> = {
  META_TITLE: "Meta Title",
  META_DESCRIPTION: "Meta Description",
  ANOTACOES: "Anotações",
};

function displayValue(value: string | null): string {
  if (!value?.trim()) return "-";
  return value;
}

function truncateValue(value: string | null, maxLength = 180): string {
  if (!value?.trim()) return "-";

  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function extractCategoryLevels(
  category: Pick<
    CategoryListItem,
    "TAXONOMIA" | "TAXONOMIA_FATHER" | "TAXONOMIA_GRANDFATHER"
  >,
): [string, string, string] {
  const taxonomy = category.TAXONOMIA?.trim() ?? "";
  const father = category.TAXONOMIA_FATHER?.trim() ?? "";
  const grandfather = category.TAXONOMIA_GRANDFATHER?.trim() ?? "";

  if (grandfather) {
    return [grandfather, father, taxonomy];
  }

  if (father) {
    return [father, taxonomy, ""];
  }

  return [taxonomy, "", ""];
}

export function CategoryListTable({ categories }: CategoryListTableProps) {
  const [editState, setEditState] = useState<EditState | null>(null);
  const [isPending, startTransition] = useTransition();

  if (categories.length === 0) return null;

  function openEdit(category: CategoryListItem, field: EditField) {
    setEditState({
      categoryId: category.ID_TAXONOMY,
      taxonomyName: category.TAXONOMIA ?? `#${category.ID_TAXONOMY}`,
      field,
      value:
        (field === "META_TITLE"
          ? category.META_TITLE
          : field === "META_DESCRIPTION"
            ? category.META_DESCRIPTION
            : category.ANOTACOES) ?? "",
      categoryLevels: extractCategoryLevels(category),
    });
  }

  function handleSave() {
    if (!editState) return;

    startTransition(async () => {
      const action =
        editState.field === "META_TITLE"
          ? updateCategoryMetaTitleAction
          : editState.field === "META_DESCRIPTION"
            ? updateCategoryMetaDescriptionAction
            : updateCategoryAnotacoesAction;

      const result = await action(editState.categoryId, editState.value);

      if (result.success) {
        toast.success("Salvo com sucesso");
        setEditState(null);
      } else {
        toast.error(result.error ?? "Falha ao salvar");
      }
    });
  }

  function normalizeWhitespace(value: string): string {
    return value.replace(/\s+/g, " ").trim();
  }

  function handleGenerateMeta() {
    if (!editState || editState.field === "ANOTACOES") return;

    const generatedValue =
      editState.field === "META_TITLE"
        ? getTitleCategoria(
            editState.categoryLevels[0],
            editState.categoryLevels[1],
            editState.categoryLevels[2],
          )
        : getDescriptionCategoria(
            editState.taxonomyName,
            editState.categoryLevels[0],
            editState.categoryLevels[1],
            editState.categoryLevels[2],
          );

    if (!generatedValue.trim()) {
      toast.error("Não foi possível gerar o conteúdo automaticamente");
      return;
    }

    setEditState((prev) =>
      prev ? { ...prev, value: normalizeWhitespace(generatedValue) } : prev,
    );
    toast.success("Conteúdo gerado automaticamente");
  }

  return (
    <>
      {/* Mobile: Card layout */}
      <div className="-mx-2 space-y-1 py-1 md:hidden">
        {categories.map((category) => (
          <Card
            key={category.ID_TAXONOMY}
            className="group gap-0 overflow-hidden rounded-xl border border-border/50 bg-card/95 py-0 shadow-xs transition-all hover:shadow-sm dark:bg-zinc-900/80"
          >
            <CardContent className="px-3 py-2">
              <div className="min-w-0">
                <span className="font-mono text-[10px] text-muted-foreground">
                  #{category.ID_TAXONOMY}
                </span>

                <p className="mt-0.5 text-[13px] font-semibold leading-5 text-foreground whitespace-normal wrap-break-word">
                  {displayValue(category.TAXONOMIA)}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                  QT_RECORDS: {category.QT_RECORDS ?? 0}
                </p>

                <div className="mt-2 space-y-1.5 text-[10px] leading-4 text-muted-foreground">
                  <div className="flex items-start gap-1">
                    <div className="flex-1">
                      <span className="font-medium text-foreground/80">
                        Title:{" "}
                      </span>
                      {truncateValue(category.META_TITLE, 120)}
                    </div>
                    <button
                      type="button"
                      onClick={() => openEdit(category, "META_TITLE")}
                      className="shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors"
                      title="Editar meta title"
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
                      <span className="font-medium text-foreground/80">
                        Description:
                      </span>
                      {truncateValue(category.META_DESCRIPTION, 120)}
                    </div>
                    <button
                      type="button"
                      onClick={() => openEdit(category, "META_DESCRIPTION")}
                      className="shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors"
                      title="Editar meta description"
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
                      <span className="font-medium text-foreground/80">
                        Anotações:{" "}
                      </span>
                      {truncateValue(category.ANOTACOES, 120)}
                    </div>
                    <button
                      type="button"
                      onClick={() => openEdit(category, "ANOTACOES")}
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
                </div>

                <div className="mt-2">
                  <Button asChild size="xs" variant="outline" className="h-6">
                    <Link href={`/category/${category.ID_TAXONOMY}`}>
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
              <TableHead className="w-24">ID_TAXONOMY</TableHead>
              <TableHead
                style={{ width: "250px", minWidth: "250px", maxWidth: "250px" }}
              >
                TAXONOMIA
              </TableHead>
              <TableHead
                style={{ width: "100px", minWidth: "100px", maxWidth: "100px" }}
              >
                QT_RECORDS
              </TableHead>
              <TableHead
                style={{ width: "300px", minWidth: "300px", maxWidth: "300px" }}
              >
                META_TITLE
              </TableHead>
              <TableHead
                style={{ width: "400px", minWidth: "400px", maxWidth: "400px" }}
              >
                META_DESCRIPTION
              </TableHead>
              <TableHead>ANOTACOES</TableHead>
              <TableHead className="w-28 text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.ID_TAXONOMY}>
                <TableCell>
                  <span className="font-mono text-sm text-muted-foreground">
                    #{category.ID_TAXONOMY}
                  </span>
                </TableCell>
                <TableCell
                  className="align-top whitespace-normal wrap-break-word"
                  style={{
                    width: "250px",
                    minWidth: "250px",
                    maxWidth: "250px",
                  }}
                >
                  <span className="font-medium text-foreground">
                    {displayValue(category.TAXONOMIA)}
                  </span>
                </TableCell>
                <TableCell
                  className="align-top text-sm text-muted-foreground"
                  style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                  }}
                >
                  {category.QT_RECORDS ?? 0}
                </TableCell>
                <TableCell
                  className="align-top text-sm text-muted-foreground whitespace-normal wrap-break-word"
                  style={{
                    width: "300px",
                    minWidth: "300px",
                    maxWidth: "300px",
                  }}
                >
                  <div className="flex items-start gap-1.5">
                    <span className="flex-1">
                      {displayValue(category.META_TITLE)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEdit(category, "META_TITLE")}
                      className="mt-0.5 shrink-0 text-muted-foreground/40 hover:text-foreground transition-colors"
                      title="Editar meta title"
                    >
                      <HugeiconsIcon
                        icon={PencilEdit01Icon}
                        size={14}
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                </TableCell>
                <TableCell
                  className="align-top text-sm text-muted-foreground whitespace-normal wrap-break-word"
                  style={{
                    width: "400px",
                    minWidth: "400px",
                    maxWidth: "400px",
                  }}
                >
                  <div className="flex items-start gap-1.5">
                    <span className="flex-1">
                      {displayValue(category.META_DESCRIPTION)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEdit(category, "META_DESCRIPTION")}
                      className="mt-0.5 shrink-0 text-muted-foreground/40 hover:text-foreground transition-colors"
                      title="Editar meta description"
                    >
                      <HugeiconsIcon
                        icon={PencilEdit01Icon}
                        size={14}
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="align-top text-sm text-muted-foreground whitespace-normal wrap-break-word">
                  <div className="flex items-start gap-1.5">
                    <span className="flex-1">
                      {displayValue(category.ANOTACOES)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEdit(category, "ANOTACOES")}
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
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="xs" variant="outline">
                    <Link href={`/category/${category.ID_TAXONOMY}`}>
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
            <DialogDescription>{editState?.taxonomyName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="edit-field">
              {editState ? FIELD_LABELS[editState.field] : ""}
            </Label>
            <textarea
              id="edit-field"
              rows={editState?.field === "ANOTACOES" ? 8 : 4}
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
            {editState?.field !== "ANOTACOES" && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleGenerateMeta}
                disabled={isPending}
              >
                {editState?.field === "META_TITLE"
                  ? "Gerar meta title"
                  : "Gerar meta description"}
              </Button>
            )}
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
