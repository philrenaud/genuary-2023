<svelte:head>
  <title>Genuary #4: Intersections</title>
</svelte:head>


<script lang="ts">
  import Canvas from "$lib/Canvas.svelte";
	import Curve from "$lib/Curve.svelte";
  import IntersectionCircle from "$lib/IntersectionCircle.svelte";
  import { getContext, setContext, onDestroy, onMount } from "svelte";
  import type { Point, CanvasContext } from "./lib/types";
  import {range} from "d3-array";
  let canvasContext = getContext("canvas") as CanvasContext;

  let height: number;
  let width: number;
  let mouseX;
  let mouseY;
  onMount(() => {
    mouseX = width / 2;
    mouseY = 0;
  });


  // 80% width and height box
  $: box = {
    x: width * 0.25,
    y: height * 0.25,
    width: width * 0.5,
    height: height * 0.5,
  };

  // Set the number of curves to draw
  const numCurves = 50;

  $: maxThickness = box.height / numCurves / 10;

  // Calculate the space between each curve
  $: curveSpacing = box.height / numCurves;

  function followMouse(e, canvas) {
    canvas.clearRect(0, 0, width, height)
    if (!canvasContext) canvasContext = canvas;
    let rect = e.target.getBoundingClientRect();
    mouseX = (e.clientX || e.touches[0].clientX) - rect.left;
    mouseY = (e.clientY || e.touches[0].clientY) - rect.top;
  }

  $: intersectsWithCircle = (curve, circle) => {
    if (!canvasContext) return false;
    // Check if the curve intersects with the circle by creating a temporary path
    // and using the isPointInPath method
    const { start, end, controlPoint } = curve;
    const { midPoint, radius } = circle;

    const context = canvasContext as CanvasRenderingContext2D;
    // console.log('context?', context, canvasContext);
    // context.beginPath();
    // context.moveTo(start[0], start[1]);
    // context.quadraticCurveTo(controlPoint[0], controlPoint[1], end[0], end[1]);
    // console.log('hm', context.isPointInPath(midPoint[0], midPoint[1]))
// Create circle
const aCircle = new Path2D();
aCircle.arc(midPoint[0], midPoint[1], radius, 0, 2 * Math.PI);
// canvasContext.fillStyle = 'red';
// canvasContext.fill(aCircle);

    return context.isPointInPath(aCircle, start[0], start[1]);
  };


  // Use a map function to create the curves and set their coordinates
  $: curves = Array.from({ length: numCurves }, (_, i) => {
    let start = [box.x, box.y + i * curveSpacing] as Point;
    let end = [box.x + box.width, box.y + i * curveSpacing] as Point;

    let controlPoint = [mouseX, mouseY] as Point;

    // calculate the y-coordinate of the curve
    let y = start[1] + (end[1] - start[1]) / 2;
    // calculate the distance between the curve's y-coordinate and the mouse's y-coordinate
    let distance = Math.abs(mouseY - y);

    // use the distance to adjust the curve width
    let thickness = (mouseX / width) * maxThickness + 1;
    // let thickness = 1;

    // use the distance to adjust the hue of the curve's color
    let hue = (distance / box.height) * 50 + 250;

    let intersects = false;
    // if (canvasContext) {
    //   intersects = canvasContext.isPointInPath(mockCircle, start[0], start[1]);
    //   console.log(i, intersects)
    // }
    let color = `hsl(${hue}, 100%, 50%)`;
    // let color = "black";
    // let color = `hsl(${i === 0 ? 0 : hue}, 70%, 50%)`;

    return { start, controlPoint, end, color, thickness };
  });

  $: circle = {
    midPoint: [mouseX, mouseY],
    // radius: the smaller of 50px or 1/5th the width of the box
    radius: Math.min(100, box.width / 5),
    // color: "rgba(255, 255, 255, 0.5)",
    color: "rgba(255,255,255,1)"
    // color: "black"
  };

  let mockCircle: Path2D;
  $: {
    if (canvasContext) {
      mockCircle = new Path2D();
      mockCircle.arc(circle.midPoint[0], circle.midPoint[1], circle.radius, 0, 2 * Math.PI);
      
    }
  }

</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
  <Canvas
    {height}
    {width}
    on:mousemove={({detail: {e, canvas}}) => {
      followMouse(e, canvas);
    }}
    on:touchmove={({detail: {e, canvas}}) => {
      e.preventDefault();
      followMouse(e, canvas);
    }}
  >
  <IntersectionCircle midPoint={circle.midPoint} radius={circle.radius} color={circle.color} />

    <!-- Nooooo idea why my last curve is showing up first, and my first curve second, etc... but it is. Throwing a Hail Mary to range() -->
    {#each range(0, curves.length) as _, i}
      <Curve start={curves[i].start} controlPoint={curves[i].controlPoint} end={curves[i].end}
        color={(curves[i+1] || curves[0]).color}
        thickness={curves[i].thickness}
        circlePath={mockCircle}
      />
    {/each}

  </Canvas>
  <!-- <div class="overlay"></div> -->
</main>

<style>
main {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  /* box-shadow: 1px 1px 0 1px rgba(0, 0, 0, 0.1), inset 0 0 50px 0px rgba(0, 0, 0, 0.1); */
  -webkit-touch-callout:none;
    -ms-touch-action:none; touch-action:none;
}

.overlay {
  width: 50vw;
  height: 50vh;
  position: fixed;
  top: 25vh;
  left: 25vw;
  border: 20px solid white;
  box-sizing: border-box;
  z-index: -1;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  padding: 0;
  margin: 0;

}
</style>
