<svelte:head>
  <title>Genuary #14: Asemic Writing</title>
</svelte:head>


<script lang="ts">
  import Canvas from "$lib/Canvas.svelte";
	import Scribble from "$lib/Scribble.svelte";
  import { getContext, setContext, onDestroy, onMount } from "svelte";
  import type { Point, CanvasContext } from "./lib/types";

  type Scribble = {
    start: Point;
    end: Point;
    points: Point[];
  };

  let height: number = 100;
  let width: number = 100;

  $: numberOfLines = height / 40;
  $: maxNumberOfScribblesPerLine = width / 20;
  let memo;

  $: scribbles = Array.from({ length: numberOfLines }, (_, i) => {
    let numberOfScribbles = 1 + Math.floor(Math.random() * maxNumberOfScribblesPerLine); // random number of scribbles per line
    return Array.from({ length: numberOfScribbles }, (_, j) => {
      let scribble: Partial<Scribble> = {
        start: [j * (width / maxNumberOfScribblesPerLine), i * (height / numberOfLines)],
        end: [j * (width / maxNumberOfScribblesPerLine), i * (height / numberOfLines) + height / numberOfLines - 10]
      };
      scribble.points = Array.from({ length: Math.random() * 8 }, (_, k) => {
        let x = Math.random() * (scribble.end[0] - scribble.start[0]) + scribble.start[0] + (Math.random() * (width / maxNumberOfScribblesPerLine / 2));
        let y = Math.random() * (scribble.end[1] - scribble.start[1]) + scribble.start[1] + (Math.random() * 5);
        return [x, y];
      });
      return scribble;
    });
  }).flat();
  $: {
    memo = scribbles[0].points.length ? Date.now() : memo;
  }
</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
  <Canvas
    {height}
    {width}
    reDraw={false}
    {memo}
  >
  {#each scribbles as scribble, i}
    <Scribble {...scribble}
    />
  {/each}
  </Canvas>
</main>

<style>
main {
  width: 80vw;
  height: 80vh;
  margin: 10vh auto;
  box-sizing: border-box;
  overflow: hidden;
  /* box-shadow: 1px 1px 0 1px rgba(0, 0, 0, 0.1), inset 0 0 50px 0px rgba(0, 0, 0, 0.1); */
  -webkit-touch-callout:none;
    -ms-touch-action:none; touch-action:none;
}
</style>
