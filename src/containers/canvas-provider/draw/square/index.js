export default function square(context, shape) {
  context.fillStyle = shape.color
  shape.fill ? context.fillRect(shape.startCoordinates.x, shape.startCoordinates.y, shape.size, shape.size) :
    context.strokeRect(shape.startCoordinates.x, shape.startCoordinates.y, shape.size, shape.size)
}

