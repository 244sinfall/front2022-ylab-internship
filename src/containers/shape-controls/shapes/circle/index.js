import React from 'react';
import {cn as bem} from '@bem-react/classname';
import propTypes from 'prop-types';
import Input from '@src/components/elements/input';
import '../style.css'

const CircleOptions = props => {
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
        {props.t('canvas.radius')}:
        <Input value={String(props.radius)} onChange={(value) => props.onFieldChange("radius", value)} type="number" theme="small"/>
      </span>
    </div>
  );
};

CircleOptions.propTypes = {
  onFieldChange: propTypes.func.isRequired,
  t: propTypes.func
}

CircleOptions.defaultProps = {
  t: (text) => text
}

export default React.memo(CircleOptions);
