/**
 * Рисует квадрат
 * @param context Контекст канваса
 * @param shape Объекта шейпа
 */

import Shape from '@src/store/canvas/shapes';
import {ShapeCoordinate} from "@src/store/canvas";

export default class Triangle extends Shape {
  pointA: ShapeCoordinate = {x: 0, y: 0}
  pointB: ShapeCoordinate = {x: 0, y: 0}
  pointC: ShapeCoordinate = {x: 0, y: 0}
  static build(id: string, color: string, fill: boolean, coordinates: ShapeCoordinate, scale: number, params: any) {
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
  constructor(id: string, color: string, fill: boolean, pointA: ShapeCoordinate, pointB:ShapeCoordinate, pointC:ShapeCoordinate) {
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
  get width() {
    return Math.max(this.pointA.x, this.pointB.x, this.pointC.x) - Math.min(this.pointA.x, this.pointB.x, this.pointC.x)
  }
  set height(newHeight) {
    const points = [this.pointA, this.pointB, this.pointB]
    const topPointY = Math.min(...points.map(point => point.y))
    const topPoint = points.find(point => point.y === topPointY)
    if(topPoint) {
      topPoint.y += this.height - newHeight
    }
  }
  set width(newPoint: number) {
    const points = [this.pointA, this.pointB, this.pointB]
    const topPointY = Math.min(...points.map(point => point.x))
    const topPoint = points.find(point => point.x === topPointY)
    if(topPoint) {
      topPoint.x += this.width - newPoint
    }
  }
  get x1() {
    return Math.min(this.pointA.x, this.pointB.x, this.pointC.x)
  }
  get y1() {
    return Math.min(this.pointA.y, this.pointB.y, this.pointC.y)
  }
  set x1(newX1: number) {
    let delta = newX1 - this.x1
    this.pointA.x += delta
    this.pointB.x += delta
    this.pointC.x += delta

  }
  set y1(newY1: number) {
    let delta = newY1 - this.y1
    this.pointA.y += delta
    this.pointB.y += delta
    this.pointC.y += delta
  }
  getBoundingRect(scale: number, currentCoordinates: ShapeCoordinate) {
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
  move(delta: ShapeCoordinate, scale = 1) {
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

  freeFall(context: CanvasRenderingContext2D, currentCoordinates: ShapeCoordinate, scale: number) {
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
  draw(context: CanvasRenderingContext2D, currentCoordinates: ShapeCoordinate, scale: number) {
    context.save()
    super.draw(context, currentCoordinates, scale)
    const getRealPoint = (point: ShapeCoordinate) => {
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
