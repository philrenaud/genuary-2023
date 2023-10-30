<svelte:head>
  <title>Genuary xx: Paris October 2023</title>
</svelte:head>


<script lang="ts">
  import Canvas from "$lib/Canvas.svelte";
	import Line from "$lib/Line.svelte";
	import Lines from "$lib/Lines.svelte";
  import IntersectionCircle from "$lib/IntersectionCircle.svelte";
  import { getContext, setContext, onDestroy, onMount } from "svelte";
  import type { Point, CanvasContext } from "./lib/types";
  import {range} from "d3-array";
  let canvasContext = getContext("canvas") as CanvasContext;

  let height: number;
  let width: number;
  let mouseX = 0;
  let mouseY = 0;

  let gapLikelihood = 0.05;


  // onMount(() => {
  //   mouseX = width / 2;
  //   mouseY = 0;
  // });


  // 80% width and height box
  $: box = {
    // x: width * 0.1,
    x: mouseX,
    // y: height * 0.1,
    y: mouseY,
    // width: width * 0.8,
    width: width - mouseX*2,
    height: height * 0.8,
  };

  $: buffbox = {
    x: box.x - buffer,
    y: box.y - buffer,
    width: box.width + buffer*2,
    height: box.height + buffer,
  }
  
  let boxLineSegments: LineSegment[] = [];
  $: buffer = lineSpacing;
  $: boxLineSegments = [
    {
      start: [buffbox.x, buffbox.y],
      end: [buffbox.x + buffbox.width, buffbox.y],
    },
    {
      start: [buffbox.x + buffbox.width, buffbox.y],
      end: [buffbox.x + buffbox.width, buffbox.y + buffbox.height],
    },
    {
      start: [buffbox.x + buffbox.width, buffbox.y + buffbox.height],
      end: [buffbox.x, buffbox.y + buffbox.height],
    },
    {
      start: [buffbox.x, buffbox.y + buffbox.height],
      end: [buffbox.x, buffbox.y],
    },
  ]

  $: boxLines = boxLineSegments.map((s) => {
    console.log('boxLine recalc', mouseY);
    return segmentify(s.start, s.end, 200);
  });

  function segmentify(start: Point, end: Point, segmentCount = 1) {
    let segments = [];
    const dx = (end[0] - start[0]) / segmentCount;
    const dy = (end[1] - start[1]) / segmentCount;
    let prevEndY = start[1];  // Initialize with the y-coordinate of the line's starting point
    for (let j = 0; j < segmentCount; j++) {
      const startX = start[0] + j * dx;
      const startY = prevEndY;  // Use the y-coordinate of the last segment's end point
      const endX = startX + dx;
      const endY = startY + dy + getJitter(0.3);  // Apply jitter to the new segment's end point
      prevEndY = endY;  // Store the y-coordinate for the next segment's starting point
      // gapLikelihood check
      if (Math.random() > gapLikelihood) {
        segments.push({ start: [startX, startY], end: [endX, endY], thickness: Math.random() * maxThickness + 1 });
      }
    }

    return segments

  }


  // Set the number of curves to draw
  let numLines = 100;
  // average of 1 line every 5 pixels
  $: numLines = Math.floor(box.height / 15);

  $: maxThickness = 1;

  // Calculate the space between each curve
  $: lineSpacing = box.height / numLines;

  function followMouse(e, canvas) {
    // console.log('fm', followMouse);
    // requestAnimationFrame(() => canvas.clearRect(0, 0, width, height))
    // canvas.clearRect(0, 0, width, height) // maybe nuke this? or make conditional elsewhere?
    if (!canvasContext) canvasContext = canvas;
    let rect = e.target.getBoundingClientRect();
    mouseX = (e.clientX || e.touches[0].clientX) - rect.left;
    mouseY = (e.clientY || e.touches[0].clientY) - rect.top;
    // console.log('ahh', mouseX, mouseY)
    // Clear a space around the mouse now eh
  }

  type LineSegment = {
    start: Point;
    end: Point;
  };

  let lineSegments: LineSegment[] = [];
  let lines: Line[] = [];

  // record current time as a % of present minute to determine gap position
  let rightNow = 0;
  // $: console.log({rightNow});
  // $: rightNow = new Date().getSeconds() / 60;
  let interval;
  onMount(() => {
    interval = setInterval(() => {
      rightNow = new Date().getSeconds() / 60;
    }, 1000);
    prefersDarkMode = window?.matchMedia('(prefers-color-scheme: dark)').matches;
    // prefersDarkMode = true;
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  function getJitter(magnitude: number): number {
    return (Math.random() - 0.5) * 2 * magnitude;
  }


  // Use a map function to create the curves and set their coordinates
  $: lines = Array.from({length: numLines}, (_, i) => {

    console.log('line recalc', mouseY);

    // let distanceFromCenter = Math.abs(i - numLines / 2) * lineSpacing;
    // let distanceFromCenter = Math.abs(mouseY - box.y - i * lineSpacing);
    // let xOffset = distanceFromCenter / Math.sqrt(2);
    // let xOffset = distanceFromCenter / Math.sin(distanceFromCenter * Math.PI / 180);
    // let xOffset = Math.pow(distanceFromCenter, 1.2);
    let xOffset = 1;
    // console.log('xoff', xOffset);


    // let startX = box.x + box.width / 2 - xOffset;
    // let endX = box.x + box.width / 2 + xOffset;

    let start = [box.x, box.y + i * lineSpacing] as Point;
    let end = [box.x + box.width, box.y + i * lineSpacing] as Point;
    // let end = [mouseX, mouseY] as Point;
    const segmentCount = 200; // Divide each line into 200 segments
    let segments: LineSegment[] = segmentify(start, end, segmentCount);

    // let thickness = Math.random() * maxThickness + 1;
    
    

    // if (canvasContext) {
    //   intersects = canvasContext.isPointInPath(mockCircle, start[0], start[1]);
    //   console.log(i, intersects)
    // }
    // let hue = distancePercent * 360;
    // let color = `hsl(${hue}, 100%, 50%)`;
    // let color = "black";
    // let color = `hsl(${i === 0 ? 0 : hue}, 70%, 50%)`;
    // dark blue
    // let color = `hsl(240, 20%, 50%)`;
    let color = prefersDarkMode ? `hsl(20, 30%, 70%)` : `hsl(240, 20%, 50%)`;
    return { segments, color };
  });

  // let memo;
  // $: {
  //   memo = `${width}-${height}-${mouseX}-${mouseY}`;
  //   // console.log('memo trigger', memo);
  // }

  let prefersDarkMode = true as boolean;


</script>

<main bind:clientWidth={width} bind:clientHeight={height}
class:dark={prefersDarkMode}
>
  <Canvas
    {height}
    {width}
    reDraw={false}
    on:mousemove={({detail: {e, canvas}}) => {
      followMouse(e, canvas);
    }}
  >
  <!-- {#each boxLineSegments as segment}
    <Line start={segment.start} end={segment.end}
    thickness={3}
    />
  {/each} -->
  {#each boxLines as line}
  <Lines lines={line} color="black" />
  {/each}


  {#each lines as line}
    <Lines lines={line.segments} color={line.color} />
  {/each}

    <!-- {#each range(0, lines.length) as _, i}
      {#each lines[i].segments as segment}
        <Line start={segment.start} end={segment.end}
        color={(lines[i+1] || lines[0]).color}
        thickness={lines[i].thickness}
        />
      {/each}
    {/each} -->

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

/* use prefers-color-scheme to determine background color */
main {
  background: #000;
}
/* @media (prefers-color-scheme: light) {
  main {
    background: #fff;
  }
} */

main {
  background: #ffeee5;
}

main.dark {
    background: #00111f;
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
