import { BUSINESS_LOCATION } from "./constants-terms/seo-meta-business-location";
import {
  CATEGORY_CALL_TO_ACTION,
  PRODUCT_CALL_TO_ACTION,
} from "./constants-terms/seo-meta-call-to-action";
import {
  CATEGORY_BENEFIT_TERMS,
  CATEGORY_PROOF_TERMS,
  CATEGORY_URGENCY_TERMS,
  PRODUCT_BENEFIT_TERMS,
  PRODUCT_PROOF_TERMS,
  PRODUCT_URGENCY_TERMS,
} from "./constants-terms/seo-meta-closing-keywords";

export type MetaPageContext = "product" | "category";

export {
  BUSINESS_LOCATION,
  CATEGORY_BENEFIT_TERMS,
  CATEGORY_CALL_TO_ACTION,
  CATEGORY_PROOF_TERMS,
  CATEGORY_URGENCY_TERMS,
  PRODUCT_BENEFIT_TERMS,
  PRODUCT_CALL_TO_ACTION,
  PRODUCT_PROOF_TERMS,
  PRODUCT_URGENCY_TERMS,
};

const META_TERM_POOLS = {
  category: {
    benefitTerms: CATEGORY_BENEFIT_TERMS,
    openingTerms: CATEGORY_CALL_TO_ACTION,
    proofTerms: CATEGORY_PROOF_TERMS,
    urgencyTerms: CATEGORY_URGENCY_TERMS,
  },
  product: {
    benefitTerms: PRODUCT_BENEFIT_TERMS,
    openingTerms: PRODUCT_CALL_TO_ACTION,
    proofTerms: PRODUCT_PROOF_TERMS,
    urgencyTerms: PRODUCT_URGENCY_TERMS,
  },
} as const;

export const PT_BR_LOWER_CONNECTORS = new Set([
  "a",
  "as",
  "da",
  "das",
  "de",
  "do",
  "dos",
  "e",
  "em",
  "na",
  "nas",
  "no",
  "nos",
  "para",
]);

export const PT_BR_UPPERCASE_EXCEPTIONS = new Map([
  ["abnt", "ABNT"],
  ["led", "LED"],
  ["nf-e", "NF-e"],
  ["pvc", "PVC"],
  ["usb", "USB"],
]);

export function normalizeMetaText(value: string): string {
  return value
    .normalize("NFC")
    .replaceAll("\u00A0", " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function replacePathSeparators(value: string): string {
  return value.replaceAll("/", " e ").replaceAll("\\", " e ");
}

export function toNaturalPtBrText(value: string): string {
  const normalized = normalizeMetaText(value);
  if (!normalized) return "";

  const allUpperCase =
    normalized === normalized.toUpperCase() &&
    normalized !== normalized.toLowerCase();

  const baseText = allUpperCase ? normalized.toLowerCase() : normalized;

  return baseText
    .split(" ")
    .map((word, index) => {
      const lowerWord = word.toLowerCase();
      const uppercaseException = PT_BR_UPPERCASE_EXCEPTIONS.get(lowerWord);

      if (uppercaseException) {
        return uppercaseException;
      }

      if (index > 0 && PT_BR_LOWER_CONNECTORS.has(lowerWord)) {
        return lowerWord;
      }

      const baseWord = allUpperCase ? lowerWord : word;

      return baseWord.charAt(0).toUpperCase() + baseWord.slice(1);
    })
    .join(" ");
}

function formatTitleCaseKeywords(name: string): string {
  let remainingName = normalizeMetaText(name).toLowerCase();
  let formattedName = "";

  while (remainingName.trim() !== "") {
    const spacePosition = remainingName.indexOf(" ");
    const word =
      spacePosition > -1
        ? remainingName.slice(0, spacePosition + 1)
        : remainingName;

    let term = word.trim();

    if (term.length > 2 && term !== "das" && term !== "dos") {
      term = word.charAt(0).toUpperCase() + word.slice(1);
    }

    const lowerTerm = term.trim().toLowerCase();

    if (lowerTerm === "ltda") {
      term = "LTDA";
    }

    if (lowerTerm === "me") {
      term = "ME";
    }

    if (lowerTerm === "sa") {
      term = "SA";
    }

    formattedName = `${formattedName} ${term.trim()}`;
    remainingName = remainingName.replace(word, "");
  }

  return formattedName.trim();
}

export function getKeywordBase(productName: string): string {
  let keyword = normalizeMetaText(productName);

  keyword = keyword.replaceAll("-", " ");

  keyword = keyword.replaceAll(" - ", "");
  keyword = keyword.replaceAll(" -", "");
  keyword = keyword.replaceAll("- ", "");
  keyword = keyword.replace(/\s+/g, " ");
  keyword = keyword.replaceAll(" ", ", ");

  keyword = keyword.trim();

  keyword = keyword.replaceAll(", da, ", " da ");
  keyword = keyword.replaceAll(", de, ", " de ");
  keyword = keyword.replaceAll(", do, ", " do ");
  keyword = keyword.replaceAll(", das, ", " das ");
  keyword = keyword.replaceAll(", dos, ", " dos ");
  keyword = keyword.replaceAll(", e, ", " e ");

  keyword = formatTitleCaseKeywords(keyword);

  if (keyword.length > 0 && keyword.at(-1) === ",") {
    keyword = keyword.slice(0, -1);
  }

  return keyword;
}

export function buildMetaSemanticTail(
  benefitTerm: string,
  proofTerm: string,
  urgencyTerm: string,
  locationTerm: string,
): string {
  const semanticTerms = [benefitTerm, proofTerm, urgencyTerm]
    .map((term) => normalizeMetaText(term))
    .filter(Boolean);
  const normalizedLocation = normalizeMetaText(locationTerm);

  if (semanticTerms.length === 0) {
    return normalizedLocation;
  }

  const semanticTail =
    semanticTerms.length === 1
      ? semanticTerms[0]
      : `${semanticTerms.slice(0, -1).join(", ")} e ${semanticTerms.at(-1)}`;

  return normalizedLocation
    ? `${semanticTail}, ${normalizedLocation}`
    : semanticTail;
}

export function drawMetaTerms(context: MetaPageContext = "product"): {
  chosenBenefitTerm: string;
  chosenOpeningTerm: string;
  chosenLocation: string;
  chosenProofTerm: string;
  chosenUrgencyTerm: string;
} {
  const { benefitTerms, openingTerms, proofTerms, urgencyTerms } =
    META_TERM_POOLS[context];

  const benefitIndex = Math.floor(Math.random() * benefitTerms.length);
  const openingIndex = Math.floor(Math.random() * openingTerms.length);
  const locationIndex = Math.floor(Math.random() * BUSINESS_LOCATION.length);
  const proofIndex = Math.floor(Math.random() * proofTerms.length);
  const urgencyIndex = Math.floor(Math.random() * urgencyTerms.length);

  return {
    chosenBenefitTerm: benefitTerms[benefitIndex],
    chosenOpeningTerm: openingTerms[openingIndex],
    chosenLocation: BUSINESS_LOCATION[locationIndex],
    chosenProofTerm: proofTerms[proofIndex],
    chosenUrgencyTerm: urgencyTerms[urgencyIndex],
  };
}
