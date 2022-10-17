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
  shapes.map((shape) => {
    if(!shape.finishedAnimation) {
      const timeNow = performance.now()
      shape.startCoordinates.y =  shape.startCoordinates.y += (0.00981 * (timeNow - startTime))
      if(shape.startCoordinates.y + shape.size > (600 / scale) + coords.y) {
        shape.startCoordinates.y = (600 / scale) - shape.size + coords.y
        shape.finishedAnimation = true
      }
    }
    draw(shape, coords, scale, context)
  })
  if(shapes.every(shape => shape.finishedAnimation)) {
    shapes.forEach(shape => shape.finishedAnimation = false)
    return onFinish()
  }
  window.requestAnimationFrame(() => animateFreeFall(shapes, coords, scale, startTime, onFinish, context))
}
