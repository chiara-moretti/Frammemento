<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import AboutManifestoSection from '$lib/components/AboutManifestoSection.svelte';

	const albumPdf = `${base}/album.pdf`;

	onMount(() => {
		const root = document.documentElement;
		root.classList.add('route-home');

		if (window.location.hash === '#about') {
			goto(`${base}/about`, { replaceState: true });
		}
		return () => {
			root.classList.remove('route-home');
		};
	});
</script>

<main class="page">
	<section class="hero scroll-bar-anchor">
		<p class="label">Portfolio Fotografico</p>
		<h1>Frammemento</h1>
	</section>

	<AboutManifestoSection {albumPdf} />
</main>

<style>
	:global(html.route-home),
	:global(html.route-home body) {
		height: 100%;
	}

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	:global(html.route-home body) {
		margin: 0;
		background: #fff;
		color: #000;
		font-family: 'Helvetica Neue', Arial, sans-serif;
		overflow: hidden;
	}

	.page {
		height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr;
		padding-bottom: 0.9rem;
		box-sizing: border-box;
		overflow: hidden;
	}

	.hero {
		position: relative;
		padding: 1.6rem 1.25rem 1rem;
		border-bottom: 6px solid #000;
	}

	.label {
		margin: 0.45rem 0 0.4rem;
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: #ff5f1f;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.2rem, 8vw, 5.8rem);
		line-height: 0.95;
		text-transform: uppercase;
		letter-spacing: -0.03em;
	}

	@media (max-width: 740px) {
		:global(html.route-home body) {
			overflow-y: auto;
		}

		.page {
			height: auto;
			min-height: 100dvh;
			display: grid;
			grid-template-rows: auto 1fr;
			gap: 1rem;
			padding: 1rem;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
		}

		.hero {
			position: sticky;
			top: 0;
			z-index: 20;
			margin-top: 0;
			padding: 0.7rem 1rem 1rem;
			border: 3px solid #000;
			min-height: auto;
			background: #fff;
		}

		h1 {
			max-width: 100%;
			font-size: clamp(1.7rem, 9.4vw, 2.75rem);
			letter-spacing: -0.015em;
			line-height: 1;
			overflow-wrap: anywhere;
		}

	}
</style>
