// Компоненты опций для каждого шейпа (разный набор полей)
export {default as RectangleOptions} from './shapes/rectangle'
export {default as CircleOptions} from './shapes/circle'
export {default as TriangleOptions} from './shapes/triangle'
export {default as LeafOptions} from './shapes/rectangle'

export interface ShapeOptionsProps {
  onFieldChange: (name: string, value: any) => any,
  t: (text: string) => string
  info: any
}
