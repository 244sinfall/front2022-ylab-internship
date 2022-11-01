import {BasketItem, CatalogItem} from "@src/store/data-model/shop";
import CanvasState, {ShapeCoordinate} from "@src/store/canvas";
import Shape from "@src/store/canvas/shapes";
import CategoriesState, {Category} from "@src/store/categories";
import ModalsState, {ModalWindow} from "@src/store/modals";
import {UserInfo} from "@src/store/data-model/user";
import BasketState from "@src/store/basket";
import CatalogState from "@src/store/catalog";
import ArticleState from "@src/store/article";
import LocaleState from "@src/store/locale";
import SessionState from "@src/store/session";
import ProfileState from "@src/store/profile";
import ChatState from "@src/store/chat";

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

export type ModuleName = "basket" | "catalog" | "modals" | "article" | "locale" | "categories" | "session" | "profile" | "chat" | "canvas"

export interface GlobalState {
  article: {
    data: CatalogItem | {}
    waiting: boolean
  },
  basket: {
    items: BasketItem[]
    sum: number,
    amount: number
  }
  canvas: {
    coordinates: ShapeCoordinate,
    scale: number,
    selectedShape: Shape | null,
    shapes: Shape[]
  },
  categories: {
    items: Category[]
    waiting: boolean
  },
  chat: {
    messages: any[],
    lastSubmittedKeys: string[],
    maxOut: boolean,
    authorized: boolean,
    waiting: boolean
  },
  locale: {
    lang: string
  },
  modals: {
    opened: ModalWindow[]
  }
  profile: {
    data: UserInfo | {},
    waiting: boolean
  }
  session: {
    user: UserInfo | {},
    token: string,
    exists: boolean,
    errors: any[] | null
    waiting: boolean
  }

}
