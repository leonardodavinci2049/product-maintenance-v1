import {
  drawMetaTerms,
  getKeywordBase,
  toNaturalPtBrText,
} from "./seo-meta-shared";

export function getProductTitle(productName: string): string {
  let metaTitle = "";

  metaTitle = productName.replace("/", " e ");
  metaTitle = metaTitle.replace("\\", " e ");
  metaTitle = toNaturalPtBrText(metaTitle);

  return `${metaTitle} em Ribeirão Preto`;
}

export function getProductDescription(
  productName: string,
  familyName: string,
  groupName: string,
  _subgroupName: string,
): string {
  const { chosenOpeningTerm, chosenClosingTerm } = drawMetaTerms();

  const normalizedProductName = toNaturalPtBrText(productName);
  const normalizedFamily = toNaturalPtBrText(familyName).trim();
  const normalizedGroup = toNaturalPtBrText(groupName).trim();

  return [
    chosenOpeningTerm,
    normalizedFamily ? `${normalizedFamily} para` : "",
    normalizedProductName,
    normalizedGroup,
    chosenClosingTerm,
    "Somos a maior loja de Ribeirão Preto São Paulo",
  ]
    .filter(Boolean)
    .join(" ");
}

export function getProductKeyword(productName: string): string {
  return getKeywordBase(productName).trim();
}
