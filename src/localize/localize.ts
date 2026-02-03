import en from './languages/en.json';
import nl from './languages/nl.json';
import de from './languages/de.json';
import it from './languages/it.json';
import fr from './languages/fr.json';
import es from './languages/es.json';

type LangMap = Record<string, string>;

const LANGS: Record<string, LangMap> = {
  en,
  nl,
  de,
  it,
  fr,
  es,
};

export const SUPPORTED_LANGUAGES = Object.keys(LANGS) as Array<keyof typeof LANGS>;

/**
 * localize
 * @param key translation key
 * @param lang optional language code (en, nl, de, it, fr). falls back to 'en'
 * @param params optional replacement params for placeholders like {0}, {1}
 */
export function localize(key: string, lang?: string, ...params: Array<string | number>): string {
  const dictionary = (lang && LANGS[lang]) ? LANGS[lang] : LANGS.en;
  let str = dictionary[key] ?? LANGS.en[key] ?? key;
  if (params && params.length) {
    params.forEach((p, i) => {
      str = str.replace(new RegExp(`\\{${i}\\}`, 'g'), String(p));
    });
  }
  return str;
}

export default localize;
