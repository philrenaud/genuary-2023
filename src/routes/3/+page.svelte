<svelte:head>
  <title>Genuary #3: Glitch</title>
</svelte:head>

<script>
  import Canvas from "$lib/Canvas.svelte";
	import Square from "$lib/Square.svelte";
  import {range} from "d3-array";

  let width = 500;
  let height = 500;

  let columns = 20;

  let maxDistance = columns*.5;

  let grid = range(0, columns).map(i =>
    range(0, columns).map(j => ({
      x: j,
      y: i,
      color: `hsla(100, 100%, 70%, 0.9)`,
      distance: 0
    }))
  ).flat();

  $: squares = grid.map(s => ({
    ...s,
      x: s.x * (width / columns), // x position based on column number
      y: s.y * (width / columns), // y position based on row number
      length: width / columns, // square length based on number of columns
      color: `hsla(100, 100%, 70%, ${1 - s.distance * 0.1})`,
  }));

  let mouseX;
  let mouseY;

  function followMouse(e, canvas) {
    canvas.clearRect(0, 0, width, height);
    let rect = e.target.getBoundingClientRect();
    mouseX = (e.clientX || e.touches[0].clientX) - rect.left;
    mouseY = (e.clientY || e.touches[0].clientY) - rect.top;

    // Which square am I over?
    let x = Math.floor(mouseX / (width / columns));
    let y = Math.floor(mouseY / (width / columns));
    let square = grid[y * columns + x];

    // square.distance = 0;

    // Set the distance of the current square and its neighbors
    setSquareDistance(square, 0);

    // Update the squares array
    grid = [...grid];
  }

  function setSquareDistance(square, distance) {
    square.distance = distance;
    if (distance < maxDistance) {
      let {x, y} = square;
      let neighbors = [
        grid[(y - 1) * columns + (x - 1)], // top left
        grid[(y - 1) * columns + x], // top center
        grid[(y - 1) * columns + (x + 1)], // top right
        grid[y * columns + (x - 1)], // middle left
        grid[y * columns + (x + 1)], // middle right
        grid[(y + 1) * columns + (x - 1)], // bottom left
        grid[(y + 1) * columns + x], // bottom center
        grid[(y + 1) * columns + (x + 1)], // bottom right
      ].filter(Boolean); // remove any null values
      setTimeout(() => {
        neighbors.forEach((neighbor) => {
          if (neighbor.distance === 0) {
            setSquareDistance(neighbor, distance + 1);
          }
        });
        grid = [...grid];
      }, 100);
      if (distance < maxDistance) {
        setTimeout(() => {
          diminishSquare(square);
        }, 500);
      }
    }
  }

  // Recursively diminishes until distance is 0 again
  function diminishSquare(square) {
    if (square.distance > 0) {
      square.distance -= 1;
      grid = [...grid];
      setTimeout(() => {
        diminishSquare(square);
      }, 50);
    }
  }

</script>

<main
  bind:clientHeight={height}
  bind:clientWidth={width}
>
  <Canvas
    on:mousemove={({detail: {e, canvas}}) => {
      followMouse(e, canvas);
    }}
    on:touchmove={({detail: {e, canvas}}) => {
      e.preventDefault();
      followMouse(e, canvas);
    }}
    {height}
    {width}
    >
    {#each squares as square}
      <Square x={square.x} y={square.y} length={square.length} color={square.color} />
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