export default function translate(key: string): string {
  const lang = "pt-BR"; // navigator.languages[0]
  if (!key) {
    return "";
  }
  let defaultName = key[0].toUpperCase() + key.substring(1);
  if (key.includes("_")) {
    defaultName = defaultName
      .split("_")
      .map((e: String) => {
        return e[0].toUpperCase() + e.substring(1);
      })
      .join(" ");
  }
  return dictionary[lang][key] ?? defaultName;
}

export const dictionary: { [lang: string]: { [key: string]: string } } = {
  "pt-BR": {
    "decklist-error": "Texto inválido. Copie a lista no formato do MTG Arena.",
    "n-cards":
      "Quantidade de cartas presente no grimório (considerando os terrenos).",
    "avg-mana-value": "Custo médio de mana total das cartas não-terreno.",
    decklist: "Copie a lista no formato do MTG Arena.",
    "n-cheap-draw":
      "Quantidade de cartas de custo baixo, com custo de mana menor ou igual a dois, que compram cartas.",
    "n-cheap-mr":
      "Quantidade de cartas de custo baixo, com custo de mana menor ou igual a dois, que rampam.",
    nonMythicLand:
      "Quantidade de cartas modais dupla face que entram desviradas. Ou seja, aquelas que podem entrar desviradas pagando X pontos de vida.",
    mythicLand:
      "Quantidade de cartas modais dupla face que sempre vão entrar viradas.",
    companion: "Se o seu deck utiliza a mecânica de Companheiro",
    info: "Este é um valor aproximado. A quantidade real pode variar para mais ou para menos. Jogue e vá adaptando conforme necessário.",
  },
};
