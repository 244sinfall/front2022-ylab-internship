import React, {useCallback} from 'react';
import propTypes from 'prop-types';
import numberFormat from "@src/utils/number-format";
import {cn as bem} from "@bem-react/classname";
import './styles.css';

function ItemBasket(props) {
  const cn = bem('ItemBasket');

  const callbacks = {
    onRemove: useCallback(() => props.onRemove(props.item._id), [props.onRemove, props.item])
  };

  return (
    <div className={cn()}>
      <div className={cn('title')} onClick={() => props.onClick(props.item._id)}>
        {props.item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('cell')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        <div className={cn('cell')}>{numberFormat(props.item.amount || 0)} {props.labelUnit}</div>
        <div className={cn('cell')}>
          <button onClick={callbacks.onRemove}>{props.labelDelete}</button>
        </div>
      </div>
    </div>
  )
}

ItemBasket.propTypes = {
  item: propTypes.object.isRequired,
  onRemove: propTypes.func,
  onClick: propTypes.func,
  labelCurr: propTypes.string,
  labelDelete: propTypes.string,
  labelUnit: propTypes.string,
}

ItemBasket.defaultProps = {
  onClick: () => {},
  labelCurr: '₽',
  labelUnit: 'шт',
  labelDelete: 'Удалить',
}

export default React.memo(ItemBasket);
