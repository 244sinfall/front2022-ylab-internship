import React, {useState} from 'react';
import LayoutModal from '@src/components/layouts/layout-modal';
import AddConfirmation from '@src/components/catalog/add-item-confirmation';
import useTranslate from '@src/hooks/use-translate';
import useStore from '@src/hooks/use-store';

const CatalogConfirmation = () => {
  const [currentAmount, setCurrentAmount] = useState(1)

  const store = useStore();

  const callbacks = {
    close: (res = 0) => store.modules.modals.close(res),
    valueChange: (newValue: string) => {
      let newValueInt = parseInt(newValue)
      if(isNaN(newValueInt) || newValueInt < 0) newValueInt = 0
      if(newValueInt > 1000) newValueInt = 1000
      setCurrentAmount(newValueInt)
    },
    increment: () => setCurrentAmount(prev => prev + 1),
    decrement: () => setCurrentAmount(prev => prev === 0 ? 0 : prev - 1),
  }

  const {t} = useTranslate();

  return (
    <LayoutModal title={t('confirmation.title')} onClose={callbacks.close} labelClose={t('confirmation.close')} theme="small">
      <AddConfirmation onDecrement={callbacks.decrement} t={t} value={currentAmount}
                       onAccept={() => callbacks.close(currentAmount)}
                       onValueChange={callbacks.valueChange}
                       onIncrement={callbacks.increment}/>
    </LayoutModal>
  );
};


export default React.memo(CatalogConfirmation);
