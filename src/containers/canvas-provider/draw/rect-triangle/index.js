/**
 * Рисует прямоугольный треугольник
 * @param context Контекст канваса
 * @param shape Объекта шейпа
 */
export default function rectTriangle(context, shape) {
  context.beginPath()
  context.moveTo(shape.startCoordinates.x + shape.size, shape.startCoordinates.y + shape.size)
  context.lineTo(shape.startCoordinates.x, shape.startCoordinates.y + shape.size)
  context.lineTo(shape.startCoordinates.x, shape.startCoordinates.y)
  context.closePath()
  shape.fill ? context.fill() : context.stroke()
}

