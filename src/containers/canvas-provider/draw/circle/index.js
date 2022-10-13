/**
 * Рисует круг
 * @param context Контекст канваса
 * @param shape Объект шейпа
 */
export default function circle(context, shape) {
  context.fillStyle = shape.color
  context.strokeStyle = shape.color
  context.beginPath()
  context.arc(shape.startCoordinates.x + shape.size, shape.startCoordinates.y + shape.size, shape.size, 0, Math.PI * 2)
  shape.fill ? context.fill() : context.stroke()
}

