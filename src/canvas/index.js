import shallowequal from 'shallowequal';

/**
 * Класс управляет канвасом и хранит его параметры во внетреннем состоянии,
 * синхронизируясь с внешним состоянием при необходимости
 */
export class CanvasDrawer {
  constructor(canvas, store, onExport) {
    this._canvas = canvas
    this._context = this._canvas.getContext('2d')
    this._context.imageSmoothingEnabled = false
    // Сылка для синхронизации
    this._onExport = onExport
    // Внутреннее состояние
    this._state = {}
    // Только отрисовываемые примитивы
    this._drawnItems = []
    // Скейл / скролл
    this._canvas.addEventListener("wheel", this._onWheel)
    this._canvas.addEventListener("mousedown", this._onMouseDown)
    window.addEventListener("mousemove", this._onMouseMove)
    window.addEventListener("mouseup", this._onMouseUp)
  }

  /**
   * Проверка на вхождение в канвас
   * @param shape Объект примитива
   * @returns {boolean} true - входит в канвас, false - нет
   * @private
   */
  _shouldDisplay(shape) {
    const rect = shape.getBoundingRect(this._state.scale, this._state.coordinates)
    return (
      rect.x2 > 0 && rect.y2 > 0 && rect.y1 < 600 && rect.x1 < 600
    )
  }
  importState(newState) {
    if(!shallowequal(this._state, newState)) {
      this._state = newState
      this._updateItems()
    }
  }
  /**
   * Управление анимацией свободного падения
   * @private
   */
  _animateFreeFall() {
    this._context.clearRect(0, 0, 600, 600)
    this._drawnItems.forEach((shape) => {
      // Выделенный приметив не падает
      if(!this._state.selectedShape || !(shape.equals(this._state.selectedShape) && this._state.selectedShape.selected)) {
        shape.freeFall(this._context, this._state.coordinates, this._state.scale)
      }
    })
    this._updateItems()
    // Анимацию останавливаем, если висячий только выделенный примитив
    if(this._drawnItems.every(shape => !shape.shouldFreeFall() || (this._state.selectedShape && shape.equals(this._state.selectedShape)))) return
    this._animationFrame = window.requestAnimationFrame(() => this._animateFreeFall())
  }

  /**
   * Метод для обновления локальных данных во внешнем состоянии
   * @private
   */
  _updateState() {
    this._updateTime = performance.now()
    const newState = {...this._state}
    newState.shapes.forEach((shape, index, array) => {
      const updatedShape = this._drawnItems.find(newShape => newShape.equals(shape))
      if(updatedShape) {
        array[index] = updatedShape
      }
    })
    newState.coordinates = this._state.coordinates
    newState.scale = this._state.scale
    newState.selectedShape = this._state.selectedShape
    // Опции сохраняются отдельно, чтобы обеспечить иммутабельность
    newState.selectedShapeOptions = {...this._state.selectedShape}
    this._onExport(newState)
  }

  /**
   * Пересчитывает отображаемые примитивы
   * @param immediately Мгновенное обновление
   * @private
   */
  _updateItems(immediately = false) {
    if(immediately || performance.now() - this._updateTime > 500) {
      this._updateState()
    } else {
      clearTimeout(this._updateTimeout)
      this._updateTimeout = setTimeout(() => {
        this._updateState()
      }, 100)
    }
    this._drawnItems = this._state.shapes.filter(shape => this._shouldDisplay(shape))
    if(this._drawnItems.filter(shape => shape.shouldFreeFall()).length > 0) {
      // Чтобы не допускать дублирующихся анимаций
      cancelAnimationFrame(this._animationFrame)
      this._animationFrame = window.requestAnimationFrame(() => this._animateFreeFall())
    }
    this._drawItems()
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
    this._mouseDown = true
    if(e.target === this._canvas && this._state.selectedShape) {
      this._state.selectedShape = null
      this._updateItems(true)
    }
    for (let i = this._drawnItems.length - 1; i >= 0; i--) {
      if(this._drawnItems[i].isIntersecting(this._state.scale, this._state.coordinates, {x: e.offsetX, y: e.offsetY})) {
        this._state.selectedShape = this._drawnItems[i]
        this._state.selectedShape.selected = true
        this._updateItems(true)
        return
      }
    }
  }
  /**
   * Метод для обработки захвата поднятия мыши. Если mouseMove не срабатывал, срабатывает Click
   * @private
   */
  _onMouseUp = (e) => {
    document.documentElement.style.userSelect = ""
    if(e.target === this._canvas && this._state.selectedShape) {
      this._state.selectedShape.startTime = performance.now()
      this._state.selectedShape.selected = false
      this._updateItems(true)
    }
    this._mouseDown = false
  }
  /**
   * Метод для обработки захвата перемещения мыши
   * @param e
   * @private
   */
  _onMouseMove = (e) => {
    if(this._mouseDown) {
      const currentPos = {
        x: e.clientX - this._mouseDownPos.x,
        y: e.clientY - this._mouseDownPos.y
      }
      if(this._state.selectedShape) {
        this._state.selectedShape.move(currentPos, this._state.scale)
        this._updateItems()
      } else {
        this._onDrag(currentPos)
      }
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
       this._state.coordinates.y -= amount
       this._updateItems()
     } else {
       if(this._state.scale <= 0.05 && e.wheelDeltaY < 0 || this._state.scale > 10 && e.wheelDeltaY > 0) return
       const modifier = this._state.scale * 0.05
       const newScale = e.wheelDeltaY < 0 ? this._state.scale - modifier : this._state.scale + modifier
       this._state.coordinates = {
         x: (((e.offsetX + this._state.coordinates.x) / this._state.scale) * newScale) - e.offsetX,
         y: (((e.offsetY + this._state.coordinates.y) / this._state.scale) * newScale) - e.offsetY
       }
       this._state.scale = newScale
       this._updateItems()
     }
  }

  /**
   * Обработчик перемещения канваса мышкой
   * @param delta Разница координат
   * @private
   */
  _onDrag(delta) {
    this._state.coordinates.x -= delta.x
    this._state.coordinates.y -= delta.y
    this._updateItems()
  }
}
