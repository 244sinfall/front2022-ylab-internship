import React, {useCallback} from 'react';
import * as shapesOptions from './exports'
import propTypes from 'prop-types';
import useTranslate from '@src/hooks/use-translate';
import useStore from '@src/hooks/use-store';

/**
 * Поскольку у всех примитивов разные поля, нужные разные компоненты под выбранный примитив. См папку shapes
 * @param props shape (для поиска конструктора), options для данных в поляхъ
 * @returns {JSX.Element}
 * @constructor
 */
const ShapeControls = props => {
  const store = useStore()
  const callbacks = {
    onShapeChange: useCallback((name, value) => {
      if(!isNaN(parseInt(value))) value = parseInt(value)
      store.get('canvas').updateShape(props.shape, name, value)
    }, [props.shape])
  }
  const {t} = useTranslate()
  const Component = shapesOptions[props.shape?.constructor?.name + "Options"]
  return (
    <>
      {Component && <Component onFieldChange={callbacks.onShapeChange} t={t} {...props.options}/>}
    </>
  )
};

ShapeControls.propTypes = {
  shape: propTypes.object,
  options: propTypes.object
};

export default React.memo(ShapeControls);
