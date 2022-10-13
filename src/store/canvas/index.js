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
        x: this.getState().coordinates.x + Math.ceil(Math.random() * 400),
        y: this.getState().coordinates.y + Math.ceil(Math.random() * 400),
      },
      color: params.color ?? "#000000",
      fill: params.fill ?? false

    }
    this.setState({...this.getState(), shapes: [...this.getState().shapes, newShape]})
  }
  moveCoordinates(direction) {
    const newCords = {...this.getState().coordinates}
    switch(direction) {
      case "up":
        newCords.y += 2
        break
      case "down":
        newCords.y -= 2
        break
      case "left":
        newCords.x -= 2
        break
      case "right":
        newCords.x += 2
        break
    }
    this.setState({...this.getState(), coordinates: newCords})
  }
  /**
   * Удаляет все фигуры из внешнего состояния
   */
  removeAll() {
    this.setState({...this.getState(), shapes: []})
  }
}

export default CanvasState;
