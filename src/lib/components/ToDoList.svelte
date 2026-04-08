<script>
    let todos = $state([
        { title: "Assignment 1", done: false },
        { title: "Assignment 2", done: false },
        { title: "Assignment 3", done: false },
    ]);
</script>

<h3>My Todos</h3>

<ul>
    {#each todos as todo}
        <li>
            <input type="checkbox" bind:checked={todo.done}/>
            (todo.title)</li>
    {/each}
</ul>