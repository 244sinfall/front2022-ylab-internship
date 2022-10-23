import React from "react";
import Layout from "@src/components/layouts/layout";
import TopContainer from "@src/containers/top";
import HeadContainer from "@src/containers/head";
import ToolsContainer from "@src/containers/tools";
import useTranslate from '@src/hooks/use-translate';
import CanvasControls from '@src/containers/canvas-controls';
import CanvasProvider from '@src/containers/canvas-provider';
import ShapeControls from '@src/containers/shape-controls';
import useSelector from '@src/hooks/use-selector';

function Canvas(){
  const {t} = useTranslate()
  // Для обновления редактора примитива и его опций
  const select = useSelector(state => ({
    shape: state.canvas.selectedShape,
    options: state.canvas.selectedShapeOptions
  }))
  const drawOptions = [
    {code: " ", title: "Выберите фигуру", value: ""},
    {code: "■", title: "Квадрат", value: "square"},
    {code: "■", title: "Прямоугольник", value: "rectangle"},
    {code: "●", title: "Круг", value: "circle"},
    {code: "▸", title: "Треугольник", value: "triangle"},
  ]
  return (
    <Layout>
      <TopContainer/>
      <HeadContainer title={t('canvas.title')}/>
      <ToolsContainer/>
      <CanvasControls drawOptions={drawOptions}/>
      <CanvasProvider/>
      <ShapeControls shape={select.shape} options={select.options}/>
    </Layout>
  )
}

export default React.memo(Canvas);
