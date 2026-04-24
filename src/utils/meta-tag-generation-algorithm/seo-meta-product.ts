import {
  drawMetaTerms,
  getKeywordBase,
  replacePathSeparators,
  toNaturalPtBrText,
} from "./seo-meta-shared";

export function getProductTitle(productName: string): string {
  const { chosenLocation } = drawMetaTerms();

  const metaTitle = toNaturalPtBrText(replacePathSeparators(productName));

  return [metaTitle, chosenLocation].filter(Boolean).join(" ").trim();
}

export function getProductDescription(
  productName: string,
  familyName: string,
  groupName: string,
  subgroupName: string,
): string {
  const { chosenOpeningTerm, chosenClosingTerm, chosenLocation } =
    drawMetaTerms();

  const normalizedProductName = toNaturalPtBrText(productName);
  const normalizedFamily = toNaturalPtBrText(familyName).trim();
  const normalizedGroup = toNaturalPtBrText(groupName).trim();
  const normalizedSubgroup = toNaturalPtBrText(subgroupName).trim();
  const normalizedHierarchy = [normalizedGroup, normalizedSubgroup]
    .filter(Boolean)
    .join(" ");

  return [
    chosenOpeningTerm,
    normalizedFamily ? `${normalizedFamily} para` : "",
    normalizedProductName,
    normalizedHierarchy,
    chosenClosingTerm,
    chosenLocation,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function getProductKeyword(productName: string): string {
  return getKeywordBase(productName).trim();
}
