import React, {useCallback} from "react";
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
  }));

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
    //Бесконечный скролл. Отказался от useCallback, поскольку в нем замыкается select limit
    onIntersect: () => store.get(props.catalogName).setParams({page: select.page + 1}, false, true)
  };
  const renders = {
    item: useCallback(item => (
      <Item item={item} onAdd={callbacks.addConfirmation} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [t]),
  }

  return (
    <InfiniteScroller onIntersection={callbacks.onIntersect}>
      <Spinner active={select.waiting}>
        <Pagination count={select.count} page={select.page} limit={select.limit} onChange={callbacks.onPaginate}/>
        <List items={select.items} renderItem={renders.item}/>
      </Spinner>
    </InfiniteScroller>
  );
}

CatalogList.propTypes = {
  catalogName: propTypes.string,
}

CatalogList.defaultProps = {
  catalogName: "catalog"
}

export default React.memo(CatalogList);
