import {CatalogItem} from "@src/store/data-model/shop";

export interface ArticleValues {
  data: CatalogItem | {}
  waiting: boolean
}
