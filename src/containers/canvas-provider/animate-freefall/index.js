import draw from '@src/containers/canvas-provider/draw';

/**
 * Анимация свободного падения до нижней точки canvas
 * @param shapes Фигуры, задействованные в падении
 * @param coords Текущие координаты канваса (для совместимости с перемещением)
 * @param scale Текущий масштаб канваса (для совместимости с перемещением)
 * @param startTime Время начала перемещения (для базовой физики)
 * @param onFinish Колбек после того, как все фигуры достигнут нижней точки
 * @param context Контекст канваса
 * @returns {*}
 */
export default function animateFreeFall(shapes, coords, scale, startTime, onFinish, context) {
  context.clearRect(0, 0, 600, 600)
  let newShapes = shapes.filter(shape => shape.startCoordinates.y !== (600 / scale) - shape.size + coords.y)
  shapes.map((shape) => {
    const timeNow = performance.now()
    shape.startCoordinates.y =  shape.startCoordinates.y += (0.0000981 * ((timeNow - startTime) ** 2))
    if(shape.startCoordinates.y + shape.size > (600 / scale) + coords.y) {
      shape.startCoordinates.y = (600 / scale) - shape.size + coords.y
    }
    draw(shape, coords, scale, context)
  })
  if(newShapes.length === 0) return onFinish()
  window.requestAnimationFrame(() => animateFreeFall(shapes, coords, scale, startTime, onFinish, context))
}
