import React from 'react';
import {cn as bem} from "@bem-react/classname";
import './styles.css';
import Input from '@src/components/elements/input';

interface AddConfirmationProps {
  value: number,
  onValueChange: (value: string) => any,
  onIncrement: () => any,
  onDecrement: () => any,
  onAccept: () => any,
  t: (text: string) => string
}

function AddConfirmation(props: AddConfirmationProps) {
  const cn = bem('AddConfirmation');
  return (
    <div className={cn()}>
      <span className={cn('label')}>{props.t('confirmation.label')}:</span>
      <span className={cn('value-controls')}>
        <button onClick={props.onIncrement}>+</button>
        <Input value={String(props.value)} onChange={(value) => props.onValueChange(value)} type="number" theme="small"/>
        <button onClick={props.onDecrement}>-</button>
      </span>
      <span className={cn('controls')}>
        <button onClick={props.onAccept}>{props.t('confirmation.add')}</button>
      </span>
    </div>
  )
}

export default React.memo(AddConfirmation);
