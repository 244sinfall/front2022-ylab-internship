import React, {useCallback} from 'react';
import numberFormat from "@src/utils/number-format";
import {cn as bem} from "@bem-react/classname";
import './styles.css';
import {BasketItem} from "@src/store/data-model/shop";

interface ItemBasketProps {
  item: BasketItem,
  onRemove?: (itemId: string) => any,
  onClick?: (itemId: string) => any,
  labelCurr?: string,
  labelDelete?: string,
  labelUnit?: string
}

function ItemBasket(props: ItemBasketProps) {
  const cn = bem('ItemBasket');

  const callbacks = {
    onRemove: useCallback(() => props.onRemove && props.onRemove(props.item._id), [props.onRemove, props.item]),
    onClick: useCallback(() => props.onClick && props.onClick(props.item._id), [props.onClick, props.item])
  };

  return (
    <div className={cn()}>
      <div className={cn('title')} onClick={callbacks.onClick}>
        {props.item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('cell')}>{numberFormat(props.item.price)} {props.labelCurr ?? "₽"}</div>
        <div className={cn('cell')}>{numberFormat(props.item.amount || 0)} {props.labelUnit ?? "шт"}</div>
        <div className={cn('cell')}>
          <button onClick={callbacks.onRemove}>{props.labelDelete ?? "Удалить"}</button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ItemBasket);
