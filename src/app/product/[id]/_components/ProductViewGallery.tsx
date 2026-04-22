import { createLogger } from "@/core/logger";
import { getProductGallery } from "@/services/api-assets/gallery-cached-service";
import { getValidImageUrl } from "@/utils/image-utils";
import { ProductViewGalleryClient } from "./ProductViewGalleryClient";

const logger = createLogger("ProductViewGallery");

interface ProductViewGalleryProps {
  productId: number;
  fallbackImage: string;
}

export async function ProductViewGallery({
  productId,
  fallbackImage,
}: ProductViewGalleryProps) {
  const resolvedFallbackImage = getValidImageUrl(fallbackImage);

  const fallbackGalleryImage = {
    id: "fallback",
    url: resolvedFallbackImage,
    originalUrl: resolvedFallbackImage,
    mediumUrl: resolvedFallbackImage,
    previewUrl: resolvedFallbackImage,
    isPrimary: true,
  };

  const images = await getProductGallery(productId.toString());

  if (images.length === 0) {
    logger.warn(`No gallery images found for product ${productId}`);
    return (
      <ProductViewGalleryClient
        initialImages={[fallbackGalleryImage]}
        fallbackImage={resolvedFallbackImage}
      />
    );
  }

  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    if (a.displayOrder !== b.displayOrder)
      return a.displayOrder - b.displayOrder;
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  });

  const galleryImages = sortedImages
    .map((img) => ({
      id: img.id,
      url: img.urls.preview ?? img.urls.medium ?? img.urls.original,
      originalUrl: img.urls.original ?? img.urls.preview,
      mediumUrl: img.urls.medium ?? img.urls.preview ?? img.urls.original,
      previewUrl: img.urls.preview ?? img.urls.medium ?? img.urls.original,
      isPrimary: img.isPrimary,
    }))
    .filter((img) => img.url !== undefined);

  return (
    <ProductViewGalleryClient
      initialImages={
        galleryImages.length > 0 ? galleryImages : [fallbackGalleryImage]
      }
      fallbackImage={resolvedFallbackImage}
    />
  );
}
