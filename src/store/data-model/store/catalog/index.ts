import {CatalogItem} from "@src/store/data-model/shop";

export interface CatalogURLParams {
  page: number,
  skip: number,
  limit: number,
  sort: string,
  query: string,
  category: string
}

export interface CatalogValues {
  items: CatalogItem[],
  count: number,
  loaded: number,
  params: CatalogURLParams,
  waiting: boolean
}
