import Shape from '@src/store/canvas/shapes';
import * as images from './images'

export default class Leaf extends Shape {
  static build(id, color, fill, coordinates, scale, params = {}) {
    const img = new Image()
    img.src = images['leaf' + (Math.floor(Math.random() * 5) + 1)]
    const opts = {
      id: id,
      x1: params.x1 ?? coordinates.x + Math.ceil(Math.random() * (600 / scale)),
      y1: params.y1 ?? coordinates.y - (params.width ?? 50) + 5,
      width: params.width ?? 50,
      height: params.height ?? 50,
      image: img
    }
    return new Leaf(opts.id, opts.x1, opts.y1, opts.width, opts.height, opts.image)
  }
  constructor(id, x1, y1, width, height, image) {
    super();
    this._id = id
    this.x1 = x1
    this.y1 = y1
    this.width = width
    this.height = height
    this.image = image
    this.angle = (Math.random() * 360) * Math.PI / 180
    this._rotationDirection = Math.random() < 0.5
    this._rotationTime = this.startTime
    this._rotateIn = Math.random() * 5000
    this._rotationForce = Math.random() * Math.PI / 180
    this._rotationForceTime = this.startTime
    this._rotateChangeForceIn = Math.random() * 10000
  }
  draw(context, currentCoordinates, scale) {
    const realX1 = (this.x1 * scale) - currentCoordinates.x
    const realY1 = (this.y1 * scale) - currentCoordinates.y
    const realWidth = this.width * scale
    const realHeight = this.height * scale
    context.save()
    context.translate(realX1  + (realWidth / 2), realY1 + (realHeight / 2))
    context.rotate(this.angle)
    context.translate(-(realX1  + (realWidth / 2)), -(realY1 + (realHeight / 2)))
    context.drawImage(this.image, realX1, realY1, realWidth, realHeight)
    context.restore()
  }
  shouldFreeFall() {
    return true
  }
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
    console.log(this._rotationForce)
  }
  freeFall(context, currentCoordinates, scale) {
    console.log(currentCoordinates, scale)
    const timeNow = performance.now()
    if(timeNow - this._rotationTime > this._rotateIn) {
      this._rotationTime = timeNow
      this._rotateIn = Math.random() * 5000
      this._rotationDirection = !this._rotationDirection
    }
    if(timeNow - this._rotationForceTime > this._rotateChangeForceIn) {
      this._rotationForceTime = timeNow
      this._rotationForce = (Math.random() * 3) * Math.PI / 180
      this._rotateChangeForceIn = Math.random() * 10000
    }
    const rotation = this._rotationDirection ? this._rotationForce : -this._rotationForce
    const offsetLimiter = (this.angle / 40) * scale
    this.x1 += offsetLimiter
    this.y1 += Math.random() / 3
    this.angle += rotation
    const rect = this.getBoundingRect(scale, currentCoordinates)
    if(rect.x2 < -50 || rect.y2 < -50 || rect.y1 > 650 || rect.x1 > 650) {
      this._updateLeaf(currentCoordinates, scale)
    }
  }
}
