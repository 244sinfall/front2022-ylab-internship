/**
 * Рисует острый треугольник
 * @param context Контекст канваса
 * @param shape Объекта шейпа
 */
export default function sharpTriangle(context, shape) {
  context.beginPath()
  context.moveTo(shape.startCoordinates.x + shape.size, shape.startCoordinates.y + shape.size)
  context.lineTo(shape.startCoordinates.x, shape.startCoordinates.y + shape.size)
  context.lineTo(shape.startCoordinates.x + shape.size / 2, shape.startCoordinates.y + shape.size / 5)
  context.closePath()
  shape.fill ? context.fill() : context.stroke()
}

