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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { CategoryDetail } from "@/services/db/category/types/category-list.types";
import {
  getDescriptionCategoria,
  getTitleCategoria,
} from "@/utils/seo-meta/seo-meta-category";

interface CategoryDetailViewProps {
  category: CategoryDetail;
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

function displayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") {
    return value.trim() ? value : "-";
  }
  return String(value);
}

function extractCategoryLevels(
  category: Pick<
    CategoryDetail,
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

function EditableTextBlock({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string | null;
  onEdit: () => void;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-border/60 bg-card/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <Button
          type="button"
          size="xs"
          variant="outline"
          onClick={onEdit}
          className="gap-1.5"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} size={14} strokeWidth={2} />
          Editar
        </Button>
      </div>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word">
        {displayValue(value)}
      </p>
    </div>
  );
}

export function CategoryDetailView({ category }: CategoryDetailViewProps) {
  const [editState, setEditState] = useState<EditState | null>(null);
  const [isPending, startTransition] = useTransition();

  function openEdit(field: EditField) {
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
      toast.error("Nao foi possivel gerar o conteudo automaticamente");
      return;
    }

    setEditState((prev) =>
      prev ? { ...prev, value: normalizeWhitespace(generatedValue) } : prev,
    );
    toast.success("Conteudo gerado automaticamente");
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-6">
      <div className="flex items-center justify-between border-b pb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/category/category-list">Voltar para lista</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informações da Categoria</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              ID_TAXONOMY
            </p>
            <p className="text-sm font-medium">
              {displayValue(category.ID_TAXONOMY)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">TAXONOMIA</p>
            <p className="text-sm font-medium whitespace-normal wrap-break-word">
              {displayValue(category.TAXONOMIA)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">PARENT_ID</p>
            <p className="text-sm">{displayValue(category.PARENT_ID)}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              TAXONOMIA_FATHER
            </p>
            <p className="text-sm whitespace-normal wrap-break-word">
              {displayValue(category.TAXONOMIA_FATHER)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              ID_TAXONOMY_GRANDFATHER
            </p>
            <p className="text-sm">
              {displayValue(category.ID_TAXONOMY_GRANDFATHER)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              TAXONOMIA_GRANDFATHER
            </p>
            <p className="text-sm whitespace-normal wrap-break-word">
              {displayValue(category.TAXONOMIA_GRANDFATHER)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">SLUG</p>
            <p className="text-sm whitespace-normal wrap-break-word">
              {displayValue(category.SLUG)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              PATH_IMAGEM
            </p>
            <p className="text-sm whitespace-normal wrap-break-word">
              {displayValue(category.PATH_IMAGEM)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">LEVEL</p>
            <p className="text-sm">{displayValue(category.LEVEL)}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">ORDEM</p>
            <p className="text-sm">{displayValue(category.ORDEM)}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              QT_RECORDS
            </p>
            <p className="text-sm">{displayValue(category.QT_RECORDS)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Campos Editáveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableTextBlock
            label="META_TITLE"
            value={category.META_TITLE}
            onEdit={() => openEdit("META_TITLE")}
          />
          <EditableTextBlock
            label="META_DESCRIPTION"
            value={category.META_DESCRIPTION}
            onEdit={() => openEdit("META_DESCRIPTION")}
          />
          <EditableTextBlock
            label="ANOTACOES"
            value={category.ANOTACOES}
            onEdit={() => openEdit("ANOTACOES")}
          />
        </CardContent>
      </Card>

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
    </div>
  );
}

export function CategoryDetailViewSkeleton() {
  return (
    <div className="mx-auto flex w-full flex-col gap-6 animate-pulse">
      <div className="h-10 w-48 rounded bg-muted" />
      <div className="h-52 rounded bg-muted" />
      <div className="h-72 rounded bg-muted" />
    </div>
  );
}
