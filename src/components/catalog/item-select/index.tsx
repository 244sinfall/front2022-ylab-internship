import React, {useCallback, useState} from 'react';
import {cn as bem} from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import './style.css';
import {CatalogItem} from "@src/store/data-model/shop";

interface ItemSelectProps {
  item: CatalogItem,
  selected?: boolean
  onClick?: (item: CatalogItem) => any,
  labelCurr?: string
}

/**
 * Компонент для добавления товаров из корзины.
 * Внутреннее состояние для клика, чтобы не перерендеривать все предметы в списке при изменениях
 */
function ItemSelect(props: ItemSelectProps) {
  const cn = bem('ItemSelect');
  const [clicked, setClicked] = useState(props.selected ?? false)
  const callbacks = {
    onClick: useCallback(() => {
      props.onClick && props.onClick(props.item)
      setClicked(prev => !prev)
    }, [props.onClick, props.item])
  };
  return (
    <div className={cn({clicked})} onClick={callbacks.onClick}>
      <div className={cn('title')}>
        {props.item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr ?? "₽"}</div>
      </div>
    </div>
  )
}

export default React.memo(ItemSelect);
