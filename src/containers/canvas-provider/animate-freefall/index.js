import draw from '@src/containers/canvas-provider/draw';

export default function animateFreeFall(shapes, coords, scale, startTime, onFinish, context) {
  context.clearRect(0, 0, 600, 600)
  shapes.map((shape) => {
    if(!shape.finishedAnimation) {
      const timeNow = performance.now()
      shape.startCoordinates.y =  shape.startCoordinates.y += (0.005 * timeNow)
      if(shape.startCoordinates.y + shape.size > 600 / scale) {
        shape.startCoordinates.y = (600 / scale) - shape.size - coords.y
        shape.finishedAnimation = true
      }
    }
    draw(shape, coords, scale, context)
  })
  if(shapes.every(shape => shape.finishedAnimation)) return onFinish()
  window.requestAnimationFrame(() => animateFreeFall(shapes, coords, scale, startTime, onFinish, context))
}
