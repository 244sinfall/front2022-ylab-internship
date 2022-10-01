import React, {useCallback} from 'react';
import LayoutModal from '@src/components/layouts/layout-modal';
import useTranslate from '@src/hooks/use-translate';
import ToolsContainer from '@src/containers/tools';
import CatalogFilter from '@src/containers/catalog-filter';
import CatalogList from '@src/containers/catalog-list';
import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';
import useSeparateCatalog from '@src/hooks/use-separate-catalog';
import ItemModal from '@src/components/catalog/item-modal';

const StoreModal = () => {
  const {t} = useTranslate();
  const catalogName = useSeparateCatalog()
  const store = useStore();
  useInit(async () => {
    await Promise.all([
      store.get(catalogName).initParams(),
      store.get('categories').load()
    ]);
  }, [], {backForward: true});
  const callbacks = {
    onClose: useCallback(() => store.get('modals').close(), []),
    onItemInspect: useCallback(_id => store.get('modals').open('article', { id: _id }), []),
    // Открытие модалки добавления в корзину
    addConfirmation: useCallback(async(_id) => {
      const result = await store.get('modals').open('confirm')
      if(!isNaN(result) && result >= 1) store.get('basket').addToBasket(_id, result)
    }, []),
  }
  const renderFunction = useCallback(item => (
    <ItemModal item={item} onAdd={callbacks.addConfirmation} labelAdd={t('article.add')} onClick={callbacks.onItemInspect}/>
  ), [])
  return (
    <LayoutModal onClose={callbacks.onClose} title={t('separateStore.title')} labelClose={t('separateStore.close')}>
      <ToolsContainer showMenu={false}/>
      <CatalogFilter catalogName={catalogName}/>
      <CatalogList catalogName={catalogName} renderFunction={renderFunction}/>
    </LayoutModal>
  );
};

export default React.memo(StoreModal);
