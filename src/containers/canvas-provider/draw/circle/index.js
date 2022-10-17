/**
 * Рисует круг
 * @param context Контекст канваса
 * @param shape Объект шейпа
 */
export default function circle(context, shape) {
  context.beginPath()
  const radius = shape.size / 2
  context.arc(shape.startCoordinates.x + radius, shape.startCoordinates.y + radius, radius, 0, Math.PI * 2)
  context.closePath()
  shape.fill ? context.fill() : context.stroke()
}

