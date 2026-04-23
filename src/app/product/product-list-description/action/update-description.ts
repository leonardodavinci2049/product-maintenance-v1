"use server";

import { revalidatePath } from "next/cache";
import {
  updateProductAnotacoes,
  updateProductDescricaoVenda,
} from "@/services/db/product/product.service";

export async function updateAnotacoesAction(
  productId: number,
  value: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateProductAnotacoes(productId, value.trim() || null);
    revalidatePath("/product/product-list-description");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao salvar as anotações" };
  }
}

export async function updateDescricaoVendaAction(
  productId: number,
  value: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateProductDescricaoVenda(productId, value.trim() || null);
    revalidatePath("/product/product-list-description");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao salvar a descrição de venda" };
  }
}
