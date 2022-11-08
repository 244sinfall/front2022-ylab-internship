import React from 'react';
import Input from "@src/components/elements/input";
import {cn as bem} from "@bem-react/classname";

interface ShapeOptionsValues {
  values: {
    color: string,
    fill: boolean,
    x1: number,
    y1: number,
    width: number,
    height: number
  },
  t: (text: string) => string,
  onChange: (prop: string, value: string | boolean | number) => void
}

const ShapeOptions = (props: ShapeOptionsValues) => {
  const cn = bem("ShapeOptions")
  return (
    <div className={cn()}>
      <span className={cn('option')}>
        {props.t(`canvas.color`)}:
        <Input value={String(props.values.color)} onChange={(value: string) => props.onChange("color", value)}
               type={"text"} theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t(`canvas.x1`)}:
        <Input value={String(props.values.x1)} onChange={(value: string) => props.onChange("x1", parseInt(value))}
               type={"number"} theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t(`canvas.y1`)}:
        <Input value={String(props.values.y1)} onChange={(value: string) => props.onChange("y1", parseInt(value))}
               type={"number"} theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t(`canvas.fill`)}:
        <Input value={String(props.values.fill)} onChange={() => props.onChange("fill", !props.values.fill)}
               type={"checkbox"} theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t(`canvas.width`)}:
        <Input value={String(props.values.width)} onChange={(value: string) => props.onChange("width", parseInt(value))}
               type={"number"} theme="small"/>
      </span>
      <span className={cn('option')}>
        {props.t(`canvas.height`)}:
        <Input value={String(props.values.height)} onChange={(value: string) => props.onChange("height", parseInt(value))}
               type={"number"} theme="small"/>
      </span>
    </div>
  );
};

export default React.memo(ShapeOptions);
