import StateModule from "@src/store/module";
import * as shapes from "./shapes/exports"
import {v4 as uuidv4} from 'uuid';
import Shape from "@src/store/canvas/shapes";
import {IState} from "@src/store/data-model/store";

export interface ShapeCoordinate {
  x: number,
  y: number
}

/**
 * Состояние холста
 */
class CanvasState extends StateModule<CanvasState>{

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      coordinates: {x: 0, y: 0} as ShapeCoordinate,
      scale: 1,
      shapes: [] as Shape[],
      selectedShape: null as Shape | null,
      selectedShapeOptions: null as any | null
    };
  }
  /**
   * Добавляет шейп во внешнее состояние. По умолчанию шейп рисуется в видимых канвасу координатах.
   * @param shapeType тип фигуры
   * @param color цвет фигуры
   * @param fill true - заливать фигуру, false - не заливать
   */
  addShape(shapeType: string, color: string, fill: boolean) {
    const params: any = {}
    if(shapeType === "square") {
      shapeType = "rectangle"
      params.isSquare = true
    }
    const newShape = shapes[shapeType as keyof typeof shapes].build(uuidv4(), color, fill,
      this.getState().coordinates, this.getState().scale, params) as Shape
    this.setState({...this.getState(), shapes: [...this.getState().shapes, newShape] as Shape[]})
  }

  /**
   * Метод для изменения существующего примитива в shapes. Находит его через уникальный ID
   * @param shape Примитив
   * @param field Строка, поле для изменения (допускается точечная нотация)
   * @param value Значение для установки в свойство
   */
  updateShape(shape: Shape, field: string, value: any) {
    const newShapes = [...this.getState().shapes]
    const selectedShape = newShapes.find(sh => sh.equals(shape))
    const fieldDirection = field.split('.')
    if(selectedShape) {
      let neededObject: Shape | any = selectedShape
      while(fieldDirection.length !== 1) {
        neededObject = neededObject[fieldDirection.shift() as keyof unknown] as any
      }
      const lastLevelField = fieldDirection.at(-1) as string
      neededObject[lastLevelField] = value
      this.setState({...this.getState(), shapes: newShapes })
    }
  }

  /**
   * Полностью перезаписывает состояние (для синхронизации со стейтом канваса)
   * @param newState Новое состояние целиком
   */
  updateState(newState: IState<CanvasState>) {
    this.setState(newState)
  }
  /**
   * Удаляет все фигуры из внешнего состояния
   */
  removeAll() {
    this.setState({...this.getState(), shapes: [] as Shape[], selectedShape: null})
  }
}

export default CanvasState;
