import React from 'react';
import useSelector from "@src/hooks/use-selector";
import * as modals from './exports'
import {ModalWindow} from "@src/store/data-model/store/modals";

/**
 * Отдельный компонент для верхнего уровня приложений, который инкапсулирует логику каскадного показа модалок
 */
const ModalProvider = () => {
  const openedModals = useSelector(state => state.modals.opened) as ModalWindow[];
  return (
    <>
      {openedModals.map(modalInfo => {
        const Component = modals[modalInfo.name as keyof typeof modals]
        return <Component key={modalInfo.name} {...modalInfo.params}/>
      })}
      </>
  );
};

export default React.memo(ModalProvider);
