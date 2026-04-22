/**
 * Cache configuration for Next.js 16 'use cache' directive
 * Defines cache tags for granular cache invalidation with cacheTag()
 *
 * Cache profiles are defined in next.config.ts:
 * - "hours": 1 hour cache (logs)
 * - "frequent": 5 minutes cache (promo links)
 */

export const CACHE_TAGS = {
  promoLink: (id: string) => `promo-link-${id}`,
  promoLinksByClient: (clientId: string) => `promo-links-client-${clientId}`,
  promoLinksByApp: (clientId: string, appId: string) =>
    `promo-links-client-${clientId}-app-${appId}`,
  promoLinksByType: (clientId: string, typeId: string) =>
    `promo-links-client-${clientId}-type-${typeId}`,
  promoLinksByAppAndType: (clientId: string, appId: string, typeId: string) =>
    `promo-links-client-${clientId}-app-${appId}-type-${typeId}`,

  logLogins: "log-logins",
  logOperations: "log-operations",
  promoLinks: "promo-links",
} as const;

export const CACHE_PROFILES = {
  hours: "hours",
  frequent: "frequent",
} as const;

export type CacheTagKey = keyof typeof CACHE_TAGS;
export type CacheProfile = keyof typeof CACHE_PROFILES;
