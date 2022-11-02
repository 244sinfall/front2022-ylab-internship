import React, {useCallback} from 'react';
import {cn as bem} from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import './style.css';
import {CatalogItem} from "@src/store/data-model/shop";

interface ItemModalProps {
  item: CatalogItem,
  onAdd?: (itemId: string) => any,
  onClick?: (itemId: string) => any,
  labelCurr?: string,
  labelAdd?: string
}

function ItemModal(props: ItemModalProps) {
  const cn = bem('ItemModal');

  const callbacks = {
    onAdd: useCallback(() => props.onAdd && props.onAdd(props.item._id), [props.onAdd, props.item])
  };

  return (
    <div className={cn()}>
      <div className={cn('title')} onClick={() => props.onClick && props.onClick(props.item._id)}>
        {props.item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr ?? "₽"}</div>
        <button onClick={callbacks.onAdd}>{props.labelAdd ?? "Добавить"}</button>
      </div>
    </div>
  )
}

export default React.memo(ItemModal);
