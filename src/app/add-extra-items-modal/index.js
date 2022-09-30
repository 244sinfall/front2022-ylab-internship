import React, {useCallback} from 'react';
import LayoutModal from '@src/components/layouts/layout-modal';
import useTranslate from '@src/hooks/use-translate';
import CatalogFilter from '@src/containers/catalog-filter';
import CatalogList from '@src/containers/catalog-list';
import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';
import useSeparateCatalog from '@src/hooks/use-separate-catalog';
import ItemSelect from '@src/components/catalog/item-select';

/**
 * Модальное окно для добавления товаров из корзины. Компонент позволяет выделять товары кликом.
 */
const AddExtraItemsModal = () => {
  const {t} = useTranslate();
  const catalogName = useSeparateCatalog()
  let selected = []
  const store = useStore();
  useInit(async () => {
    await Promise.all([
      store.get(catalogName).initParams(),
      store.get('categories').load()
    ]);
  }, [], {backForward: true});
  const callbacks = {
    onClose: useCallback(() => store.get('modals').close(selected), [selected]),
    onItemClick: useCallback(item => {
        const existId = selected.findIndex(i => i._id === item._id)
        existId !== -1 ? selected.splice(existId, 1) : selected.push(item)
    }, [selected])
  }
  const renderFunction = useCallback(item => (
      <ItemSelect item={item} selected={selected.findIndex(i => i._id === item._id) !== -1} onClick={callbacks.onItemClick}/>
    ), [])
  return (
    <LayoutModal onClose={callbacks.onClose} title={t('addExtraItems.title')} labelClose={t('addExtraItems.close')}>
      <CatalogFilter catalogName={catalogName}/>
      <CatalogList catalogName={catalogName} renderFunction={renderFunction}/>
    </LayoutModal>
  );
};

export default React.memo(AddExtraItemsModal);
