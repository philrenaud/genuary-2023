<script lang="ts">
  import { getContext, setContext, onDestroy, onMount } from "svelte";
  import type { Point, CanvasContext } from "./types";

  export let start: Point;
  export let end: Point;
  export let color: string = "black";
  export let thickness: number = 1;

  // export let segmentLikelihood: number = 0;
  // export let gapSize: number = Math.random() * 200;
  // export let number: number = 0;
 
  let canvasContext = getContext("canvas") as CanvasContext;

  onMount(() => {
    canvasContext.addDrawFn(draw);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(draw);
  });


  function draw(ctx: CanvasRenderingContext2D) {
    // requestAnimationFrame(() => {
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = "luminosity";
    // console.log('number', number, segmentLikelihood, ctx.lineWidth);

    ctx.beginPath();
    ctx.moveTo(...start);
    // if segmentLikelihood is 0, draw a straight line
    // if (segmentLikelihood === 0) {
      ctx.lineTo(...end);
      ctx.stroke();
    //   return;
    // } else {
    //   // Otherwise, random chace to determine if we draw a gap
    //   let gap = Math.random() < segmentLikelihood;
    //   if (gap) {
    //     let segmentPosition: number = Math.random();
    //     const segmentX = start[0] + (end[0] - start[0]) * segmentPosition;
    //     const segmentY = start[1] + (end[1] - start[1]) * segmentPosition;
    //     ctx.lineTo(segmentX, segmentY);
    //     ctx.moveTo(segmentX + gapSize, segmentY);
    //     ctx.lineTo(...end);
    //     ctx.stroke();
    //   } else {
    //     ctx.lineTo(...end);
    //     ctx.stroke();
    //   }
    // }
    ctx.globalCompositeOperation = "source-over";
    // });

  }
</script>