<script>
  import { getContext, setContext, onDestroy, onMount } from "svelte";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let canvasElement;
  let fnsToDraw = [];
  let frameId;
  let ctx;
  export let reDraw = true;
  export let memo;
  let internalMemo;

  export let width;
  export let height;

  setContext("canvas", {
    addDrawFn: (fn) => {
      fnsToDraw.push(fn);
    },
    removeDrawFn: (fn) => {
        let index = fnsToDraw.indexOf(fn);
        if (index > -1){
          fnsToDraw.splice(index, 1);
        }
    },
  });

  onMount(() => {
    ctx = canvasElement?.getContext("2d");
    requestAnimationFrame(() => draw(ctx));
  });

  onDestroy(() => {
    if (frameId){
      cancelAnimationFrame(frameId)
    }
  });

  function draw(ctx) {
    fnsToDraw.forEach((fn) => fn(ctx));
    requestAnimationFrame(() => {
      clear();
      draw(ctx);
    });
  }

function clear() {
  canvasElement?.getContext("2d").clearRect(0,0,width, height);
}

</script>

<canvas
{width}
{height}
on:mousemove={(e) => {
  dispatch('mousemove', {
    e,
    canvas: canvasElement?.getContext("2d")
  });
}}
on:touchmove={(e) => {
  dispatch('touchmove', {
    e,
    canvas: canvasElement?.getContext("2d")
  });
}}
on:touchend={(e) => {
  dispatch('touchend', {
    e,
    canvas: canvasElement?.getContext("2d")
  });
}}
on:touchstart={(e) => {
  dispatch('touchstart', {
    e,
    canvas: canvasElement?.getContext("2d")
  });
}}
on:mousedown={(e) => {
  dispatch('mousedown', {
    e,
    canvas: canvasElement?.getContext("2d"),
  });
}}
on:mouseup
on:mouseleave
on:click
bind:this={canvasElement} />
<slot />

