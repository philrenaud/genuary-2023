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
      ctx.filter = `drop-shadow(0px 0px 10px rgba(0,0,0,0.25))`;
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.arc(midPoint[0], midPoint[1], radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.filter = "none";
  }
</script>