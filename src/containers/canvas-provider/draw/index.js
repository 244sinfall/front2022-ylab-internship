import * as shapes from './exports.js';
export default function draw(shape, coords, scale, context) {
  const newShape = {
    ...shape,
    startCoordinates: {
      x: (shape.startCoordinates.x - coords.x) * scale,
      y: (shape.startCoordinates.y - coords.y) * scale
    },
    size: shape.size * scale
  }
  return shapes[shape.type](context, newShape)
}
