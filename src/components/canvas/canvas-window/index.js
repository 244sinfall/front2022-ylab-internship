import React from 'react';
import propTypes from 'prop-types';
import './style.css'
const CanvasWindow = React.forwardRef((props, ref) => {
  return (
    <div className="CanvasContainer">
      <canvas width={props.size} height={props.size} ref={ref}></canvas>
    </div>
  );
})

CanvasWindow.propTypes = {
  size: propTypes.number.isRequired
};

export default React.memo(CanvasWindow)
