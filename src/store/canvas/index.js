import StateModule from "@src/store/module";
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
   * Добавляет фигуру во внешнее состояние. По умолчанию фигура рисуется в видимых канвасу координатах.
   * @param shapeType тип фигуры
   * @param params (startCoordinates, size)
   */
  addShape(shapeType, params = {}) {
    const newShape = {
      id: uuidv4(),
      type: shapeType,
      size: params.size ?? Math.ceil(Math.random() * 100),
      startCoordinates: params.startCoordinates ?? {
        x: this.getState().coordinates.x + Math.ceil(Math.random() * (400 / this.getState().scale)),
        y: this.getState().coordinates.y + Math.ceil(Math.random() * (400 / this.getState().scale)),
      },
      color: params.color ?? "#000000",
      fill: params.fill ?? false

    }
    this.setState({...this.getState(), shapes: [...this.getState().shapes, newShape]})
  }
  moveCoordinates(direction, amount = 2) {
    const newCords = {...this.getState().coordinates}
    switch(direction) {
      case "vertical":
        newCords.y += amount
        break
      case "horizontal":
        newCords.x += amount
        break
    }
    this.setState({...this.getState(), coordinates: newCords})
  }
  setScale(direction) {
    if(this.getState().scale <= 0.05 && direction === "up" || this.getState().scale > 10 && direction === "down") return
    this.setState({...this.getState(), scale: direction === "up" ? this.getState().scale - 0.05 : this.getState().scale + 0.05})
  }
  /**
   * Удаляет все фигуры из внешнего состояния
   */
  removeAll() {
    this.setState({...this.getState(), shapes: []})
  }
}

export default CanvasState;
