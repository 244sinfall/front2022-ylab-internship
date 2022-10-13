import React from 'react';
import propTypes from 'prop-types';
import './style.css'
const CanvasWindow = React.forwardRef((props, ref) => {
  return (
    <div className="CanvasContainer">
      <canvas width={props.size} height={props.size} ref={ref} onWheel={props.onWheel}></canvas>
    </div>
  );
})

CanvasWindow.propTypes = {
  onWheel: propTypes.func,
  size: propTypes.number.isRequired
};

export default CanvasWindow
