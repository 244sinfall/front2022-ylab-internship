import React from 'react';
import numberFormat from "@src/utils/number-format";
import './styles.css';

interface BasketTotalProps {
  sum?: number,
  onAddMore?: () => any,
  t: (text: string) => string
}

function BasketTotal(props: BasketTotalProps) {
  return (
    <div className="BasketTotal">
      <span className="BasketTotal-cell">{props.t('basket.total')}</span>
      <span className="BasketTotal-cell"> {numberFormat(props.sum ?? 0)} ₽</span>
      <span className="BasketTotal-cell"></span>
      <button onClick={props.onAddMore}>{props.t('basket.addMore')}</button>
    </div>
  )
}

export default React.memo(BasketTotal);
