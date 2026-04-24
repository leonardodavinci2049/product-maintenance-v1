import {
  drawMetaTerms,
  getKeywordBase,
  replacePathSeparators,
  toNaturalPtBrText,
} from "./seo-meta-shared";

export function getCategoryTitle(
  categoryName: string,
  parentName: string,
): string {
  const { chosenLocation } = drawMetaTerms();

  const normalizedCategoryName = toNaturalPtBrText(categoryName).trim();
  const normalizedParentName = toNaturalPtBrText(parentName).trim();

  let partialMetaTitle = normalizedCategoryName;

  if (normalizedCategoryName !== "" && normalizedParentName !== "") {
    partialMetaTitle = `${normalizedCategoryName} departamento de ${normalizedParentName}`;
  }

  partialMetaTitle = toNaturalPtBrText(replacePathSeparators(partialMetaTitle));

  return [partialMetaTitle, chosenLocation].filter(Boolean).join(" ").trim();
}

export function getCategoryDescription(
  categoryName: string,
  parentName: string,
): string {
  const { chosenOpeningTerm, chosenClosingTerm, chosenLocation } =
    drawMetaTerms();

  const normalizedCategoryName = toNaturalPtBrText(categoryName).trim();
  const normalizedParentName = toNaturalPtBrText(parentName).trim();

  let partialMetaDescription = "";

  if (normalizedCategoryName !== "") {
    partialMetaDescription = normalizedParentName
      ? `${normalizedCategoryName} em ${normalizedParentName}`
      : normalizedCategoryName;
  }

  partialMetaDescription = toNaturalPtBrText(
    replacePathSeparators(partialMetaDescription),
  );

  return [
    chosenOpeningTerm,
    partialMetaDescription,
    chosenClosingTerm,
    chosenLocation,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function getCategoryKeyword(
  familyName: string,
  groupName: string,
  subgroupName: string,
): string {
  const keyword = `${familyName} ${groupName} ${subgroupName}`;

  return getKeywordBase(keyword).trim();
}
