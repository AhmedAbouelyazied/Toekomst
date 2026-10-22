import nl from "@/messages/nl.json";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import type { Locale } from "./config";

export type Dictionary = typeof nl;

const dictionaries: Record<Locale, Dictionary> = {
  nl,
  ar: ar as unknown as Dictionary,
  en: en as unknown as Dictionary,
  fr: fr as unknown as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
