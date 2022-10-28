import React from 'react';
import {cn as bem} from "@bem-react/classname";
import CustomSelect from '@src/components/elements/custom-select';
import propTypes from 'prop-types';
import './style.css'
import {SketchPicker} from 'react-color';
const CanvasOptions = props => {
  const cn = bem('CanvasControls')
  return (
    <div className={cn()}>
      <span className={cn('draw')}>
        <CustomSelect value={props.selectedShape} onChange={props.onShapeSelectionChange} options={props.drawOptions}/>
        <label htmlFor="shouldFill">{props.t('canvas.shouldFill')}</label>
        <input id="shouldFill" type={'checkbox'} onChange={props.onFillCheck}/>
        <button onClick={props.onDraw} disabled={props.drawDisabled}>{props.t('canvas.draw')}</button>
      </span>
      <span className={cn('control')}>
        <button onClick={props.onRemoveAll}>{props.t('canvas.removeAll')}</button>
      </span>
      <SketchPicker className="color-picker" disableAlpha={true} color={props.color} onChangeComplete={props.onColorChange}/>
    </div>
  );
};

CanvasOptions.propTypes = {
  drawOptions: propTypes.arrayOf(propTypes.object).isRequired,
  color: propTypes.string,
  onDraw: propTypes.func.isRequired,
  onShapeSelectionChange: propTypes.func.isRequired,
  onRemoveAll: propTypes.func.isRequired,
  onFillCheck: propTypes.func,
  onColorChange: propTypes.func,
  selectedShape: propTypes.string.isRequired,
  drawDisabled: propTypes.bool.isRequired,
  t: propTypes.func.isRequired
};

export default React.memo(CanvasOptions);
