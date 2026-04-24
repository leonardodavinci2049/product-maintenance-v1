import {
  getKeywordBase,
  sortearTermosMeta,
  toNaturalPtBrText,
} from "./seo-meta-shared";

export function getTitleCategoria(
  categoryName: string,
  parentName: string,
): string {
  const nomeCategoriaNormalizado = toNaturalPtBrText(categoryName).trim();
  const nomePaiNormalizado = toNaturalPtBrText(parentName).trim();

  let partialMetaTitle = nomeCategoriaNormalizado;

  if (nomeCategoriaNormalizado !== "" && nomePaiNormalizado !== "") {
    partialMetaTitle = `${nomeCategoriaNormalizado} departamento de ${nomePaiNormalizado}`;
  }

  partialMetaTitle = partialMetaTitle.replace("/", " e ");
  partialMetaTitle = partialMetaTitle.replace("\\", " e ");
  partialMetaTitle = toNaturalPtBrText(partialMetaTitle);

  return `${partialMetaTitle} em Ribeirão Preto`;
}

export function getDescriptionCategoria(
  categoryName: string,
  parentName: string,
): string {
  const { termoInicialEscolhido, termoFinalEscolhido } = sortearTermosMeta();

  const nomeCategoriaNormalizado = toNaturalPtBrText(categoryName).trim();
  const nomePaiNormalizado = toNaturalPtBrText(parentName).trim();

  let partialMetaDescription = "";

  if (nomeCategoriaNormalizado !== "") {
    partialMetaDescription = nomePaiNormalizado
      ? `${nomeCategoriaNormalizado} em ${nomePaiNormalizado}`
      : `${nomeCategoriaNormalizado} em Ribeirão Preto SP`;
  }

  partialMetaDescription = partialMetaDescription.replace("/", " e ");
  partialMetaDescription = partialMetaDescription.replace("\\", " e ");
  partialMetaDescription = toNaturalPtBrText(partialMetaDescription);

  return `${termoInicialEscolhido} ${partialMetaDescription} ${termoFinalEscolhido} Somos a maior loja de Ribeirão Preto São Paulo`;
}

export function getKeywordCategoria(
  opNomeFamilia: string,
  opNomeGrupo: string,
  opNomeSubgrupo: string,
): string {
  const keyword = `${opNomeFamilia} ${opNomeGrupo} ${opNomeSubgrupo}`;

  return getKeywordBase(keyword).trim();
}
