import "server-only";

import { envs } from "@/core/config/envs";
import dbService from "@/database/dbConnection";
import { PRODUCT_LIST_DESCRIPTION_SQL } from "./query/product-find_list-description";
import { PRODUCT_FIND_ID_SQL } from "./query/product_find_id";
import { PRODUCT_LIST_SQL } from "./query/product-find_list";
import { PRODUCT_LIST_META_SQL } from "./query/product-find_list-meta";
import type {
  ProductDetail,
  ProductListDescriptionItem,
  ProductListItem,
  ProductListMetaItem,
  ProductListParams,
} from "./types/product-list.types";

function buildProductListQueryParams(params: ProductListParams) {
  const clientId = envs.CLIENT_ID;
  const inativo = params.inativo === "all" ? null : Number(params.inativo);
  const search = params.search ?? null;

  return [
    clientId, // PE_SYSTEM_CLIENT_ID
    inativo, // PE_INATIVO_NULL_CHECK
    inativo, // PE_INATIVO
    search, // PE_SEARCH (IS NULL check)
    search, // PE_SEARCH (TRIM check)
    search, // PE_SEARCH (REGEXP check)
    search, // PE_SEARCH (CAST AS UNSIGNED)
    search, // PE_SEARCH (LIKE inside REGEXP block)
    search, // PE_SEARCH (NOT REGEXP check)
    search, // PE_SEARCH (LIKE inside NOT REGEXP block)
  ];
}

export async function getProductList(
  params: ProductListParams,
): Promise<ProductListItem[]> {
  const queryParams = buildProductListQueryParams(params);

  return dbService.selectQuery<ProductListItem>(PRODUCT_LIST_SQL, queryParams);
}

export async function getProductListMeta(
  params: ProductListParams,
): Promise<ProductListMetaItem[]> {
  const queryParams = buildProductListQueryParams(params);

  return dbService.selectQuery<ProductListMetaItem>(
    PRODUCT_LIST_META_SQL,
    queryParams,
  );
}

export async function getProductListDescription(
  params: ProductListParams,
): Promise<ProductListDescriptionItem[]> {
  const queryParams = buildProductListQueryParams(params);

  return dbService.selectQuery<ProductListDescriptionItem>(
    PRODUCT_LIST_DESCRIPTION_SQL,
    queryParams,
  );
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
