import * as shapes from './exports.js';
export default function draw(shape, coords, context) {
  const newShape = {...shape, startCoordinates: {
      x: shape.startCoordinates.x - coords.x,
      y: shape.startCoordinates.y - coords.y
    }}
  return shapes[shape.type](context, newShape)
}
