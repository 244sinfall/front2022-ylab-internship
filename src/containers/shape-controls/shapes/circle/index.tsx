import React from 'react';
import {cn as bem} from '@bem-react/classname';
import Input from '@src/components/elements/input';
import '../style.css'
import {ShapeOptionsProps} from "@src/containers/shape-controls/exports";

const CircleOptions = (props: ShapeOptionsProps) => {
  const cn = bem('ShapeOptions');
  return (
    <div className={cn()}>
      <span className={cn('option')}>
        {props.t('canvas.startXCoordinate')}:
        <Input value={String(props.info.x1)} onChange={(value) => props.onFieldChange("x1", value)} type="number" theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.startYCoordinate')}:
        <Input value={String(props.info.y1)} onChange={(value) => props.onFieldChange("y1", value)} type="number" theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.color')}:
        <Input value={props.info.color} onChange={(value) => props.onFieldChange("color", value)} type="text" theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.fill')}:
        <input type={'checkbox'} defaultChecked={props.info.fill} onChange={(e) => props.onFieldChange("fill", e.target.checked)}/>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.radius')}:
        <Input value={String(props.info.radius)} onChange={(value) => props.onFieldChange("radius", value)} type="number" theme="small"/>
      </span>
    </div>
  );
};


export default React.memo(CircleOptions);
