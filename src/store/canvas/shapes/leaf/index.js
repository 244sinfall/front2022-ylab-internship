import Shape from '@src/store/canvas/shapes';
import * as images from './images'

export default class Leaf extends Shape {
  static build(id, color, fill, coordinates, scale, params = {}) {
    const img = new Image()
    img.src = images['leaf' + (Math.floor(Math.random() * 5) + 1)]
    const size = params.size ?? 10 + Math.random() * 50
    const opts = {
      id: id,
      x1: params.x1 ?? coordinates.x + Math.ceil(Math.random() * (600 / scale)),
      y1: params.y1 ?? coordinates.y - (params.size ?? size) + 5,
      width: params.size ?? size,
      height: params.size ?? size,
      image: img
    }
    const newLeaf = new Leaf(opts.id, opts.x1, opts.y1, opts.width, opts.height, opts.image)
    img.onload = () => {
      const aspectRatio = img.width / img.height
      newLeaf.width = size * aspectRatio
      newLeaf.height = size
    }
    return newLeaf
  }
  constructor(id, x1, y1, width, height, image) {
    super();
    this._id = id
    this.x1 = x1
    this.y1 = y1
    this.width = width
    this.height = height
    this.image = image
    // Угол поворота изображения
    this.angle = (Math.random() * 360) * Math.PI / 180
    // Направление поворота листка
    this._rotationDirection = Math.random() < 0.5
    // Время последнего изменения направления движения
    this._rotationTime = this.startTime
    // Время, через которое от this._rotationTime нужно выполнить новый поворот
    this._rotateIn = Math.random() * 5000
    // Частота смещения угла в фрейм
    this._rotationForce = Math.random() * Math.PI / 180
    // Время последнего изменения частоты смещения угла
    this._rotationForceTime = this.startTime
    // Время, через которое от this._rotationForceTime нужно пересчитать частоту смещения угла
    this._rotateChangeForceIn = Math.random() * 10000
  }
  draw(context, currentCoordinates, scale) {
    const realX1 = (this.x1 * scale) - currentCoordinates.x
    const realY1 = (this.y1 * scale) - currentCoordinates.y
    const realWidth = this.width * scale
    const realHeight = this.height * scale
    context.save()
    // Поворот на своей оси
    context.translate(realX1  + (realWidth / 2), realY1 + (realHeight / 2))
    context.rotate(this.angle)
    context.translate(-(realX1  + (realWidth / 2)), -(realY1 + (realHeight / 2)))
    let opacity = this.y1 + this.height < 500 ? 1 : (600 - (this.y1 + this.height)) / 100
    if (opacity < 0) opacity = 0
    context.globalAlpha = opacity
    context.drawImage(this.image, realX1, realY1, realWidth, realHeight)
    context.restore()
  }
  shouldFreeFall() {
    // Анимируется всегда
    return true
  }

  /**
   * Обновление положения листа. После выхода из вьюпорта он уходит наверх с новыми параметрами
   * @param currentCoordinates Текущие координаты канваса
   * @param scale Текущий масштаб канваса
   * @private
   */
  _updateLeaf(currentCoordinates, scale) {
    this.x1 = currentCoordinates.x + Math.ceil(Math.random() * (600 / scale))
    this.y1 = currentCoordinates.y - this.width + 5
    this.angle = ((Math.random() * 360) * Math.PI / 180) * scale
    this._rotationDirection = Math.random() < 0.5
    this._rotationTime = performance.now()
    this._rotateIn = Math.random() * 5000
    this._rotationForce = (Math.random() * Math.PI / 180) * scale
    this._rotationForceTime = performance.now()
    this._rotateChangeForceIn = Math.random() * 10000
  }
  freeFall(context, currentCoordinates, scale) {
    const timeNow = performance.now()
    // Обновление направления полета
    if(timeNow - this._rotationTime > this._rotateIn) {
      this._rotationTime = timeNow
      // Переменная частота изменения поворота
      this._rotateIn = Math.random() * 5000
      // Переменное направление вращения
      this._rotationDirection = Math.random() < 0.5
    }
    // Обновление частоты смещения угла
    if(timeNow - this._rotationForceTime > this._rotateChangeForceIn) {
      this._rotationForceTime = timeNow
      // Переменная частота смещения угла
      this._rotationForce = (Math.random() * 3) * Math.PI / 180
      this._rotateChangeForceIn = Math.random() * 10000
    }
    // Направление перемещение через перестановку знака
    const rotation = this._rotationDirection ? this._rotationForce : -this._rotationForce
    // Движение учитывает скролл и также зависит от направления поворота. Поворот вправо - смещение вправо по X итд
    const offsetLimiter = (this._rotationForce * 10 * scale) * (this._rotationDirection ? 1 : -1)
    this.x1 += offsetLimiter
    // Рандомное смещение вниз по Y, чтобы в движении не было монотонности
    this.y1 += 0.2 + (this._rotationForce * 5)
    this.angle += rotation
    const rect = this.getBoundingRect(scale, currentCoordinates)
    if(rect.x2 < 0 || rect.y2 < 0 || rect.y1 > 600 || rect.x1 > 600) {
      this._updateLeaf(currentCoordinates, scale)
    }
  }
}
