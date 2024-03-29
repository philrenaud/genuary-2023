export type Point = [number, number];
export type DrawFn = (ctx: CanvasRenderingContext2D) => void;
export type CanvasContext = {
  addDrawFn: (fn: DrawFn) => void;
  removeDrawFn: (fn: DrawFn) => void;
  clear: () => void;
};

export type Line = {
  start: Point;
  end: Point;
  color: string;
  width: number;
};