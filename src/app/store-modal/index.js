import React, {useCallback} from 'react';
import LayoutModal from '@src/components/layouts/layout-modal';
import useTranslate from '@src/hooks/use-translate';
import ToolsContainer from '@src/containers/tools';
import CatalogFilter from '@src/containers/catalog-filter';
import CatalogList from '@src/containers/catalog-list';
import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';

const StoreModal = () => {
  const {t} = useTranslate();

  const store = useStore();
  useInit(async () => {
    await Promise.all([
      store.get('catalog').initParams(),
      store.get('categories').load()
    ]);
  }, [], {backForward: true});

  const callbacks = {
    onClose: useCallback(() => store.get('modals').close(), [])
  }
  return (
    <LayoutModal onClose={callbacks.onClose} title={t('separateStore.title')} labelClose={t('separateStore.close')}>
      <ToolsContainer showMenu={false}/>
      <CatalogFilter/>
      <CatalogList/>
    </LayoutModal>
  );
};

export default React.memo(StoreModal);
