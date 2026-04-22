export const DEFAULT_PRODUCT_IMAGE = "/images/product-placeholder.png";

/**
 * Returns a valid image URL, falling back to the default product image
 * if the provided URL is empty, null, or undefined.
 */
export function getValidImageUrl(url?: string | null): string {
  if (!url || url.trim() === "") return DEFAULT_PRODUCT_IMAGE;
  return url;
}

/**
 * Creates an error handler for <Image> components that swaps to a fallback URL
 * when the image fails to load.
 */
export function createImageErrorHandler(fallbackUrl: string) {
  return {
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      if (target.src !== fallbackUrl) {
        target.src = fallbackUrl;
      }
    },
  };
}
