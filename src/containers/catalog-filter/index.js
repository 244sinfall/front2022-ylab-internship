import React, {useCallback, useMemo} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import Input from "@src/components/elements/input";
import LayoutFlex from "@src/components/layouts/layout-flex";
import listToTree from "@src/utils/list-to-tree";
import treeToList from "@src/utils/tree-to-list";
import CustomSelect from '@src/components/elements/custom-select';
import propTypes from 'prop-types';

function CatalogFilter(props) {

  const store = useStore();

  const select = useSelector(state => ({
    sort: state[props.catalogName].params.sort,
    query: state[props.catalogName].params.query,
    category: state[props.catalogName].params.category,
    categories: state.categories.items,
  }));
  const {t} = useTranslate();

  const callbacks = {
    // Сортировка
    onSort: useCallback(sort => store.get(props.catalogName).setParams({sort}), []),
    // Поиск
    onSearch: useCallback(query => store.get(props.catalogName).setParams({query, page: 1}), []),
    // Сброс
    onReset: useCallback(() => store.get(props.catalogName).resetParams(), []),
    // Фильтр по категории
    onCategory: useCallback(category => store.get(props.catalogName).setParams({category}), []),
  };

  // Опции для полей
  const options = {
    sort: useMemo(() => ([
      {code: "ПО", value: 'order', title: 'По порядку'},
      {code: "ИМ", value: 'title.ru', title: 'По именованию'},
      {code: "ДО",value: '-price', title: 'Сначала дорогие'},
      {code: "ДР", value: 'edition', title: 'Древние'},
    ]), []),

    categories: useMemo(() => [
      {value: '', title: 'Все'},
      ...treeToList(
        listToTree(select.categories),
        (item, level) => ({value: item._id, code: item.title.substring(0, 2).toUpperCase(), title: '- '.repeat(level) + item.title})
      )
    ], [select.categories]),
  }
  return (
    <LayoutFlex flex="start" indent="big">
      <CustomSelect onChange={callbacks.onCategory} value={select.category} options={options.categories}/>
      <CustomSelect onChange={callbacks.onSort} value={select.sort} options={options.sort}/>
      <Input onChange={callbacks.onSearch} value={select.query} placeholder={'Поиск'} theme="big"/>
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </LayoutFlex>
  );
}

CatalogFilter.propTypes = {
  catalogName: propTypes.string,
}

CatalogFilter.defaultProps = {
  catalogName: "catalog",
}

export default React.memo(CatalogFilter);
