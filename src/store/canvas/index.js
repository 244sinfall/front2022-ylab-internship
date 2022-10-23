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
      shapes: [],
      selectedShape: null,
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
   * Метод для изменения существующего примитива в shapes. Находит его через уникальный ID
   * @param shape Примитив
   * @param field Строка, поле для изменения (допускается точечная нотация)
   * @param value Значение для установки в свойство
   */
  updateShape(shape, field, value) {
    const newShapes = [...this.getState().shapes]
    const selectedShape = newShapes.find(sh => sh.equals(shape))
    const fieldDirection = field.split('.')
    let neededObject = selectedShape
    while(fieldDirection.length !== 1) {
      neededObject = neededObject[fieldDirection.shift()]
    }
    neededObject[fieldDirection.at(-1)] = value
    this.setState({...this.getState(), shapes: newShapes })
  }

  /**
   * Полностью перезаписывает состояние (для синхронизации со стейтом канваса)
   * @param newState Новое состояние целиком
   */
  updateState(newState) {
    this.setState(newState)
  }
  /**
   * Удаляет все фигуры из внешнего состояния
   */
  removeAll() {
    this.setState({...this.getState(), shapes: [], selectedShape: null})
  }
}

export default CanvasState;
