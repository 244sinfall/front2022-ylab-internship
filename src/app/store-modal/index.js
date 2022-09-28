import React, {useCallback} from 'react';
import LayoutModal from '@src/components/layouts/layout-modal';
import useTranslate from '@src/hooks/use-translate';
import {useStore as useStoreRedux} from 'react-redux';
import actionsModals from "@src/store-redux/modals/actions";
import ToolsContainer from '@src/containers/tools';
import CatalogFilter from '@src/containers/catalog-filter';
import CatalogList from '@src/containers/catalog-list';

const StoreModal = () => {
  const {t} = useTranslate();
  const storeRedux = useStoreRedux();
  const callbacks = {
    onClose: useCallback(() => storeRedux.dispatch(actionsModals.close()), [])
  }
  return (
    <LayoutModal onClose={callbacks.onClose} title={t('separateStore.title')} labelClose={t('separateStore.close')}>
      <ToolsContainer/>
      <CatalogFilter/>
      <CatalogList/>
    </LayoutModal>
  );
};

export default React.memo(StoreModal);
