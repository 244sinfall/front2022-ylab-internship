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
  _color = "#000000"
  _fill = false
  static build() {
    throw new Error("Метод не реализован")
  }
  constructor() {
    if(this.constructor === Shape) {
      throw new Error("Невозможно создать экземпляр абстрактного класса")
    }
  }
  get height() {
    return this._height
  }
  draw(context) {
    context.fillStyle = this._color
    context.strokeStyle = this._color
  }
  shouldFreeFall() {
    return this._y1 + this.height < 400
  }
  freeFall(context, currentCoordinates, scale, startTime) {
    const timeNow = performance.now()
    if(this._y1 + this.height < 400) {
      this._y1 =  this._y1 + (0.0000981 * ((timeNow - startTime) ** 2))
      if(this._y1 + this.height > 400) {
        this._y1 = 400 - this.height
      }
    }
    this.draw(context, currentCoordinates, scale)
  }
  getBoundingRect() { throw new Error("Метод не реализован"); }
  isIntersecting() {
    //@todo
    return true
  }
  equals(shape) {
    return this._id === shape._id
  }
}
