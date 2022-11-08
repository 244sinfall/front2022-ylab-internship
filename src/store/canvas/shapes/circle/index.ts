import Shape from '@src/store/canvas/shapes';
import {ShapeCoordinate} from "@src/store/canvas";

export default class Circle extends Shape {
  radius: number
  static build(id: string, color: string, fill: boolean, coordinates: ShapeCoordinate, scale: number, params: any) {
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
   * Переопределение для круга, границы находятся через радиус
   * @param scale масштаб
   * @param currentCoordinates текущие координаты канваса
   * @returns {{y1: number, x1: number, y2: number, x2: number}}
   */
  getBoundingRect(scale: number, currentCoordinates: ShapeCoordinate) {
    const realX1 = (this.x1 * scale) - currentCoordinates.x
    const realY1 = (this.y1 * scale) - currentCoordinates.y
    return ({
      x1: realX1,
      y1: realY1,
      x2: realX1 + ((this.radius * 2) * scale),
      y2: realY1 + ((this.radius * 2) * scale)
    })
  }

  /**
   * Высота круга это два радиуса
   * @returns {number}
   */
  get height() {
    return this.radius * 2
  }
  get width() {
    return this.radius * 2
  }
  set height(newHeight: number) {
    this.radius = newHeight / 2
  }
  set width(newWidth: number) {
    this.radius = newWidth / 2
  }
  constructor(id: string, color: string, fill: boolean, x1: number, y1: number, radius: number) {
    super();
    this._id = id
    this.color = color
    this.fill = fill
    this.x1 = x1
    this.y1 = y1
    this.radius = radius
  }
  draw(context: CanvasRenderingContext2D, currentCoordinates: ShapeCoordinate, scale: number) {
    context.save()
    super.draw(context, currentCoordinates, scale)
    context.beginPath()
    const realCircle = {
      x: (this.x1 * scale) - currentCoordinates.x,
      y: (this.y1 * scale) - currentCoordinates.y,
      radius: this.radius * scale
    }
    context.arc(realCircle.x + realCircle.radius, realCircle.y + realCircle.radius, realCircle.radius, 0, Math.PI * 2)
    context.closePath()
    this.fill ? context.fill() : context.stroke()
    context.restore()
  }
}
