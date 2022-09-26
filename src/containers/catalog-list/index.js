import React, {useCallback, useEffect, useState} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/elements/list";
import Pagination from "@src/components/navigation/pagination";
import Spinner from "@src/components/elements/spinner";
import Item from "@src/components/catalog/item";
import InfiniteScroller from '@src/containers/infinite-scroller';

function CatalogList() {

  const store = useStore();

  const select = useSelector(state => ({
    items: state.catalog.items,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
  }));

  const {t} = useTranslate();
  const [intersectionLimit, setIntersectionLimit] = useState(select.limit)
  useEffect(() => {
    if(intersectionLimit < select.limit) return setIntersectionLimit(select.limit)
    if(select.limit < select.count || select.count === 0)
      store.get('catalog').setParams({limit: intersectionLimit})
  }, [intersectionLimit])
  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(_id => store.get('basket').addToBasket(_id), []),
    //Пагианция
    onPaginate: useCallback(page => store.get('catalog').setParams({page}), []),
    //Бесконечный скролл
    onIntersect: useCallback(() => setIntersectionLimit(prev => prev + 20), [])
  };
  const renders = {
    item: useCallback(item => (
      <Item item={item} onAdd={callbacks.addToBasket} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [t]),
  }

  return (
    <InfiniteScroller triggerIntersectionAt={0.95} onIntersection={callbacks.onIntersect}>
      <Spinner active={select.waiting}>
        <List items={select.items} renderItem={renders.item}/>
        <Pagination count={select.count} page={select.page} limit={select.limit} onChange={callbacks.onPaginate}/>
      </Spinner>
    </InfiniteScroller>
  );
}

export default React.memo(CatalogList);
