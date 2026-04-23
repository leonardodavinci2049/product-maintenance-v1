"use server";

import { revalidatePath } from "next/cache";
import {
  updateCategoryAnotacoes,
  updateCategoryMetaDescription,
  updateCategoryMetaTitle,
} from "@/services/db/category/category.service";

function revalidateCategoryPaths(categoryId: number) {
  revalidatePath("/category/category-list");
  revalidatePath(`/category/${categoryId}`);
}

export async function updateCategoryMetaTitleAction(
  categoryId: number,
  value: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateCategoryMetaTitle(categoryId, value.trim() || null);
    revalidateCategoryPaths(categoryId);
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao salvar o meta title" };
  }
}

export async function updateCategoryMetaDescriptionAction(
  categoryId: number,
  value: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateCategoryMetaDescription(categoryId, value.trim() || null);
    revalidateCategoryPaths(categoryId);
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao salvar o meta description" };
  }
}

export async function updateCategoryAnotacoesAction(
  categoryId: number,
  value: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateCategoryAnotacoes(categoryId, value.trim() || null);
    revalidateCategoryPaths(categoryId);
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao salvar as anotações" };
  }
}
