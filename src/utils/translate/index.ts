import * as locales from './locales';

/**
 * Перевод фразу по словарю
 * @param lang {String} Код языка
 * @param text {String} Текст для перевода
 * @param [plural] {Number} Число для плюрализации
 * @returns {String} Перведенный текст
 */
export default function translate(lang: string, text: string, plural?: number) {
  const languageKey = lang as keyof typeof locales
  const language = locales[languageKey]
  const probableResult = Object.entries(language).find(entry => entry[0] === text)
  const result = probableResult ? probableResult[1] : text
  if(typeof result === "string") {
    return result;
  } else {
    if (typeof plural !== 'undefined') {
      const key = new Intl.PluralRules(languageKey).select(plural);
      return result[key as keyof typeof result] as string ?? result["one" as keyof typeof result] as string ?? "";
    }
  }
  return text
}
