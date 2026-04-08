<script>
    import{untrack} from "svelte"
    let size = $state(50)
    let color = $state("#ff3e00")

    let canvas

    $effect(() => {
        const context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = untrack (() => color)
    context.fillRect(0, 0, size, size)
    })
    
</script>

<h3>canvas square</h3>

<article>
    <canvas bind:this={canvas} width="100" height="100"></canvas>

    <nav>
        <label>
            size: <input type="range" bind:value={size}>
        </label>

        <label>
            color: <input type="color" bind:value={color}>
        </label>
    </nav>
</article>

<style>
    article {
        display: flex;
        gap: 1em;
        align-items: end;
    }

    canvas{
        border: solid 1px black;
    }

    nav {
        display: flex;
        gap: 1em;
        flex-direction: column;
    }
</style>