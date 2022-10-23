import React from 'react';
import {cn as bem} from '@bem-react/classname';
import propTypes from 'prop-types';
import Input from '@src/components/elements/input';
import '../style.css'

const RectangleOptions = props => {
  const cn = bem('ShapeOptions');
  return (
    <div className={cn()}>
      <span className={cn('option')}>
        {props.t('canvas.startXCoordinate')}:
        <Input value={String(props.x1)} onChange={(value) => props.onFieldChange("x1", value)} type="number" theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.startYCoordinate')}:
        <Input value={String(props.y1)} onChange={(value) => props.onFieldChange("y1", value)} type="number" theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.color')}:
        <Input value={props.color} onChange={(value) => props.onFieldChange("color", value)} type="text" theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.fill')}:
        <input type={'checkbox'} defaultChecked={props.fill} onChange={(e) => props.onFieldChange("fill", e.target.checked)}/>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.width')}:
        <Input value={String(props.width)} onChange={(value) => props.onFieldChange("width", value)} type="number" theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t('canvas.height')}:
        <Input value={String(props.height)} onChange={(value) => props.onFieldChange("height", value)} type="number" theme="small"/>
      </span>
    </div>
  );
};

RectangleOptions.propTypes = {
  onFieldChange: propTypes.func.isRequired,
  t: propTypes.func
}

RectangleOptions.defaultProps = {
  t: (text) => text
}

export default React.memo(RectangleOptions);
