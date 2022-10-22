import Shape from '@src/store/canvas/shapes';

export default class Circle extends Shape {
  static build(id, color, fill, coordinates, scale, params = {}) {
    const opts = {
      id: id,
      color: color,
      fill: fill,
      x1: params.x1 ?? coordinates.x + Math.ceil(Math.random() * (400 / scale)),
      y1: params.y1 ?? coordinates.y + Math.ceil(Math.random() * (400 / scale)),
      radius: params.radius ?? Math.ceil(Math.random() * 50),
    }
    return new Circle(opts.id, opts.color, opts.fill, opts.x1, opts.y1, opts.radius)
  }

  /**
   * Высота круга это два радиуса
   * @returns {number}
   */
  get height() {
    return this._radius * 2
  }
  constructor(id, color, fill, x1, y1, radius) {
    super();
    this._id = id
    this._color = color
    this._fill = fill
    this._x1 = x1
    this._y1 = y1
    this._radius = radius
  }
  draw(context, currentCoordinates, scale) {
    context.save()
    super.draw(context)
    context.beginPath()
    const realCircle = {
      x: (this._x1 * scale) - currentCoordinates.x,
      y: (this._y1 * scale) - currentCoordinates.y,
      radius: this._radius * scale
    }
    context.arc(realCircle.x + realCircle.radius, realCircle.y + realCircle.radius, realCircle.radius, 0, Math.PI * 2)
    context.closePath()
    this._fill ? context.fill() : context.stroke()
    context.restore()
  }
}
