import draw from '@src/containers/canvas-provider/draw';
import shallowequal from 'shallowequal';
import animateFreeFall from '@src/containers/canvas-provider/animate-freefall';

export class CanvasDrawer {
  constructor(ref, store) {
    this._canvas = ref.current
    this._context = this._canvas.getContext('2d')
    this._context.imageSmoothingEnabled = false
    this._store = store
    this._state = {}
    this._drawnItems = []
    this._store.subscribe(() => {
      const newState = this._store.getState()['canvas']
      if(!shallowequal(this._state, newState)) {
        this._state = newState
        this._drawnItems = this._state.shapes.filter(shape => {
          // Нас интересуют только те шейпы, которые полностью входят в канвас с учетом текущего скейла и координат
          return (shape.startCoordinates.x + shape.size >= this._state.coordinates.x && shape.startCoordinates.y + shape.size >= this._state.coordinates.y &&
            shape.startCoordinates.x <= this._state.coordinates.x + (600 / this._state.scale) && shape.startCoordinates.y <= this._state.coordinates.y + (600 / this._state.scale))
        })
        if(this._drawnItems.filter(shape => shape.startCoordinates.y !== 400 - shape.size).length > 0) {
          store.get('canvas').setAnimationFinished(false)
          const currentTime = performance.now()
          window.requestAnimationFrame(() => animateFreeFall(this._drawnItems, this._state.coordinates,
            this._state.scale, currentTime, () => this._store.get('canvas').setAnimationFinished(false), this._context))
        }
        this.drawItems()
      }
    })
    this._canvas.addEventListener("wheel", this._onWheel)
    this._canvas.addEventListener("mousedown", e => {
      this._mouseDownPos = {x: e.clientX, y: e.clientY}
      this._mouseMoving = true
    })
    this._canvas.addEventListener("mousemove", e => {
      if(this._mouseMoving) {
        this._onDrag({
          x: e.clientX - this._mouseDownPos.x,
          y: e.clientY - this._mouseDownPos.y
        })
        this._mouseDownPos = {
          x: e.clientX,
          y: e.clientY
        }
      }
    })
    this._canvas.addEventListener("mouseup", () => this._mouseMoving = false)
  }
  drawItems() {
    this._context.clearRect(0, 0, 600, 600)
    const coords = this._state.coordinates
    const scale = this._state.scale
    if(this._drawnItems) this._drawnItems.forEach(shape => draw(shape, coords, scale, this._context))
  }
  _onWheel = (e) => {
     if(!e.shiftKey) {
       const amount = e.wheelDeltaY > 0 ? 2 : -2
       this._store.get('canvas').moveCoordinates("vertical", amount)
     } else {
       const direction = e.wheelDeltaY > 0 ? "down" : "up"
       const offset = {
         x: e.clientX - this._canvas.offsetLeft,
         y: e.clientY - this._canvas.offsetTop
       }
       this._store.get('canvas').setScale(direction, offset)
     }
  }
  _onDrag(delta) {
     this._store.get('canvas').moveCoordinates("horizontal", delta.x)
     this._store.get('canvas').moveCoordinates("vertical", delta.y)
  }
}
