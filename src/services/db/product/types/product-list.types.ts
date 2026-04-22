import type { RowDataPacket } from "mysql2/promise";

export type ProductListParams = {
  inativo: number;
  search?: string | null;
};

export type ProductListItem = RowDataPacket & {
  ID_PRODUTO: number;
  SKU: number;
  PRODUTO: string | null;
  ESTOQUE_LOJA: number | null;
  TIPO_VALOR: string;
  VALOR_PRODUTO: number | null;
  VL_ATACADO: number | null;
  VL_CORPORATIVO: number | null;
  VL_VAREJO: number | null;
  DESCRICAO_TAB: string | null;
  ETIQUETA: string | null;
  REF: string | null;
  MODELO: string | null;
  ID_TIPO: number | null;
  TIPO: string | null;
  ID_MARCA: number | null;
  MARCA: string | null;
  PATH_IMAGEM_MARCA: string | null;
  ID_IMAGEM: number | null;
  PATH_IMAGEM: string | null;
  PATH_PAGE: string | null;
  SLUG: string | null;
  TX_PRODUTO_LOJA: number | null;
  OURO: number | null;
  PRATA: number | null;
  BRONZE: number | null;
  DECONTO: number | null;
  TEMPODEGARANTIA_MES: number | null;
  TEMPODEGARANTIA_DIA: number | null;
  DESCRICAO_VENDA: string | null;
  IMPORTADO: number | null;
  PROMOCAO: number | null;
  LANCAMENTO: number | null;
  DATADOCADASTRO: Date | null;
};
