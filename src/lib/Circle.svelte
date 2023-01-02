<script>
  import { getContext, setContext, onDestroy, onMount } from "svelte";

  export let midPoint;
  export let radius;
  export let color = "black";

  let canvasContext = getContext("canvas");

  onMount(() => {
    canvasContext.addDrawFn(draw);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(draw);
  });


  function draw(ctx) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.arc(midPoint[0], midPoint[1], radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.stroke();
  }
</script>