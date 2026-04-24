import {
  drawMetaTerms,
  getKeywordBase,
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

  partialMetaTitle = partialMetaTitle.replace("/", " e ");
  partialMetaTitle = partialMetaTitle.replace("\\", " e ");
  partialMetaTitle = toNaturalPtBrText(partialMetaTitle);

  return `${partialMetaTitle} ${chosenLocation}  `;
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
      : `${normalizedCategoryName} em ${chosenLocation}`;
  }

  partialMetaDescription = partialMetaDescription.replace("/", " e ");
  partialMetaDescription = partialMetaDescription.replace("\\", " e ");
  partialMetaDescription = toNaturalPtBrText(partialMetaDescription);

  return `${chosenOpeningTerm} ${partialMetaDescription} ${chosenClosingTerm} ${chosenLocation}`;
}

export function getCategoryKeyword(
  familyName: string,
  groupName: string,
  subgroupName: string,
): string {
  const keyword = `${familyName} ${groupName} ${subgroupName}`;

  return getKeywordBase(keyword).trim();
}
