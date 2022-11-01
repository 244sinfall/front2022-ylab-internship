import {ShapeCoordinate} from "@src/store/canvas";
import Shape from "@src/store/canvas/shapes";

export interface CanvasValues {
  coordinates: ShapeCoordinate,
  scale: number,
  selectedShape: Shape | null,
  selectedShapeOptions?: any
  shapes: Shape[]
}
