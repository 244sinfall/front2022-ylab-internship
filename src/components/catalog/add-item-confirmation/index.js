import React from 'react';
import propTypes from 'prop-types';
import {cn as bem} from "@bem-react/classname";
import './styles.css';
import Input from '@src/components/elements/input';


function AddConfirmation(props) {
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

AddConfirmation.propTypes = {
  value: propTypes.number.isRequired,
  onValueChange: propTypes.func.isRequired,
  onIncrement: propTypes.func.isRequired,
  onDecrement: propTypes.func.isRequired,
  onAccept: propTypes.func.isRequired,
  t: propTypes.func
}

AddConfirmation.defaultProps = {
  t: (text) => text
}

export default React.memo(AddConfirmation);
