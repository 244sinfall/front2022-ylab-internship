import Shape from '@src/store/canvas/shapes';

export default class Rectangle extends Shape {
  static build(id, color, fill, coordinates, scale, params = {}) {
    const width = Math.ceil(Math.random() * 100)
    const opts = {
      id: id,
      color: color,
      fill: fill,
      x1: params.x1 ?? coordinates.x + Math.ceil(Math.random() * (400 / scale)),
      y1: params.y1 ?? coordinates.y + Math.ceil(Math.random() * (400 / scale)),
      width: params.width ?? width,
      height: params.height ?? params.isSquare ? width : Math.ceil(Math.random() * 100)
    }
    return new Rectangle(opts.id, opts.color, opts.fill, opts.x1, opts.y1, opts.width, opts.height)
  }
  constructor(id, color, fill, x1, y1, width, height) {
    super();
    this._id = id
    this.color = color
    this.fill = fill
    this.x1 = x1
    this.y1 = y1
    this.width = width
    this.height = height
  }
  getBoundingRect(scale, currentCoordinates) {
    const realX1 = (this.x1 * scale) - currentCoordinates.x
    const realY1 = (this.y1 * scale) - currentCoordinates.y
    return ({
      x1: realX1,
      y1: realY1,
      x2: realX1 + (this.width * scale),
      y2: realY1 + (this.height * scale)
    })
  }

  draw(context, currentCoordinates, scale) {
    context.save()
    super.draw(context)
    const realX1 = (this.x1 * scale) - currentCoordinates.x
    const realY1 = (this.y1 * scale) - currentCoordinates.y
    const realWidth = this.width * scale
    const realHeight = this.height * scale
    this.fill ? context.fillRect(realX1, realY1, realWidth, realHeight) :
      context.strokeRect(realX1, realY1, realWidth, realHeight)
    context.restore()
  }
}
