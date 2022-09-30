import React, {useCallback, useState} from 'react';
import propTypes from 'prop-types';
import {cn as bem} from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import './style.css';

/**
 * Компонент для добавления товаров из корзины.
 * Внутреннее состояние для клика, чтобы не перерендеривать все предметы в списке при изменениях
 */
function ItemSelect(props) {
  const cn = bem('ItemSelect');
  const [clicked, setClicked] = useState(props.selected)
  const callbacks = {
    onClick: useCallback(() => {
      props.onClick(props.item)
      setClicked(prev => !prev)
    }, [props.onClick, props.item])
  };
  return (
    <div className={cn({clicked})} onClick={callbacks.onClick}>
      <div className={cn('title')}>
        {props.item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
      </div>
    </div>
  )
}

ItemSelect.propTypes = {
  item: propTypes.object.isRequired,
  selected: propTypes.bool,
  onClick: propTypes.func,
  labelCurr: propTypes.string,
}

ItemSelect.defaultProps = {
  onClick: () => {},
  selected: false,
  labelCurr: '₽',
}

export default React.memo(ItemSelect);
