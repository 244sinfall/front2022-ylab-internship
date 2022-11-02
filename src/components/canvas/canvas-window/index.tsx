import React, {ForwardedRef} from 'react';
import './style.css'

interface CanvasWindowProps {
  size: number
}
const CanvasWindow = React.forwardRef((props: CanvasWindowProps, ref: ForwardedRef<HTMLCanvasElement>) => {
  return (
    <div className="CanvasContainer">
      <canvas width={props.size} height={props.size} ref={ref}></canvas>
    </div>
  );
})

export default React.memo(CanvasWindow)
