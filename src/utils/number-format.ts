/**
 * Форматирование разрядов числа
 * @param value
 * @param options
 * @returns {string}
 */
export default function numberFormat(value: number, options: Intl.NumberFormatOptions){
  return new Intl.NumberFormat('ru-RU', options).format(value)
}
