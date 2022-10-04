import React, {useCallback, useEffect, useRef} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/elements/list";
import Pagination from "@src/components/navigation/pagination";
import Spinner from "@src/components/elements/spinner";
import Item from "@src/components/catalog/item";
import InfiniteScroller from '@src/containers/infinite-scroller';
import propTypes from 'prop-types';

function CatalogList(props) {

  const store = useStore();

  const select = useSelector(state => ({
    items: state[props.catalogName].items,
    page: state[props.catalogName].params.page,
    limit: state[props.catalogName].params.limit,
    count: state[props.catalogName].count,
    waiting: state[props.catalogName].waiting,
    params: state[props.catalogName].params,
    loaded: state[props.catalogName].loaded
  }));
  // Массив координат крайни элементов текущего списка товара
  const prevThresholds = useRef([])
  // Сброс координат для вычита параметра страницы при смене любых параметров
  useEffect(() => {
    prevThresholds.current = []
  }, [select.params])
  // Событие на скролл страницы. Поиск последней координаты, которая ниже текущего положения скролла
  // Последующая тихая установка параметра url
  let rollOverThrottleTimeout
  const onRollOverLastElement = useCallback(() => {
    clearTimeout(rollOverThrottleTimeout)
    rollOverThrottleTimeout = setTimeout(() => {
      const currentViewportPage = prevThresholds.current.filter(coordinates => coordinates < window.scrollY).length
      store.get(props.catalogName).mutatePage(currentViewportPage)
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
    addToBasket: useCallback((_id, count) => store.get('basket').addToBasket(_id, count), []),
    // Открытие модалки добавления в корзину
    addConfirmation: useCallback(async(_id) => {
      const result = await store.get('modals').open('confirm')
      if(!isNaN(result) && result >= 1) callbacks.addToBasket(_id, result)
    }, []),
    //Пагианция
    onPaginate: useCallback(page => store.get(props.catalogName).setParams({page}), []),
    //Бесконечный скролл.
    onIntersect: useCallback(() => {
      if(select.loaded > 0) store.get(props.catalogName).loadMoreItems()
    }, [select.loaded])
  };
  const renders = {
    item: useCallback((item, idx) => (
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
        <Pagination count={select.count} page={select.page} limit={select.limit} onChange={callbacks.onPaginate}/>
        <List idSpreader={props.catalogName} items={select.items} renderItem={props.renderFunction || renders.item}/>
      </Spinner>
    </InfiniteScroller>
  );
}

CatalogList.propTypes = {
  catalogName: propTypes.string,
  renderFunction: propTypes.func
}

CatalogList.defaultProps = {
  catalogName: "catalog"
}

export default React.memo(CatalogList);
