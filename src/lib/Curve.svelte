<script lang="ts">
  import { getContext, setContext, onDestroy, onMount } from "svelte";
  import type { Point, CanvasContext } from "./types";

  export let start: Point;
  export let controlPoint: Point;
  export let end: Point;
  export let color: string = "black";
  export let thickness: number = 1;
  export let circlePath;

  let canvasContext = getContext("canvas") as CanvasContext;

  onMount(() => {
    canvasContext.addDrawFn(draw);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(draw);
  });


  function draw(ctx: CanvasRenderingContext2D) {
  // Check if any point on the curve intersects with the circle
  // let intersects = false;
  // if (canvasContext) {
  //   canvasContext.beginPath();
  //   canvasContext.moveTo(...start);
  //   canvasContext.quadraticCurveTo(...controlPoint, ...end);
  //   intersects = canvasContext.isPointInPath(circlePath);
  // }
  // if (intersects) {
  //   ctx.globalCompositeOperation = "difference";
  // }
  ctx.globalCompositeOperation = "luminosity";
  ctx.beginPath();
      ctx.moveTo(...start);
      ctx.quadraticCurveTo(...controlPoint, ...end);
      ctx.stroke();
      ctx.lineWidth = thickness;
      ctx.strokeStyle = color;
      ctx.imageSmoothingEnabled = false;
  ctx.globalCompositeOperation = "source-over";
  }
</script>