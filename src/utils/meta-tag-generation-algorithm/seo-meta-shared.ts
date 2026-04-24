const TERMOS_INICIAIS = [
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

const TERMOS_FINAIS = [
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

function extrairCadastrarKeywords(nome: string): string {
  let nomeBase = nome.trim().toLowerCase();
  let nomeCompleto = "";

  while (nomeBase.trim() !== "") {
    const posicaoEspaco = nomeBase.indexOf(" ");
    const palavra =
      posicaoEspaco > -1 ? nomeBase.slice(0, posicaoEspaco + 1) : nomeBase;

    let termo = palavra.trim();

    if (termo.length > 2 && termo !== "das" && termo !== "dos") {
      termo = palavra.charAt(0).toUpperCase() + palavra.slice(1);
    }

    const empresa = termo.trim().toLowerCase();

    if (empresa === "ltda") {
      termo = "LTDA";
    }

    if (empresa === "me") {
      termo = "ME";
    }

    if (empresa === "sa") {
      termo = "SA";
    }

    nomeCompleto = `${nomeCompleto} ${termo.trim()}`;
    nomeBase = nomeBase.replace(palavra, "");
  }

  return nomeCompleto.trim();
}

export function getKeywordBase(produtoNome: string): string {
  let keyword = produtoNome;

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

  keyword = extrairCadastrarKeywords(keyword);

  if (keyword.length > 0 && keyword.at(-1) === ",") {
    keyword = keyword.slice(0, -1);
  }

  return keyword;
}

export function sortearTermosMeta(): {
  termoInicialEscolhido: string;
  termoFinalEscolhido: string;
} {
  const indiceInicial = Math.floor(Math.random() * 10);
  const indiceFinal = Math.floor(Math.random() * 10);

  return {
    termoInicialEscolhido: TERMOS_INICIAIS[indiceInicial],
    termoFinalEscolhido: TERMOS_FINAIS[indiceFinal],
  };
}
