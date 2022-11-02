import React, {useCallback, useMemo} from 'react';
import LayoutModal from '@src/components/layouts/layout-modal';
import useTranslate from '@src/hooks/use-translate';
import CatalogFilter from '@src/containers/catalog-filter';
import CatalogList from '@src/containers/catalog-list';
import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';
import useSeparateCatalog from '@src/hooks/use-separate-catalog';
import ItemSelect from '@src/components/catalog/item-select';
import CatalogModalControls from '@src/components/catalog/catalog-modal-controls';
import {CatalogItem} from "@src/store/data-model/shop";
import CatalogState from "@src/store/catalog";

/**
 * Модальное окно для добавления товаров из корзины. Компонент позволяет выделять товары кликом.
 */
const AddExtraItemsModal = () => {
  const {t} = useTranslate();
  const catalogName = useSeparateCatalog() as keyof typeof store.modules
  let selected: CatalogItem[] = []
  const store = useStore();
  useInit(async () => {
    await Promise.all([
      (store.modules[catalogName] as CatalogState).initParams(),
      store.modules.categories.load()
    ]);
  }, [], {backForward: true});
  const callbacks = {
    onClose: useCallback(() => store.modules.modals.close(), []),
    onItemClick: useCallback((item: CatalogItem) => {
        const existId = selected.findIndex(i => i._id === item._id)
        existId !== -1 ? selected.splice(existId, 1) : selected.push(item)
    }, [selected]),
    onCloseAdd: useCallback(() => store.modules.modals.close(selected), [selected]),
  }
  const renderFunction = useCallback((item: CatalogItem) => (
      <ItemSelect item={item} selected={selected.findIndex(i => i._id === item._id) !== -1} onClick={callbacks.onItemClick}/>
    ), [])
  const controls = useMemo(() => {
    return [
      {labelName: t("addExtraItems.add"), labelCallback: callbacks.onCloseAdd}
    ]
  }, [t])
  return (
    <LayoutModal onClose={callbacks.onClose} title={t('addExtraItems.title')} labelClose={t('addExtraItems.close')}>
      <CatalogFilter catalogName={catalogName}/>
      <CatalogModalControls controls={controls}/>
      <CatalogList catalogName={catalogName} renderFunction={renderFunction}/>
    </LayoutModal>
  );
};

export default React.memo(AddExtraItemsModal);
