<script>
  import { getContext, setContext, onDestroy, onMount } from "svelte";

  /**
   * @type {number} x
   */
  export let x;
  export let y;
  export let length;
  export let color;

  let canvasContext = getContext("canvas");

  onMount(() => {
    canvasContext.addDrawFn(draw);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(draw);
  });


  function draw(ctx) {
      ctx.beginPath();
      ctx.lineWidth = length / 10;
      ctx.rect(x, y, length, length);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
  }
</script>