import React, {useCallback} from 'react';
import propTypes from 'prop-types';
import {cn as bem} from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import './style.css';

function ItemModal(props) {
  const cn = bem('ItemModal');

  const callbacks = {
    onAdd: useCallback(() => props.onAdd(props.item._id), [props.onAdd, props.item])
  };

  return (
    <div className={cn()}>
      <div className={cn('title')} onClick={() => props.onClick(props.item._id)}>
        {props.item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        <button onClick={callbacks.onAdd}>{props.labelAdd}</button>
      </div>
    </div>
  )
}

ItemModal.propTypes = {
  item: propTypes.object.isRequired,
  onAdd: propTypes.func,
  onClick: propTypes.func,
  labelCurr: propTypes.string,
  labelAdd: propTypes.string
}

ItemModal.defaultProps = {
  onAdd: () => {},
  onClick: () => {},
  labelCurr: '₽',
  labelAdd: 'Добавить'
}

export default React.memo(ItemModal);
