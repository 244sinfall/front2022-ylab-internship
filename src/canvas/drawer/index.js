import shallowequal from 'shallowequal';

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
          //@todo Фильтр что рисовать
          return true
        })
        if(this._drawnItems.filter(shape => shape.shouldFreeFall()).length > 0) {
          const currentTime = performance.now()
          window.requestAnimationFrame(() => this._animateFreeFall(currentTime))
        }
        this._drawItems()
      }
    })
    this._canvas.addEventListener("wheel", this._onWheel)
    this._canvas.addEventListener("mousedown", this._onMouseDown)
    window.addEventListener("mousemove", this._onMouseMove)
    window.addEventListener("mouseup", this._onMouseUp)
  }

  /**
   * Управление анимацией свободного падения
   * @param startTime Время начала анимации
   * @private
   */
  _animateFreeFall(startTime) {
    //@todo Разное стартовое время для каждой фигуры
    this._context.clearRect(0, 0, 600, 600)
    this._drawnItems.forEach((shape) => {
      shape.freeFall(this._context, this._state.coordinates, this._state.scale, startTime)
    })
    if(this._drawnItems.every(shape => !shape.shouldFreeFall())) return
    window.requestAnimationFrame(() => this._animateFreeFall(startTime))
  }

  /**
   * Метод для одноразовой отрисовки примитивов
   * @private
   */
  _drawItems() {
    this._context.clearRect(0, 0, 600, 600)
    const coords = this._state.coordinates
    const scale = this._state.scale
    if(this._drawnItems) this._drawnItems.forEach(shape => shape.draw(this._context, coords, scale))
  }

  /**
   * Метод для обработки захвата нажатия мыши
   * @param e
   * @private
   */
  _onMouseDown = (e) => {
    document.documentElement.style.userSelect = "none"
    this._mouseDownPos = {x: e.clientX, y: e.clientY}
    this._mouseMoving = true
  }
  /**
   * Метод для обработки захвата поднятия мыши
   * @private
   */
  _onMouseUp = () => {
    if(this._mouseMoving) {
      document.documentElement.style.userSelect = ""
      this._mouseMoving = false
    }
  }
  /**
   * Метод для обработки захвата перемещения мыши
   * @param e
   * @private
   */
  //@todo Отвязать от стейта и обновлять стейт раз в полсекунды
  _onMouseMove = (e) => {
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
  }
  /**
   * Обработчик событий колесика мыши (скролл и скейл)
   * @param e
   * @private
   */
  _onWheel = (e) => {
     if(!e.shiftKey) {
       const deltaY = 4 / this._state.scale
       const amount = e.wheelDeltaY > 0 ? -deltaY : deltaY
       this._store.get('canvas').moveCoordinates({x: 0, y: amount})
     } else {
       const direction = e.wheelDeltaY > 0 ? "down" : "up"
       this._store.get('canvas').setScale(direction, {x: e.offsetX, y: e.offsetY})
     }
  }

  /**
   * Обработчик перемещения канваса мышкой
   * @param delta Разница координат
   * @private
   */
  _onDrag(delta) {
     this._store.get('canvas').moveCoordinates({x: delta.x, y: delta.y} )
  }
}
