<svelte:head>
  <title>Genuary #1: Perfect Loop</title>
</svelte:head>

<script>
  import Canvas from "$lib/Canvas.svelte";
	import Circle from "$lib/Circle.svelte";
  import { onMount } from "svelte";

  let width = 500;
  let height = 500;

  let circleSize = 20;

  $: buffer = Math.min(100, Math.min(width, height) / 8);

  $: radius = Math.min(width, height) / 2 - buffer;

  let circleAnimationAdjustment = 0;

  onMount(() => {
    setInterval(() => {
      circleAnimationAdjustment += 1;
    }, 1);
  });

  $: numberOfCircles = 0 + circleAnimationAdjustment;

  const PHI = (1 + Math.sqrt(5)) / 2;

  $: circles = Array.from({ length: numberOfCircles }, (_, i) => {
    let percent = i / numberOfCircles;
    let size = circleSize * percent;
    let r = radius * percent;
    let t = i * Math.PI * 2 * PHI;
    let x = width / 2 + Math.cos(t) * r;
    let y = height / 2 + Math.sin(t) * r;
    return {
      r: size,
      x: x,
      y: y,
      color: `hsla(${numberOfCircles}, 70%, 70%, ${1-percent+0.1})`,
      opacity: percent,
    };
  });
</script>

<main
bind:clientHeight={height}
bind:clientWidth={width}
>
<Canvas
  {height}
  {width}
  >
  {#each circles as circle}
    <Circle midPoint={[circle.x, circle.y]} radius={circle.r} color={circle.color} />
  {/each}
</Canvas>
</main>

<style lang="scss">
  main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    color: #333;
    font-family: Georgia, serif;
  }
</style>