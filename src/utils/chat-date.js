/**
 * Функция для преобразования даты в удобный для чата формат (12.00 (01.01.1970))
 * @param date дата в строковом виде
 * @returns {string} преобразованная строка
 */
export const convertDateToChatFormat = (date) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleTimeString('ru-RU', {hour: "numeric", minute: "numeric"}) + ` (${dateObj.toLocaleDateString()})`
}
