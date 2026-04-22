import "server-only";

import { envs } from "@/core/config/envs";
import dbService from "@/database/dbConnection";
import { PRODUCT_FIND_ID_SQL } from "./query/product_find_id";
import { PRODUCT_LIST_SQL } from "./query/product-find_list";
import type {
  ProductDetail,
  ProductListItem,
  ProductListParams,
} from "./types/product-list.types";

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

export async function getProductById(
  id: number,
): Promise<ProductDetail | null> {
  const clientId = envs.CLIENT_ID;

  const queryParams = [
    clientId, // PE_SYSTEM_CLIENT_ID
    id, // PE_ID_PRODUTO
  ];

  const rows = await dbService.selectQuery<ProductDetail>(
    PRODUCT_FIND_ID_SQL,
    queryParams,
  );

  return rows[0] ?? null;
}
