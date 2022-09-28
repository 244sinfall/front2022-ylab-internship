import React from 'react';
import propTypes from 'prop-types';
import Basket from '@src/app/basket';
import CatalogConfirmation from '@src/containers/catalog-confirmation';

/**
 * Компонент отрисовывает нужное модальное окно без контекста применения
 * @param props name имя модального окна, resultCallback коллбек, исполняемый модальным окном при положительном завершении
 */
const Modal = props => {
  switch (props.name) {
    case "basket": return <Basket/>
    case "confirm": return <CatalogConfirmation onAccept={confirmedValue => props.resultCallback(confirmedValue)}/>
    default: return <></>
  }
};

Modal.propTypes = {
  name: propTypes.string.isRequired,
  resultCallback: propTypes.func
};

Modal.defaultProps = {
  resultCallback: () => {}
}

export default React.memo(Modal);
