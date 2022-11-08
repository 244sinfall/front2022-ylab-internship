import React, {useCallback, useEffect, useState} from 'react';
import useTranslate from '@src/hooks/use-translate';
import useStore from '@src/hooks/use-store';
import Shape from "@src/store/canvas/shapes";
import './style.css'
import shallowequal from "shallowequal";
import ShapeOptions from "@src/components/canvas/shape-options";

interface ShapeControlsProps<T> {
  shape: T
}
/**
 * Поскольку у всех примитивов разные поля, нужные разные компоненты под выбранный примитив. См папку shapes
 * @param props shape (для поиска конструктора), options для данных в поляхъ
 * @returns {JSX.Element}
 * @constructor
 */
const ShapeControls = <T extends Shape>(props: ShapeControlsProps<T>) => {
  const store = useStore()
  const [values, setValues] = useState(props.shape.getPublicFields())

  useEffect(() => {
    const intervalId = setInterval(() => {
      if(!shallowequal(values, props.shape.getPublicFields())) return setValues(props.shape.getPublicFields())
    }, 500)
    return () => clearInterval(intervalId)
  }, [props.shape, values])

  const callbacks = {
    onShapeChange: useCallback((prop: string, value: string | number | boolean) => {
      if(props.shape) {
        const modified = Object.assign(Object.create(Object.getPrototypeOf(props.shape)), props.shape, {[prop]: value})
        store.get("canvas").updateShape(modified)
      }
    }, [props.shape, values])
  }
  const {t} = useTranslate()

  return <ShapeOptions values={values} t={t} onChange={callbacks.onShapeChange}/>
};

export default React.memo(ShapeControls);
