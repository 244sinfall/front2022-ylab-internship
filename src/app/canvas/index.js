import React from "react";
import Layout from "@src/components/layouts/layout";
import TopContainer from "@src/containers/top";
import HeadContainer from "@src/containers/head";
import ToolsContainer from "@src/containers/tools";
import useTranslate from '@src/hooks/use-translate';
import CanvasControls from '@src/containers/canvas-controls';
import CanvasProvider from '@src/containers/canvas-provider';

function Canvas(){
  const {t} = useTranslate()
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
    </Layout>
  )
}

export default React.memo(Canvas);
