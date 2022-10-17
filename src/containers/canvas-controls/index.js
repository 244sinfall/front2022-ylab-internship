import React, {useCallback, useState} from 'react';
import CanvasOptions from '@src/components/canvas/canvas-options';
import useTranslate from '@src/hooks/use-translate';
import propTypes from 'prop-types';
import useStore from '@src/hooks/use-store';

const CanvasControls = props => {
  const {t} = useTranslate()
  const store = useStore();
  const [selectedShape, setSelectedShape] = useState("")
  const [isFilling, setIsFilling] = useState(false)
  const [color, setColor] = useState("#000000")

  const callbacks = {
    onShapeSelectionChange: useCallback((value) => setSelectedShape(value), []),
    onDraw: useCallback(() => store.get('canvas').addShape(selectedShape, { fill: isFilling, color: color }), [selectedShape, isFilling, color]),
    onRemoveAll: useCallback(() => store.get('canvas').removeAll(), []),
    onAnimate: useCallback(() => store.get('canvas').triggerFreeFall(), []),
    onColorChange: useCallback((color) => setColor(color.hex), []),
    onFillCheck: useCallback((e) => setIsFilling(e.target.checked), [])
  }

  return (
    <CanvasOptions drawOptions={props.drawOptions} onDraw={callbacks.onDraw}
                   onShapeSelectionChange={callbacks.onShapeSelectionChange} t={t}
                   onRemoveAll={callbacks.onRemoveAll} onAnimate={callbacks.onAnimate}
                   selectedShape={selectedShape} drawDisabled={!selectedShape}
                   color={color} onColorChange={callbacks.onColorChange} onFillCheck={callbacks.onFillCheck}/>
  );
};

CanvasControls.propTypes = {
  drawOptions: propTypes.arrayOf(propTypes.object).isRequired
};

export default React.memo(CanvasControls);