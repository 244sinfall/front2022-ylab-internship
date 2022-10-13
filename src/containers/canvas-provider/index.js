import React, {useCallback, useEffect, useRef, useState} from 'react';
import CanvasWindow from '@src/components/canvas/canvas-window';
import useSelector from '@src/hooks/use-selector';
import draw from '@src/containers/canvas-provider/draw';
import useStore from '@src/hooks/use-store';
const CanvasProvider = () => {

  const canvas = useRef()
  // draw()
  const store = useStore();
  const select = useSelector(state => ({
    coords: state.canvas.coordinates,
    shapes: state.canvas.shapes
  }));

  const [drawnItems, setDrawnItems] = useState([])

  useEffect(() => {

    setDrawnItems(select.shapes.filter(shape => {
      return (shape.startCoordinates.x >= select.coords.x && shape.startCoordinates.y >= select.coords.y &&
        shape.startCoordinates.x + shape.size <= select.coords.x + 600 && shape.startCoordinates.y + shape.size <= select.coords.y + 600)
    }))
  }, [select.shapes, select.coords])

  useEffect(() => {
    const context = canvas.current.getContext("2d")
    if(canvas) {
      context.clearRect(0, 0, 600, 600)
      drawnItems.forEach(shape => draw(shape, select.coords, context))
    }
  }, [drawnItems, canvas, select.coords])

  const callbacks = {
    onWheel: useCallback((e) => {
      const direction = e.nativeEvent.wheelDeltaY > 0 ? "up" : "down"
      if(!e.nativeEvent.shiftKey) {
        store.get('canvas').moveCoordinates(direction)
      } else {
        console.log("scale")
      }
    }, [])
  }

  return (
    <CanvasWindow size={600} ref={canvas} onWheel={callbacks.onWheel}/>
  );
};

CanvasProvider.propTypes = {
};

export default React.memo(CanvasProvider);
