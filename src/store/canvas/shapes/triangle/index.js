/**
 * Рисует квадрат
 * @param context Контекст канваса
 * @param shape Объекта шейпа
 */

import Shape from '@src/store/canvas/shapes';

export default class Triangle extends Shape {
  static build(id, color, fill, coordinates, scale, params = {}) {
    const generatePoint = () => {
      return ({
        x: coordinates.x + Math.ceil(Math.random() * (400 / scale)),
        y: coordinates.y + Math.ceil(Math.random() * (400 / scale))
      })
    }
    const opts = {
      id: id,
      color: color,
      fill: fill,
      pointA: params.pointA ?? generatePoint(),
      pointB: params.pointB ?? generatePoint(),
      pointC: params.pointC ?? generatePoint(),
    }
    return new Triangle(opts.id, opts.color, opts.fill, opts.pointA, opts.pointB, opts.pointC)
  }
  constructor(id, color, fill, pointA, pointB, pointC) {
    super();
    this._id = id
    this._color = color
    this._fill = fill
    this._pointA = pointA
    this._pointB = pointB
    this._pointC = pointC
    this._height = Math.max(pointA.y, pointB.y, pointC.y) - Math.min(pointA.y, pointB.y, pointC.y)
  }

  /**
   * Для треугольника пересечение с гранью можно измерить максимальной точкой Y
   * @returns {boolean}
   */
  shouldFreeFall() {
    const maxPoint = () => Math.max(this._pointA.y, this._pointB.y, this._pointC.y)
    return maxPoint() < 400;
  }

  freeFall(context, currentCoordinates, scale, startTime) {
    const timeNow = performance.now()
    const maxPoint = () => Math.max(this._pointA.y, this._pointB.y, this._pointC.y)
    if(maxPoint() < 400) {
      const delta = 0.0000981 * ((timeNow - startTime) ** 2)
      this._pointA.y += delta
      this._pointB.y += delta
      this._pointC.y += delta
      if(maxPoint() > 400) {
        const minusDelta = maxPoint() - 400
        this._pointA.y -= minusDelta
        this._pointB.y -= minusDelta
        this._pointC.y -= minusDelta
      }
    }
    this.draw(context, currentCoordinates, scale)
  }
  draw(context, currentCoordinates, scale) {
    context.save()
    super.draw(context)
    const getRealPoint = (point) => {
      return ({
        x: (point.x * scale) - currentCoordinates.x,
        y: (point.y * scale) - currentCoordinates.y
      })
    }
    const realPointA = getRealPoint(this._pointA)
    const realPointB = getRealPoint(this._pointB)
    const realPointC = getRealPoint(this._pointC)
    context.beginPath()
    context.moveTo(realPointA.x, realPointA.y)
    context.lineTo(realPointB.x, realPointB.y)
    context.lineTo(realPointC.x, realPointC.y)
    context.closePath()
    this._fill ? context.fill() : context.stroke()
    context.restore()
  }
}
