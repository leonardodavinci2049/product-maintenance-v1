import "server-only";

import dbService from "@/database/dbConnection";
import { envs } from "@/core/config/envs";
import type {
  ProductListItem,
  ProductListParams,
} from "./types/product-list.types";
import { PRODUCT_LIST_SQL } from "./query/product-list";

export async function getProductList(
  params: ProductListParams,
): Promise<ProductListItem[]> {
  const clientId = envs.CLIENT_ID;
  const search = params.search ?? null;

  const queryParams = [
    clientId, // PE_SYSTEM_CLIENT_ID
    params.inativo, // PE_INATIVO
    search, // PE_SEARCH (IS NULL check)
    search, // PE_SEARCH (TRIM check)
    search, // PE_SEARCH (REGEXP check)
    search, // PE_SEARCH (CAST AS UNSIGNED)
    search, // PE_SEARCH (LIKE inside REGEXP block)
    search, // PE_SEARCH (NOT REGEXP check)
    search, // PE_SEARCH (LIKE inside NOT REGEXP block)
  ];

  return dbService.selectQuery<ProductListItem>(PRODUCT_LIST_SQL, queryParams);
}
