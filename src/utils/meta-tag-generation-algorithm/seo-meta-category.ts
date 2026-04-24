import {
  getKeywordBase,
  sortearTermosMeta,
  toNaturalPtBrText,
} from "./seo-meta-shared";

export function getKeywordCategoria(
  opNomeFamilia: string,
  opNomeGrupo: string,
  opNomeSubgrupo: string,
): string {
  const keyword = `${opNomeFamilia} ${opNomeGrupo} ${opNomeSubgrupo}`;

  return getKeywordBase(keyword).trim();
}

export function getTitleCategoria(
  opNomeFamilia: string,
  opNomeGrupo: string,
  opNomeSubgrupo: string,
): string {
  const familiaNormalizada = toNaturalPtBrText(opNomeFamilia);
  const grupoNormalizado = toNaturalPtBrText(opNomeGrupo);
  const subgrupoNormalizado = toNaturalPtBrText(opNomeSubgrupo);

  let metaTitle = "";

  if (familiaNormalizada !== "") {
    metaTitle = familiaNormalizada;
  }

  if (grupoNormalizado !== "") {
    metaTitle = `${grupoNormalizado} departamento de ${familiaNormalizada}`;
  }

  if (subgrupoNormalizado !== "") {
    metaTitle = `${subgrupoNormalizado} departamento de ${subgrupoNormalizado}`;
  }

  metaTitle = metaTitle.replace("/", " e ");
  metaTitle = metaTitle.replace("\\", " e ");
  metaTitle = toNaturalPtBrText(metaTitle);

  return `${metaTitle} em Ribeirão Preto`;
}

export function getDescriptionCategoria(
  _opNomeTaxonomia: string,
  opNomeFamilia: string,
  opNomeGrupo: string,
  opNomeSubgrupo: string,
): string {
  const { termoInicialEscolhido, termoFinalEscolhido } = sortearTermosMeta();

  const familiaNormalizada = toNaturalPtBrText(opNomeFamilia);
  const grupoNormalizado = toNaturalPtBrText(opNomeGrupo);
  const subgrupoNormalizado = toNaturalPtBrText(opNomeSubgrupo);

  let metaDescription = "";

  if (familiaNormalizada !== "") {
    metaDescription = `${familiaNormalizada} em Ribeirão Preto SP`;
  }

  if (grupoNormalizado !== "") {
    metaDescription = `${grupoNormalizado} em ${familiaNormalizada}`;
  }

  if (subgrupoNormalizado !== "") {
    metaDescription = `${subgrupoNormalizado} em ${grupoNormalizado}`;
  }

  metaDescription = metaDescription.replace("/", " e ");
  metaDescription = metaDescription.replace("\\", " e ");
  metaDescription = toNaturalPtBrText(metaDescription);

  return `${termoInicialEscolhido} ${metaDescription} ${termoFinalEscolhido} Somos a maior loja de Ribeirão Preto São Paulo`;
}
