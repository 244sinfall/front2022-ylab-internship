import * as shapes from './exports.js';

/**
 * Базовая анимация для отрисовки шейпа
 * @param shape Объект shape (подробнее в стейте канваса)
 * @param coords Текущие координаты (в стейте канваса)
 * @param scale Текущий скейл (в стейте канваса)
 * @param context Контекст канваса
 * @returns {*}
 */
export default function draw(shape, coords, scale, context) {
  const newShape = {
    ...shape,
    startCoordinates: {
      x: (shape.startCoordinates.x - coords.x) * scale,
      y: (shape.startCoordinates.y - coords.y) * scale
    },
    size: shape.size * scale
  }
  context.fillStyle = shape.color
  context.strokeStyle = shape.color
  // Для управления шейпами используется реэкспорт
  return shapes[shape.type](context, newShape)
}
