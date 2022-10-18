import StateModule from "@src/store/module";
// import {v4 as uuidv4} from 'uuid';

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
      animationFinished: false,
    };
  }

  /**
   * Добавляет шейп во внешнее состояние. По умолчанию шейп рисуется в видимых канвасу координатах.
   * @param shapeType тип фигуры
   * @param params (startCoordinates - начальные координаты, size - размер, color - цвет (хекс код), fill - заливать true, не заливать false))
   */
  addShape(shapeType, params = {}) {
    const newShape = {
      // id: uuidv4(),
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

  /**
   * Передвигает координаты канваса
   * @param direction Направление "vertical" | "horizontal"
   * @param amount Количество пикселей сдвига (по умолчанию 2)
   */
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
  setAnimationFinished(state) {
    this.setState({...this.getState(), animationFinished: state})
  }
  /**
   * Устанавливает масштаб
   * @param direction Направление "up" - уменьшение, "down" - увеличение
   * @param anchor Точка центровки при зумировании
   * Минимальный масштаб 0.05, максимальный - 10
   */
  setScale(direction, anchor = {x: 0, y: 0}) {
    if(this.getState().scale <= 0.05 && direction === "up" || this.getState().scale > 10 && direction === "down") return
    const newScale = direction === "up" ? this.getState().scale - 0.05 : this.getState().scale + 0.05
    const newStartCoordinates = {
      x: anchor.x / newScale - ((600 / newScale) / 2),
      y: anchor.y / newScale - ((600 / newScale) / 2)
    }
    this.setState({...this.getState(), scale: newScale,
    coordinates: newStartCoordinates})
  }

  /**
   * Удаляет все фигуры из внешнего состояния
   */
  removeAll() {
    this.setState({...this.getState(), shapes: []})
  }
}

export default CanvasState;
