import {
  getKeywordBase,
  sortearTermosMeta,
  toNaturalPtBrText,
} from "./seo-meta-shared";

export function getTitleProduto(opNome: string): string {
  let metaTitle = "";

  metaTitle = opNome.replace("/", " e ");
  metaTitle = metaTitle.replace("\\", " e ");
  metaTitle = toNaturalPtBrText(metaTitle);

  return `${metaTitle} em Ribeirão Preto`;
}

export function getDescriptionProduto(
  opNomeProduto: string,
  opNomeFamilia: string,
  opNomeGrupo: string,
  _opNomeSubgrupo: string,
): string {
  const { termoInicialEscolhido, termoFinalEscolhido } = sortearTermosMeta();

  const nomeProdutoNormalizado = toNaturalPtBrText(opNomeProduto);
  const familiaNormalizada = toNaturalPtBrText(opNomeFamilia).trim();
  const grupoNormalizado = toNaturalPtBrText(opNomeGrupo).trim();

  return [
    termoInicialEscolhido,
    familiaNormalizada ? `${familiaNormalizada} para` : "",
    nomeProdutoNormalizado,
    grupoNormalizado,
    termoFinalEscolhido,
    "Somos a maior loja de Ribeirão Preto São Paulo",
  ]
    .filter(Boolean)
    .join(" ");
}

export function getKeywordProduto(opNome: string): string {
  return getKeywordBase(opNome).trim();
}
