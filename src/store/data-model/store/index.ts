import CanvasState from "@src/store/canvas";
import CategoriesState from "@src/store/categories";
import ModalsState from "@src/store/modals";
import BasketState from "@src/store/basket";
import CatalogState from "@src/store/catalog";
import ArticleState from "@src/store/article";
import LocaleState from "@src/store/locale";
import SessionState from "@src/store/session";
import ProfileState from "@src/store/profile";
import ChatState from "@src/store/chat";
import {ArticleValues} from "@src/store/data-model/store/article";
import {BasketValues} from "@src/store/data-model/store/basket";
import {CanvasValues} from "@src/store/data-model/store/canvas";
import {CategoriesValues} from "@src/store/data-model/store/categories";
import {ChatValues} from "@src/store/data-model/store/chat";
import {ModalsValues} from "@src/store/data-model/store/modals";
import {LocaleValues} from "@src/store/data-model/store/locale";
import {ProfileValues} from "@src/store/data-model/store/profile";
import {SessionValues} from "@src/store/data-model/store/session";
import {CatalogValues} from "@src/store/data-model/store/catalog";

export interface StoreModules {
  basket: BasketState
  catalog: CatalogState
  modals: ModalsState
  article: ArticleState
  locale: LocaleState
  categories: CategoriesState
  session: SessionState
  profile: ProfileState
  chat: ChatState
  canvas: CanvasState
}

export interface GlobalState {
  article: ArticleValues,
  basket: BasketValues,
  catalog: CatalogValues,
  canvas: CanvasValues,
  categories: CategoriesValues,
  chat: ChatValues,
  locale: LocaleValues,
  modals: ModalsValues,
  profile: ProfileValues,
  session: SessionValues
}
