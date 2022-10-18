import React from 'react';
import propTypes from 'prop-types';
import './style.css'
const CanvasWindow = React.forwardRef((props, ref) => {
  let isMoving = false
  const startMousePos = {x: 0, y: 0}
  return (
    <div className="CanvasContainer">
      <canvas width={props.size} height={props.size} ref={ref} onWheel={props.onWheel} onMouseDown={e =>  {
        startMousePos.x = e.clientX
        startMousePos.y = e.clientY
        isMoving = true
      }} onMouseMove={e => {
        if(isMoving) {
          props.onDrag({
            x: e.clientX - startMousePos.x,
            y: e.clientY - startMousePos.y
          })
          startMousePos.x = e.clientX
          startMousePos.y = e.clientY
        }
      }} onMouseUp={() => isMoving = false }></canvas>
    </div>
  );
})

CanvasWindow.propTypes = {
  onWheel: propTypes.func,
  onDrag: propTypes.func,
  size: propTypes.number.isRequired
};

export default React.memo(CanvasWindow)
