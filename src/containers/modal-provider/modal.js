import React from 'react';
import propTypes from 'prop-types';
import Basket from '@src/app/basket';
import CatalogConfirmation from '@src/containers/catalog-confirmation';
import StoreModal from '@src/app/store-modal';
import AddExtraItemsModal from '@src/app/add-extra-items-modal';
import ArticleModal from '@src/app/article-modal';

/**
 * Компонент отрисовывает нужное модальное окно без контекста применения
 * @param props name имя модального окна, resultCallback коллбек, исполняемый модальным окном при положительном завершении
 */
const Modal = props => {
  switch (props.name) {
    case "basket": return <Basket/>
    case "confirm": return <CatalogConfirmation/>
    case "separateStore": return <StoreModal/>
    case "addExtraItems": return <AddExtraItemsModal/>
    case "article": return <ArticleModal params={props.params}/>
    default: return <></>
  }
};

Modal.propTypes = {
  name: propTypes.string.isRequired,
  params: propTypes.object
};

Modal.defaultProps = {
  params: {}
}

export default React.memo(Modal);
