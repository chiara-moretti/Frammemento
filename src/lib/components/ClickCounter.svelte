<script>
    let { initialCount: count } = $props();
    // i props sono un oggetto che contiene tutte le proprietà passate al componente, quindi è possibile accedervi tramite $props() o tramite la sintassi $props.nomeProp

    let doubled = $derived(count * 2);
    // anche le variabili che dipendono dallo stato sono reattive, quindi quando count cambia, anche doubled cambia automaticamente
</script>

<h3>ClickCounter</h3>

<button onclick={() => initialCount++}>
    clicks: {initialCount}
</button>

<span>doubled is {doubled}</span>