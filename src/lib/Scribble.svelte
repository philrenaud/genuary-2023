<script lang="ts">
  import { getContext, setContext, onDestroy, onMount } from "svelte";
  import type { Point, CanvasContext } from "./types";

  export let start: Point;
  export let end: Point;
  export let points: Point[];

  let canvasContext = getContext("canvas") as CanvasContext;

  onMount(() => {
    canvasContext.addDrawFn(draw);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(draw);
  });


  function draw(ctx: CanvasRenderingContext2D) {
    // console.log('drawing', x, y, points);
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    points.forEach((point) => {
      ctx.lineTo(point[0], point[1]);
    });
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
  }
</script>