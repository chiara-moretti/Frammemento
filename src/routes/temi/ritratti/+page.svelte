<script>
	import ThemeSlider from '$lib/components/ThemeSlider.svelte';

	/** @type {{ data: { title: string; photos: { url: string; alt: string }[] } }} */
	let { data } = $props();
</script>

<ThemeSlider title={data.title} photos={data.photos} />
