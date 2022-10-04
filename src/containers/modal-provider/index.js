import React from 'react';
import useSelector from "@src/hooks/use-selector";
import * as modals from './exports'

/**
 * Отдельный компонент для верхнего уровня приложений, который инкапсулирует логику каскадного показа модалок
 */
const ModalProvider = () => {
  const openedModals = useSelector(state => state.modals.opened);
  return (
    <>
      {openedModals.map(modalInfo => {
        const Component = modals[modalInfo.name]
        return <Component key={modalInfo.name} {...modalInfo.params}/>
      })}
      </>
  );
};

export default React.memo(ModalProvider);
