import React from 'react';
import {cn as bem} from '@bem-react/classname';
import propTypes from 'prop-types';
import './style.css'

const CatalogModalControls = props => {
  const cn = bem('CatalogModalControls');
  return (
    <div className={cn()}>
      {props.controls.map(c => <button key={c.labelName} onClick={c.labelCallback}>{c.labelName}</button>)}
    </div>
  );
};

CatalogModalControls.propTypes = {
  controls: propTypes.arrayOf(propTypes.shape({
    labelName: propTypes.string,
    labelCallback: propTypes.func
  })).isRequired
};

export default React.memo(CatalogModalControls);
