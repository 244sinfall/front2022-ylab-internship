import React, {useCallback, useState} from 'react';
import CanvasOptions from '@src/components/canvas/canvas-options';
import useTranslate from '@src/hooks/use-translate';
import useStore from '@src/hooks/use-store';
import {ColorChangeHandler} from "react-color";
import {CustomSelectOption} from "@src/store/data-model/components/custom-select";

interface CanvasControlsProps {
  drawOptions: CustomSelectOption[]
}

const CanvasControls = (props: CanvasControlsProps) => {
  const {t} = useTranslate()
  const store = useStore();
  const [selectedShape, setSelectedShape] = useState("")
  const [isFilling, setIsFilling] = useState(false)
  const [color, setColor] = useState("#000000")
  const callbacks = {
    onShapeSelectionChange: useCallback((value: string) => setSelectedShape(value), []),
    onDraw: useCallback(() => store.get('canvas').addShape(selectedShape, color, isFilling), [selectedShape, isFilling, color]),
    onRemoveAll: useCallback(() => store.get("canvas").removeAll(), []),
    onColorChange: useCallback<ColorChangeHandler>((color) => setColor(color.hex), []),
    onFillCheck: useCallback((e: any) => setIsFilling(e.target.checked), [])
  }

  return (
    <CanvasOptions drawOptions={props.drawOptions} onDraw={callbacks.onDraw}
                   onShapeSelectionChange={callbacks.onShapeSelectionChange} t={t}
                   onRemoveAll={callbacks.onRemoveAll}
                   selectedShape={selectedShape} drawDisabled={!selectedShape}
                   color={color} onColorChange={callbacks.onColorChange} onFillCheck={callbacks.onFillCheck}/>
  );
};

export default React.memo(CanvasControls);
