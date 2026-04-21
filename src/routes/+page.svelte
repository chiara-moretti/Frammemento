<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import AboutManifestoSection from '$lib/components/AboutManifestoSection.svelte';
	import CylinderPhotoSection from '$lib/components/CylinderPhotoSection.svelte';
	import HomeHero3DSection from '$lib/components/HomeHero3DSection.svelte';
	import HomePhotoWheelSection from '$lib/components/HomePhotoWheelSection.svelte';

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
	<section id="home-top" class="top-fold">
		<section class="hero scroll-bar-anchor">
			<p class="label">Portfolio Fotografico</p>
			<h1>Frammemento</h1>
		</section>

		<AboutManifestoSection {albumPdf} />
	</section>

	<CylinderPhotoSection />

	<section class="first-screen">
		<HomeHero3DSection />
	</section>

	<HomePhotoWheelSection />

	<footer class="mobile-footer" aria-label="Link social">
		<a
			class="instagram-button"
			href="https://instagram.com/frammemento"
			target="_blank"
			rel="noreferrer"
		>
			Apri Instagram
		</a>
	</footer>

	<footer class="back-top-footer" aria-label="Navigazione pagina">
		<a class="back-top-button" href="#home-top">Torna all'inizio</a>
	</footer>
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
		overflow-y: auto;
		overflow-x: clip;
	}

	.page {
		min-height: 100dvh;
		width: 100%;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		overflow-x: clip;
	}

	.first-screen {
		height: 100dvh;
		min-height: 100dvh;
		display: flex;
		align-items: stretch;
	}

	.top-fold {
		min-height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr;
		padding-bottom: 0.9rem;
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
		text-align: left;
	}

	.mobile-footer {
		display: none;
	}

	.back-top-footer {
		display: flex;
		justify-content: center;
		padding: 0 0 2rem;
	}

	.back-top-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.5rem;
		padding: 0.55rem 1.1rem;
		border: 2px solid #000;
		background: #fff;
		color: #000;
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		text-decoration: none;
	}

	.back-top-button:active {
		transform: scale(0.98);
	}

	@media (max-width: 740px) {
		:global(html.route-home body) {
			overflow-y: auto;
			overflow-x: clip;
		}

		.page {
			min-height: 100dvh;
			width: 100%;
			max-width: 100%;
			display: grid;
			padding: 1rem;
			gap: 1rem;
		}

		.first-screen {
			height: 100dvh;
			min-height: 100dvh;
		}

		.top-fold {
			height: auto;
			min-height: 100dvh;
			display: grid;
			grid-template-rows: auto 1fr;
			gap: 1rem;
			padding: 0;
			overflow-y: auto;
			overflow-x: clip;
			-webkit-overflow-scrolling: touch;
		}

		.hero {
			position: relative;
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

		.mobile-footer {
			display: flex;
			justify-content: center;
			padding: 0.1rem 0 0.35rem;
		}

		.instagram-button {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-height: 2.6rem;
			padding: 0.55rem 1.15rem;
			border: 2px solid #000;
			background: #fff;
			color: #000;
			font-size: 0.9rem;
			font-weight: 700;
			letter-spacing: 0.02em;
			text-transform: uppercase;
			text-decoration: none;
		}

		.instagram-button:active {
			transform: scale(0.98);
		}

		.back-top-footer {
			padding: 0 0 1rem;
		}

	}
</style>
