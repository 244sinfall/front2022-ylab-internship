import React, {useCallback, useEffect, useRef} from 'react';
import CanvasWindow from '@src/components/canvas/canvas-window';
import useSelector from '@src/hooks/use-selector';
import draw from '@src/containers/canvas-provider/draw';
const CanvasProvider = () => {

  const canvas = useRef()
  // draw()
  const select = useSelector(state => ({
    coords: state.canvas.coordinates,
    shapes: state.canvas.shapes
  }));
  useEffect(() => {
    const context = canvas.current.getContext('2d')
    if(context) {
      select.shapes.forEach(shape => {
        console.log(shape, context)
        draw(shape, context)
      })
    }

  }, [canvas, select.shapes])
  const callbacks = {
    onWheel: useCallback(() => console.log('wheel'), [])
  }

  return (
    <CanvasWindow size={600} ref={canvas} onWheel={callbacks.onWheel}/>
  );
};

CanvasProvider.propTypes = {
};

export default React.memo(CanvasProvider);
