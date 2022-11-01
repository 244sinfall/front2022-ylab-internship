import React from 'react';
import {cn as bem} from "@bem-react/classname";
import './style.css';

interface ListProps {
  items: any[]
  renderItem: (item: any, idx: number) => React.ReactNode
  idSpreader?: string
}

function List(props: ListProps) {
  const cn = bem('List');
  return (
    <div className={cn()}>{props.items.map((item, idx) =>
      <div key={`${item._id}-${props.idSpreader ?? "catalog"}-${Math.random()*10000}`} className={cn('item')}>
        {props.renderItem(item, idx)}
      </div>
    )}
    </div>
  )
}

export default React.memo(List);
