<script>
    let props = $props();
    // i props sono un oggetto che contiene tutte le proprietà passate al componente, quindi è possibile accedervi tramite $props() o tramite la sintassi $props.nomeProp
    let { initialCount =$bindable} = props;
    let count = $state(props.initialCount);
    // lo stato è reattivo, quindi quando viene modificato, il componente si aggiorna automaticamente

    let doubled = $derived(count*2);
    // anche le variabili che dipendono dallo stato sono reattive, quindi quando count cambia, anche doubled cambia automaticamente
</script>

<ClickCounter bind:initialCount={initialCount}/>
<h3>ClickCounter</h3>

<button on:click={() => (count++)}>
    click: {count}
</button>

<span>doubled is {doubled}</span>