import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { z } from "zod";
import { createLogger } from "@/core/logger";
import { getProductById } from "@/services/db/product/product.service";
import {
  ProductViewLayout,
  ProductViewLayoutSkeleton,
} from "./_components/ProductViewLayout";

const logger = createLogger("ProductDetailsPage");

const ProductPageParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID deve ser um número válido")
    .transform(Number),
});

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

async function ProductDetailsLoader({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const routeParams = await paramsPromise;

  const parsed = ProductPageParamsSchema.safeParse({ id: routeParams.id });
  if (!parsed.success) {
    logger.error("Invalid product ID parameter:", parsed.error);
    notFound();
  }

  const productId = parsed.data.id;

  await connection();

  const product = await getProductById(productId);

  if (!product) {
    logger.warn(`Product not found for ID: ${productId}`);
    notFound();
  }

  return (
    <div className="mx-auto flex flex-1 flex-col w-full max-w-350">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-6 py-6">
          <div className="px-4 lg:px-6">
            <ProductViewLayout product={product} productId={productId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main mx-auto flex w-full max-w-350 flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Detalhes do Produto
        </h1>
        <Suspense
          fallback={
            <div className="px-4 lg:px-6">
              <ProductViewLayoutSkeleton />
            </div>
          }
        >
          <ProductDetailsLoader paramsPromise={params} />
        </Suspense>
      </div>
    </div>
  );
}
