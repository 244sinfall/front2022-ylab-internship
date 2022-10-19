import React, {useEffect, useRef} from 'react';
import CanvasWindow from '@src/components/canvas/canvas-window';
import useStore from '@src/hooks/use-store';
import {CanvasDrawer} from '@src/canvas/drawer';

const CanvasProvider = () => {
  const canvas = useRef()
  const store = useStore();
  useEffect(() => {
    if(canvas.current) {
      new CanvasDrawer(canvas, store)
    }
  }, [canvas])
  return (
    <CanvasWindow size={600} ref={canvas}/>
  );
};


export default React.memo(CanvasProvider);
