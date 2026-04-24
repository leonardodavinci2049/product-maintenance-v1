import {
  buildMetaSemanticTail,
  drawMetaTerms,
  getKeywordBase,
  replacePathSeparators,
  toNaturalPtBrText,
} from "./seo-meta-shared";

export function getCategoryTitle(
  categoryName: string,
  parentName: string,
): string {
  const { chosenLocation } = drawMetaTerms("category");

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
  const {
    chosenBenefitTerm,
    chosenOpeningTerm,
    chosenLocation,
    chosenProofTerm,
    chosenUrgencyTerm,
  } = drawMetaTerms("category");

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
  const semanticTail = buildMetaSemanticTail(
    chosenBenefitTerm,
    chosenProofTerm,
    chosenUrgencyTerm,
    chosenLocation,
  );

  return [chosenOpeningTerm, partialMetaDescription, semanticTail]
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
