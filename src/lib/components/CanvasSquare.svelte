<script>
    let size = $state(50);
    let color = $state("#ff3e00");

    let canvas 
    
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
</script>

<h3>Canvas Square</h3>

<article>
    <canvas bind:this(canvas) width="100" height="100"></canvas>

    <nav>
        <label>
            Size: <input type="range">
        </label>

        <label>
            Color: <input type="color">
        </label>
    </nav>
</article>

<style>
    article {
        display: flex;
        gap: 1em;
        align-items: end;
    }

    canvas {
        border: 1px solid black;
    }

    nav {
        display: flex;
        gap: 1em;
        flex-direction: column;
    }
</style>