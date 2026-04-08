<script>
    let props = $props();
    // i props sono un oggetto che contiene tutte le proprietà passate al componente, quindi è possibile accedervi tramite $props() o tramite la sintassi $props.nomeProp
        
    let count = $state(0);
    // lo stato è reattivo, quindi quando viene modificato, il componente si aggiorna automaticamente

    let doubled = $derived(count * 2);
    // anche le variabili che dipendono dallo stato sono reattive, quindi quando count cambia, anche doubled cambia automaticamente
</script>

<h3>ClickCounter</h3>

<button onclick={() => count++}>
    clicks: {count}
</button>

<span>doubled is {doubled}</span>