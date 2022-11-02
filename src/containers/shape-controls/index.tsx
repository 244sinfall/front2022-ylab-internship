import React, {useCallback} from 'react';
import * as shapesOptions from './exports'
import useTranslate from '@src/hooks/use-translate';
import useStore from '@src/hooks/use-store';
import Shape from "@src/store/canvas/shapes";

interface ShapeControlsProps {
  shape: Shape,
  options: any
}
/**
 * Поскольку у всех примитивов разные поля, нужные разные компоненты под выбранный примитив. См папку shapes
 * @param props shape (для поиска конструктора), options для данных в поляхъ
 * @returns {JSX.Element}
 * @constructor
 */
const ShapeControls = (props: ShapeControlsProps) => {
  const store = useStore()
  const callbacks = {
    onShapeChange: useCallback((name: string, value: string | number) => {
      if(!isNaN(parseInt(value as string))) value = parseInt(value as string)
      store.modules.canvas.updateShape(props.shape, name, value)
    }, [props.shape])
  }
  const {t} = useTranslate()
  const key = props.shape.constructor.name + "Options"
  const Component = shapesOptions[key as keyof typeof shapesOptions]
  return (
    <>
      {Component && <Component onFieldChange={callbacks.onShapeChange} t={t} {...props.options}/>}
    </>
  )
};

export default React.memo(ShapeControls);
