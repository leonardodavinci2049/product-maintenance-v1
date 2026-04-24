import {
  drawMetaTerms,
  getKeywordBase,
  toNaturalPtBrText,
} from "./seo-meta-shared";

export function getProductTitle(productName: string): string {
  const { chosenLocation } = drawMetaTerms();

  let metaTitle = "";

  metaTitle = productName.replace("/", " e ");
  metaTitle = metaTitle.replace("\\", " e ");
  metaTitle = toNaturalPtBrText(metaTitle);

  return `${metaTitle} ${chosenLocation}`;
}

export function getProductDescription(
  productName: string,
  familyName: string,
  groupName: string,
  _subgroupName: string,
): string {
  const { chosenOpeningTerm, chosenClosingTerm, chosenLocation } =
    drawMetaTerms();

  const normalizedProductName = toNaturalPtBrText(productName);
  const normalizedFamily = toNaturalPtBrText(familyName).trim();
  const normalizedGroup = toNaturalPtBrText(groupName).trim();

  return [
    chosenOpeningTerm,
    normalizedFamily ? `${normalizedFamily} para` : "",
    normalizedProductName,
    normalizedGroup,
    chosenClosingTerm,
    chosenLocation,
  ]
    .filter(Boolean)
    .join(" ");
}

export function getProductKeyword(productName: string): string {
  return getKeywordBase(productName).trim();
}
