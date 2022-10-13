import * as shapes from './exports.js';
export default function draw(shape, context) {
  return shapes[shape.type](context, shape)
}
