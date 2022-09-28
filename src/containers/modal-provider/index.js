import React from 'react';
import {useSelector as useSelectorRedux} from 'react-redux';
import Modal from '@src/containers/modal-provider/modal';

/**
 * Отдельный компонент для верхнего уровня приложений, который инкапсулирует логику каскадного показа модалок
 */
const ModalProvider = () => {
  const openedModals = useSelectorRedux(state => state.modals.opened);
  return (
    <>
      {openedModals.map(modalInfo => <Modal key={modalInfo.name} name={modalInfo.name} resultCallback={modalInfo.resultCallback}/>)}
    </>
  );
};

export default React.memo(ModalProvider);
