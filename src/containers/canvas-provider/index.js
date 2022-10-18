import React, {useCallback, useEffect, useRef, useState} from 'react';
import CanvasWindow from '@src/components/canvas/canvas-window';
import useSelector from '@src/hooks/use-selector';
import draw from '@src/containers/canvas-provider/draw';
import useStore from '@src/hooks/use-store';
import animateFreeFall from '@src/containers/canvas-provider/animate-freefall';

const CanvasProvider = () => {
  const canvas = useRef()
  const store = useStore();
  const select = useSelector(state => ({
    coords: state.canvas.coordinates,
    scale: state.canvas.scale,
    shapes: state.canvas.shapes,
    animationFinished: state.canvas.animationFinished
  }));
  // Только те шейпы, которые в зоне видимости
  const [drawnItems, setDrawnItems] = useState([])
  // Эффект для фильтрации существующих шейпов на те, которые сейчас видны
  useEffect(() => {
    setDrawnItems(select.shapes.filter(shape => {
      // Нас интересуют только те шейпы, которые полностью входят в канвас с учетом текущего скейла и координат
      return (shape.startCoordinates.x + shape.size >= select.coords.x && shape.startCoordinates.y + shape.size >= select.coords.y &&
        shape.startCoordinates.x <= select.coords.x + (600 / select.scale) && shape.startCoordinates.y <= select.coords.y + (600 / select.scale))
    }))
  }, [select.shapes, select.coords, select.scale])
  // Эффект для перерисовки шейпов, когда меняется набор шейпов, координаты или скейл
  useEffect(() => {
    const context = canvas.current.getContext("2d")
    if(context && select.animationFinished) {
      context.clearRect(0, 0, 600, 600)
      drawnItems.forEach(shape => draw(shape, select.coords, select.scale, context))
    }
  }, [drawnItems, canvas, select.coords, select.scale, select.animationFinished])
  const callbacks = {
    // Обработка движения канваса + управление скейлом
    onWheel: useCallback((e) => {
      if(!e.nativeEvent.shiftKey) {
        const amount = e.nativeEvent.wheelDeltaY > 0 ? 2 : -2
        store.get('canvas').moveCoordinates("vertical", amount)
      } else {
        const direction = e.nativeEvent.wheelDeltaY > 0 ? "down" : "up"
        const offset = {
          x: e.clientX - canvas.current.offsetLeft,
          y: e.clientY - canvas.current.offsetTop
        }
        store.get('canvas').setScale(direction, offset)
      }
    }, []),
    // Обработка движения канваса с помощью кнопки мыши
    onDrag: useCallback((delta) => {
      store.get('canvas').moveCoordinates("horizontal", delta.x)
      store.get('canvas').moveCoordinates("vertical", delta.y)
    }, []),
    onAnimationFinish: useCallback(() => store.get('canvas').setAnimationFinished(true),[])
  }
  // Эффект для обработки анимации, когда она включена. Вызывается при переключении свойства freefall
  useEffect(() => {
    const context = canvas.current.getContext("2d")
    if(context && drawnItems.filter(shape => shape.startCoordinates.y !== (600 / select.scale) - shape.size + select.coords.y)) {
      store.get('canvas').setAnimationFinished(false)
      const currentTime = performance.now()
      window.requestAnimationFrame(() => animateFreeFall(drawnItems, select.coords,
        select.scale, currentTime, callbacks.onAnimationFinish, context))
    }
  }, [select.coords, select.scale, canvas, drawnItems])

  return (
    <CanvasWindow size={600} ref={canvas} onWheel={callbacks.onWheel} onDrag={callbacks.onDrag}/>
  );
};


export default React.memo(CanvasProvider);
