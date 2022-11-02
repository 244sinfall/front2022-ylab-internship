import React from 'react';
import {cn as bem} from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import './styles.css';

interface BasketSimpleProps {
  onOpen: () => any,
  sum?: number,
  amount?: number
  t: (text: string, number?: number) => string
}

function BasketSimple(props: BasketSimpleProps) {
  const cn = bem('BasketSimple');
  return (
    <div className={cn()}>
      <span className={cn('label')}>{props.t('basket.inBasket')}:</span>
      <span className={cn('total')}>
      {props.amount
        ? `${props.amount} ${props.t('basket.articles', props.amount)} / ${numberFormat(props.sum ?? 0)} ₽`
        : props.t('basket.empty')
      }
      </span>
      <button className='BasketSimple__button' onClick={props.onOpen}>{props.t('basket.open')}</button>
    </div>
  )
}


export default React.memo(BasketSimple);
