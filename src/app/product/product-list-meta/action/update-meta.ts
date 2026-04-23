"use server";

import { revalidatePath } from "next/cache";
import {
  updateProductMetaDescription,
  updateProductMetaTitle,
} from "@/services/db/product/product.service";

export async function updateMetaTitleAction(
  productId: number,
  value: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateProductMetaTitle(productId, value.trim() || null);
    revalidatePath("/product/product-list-meta");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao salvar o meta title" };
  }
}

export async function updateMetaDescriptionAction(
  productId: number,
  value: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateProductMetaDescription(productId, value.trim() || null);
    revalidatePath("/product/product-list-meta");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao salvar o meta description" };
  }
}
