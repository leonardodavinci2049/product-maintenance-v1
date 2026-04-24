const CALL_TO_ACTION = [
  "Confira ofertas de",
  "Confira as melhores ofertas de",
  "Aproveite a promoção de",
  "Aproveite e compre agora",
  "Economize comprando agora",
  "Encontre aqui",
  "Confira os menores preços em",
  "Confira ofertas e promoções de ",
  "Visite e veja nossas promoções para",
  "Venha conferir, temos as melhores ofertas em",
];

const CLOSING_KEYWORDS = [
  "confira as ofertas.",
  "ótimos preços!",
  "aproveite o menor preços.",
  "menores preços.",
  "aproveite e compre Agora o Seu!",
  "entrega Garantida.",
  "economize compare preços.",
  "excelente oferta.",
  "economize compre mais barato.",
  "venha fazer ótimos negócios. Aproveite!",
];

export const BUSINESS_LOCATION = [
  "Ribeirão Preto São Paulo",
  "em Ribeirão Preto SP",
];

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

export function toNaturalPtBrText(value: string): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return "";

  const allUpperCase =
    normalized === normalized.toUpperCase() &&
    normalized !== normalized.toLowerCase();

  const baseText = allUpperCase ? normalized.toLowerCase() : normalized;

  return baseText
    .split(" ")
    .map((word, index) => {
      if (index > 0 && PT_BR_LOWER_CONNECTORS.has(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function formatTitleCaseKeywords(name: string): string {
  let remainingName = name.trim().toLowerCase();
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
  let keyword = productName;

  keyword = keyword.replaceAll("-", " ");

  keyword = keyword.replaceAll(" - ", "");
  keyword = keyword.replaceAll(" -", "");
  keyword = keyword.replaceAll("- ", "");
  keyword = keyword.replaceAll("  ", " ");
  keyword = keyword.replaceAll("  ", " ");
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

export function drawMetaTerms(): {
  chosenOpeningTerm: string;
  chosenClosingTerm: string;
  chosenLocation: string;
} {
  const openingIndex = Math.floor(Math.random() * CALL_TO_ACTION.length);
  const closingIndex = Math.floor(Math.random() * CLOSING_KEYWORDS.length);
  const locationIndex = Math.floor(Math.random() * BUSINESS_LOCATION.length);

  return {
    chosenOpeningTerm: CALL_TO_ACTION[openingIndex],
    chosenClosingTerm: CLOSING_KEYWORDS[closingIndex],
    chosenLocation: BUSINESS_LOCATION[locationIndex],
  };
}
