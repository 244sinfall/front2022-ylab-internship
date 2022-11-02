import React, {ForwardedRef, useCallback} from 'react';
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import numberFormat from "@src/utils/number-format";
import './style.css';
import {CatalogItem} from "@src/store/data-model/shop";

interface ItemProps {
  item: CatalogItem,
  onAdd?: (itemId: string) => any,
  link?: string,
  labelCurr?: string,
  labelAdd?: string
}

const Item = React.forwardRef((props: ItemProps, ref: ForwardedRef<HTMLDivElement>) => {
  const cn = bem('Item');

  const callbacks = {
    onAdd: useCallback(() => props.onAdd && props.onAdd(props.item._id), [props.onAdd, props.item])
  };

  return (
    <div className={cn()} ref={ref}>
      <div className={cn('title')}>
        {props.link ? <Link to={props.link}>{props.item.title}</Link> : props.item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr ?? "₽"}</div>
        <button onClick={callbacks.onAdd}>{props.labelAdd ?? "Добавить"}</button>
      </div>
    </div>
  )
})

export default React.memo(Item);
