/**
 * Отношения к другим сущностям для поиска через ID
 */
interface CatalogItemReference {
  _id: string,
  _type: string
}

/**
 * Объект товара
 */
export interface CatalogItem {
  category: CatalogItemReference
  dateCreate: string,
  dateUpdate: string,
  description: string,
  edition: number,
  isDeleted: boolean,
  isFavorite: boolean,
  isNew: boolean,
  maidIn: CatalogItemReference
  name: string,
  order: number,
  price: number,
  proto: any,
  title: string,
  _id: string,
  _key: string,
  _type: string
}

/**
 * Мутируемый объект товара со свойством количества в корзине
 */
export interface BasketItem extends CatalogItem {
  amount?: number
}
