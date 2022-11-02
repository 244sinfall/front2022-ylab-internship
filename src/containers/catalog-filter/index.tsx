import React, {useCallback, useMemo} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import Input from "@src/components/elements/input";
import LayoutFlex from "@src/components/layouts/layout-flex";
import listToTree from "@src/utils/list-to-tree";
import treeToList from "@src/utils/tree-to-list";
import CustomSelect from '@src/components/elements/custom-select';
import CatalogState from "@src/store/catalog";
import {CatalogValues} from "@src/store/data-model/store/catalog";
import {Category} from "@src/store/data-model/store/categories";

interface CatalogFilterProps {
  catalogName?: string
}

function CatalogFilter(props: CatalogFilterProps) {
  const catalogName = (props.catalogName ? props.catalogName : "catalog") as keyof typeof store.state

  const store = useStore();
  const catalogModule = (store.modules[catalogName] as CatalogState)
  const select = useSelector(state => ({
    sort: (state[catalogName] as CatalogValues).params.sort,
    query: (state[catalogName] as CatalogValues).params.query,
    category: (state[catalogName] as CatalogValues).params.category,
    categories: state.categories.items,
  }));
  const {t} = useTranslate();

  const callbacks = {
    // Сортировка
    onSort: useCallback((sort: string) => catalogModule.setParams({sort}), []),
    // Поиск
    onSearch: useCallback((query: string) => catalogModule.setParams({query, page: 1}), []),
    // Сброс
    onReset: useCallback(() => catalogModule.resetParams(), []),
    // Фильтр по категории
    onCategory: useCallback((category: string) => catalogModule.setParams({category, page: 1}), []),
  };

  // Опции для полей
  const options = {
    sort: useMemo(() => ([
      {code: "ПО", value: 'order', title: 'По порядку'},
      {code: "ИМ", value: 'title.ru', title: 'По именованию'},
      {code: "ДО",value: '-price', title: 'Сначала дорогие'},
      {code: "ДР", value: 'edition', title: 'Древние'},
    ]), []),

    categories: useMemo(() => {
      return [
        {value: '', title: 'Все'},
        ...treeToList(
          listToTree(select.categories),
          (item: Category, level) => ({value: item._id, code: item.title.substring(0, 2).toUpperCase(), title: '- '.repeat(level) + item.title})
        )
      ]
    }, [select.categories]),
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

export default React.memo(CatalogFilter);
