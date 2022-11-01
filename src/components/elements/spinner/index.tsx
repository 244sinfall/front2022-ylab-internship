import React from 'react';
import './style.css';

interface SpinnerProps {
  active: boolean,
  children: React.ReactNode | React.ReactNode[]
}

function Spinner(props: SpinnerProps) {
  if (props.active){
    return (
      <div className="Spinner">
        {props.children}
      </div>
    )
  } else {
    return <>{props.children}</>;
  }
}

export default React.memo(Spinner);
