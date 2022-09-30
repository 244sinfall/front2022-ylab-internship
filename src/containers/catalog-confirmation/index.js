import React, {useState} from 'react';
import LayoutModal from '@src/components/layouts/layout-modal';
import AddConfirmation from '@src/components/catalog/add-item-confirmation';
import propTypes from 'prop-types';
import useTranslate from '@src/hooks/use-translate';
import useStore from '@src/hooks/use-store';

const CatalogConfirmation = (props) => {
  const [currentAmount, setCurrentAmount] = useState(1)

  const store = useStore();

  const callbacks = {
    close: () => store.get('modals').close(),
    valueChange: (newValue) => {
      let newValueInt = parseInt(newValue)
      if(isNaN(newValueInt) || newValueInt < 0) newValueInt = 0
      setCurrentAmount(newValueInt)
    },
    increment: () => setCurrentAmount(prev => prev + 1),
    decrement: () => setCurrentAmount(prev => prev === 0 ? 0 : prev - 1),
  }

  const {t} = useTranslate();

  return (
    <LayoutModal title={t('confirmation.title')} onClose={callbacks.close} labelClose={t('confirmation.close')} theme="small">
      <AddConfirmation onDecrement={callbacks.decrement} t={t} value={currentAmount}
                       onAccept={() => props.onAccept(currentAmount)}
                       onValueChange={callbacks.valueChange}
                       onIncrement={callbacks.increment}/>
    </LayoutModal>
  );
};

CatalogConfirmation.propTypes = {
  onAccept: propTypes.func.isRequired,
}

export default React.memo(CatalogConfirmation);
