import easterEggPhrases from "./cv-about-easter-egg-names.json";

const EASTER_EGG_PHRASES = easterEggPhrases as string[];

function normalizePersianText(text: string): string {
  return text
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u065F\u0670\u0640\u200c]/g, "")
    .replace(/[^\u0600-\u06FF]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const NORMALIZED_PHRASES = EASTER_EGG_PHRASES.map((phrase) => {
  const normalizedPhrase = normalizePersianText(phrase);
  return {
    normalizedPhrase,
    compactPhrase: normalizedPhrase.replace(/ /g, ""),
  };
}).filter((phrase) => phrase.normalizedPhrase.length > 0);

export function matchesCvAboutEasterEgg(
  about: string | null | undefined,
): boolean {
  if (!about) return false;

  const normalized = normalizePersianText(about);
  if (!normalized) return false;

  const compact = normalized.replace(/ /g, "");

  return NORMALIZED_PHRASES.some(
    ({ normalizedPhrase, compactPhrase }) =>
      normalized.includes(normalizedPhrase) || compact.includes(compactPhrase),
  );
}
