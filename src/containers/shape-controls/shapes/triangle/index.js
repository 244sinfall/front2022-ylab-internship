import React from 'react';
import {cn as bem} from '@bem-react/classname';
import propTypes from 'prop-types';
import Input from '@src/components/elements/input';
import '../style.css'

const TriangleOptions = props => {
  const cn = bem('ShapeOptions');
  return (
    <div className={cn()}>
      <span className={cn('option')}>
        {props.t('canvas.point') + " A"}:
        <span>x:<Input value={String(props.pointA.x)} onChange={(value) => props.onFieldChange("pointA.x", value)} type="number" theme="small"/></span>
        <span>y:<Input value={String(props.pointA.y)} onChange={(value) => props.onFieldChange("pointA.x", value)} type="number" theme="small"/></span>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.point') + " B"}:
        <span>x:<Input value={String(props.pointB.x)} onChange={(value) => props.onFieldChange("pointB.x", value)} type="number" theme="small"/></span>
        <span>y:<Input value={String(props.pointB.y)} onChange={(value) => props.onFieldChange("pointB.x", value)} type="number" theme="small"/></span>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.point') + " C"}:
        <span>x:<Input value={String(props.pointC.x)} onChange={(value) => props.onFieldChange("pointC.x", value)} type="number" theme="small"/></span>
        <span>y:<Input value={String(props.pointC.y)} onChange={(value) => props.onFieldChange("pointC.x", value)} type="number" theme="small"/></span>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.color')}:
        <Input value={props.color} onChange={(value) => props.onFieldChange("color", value)} type="text" theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.fill')}:
        <input type={'checkbox'} defaultChecked={props.fill} onChange={(e) => props.onFieldChange("fill", e.target.checked)}/>
      </span>
    </div>
  );
};

TriangleOptions.propTypes = {
  onFieldChange: propTypes.func.isRequired,
  t: propTypes.func
}

TriangleOptions.defaultProps = {
  t: (text) => text
}

export default TriangleOptions;
