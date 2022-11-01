import React from 'react';
import {cn as bem} from "@bem-react/classname";
import './style.css';

interface FieldProps {
  label?: React.ReactNode | React.ReactNode[]
  children?: React.ReactNode | React.ReactNode[]
  error?: React.ReactNode | React.ReactNode[]
}

function Field(props: FieldProps){
  const cn = bem('Field');

  return (
    <div className={cn()}>
      <label className={cn('label')}>{props.label}</label>
      <div className={cn('input')}>
        {props.children}
      </div>
      <div className={cn('error')}>
        {props.error}
      </div>
    </div>
  )
}

export default React.memo(Field);
