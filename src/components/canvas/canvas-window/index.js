import React from 'react';
import propTypes from 'prop-types';
import './style.css'
const CanvasWindow = React.forwardRef((props, ref) => {
  const startMousePos = {x: 0, y: 0}
  return (
    <div className="CanvasContainer" onMouseDown={e => {
      startMousePos.x = e.clientX
      startMousePos.y = e.clientY
    }} onMouseUp={e => {
      props.onDrag({
        x: e.clientX - startMousePos.x,
        y: e.clientY - startMousePos.y,
      })
    }}>
      <canvas width={props.size} height={props.size} ref={ref} onWheel={props.onWheel}></canvas>
    </div>
  );
})

CanvasWindow.propTypes = {
  onWheel: propTypes.func,
  onDrag: propTypes.func,
  size: propTypes.number.isRequired
};

export default CanvasWindow
