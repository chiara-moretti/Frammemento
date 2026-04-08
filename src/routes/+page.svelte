<script>
    console.log("Hello world")

    import ClickCounter from "$lib/components/ClickCounter.svelte";
    // è possibile importare componenti da altri file e usarli come tag HTML

    let count = $state(5);

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<ClickCounter initialCount={(count)}/>
<p>count from parent: {count}</p>

<style>
    h1 {
        color: deepskyblue;
    }
</style>

