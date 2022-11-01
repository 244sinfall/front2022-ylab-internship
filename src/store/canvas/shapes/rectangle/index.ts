import Shape from '@src/store/canvas/shapes';
import {ShapeCoordinate} from "@src/store/canvas";

export default class Rectangle extends Shape {
  static build(id: string, color: string, fill: boolean, coordinates: ShapeCoordinate, scale: number, params: any) {
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
  constructor(id: string, color: string, fill: boolean, x1: number, y1: number, width: number, height: number) {
    super();
    this._id = id
    this.color = color
    this.fill = fill
    this.x1 = x1
    this.y1 = y1
    this.width = width
    this.height = height
  }

  draw(context: CanvasRenderingContext2D, currentCoordinates: ShapeCoordinate, scale: number) {
    context.save()
    super.draw(context, currentCoordinates, scale)
    const realX1 = (this.x1 * scale) - currentCoordinates.x
    const realY1 = (this.y1 * scale) - currentCoordinates.y
    const realWidth = this.width * scale
    const realHeight = this.height * scale
    this.fill ? context.fillRect(realX1, realY1, realWidth, realHeight) :
      context.strokeRect(realX1, realY1, realWidth, realHeight)
    context.restore()
  }
}
