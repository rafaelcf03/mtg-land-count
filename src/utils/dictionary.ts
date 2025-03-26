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
  },
};
