import {BasketItem} from "@src/store/data-model/shop";

export interface BasketValues {
  items: BasketItem[]
  sum: number,
  amount: number
}
