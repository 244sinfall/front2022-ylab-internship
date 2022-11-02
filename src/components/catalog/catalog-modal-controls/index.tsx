import React from 'react';
import {cn as bem} from '@bem-react/classname';
import './style.css'

interface CatalogModalControl {
  labelName: string,
  labelCallback: () => any
}
interface CatalogModalControlsProps {
  controls: CatalogModalControl[]
}

const CatalogModalControls = (props: CatalogModalControlsProps) => {
  const cn = bem('CatalogModalControls');
  return (
    <div className={cn()}>
      {props.controls.map(c => <button key={c.labelName} onClick={c.labelCallback}>{c.labelName}</button>)}
    </div>
  );
};

export default React.memo(CatalogModalControls);
