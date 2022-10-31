/**
 * Базовая анимация для отрисовки шейпа
 * @param shape Объект shape (подробнее в стейте канваса)
 * @param coords Текущие координаты (в стейте канваса)
 * @param scale Текущий скейл (в стейте канваса)
 * @param context Контекст канваса
 * @returns {*}
 */

export default class Shape {
  _id = ""
  color = "#000000"
  fill = false
  selected = false
  static build() {
    return new Shape()
  }
  constructor() {
    if(this.constructor === Shape) {
      throw new Error("Невозможно создать экземпляр абстрактного класса")
    }
    this.startTime = performance.now()
  }

  /**
   * Установка цвет (одинаково для всех наследников)
   * @param context
   */
  draw(context) {
    context.lineWidth = this.selected ? 2 : 1
    context.fillStyle = this.color
    context.strokeStyle = this.color
  }

  /**
   * Булевый флаг - стоит ли фигуре в данный момент падать, исходя из ее координат
   * @returns {boolean}
   */
  shouldFreeFall() {
    return this.y1 + this.height < 400
  }

  /**
   * Общая механика свободного падения
   * @param context Контекст канваса
   * @param currentCoordinates Текущие координаты
   * @param scale Текущий масштаб
   */
  freeFall(context, currentCoordinates, scale) {
    const timeNow = performance.now()
    if(this.y1 + this.height < 400) {
      this.y1 =  this.y1 + (0.0000981 * ((timeNow - this.startTime) ** 2))
      if(this.y1 + this.height > 400) {
        this.y1 = 400 - this.height
      }
    }
  }

  /**
   * Общая механика передвижения примитивов
   * @param delta {{x: number, y: number}}
   * @param scale Масштаб канваса
   */
  move(delta, scale = 1) {
    this.y1 += delta.y / scale
    this.x1 += delta.x / scale
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
  isIntersecting(scale, currentCoordinates, intersectionCoordinates) {
    const rect = this.getBoundingRect(scale, currentCoordinates)
    return (
      rect.x1 <= intersectionCoordinates.x && rect.y1 <= intersectionCoordinates.y &&
      rect.x2 >= intersectionCoordinates.x && rect.y2 >= intersectionCoordinates.y
    )
  }
  equals(shape) {
    return this._id === shape._id
  }
}
