import * as locales from './locales';

interface Locales {
  ru: JSON,
  en: JSON
}

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Перведенный текст
 */
export default function translate(lang: Locales, text: string, plural?: number) {
  const languageKey = lang as unknown as keyof Locales
  const result = locales[languageKey] && typeof locales[languageKey][text] !== 'undefined' ? locales[languageKey][text] : text;

  if (typeof plural !== 'undefined'){
    const key = new Intl.PluralRules(languageKey).select(plural);
    return result[key] || result;
  }

  return result;
}
