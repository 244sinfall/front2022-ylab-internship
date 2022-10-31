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
    this.color = color
    this.fill = fill
    this.pointA = pointA
    this.pointB = pointB
    this.pointC = pointC
  }
  get height() {
    return Math.max(this.pointA.y, this.pointB.y, this.pointC.y) - Math.min(this.pointA.y, this.pointB.y, this.pointC.y)
  }
  getBoundingRect(scale, currentCoordinates) {
    const minX = Math.min(this.pointA.x, this.pointB.x, this.pointC.x)
    const minY = Math.min(this.pointA.y, this.pointB.y, this.pointC.y)
    const maxX = Math.max(this.pointA.x, this.pointB.x, this.pointC.x)
    const maxY = Math.max(this.pointA.y, this.pointB.y, this.pointC.y)
    return ({
      x1: (minX * scale) - currentCoordinates.x,
      y1: (minY * scale)  - currentCoordinates.y,
      x2: (maxX * scale) - currentCoordinates.x,
      y2: (maxY * scale) - currentCoordinates.y
    })
  }

  /**
   * Переопределено, т.к у треугольника нет однозначной верхней точки, плюс точки не зависят друг от друга
   * @param delta {{x: number, y: number}}
   * @param scale Масштаб канваса
   */
  move(delta, scale = 1) {
    const deltaX = delta.x / scale
    const deltaY = delta.y / scale
    this.pointA.x += deltaX
    this.pointA.y += deltaY
    this.pointB.x += deltaX
    this.pointB.y += deltaY
    this.pointC.x += deltaX
    this.pointC.y += deltaY
  }
  /**
   * Для треугольника пересечение с гранью можно измерить максимальной точкой Y
   * @returns {boolean}
   */
  shouldFreeFall() {
    return Math.max(this.pointA.y, this.pointB.y, this.pointC.y) < 400;
  }

  freeFall(context, currentCoordinates, scale) {
    const timeNow = performance.now()
    if(this.shouldFreeFall()) {
      const delta = 0.0000981 * ((timeNow - this.startTime) ** 2)
      this.pointA.y += delta
      this.pointB.y += delta
      this.pointC.y += delta
      const maxPoint = Math.max(this.pointA.y, this.pointB.y, this.pointC.y)
      if(maxPoint > 400) {
        const minusDelta = maxPoint - 400
        this.pointA.y -= minusDelta
        this.pointB.y -= minusDelta
        this.pointC.y -= minusDelta
      }
    }
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
    const realPointA = getRealPoint(this.pointA)
    const realPointB = getRealPoint(this.pointB)
    const realPointC = getRealPoint(this.pointC)
    context.beginPath()
    context.moveTo(realPointA.x, realPointA.y)
    context.lineTo(realPointB.x, realPointB.y)
    context.lineTo(realPointC.x, realPointC.y)
    context.closePath()
    this.fill ? context.fill() : context.stroke()
    context.restore()
  }
}
