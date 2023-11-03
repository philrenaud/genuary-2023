<main>
  <div>
    <h1>Genuary 2023 &middot; Phil Renaud</h1>
    <ul>
      <li><a href="/1">1: Perfect Loop</a></li>
      <li><a href="/3">3: Glitch</a></li>
      <li><a href="/4">4: Intersections</a></li>
      <li><a href="/14">14: Asemic Writing</a></li>
      <li><a href="/xx">xx: Paris</a></li>
    </ul>
  </div>
</main>

<style lang="scss">

  @font-face {
    font-family: 'PressStart2P';
    src: url('PressStart2P-Regular.ttf');
  }
  main {
    background: #000;
    position: fixed;
    width: 100vw;
    height: 100vh;
    margin: auto;
    color: white;
    text-align: center;
    font-family: 'PressStart2P', monospace;
    display: grid;
    align-items: center;
    justify-items: center;

    h1, li a {
      padding: 1rem 0;
    }

    a {
      color: greenyellow;
      text-decoration: none;
      display: block;
      &:hover {
        background: greenyellow;
        color: black;
      }
    }
  }
</style>