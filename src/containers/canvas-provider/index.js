import React, {useEffect, useMemo, useRef} from 'react';
import CanvasWindow from '@src/components/canvas/canvas-window';
import useStore from '@src/hooks/use-store';
import {CanvasDrawer} from '@src/canvas';
import useSelector from '@src/hooks/use-selector';

const CanvasProvider = () => {
  const canvas = useRef()
  const store = useStore();
  const canvasState = useSelector(state => state.canvas)
  const drawer = useMemo(() => {
    if(canvas.current) {
      return new CanvasDrawer(canvas.current, canvasState,state => store.modules.canvas.updateState(state))
    }
  }, [canvas.current])
  useEffect(() => {
    if(drawer) drawer.importState(canvasState)
  }, [drawer, canvasState])
  return (
    <CanvasWindow size={600} ref={canvas}/>
  );
};


export default React.memo(CanvasProvider);
