import React from 'react';
import {cn as bem} from '@bem-react/classname';
import Input from '@src/components/elements/input';
import '../style.css'
import {ShapeOptionsProps} from "@src/containers/shape-controls/exports";

const TriangleOptions = (props: ShapeOptionsProps) => {
  const cn = bem('ShapeOptions');
  return (
    <div className={cn()}>
      <span className={cn('option')}>
        {props.t('canvas.point') + " A"}:
        <span>x:<Input value={String(props.info.pointA.x)} onChange={(value) => props.onFieldChange("pointA.x", value)} type="number" theme="small"/></span>
        <span>y:<Input value={String(props.info.pointA.y)} onChange={(value) => props.onFieldChange("pointA.x", value)} type="number" theme="small"/></span>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.point') + " B"}:
        <span>x:<Input value={String(props.info.pointB.x)} onChange={(value) => props.onFieldChange("pointB.x", value)} type="number" theme="small"/></span>
        <span>y:<Input value={String(props.info.pointB.y)} onChange={(value) => props.onFieldChange("pointB.x", value)} type="number" theme="small"/></span>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.point') + " C"}:
        <span>x:<Input value={String(props.info.pointC.x)} onChange={(value) => props.onFieldChange("pointC.x", value)} type="number" theme="small"/></span>
        <span>y:<Input value={String(props.info.pointC.y)} onChange={(value) => props.onFieldChange("pointC.x", value)} type="number" theme="small"/></span>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.color')}:
        <Input value={props.info.color} onChange={(value) => props.onFieldChange("color", value)} type="text" theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.fill')}:
        <input type={'checkbox'} defaultChecked={props.info.fill} onChange={(e) => props.onFieldChange("fill", e.target.checked)}/>
      </span>
    </div>
  );
};

export default React.memo(TriangleOptions);
