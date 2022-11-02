import React from 'react';
import {cn as bem} from "@bem-react/classname";
import CustomSelect from '@src/components/elements/custom-select';
import './style.css'
import {ColorChangeHandler, SketchPicker} from 'react-color';
import {CustomSelectOption} from "@src/store/data-model/components/custom-select";

interface CanvasOptionsProps {
  drawOptions: CustomSelectOption[],
  color: string,
  onDraw: () => any,
  onShapeSelectionChange: (e: any) => any,
  onRemoveAll: () => any,
  onFillCheck: (e: any) => any,
  onColorChange: ColorChangeHandler,
  selectedShape: string,
  drawDisabled: boolean,
  t: (text: string) => string
}

const CanvasOptions = (props: CanvasOptionsProps) => {
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

export default React.memo(CanvasOptions);
