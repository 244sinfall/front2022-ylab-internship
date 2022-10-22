import StateModule from "@src/store/module";
import * as shapes from "./shapes/exports"
import {v4 as uuidv4} from 'uuid';

/**
 * Состояние холста
 */
class CanvasState extends StateModule{

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      coordinates: {x: 0, y: 0},
      scale: 1,
      // Shape: Уникальный ID, координаты: { начала (верх-лево), конец (низ-право) }, тип шейпа, другие параметры
      shapes: [],
    };
  }

  /**
   * Добавляет шейп во внешнее состояние. По умолчанию шейп рисуется в видимых канвасу координатах.
   * @param shapeType тип фигуры
   * @param color цвет фигуры
   * @param fill true - заливать фигуру, false - не заливать
   */
  addShape(shapeType, color, fill) {
    const params = {}
    if(shapeType === "square") {
      shapeType = "rectangle"
      params.isSquare = true
    }
    const newShape = shapes[shapeType].build(uuidv4(), color, fill, this.getState().coordinates, this.getState().scale, params)
    this.setState({...this.getState(), shapes: [...this.getState().shapes, newShape]})
  }

  /**
   * Передвигает координаты канваса
   * @param delta Объект с разницей координат
   */
  moveCoordinates(delta) {
    const newCords = {
      x: this.getState().coordinates.x - delta.x,
      y: this.getState().coordinates.y - delta.y
    }
    this.setState({...this.getState(), coordinates: newCords})
  }
  /**
   * Устанавливает масштаб
   * @param direction Направление "up" - уменьшение, "down" - увеличение
   * @param anchor Точка центровки при зумировании
   * Минимальный масштаб 0.05, максимальный - 10
   */
  setScale(direction, anchor = {x: 0, y: 0}) {
    if(this.getState().scale <= 0.05 && direction === "up" || this.getState().scale > 10 && direction === "down") return
    const modifier = this.getState().scale * 0.05
    const newScale = direction === "up" ? this.getState().scale - modifier : this.getState().scale + modifier
    const newAnchor = {
      x: ((anchor.x + this.getState().coordinates.x) / this.getState().scale) * newScale,
      y: ((anchor.y + this.getState().coordinates.y) / this.getState().scale) * newScale
    }
    const newCoordinates = {
      x: newAnchor.x - anchor.x,
      y: newAnchor.y - anchor.y
    }
    this.setState({...this.getState(), scale: newScale, coordinates: newCoordinates})
  }

  /**
   * Удаляет все фигуры из внешнего состояния
   */
  removeAll() {
    this.setState({...this.getState(), shapes: []})
  }
}

export default CanvasState;
