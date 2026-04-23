import {
  getKeywordBase,
  sortearTermosMeta,
  toNaturalPtBrText,
} from "../seo-meta-shared";

export function getTitleProduto(opNome: string): string {
  let metaTitle = "";

  metaTitle = opNome.replace("/", " e ");
  metaTitle = opNome.replace("\\", " e ");
  metaTitle = toNaturalPtBrText(metaTitle);

  return `${metaTitle} em Ribeirão Preto`;
}

export function getDescriptionProduto(
  opNomeProduto: string,
  opNomeFamilia: string,
  opNomeGrupo: string,
  opNomeSubgrupo: string,
): string {
  const { termoInicialEscolhido, termoFinalEscolhido } = sortearTermosMeta();

  const nomeProdutoNormalizado = toNaturalPtBrText(opNomeProduto);
  const familiaNormalizada = toNaturalPtBrText(opNomeFamilia);
  const grupoNormalizado = toNaturalPtBrText(opNomeGrupo);
  const subgrupoNormalizado = toNaturalPtBrText(opNomeSubgrupo);

  const categoriaCompleta = [
    familiaNormalizada,
    grupoNormalizado,
    subgrupoNormalizado,
  ]
    .map((item) => item.trim())
    .filter(Boolean)
    .join(" ");

  const contextoCategoria = categoriaCompleta
    ? `${categoriaCompleta} para `
    : "";

  return `${termoInicialEscolhido} ${contextoCategoria}${nomeProdutoNormalizado} ${termoFinalEscolhido} Somos a maior loja de Ribeirão Preto São Paulo`;
}

export function getKeywordProduto(opNome: string): string {
  return getKeywordBase(opNome).trim();
}
