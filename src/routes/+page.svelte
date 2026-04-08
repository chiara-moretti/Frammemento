<script>
    import { website } from "$lib/state.svelte.js";
    import ClickCounter from "$lib/components/ClickCounter.svelte";
    // è possibile importare componenti da altri file e usarli come tag HTML
    import CanvasSquare from "$lib/components/CanvasSquare.svelte";
    import ToDoList from "$lib/components/ToDoList.svelte";
    import TitleEditor from "$lib/components/TitleEditor.svelte";

    let count = $state(5);
</script>

<h1>{website.title}</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<TitleEditor />

<ClickCounter bind:initialCount={count}/>

{#if count > 10 && count < 20}
    <p>count from parent is {count}</p>
{:else if count > 30}
    <p>that's a lot of clicks!</p>   
{/if}

<CanvasSquare />
<ToDoList />

<style>
    h1 {
        color: deepskyblue;
    }
</style>

