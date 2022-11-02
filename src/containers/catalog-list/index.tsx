import React, {useCallback, useEffect, useRef} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/elements/list";
import Pagination from "@src/components/navigation/pagination";
import Spinner from "@src/components/elements/spinner";
import Item from "@src/components/catalog/item";
import InfiniteScroller from '@src/containers/infinite-scroller';
import {CatalogItem} from "@src/store/data-model/shop";
import {CatalogValues} from "@src/store/data-model/store/catalog";
import CatalogState from "@src/store/catalog";

interface CatalogListProps {
  catalogName?: string,
  renderFunction?: (item: CatalogItem, index?: number) => any
}

function CatalogList(props: CatalogListProps) {

  const store = useStore();
  const catalogName = (props.catalogName ? props.catalogName : "catalog") as keyof typeof store.state
  const select = useSelector(state => ({
    items: (state[catalogName] as CatalogValues).items,
    page: (state[catalogName] as CatalogValues).params.page,
    limit: (state[catalogName] as CatalogValues).params.limit,
    count: (state[catalogName] as CatalogValues).count,
    waiting: (state[catalogName] as CatalogValues).waiting,
    params: (state[catalogName] as CatalogValues).params,
    loaded: (state[catalogName] as CatalogValues).loaded
  }));
  // Массив координат крайни элементов текущего списка товара
  const prevThresholds = useRef<number[]>([])
  // Сброс координат для вычита параметра страницы при смене любых параметров
  useEffect(() => {
    prevThresholds.current = []
  }, [select.params])
  // Событие на скролл страницы. Поиск последней координаты, которая ниже текущего положения скролла
  // Последующая тихая установка параметра url
  let rollOverThrottleTimeout: NodeJS.Timeout
  const onRollOverLastElement = useCallback(() => {
    clearTimeout(rollOverThrottleTimeout)
    rollOverThrottleTimeout = setTimeout(() => {
      const currentViewportPage = prevThresholds.current.filter(coordinates => coordinates < window.scrollY).length;
      (store.modules[catalogName] as CatalogState).mutatePage(currentViewportPage)
    }, 300)
  }, [])
  // Событие для отслеживания глобального скролла
  useEffect(() => {
    document.addEventListener("scroll", onRollOverLastElement)
    return () => document.removeEventListener('scroll', onRollOverLastElement)
  }, [])

  const {t} = useTranslate();
  // Вместо коллбека сделать промисы. Переписать модалки на обычный стор. Пофиксить инфинит скролл
  // В корзине кнопку добавление товара. При нажатии на эту кнопку открывается модалка с каталогом, где можно добавить новый товар для корзины
  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback((_id: string, count: number) => store.modules.basket.addToBasket(_id, count), []),
    // Открытие модалки добавления в корзину
    addConfirmation: useCallback(async(_id: string) => {
      const result = await store.modules.modals.open('confirm')
      if(typeof result === 'number' && !isNaN(result) && result >= 1) await callbacks.addToBasket(_id, result)
    }, []),
    //Пагианция
    onPaginate: useCallback((page: number) => (store.modules[catalogName] as CatalogState).setParams({page}), []),
    //Бесконечный скролл.
    onIntersect: useCallback(async() => {
      if(select.loaded > 0) await (store.modules[catalogName] as CatalogState).loadMoreItems()
    }, [select.loaded])
  };
  const renders = {
    item: useCallback((item: CatalogItem, idx: number) => (
      <Item ref={element => {
        // Форвард реф используется для нахождения координат элемента на лету
        // Нас интересуют только крайние элементы списка, и так же интересуют только не во время загрузки
        if(select.items.length - select.limit === idx && element !== null && !select.waiting) {
          prevThresholds.current = [...prevThresholds.current, element.offsetTop]
        }
      }} item={item} onAdd={callbacks.addConfirmation} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [t, select.items, select.waiting, select.limit]),
  }

  return (
    <InfiniteScroller onIntersection={callbacks.onIntersect}>
      <Spinner active={select.waiting}>
        <Pagination indent={3} count={select.count} page={select.page} limit={select.limit} onChange={callbacks.onPaginate}/>
        <List idSpreader={props.catalogName} items={select.items} renderItem={props.renderFunction || renders.item}/>
      </Spinner>
    </InfiniteScroller>
  );
}

export default React.memo(CatalogList);
