import React from 'react';
import {cn as bem} from "@bem-react/classname";
import CustomSelect from '@src/components/elements/custom-select';
import propTypes from 'prop-types';
import './style.css'
const CanvasOptions = props => {
  const cn = bem('CanvasControls')
  return (
    <div className={cn()}>
      <span className={cn('draw')}>
        <CustomSelect value={props.selectedShape} onChange={props.onShapeSelectionChange} options={props.drawOptions}/>
        <button onClick={props.onDraw} disabled={props.drawDisabled}>{props.t('canvas.draw')}</button>
      </span>
      <span className={cn('control')}>
        <button onClick={props.onAnimate}>{props.t('canvas.animate')}</button>
        <button onClick={props.onRemoveAll}>{props.t('canvas.removeAll')}</button>
      </span>
    </div>
  );
};

CanvasOptions.propTypes = {
  drawOptions: propTypes.arrayOf(propTypes.object).isRequired,
  onDraw: propTypes.func.isRequired,
  onShapeSelectionChange: propTypes.func.isRequired,
  onAnimate: propTypes.func.isRequired,
  onRemoveAll: propTypes.func.isRequired,
  selectedShape: propTypes.string.isRequired,
  drawDisabled: propTypes.bool.isRequired,
  t: propTypes.func.isRequired
};

export default React.memo(CanvasOptions);
