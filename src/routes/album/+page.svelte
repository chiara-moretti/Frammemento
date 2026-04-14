<script>
	import { onMount } from 'svelte';

	const albumPdf = '/album.pdf';
	/** @type {HTMLDivElement | undefined} */
	let viewerTrack = undefined;
	let isLoading = $state(true);
	let loadError = $state('');

	onMount(async () => {
		if (!viewerTrack) return;

		try {
			const pdfjs = await import('pdfjs-dist');
			const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
			pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default;

			const loadingTask = pdfjs.getDocument(albumPdf);
			const pdf = await loadingTask.promise;

			for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
				const page = await pdf.getPage(pageNum);
				const viewport = page.getViewport({ scale: 1.2 });

				const pageShell = document.createElement('article');
				pageShell.className = 'pdf-page';

				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				if (!context) throw new Error('Canvas context non disponibile');

				canvas.width = viewport.width;
				canvas.height = viewport.height;

				pageShell.appendChild(canvas);
				viewerTrack.appendChild(pageShell);

				await page.render({ canvasContext: context, viewport, canvas }).promise;
			}
		} catch (error) {
			loadError = 'Non riesco a caricare il PDF in modalità orizzontale.';
			console.error(error);
		} finally {
			isLoading = false;
		}
	});
</script>

<main class="album-page">
	<header class="album-header">
		<p class="label">Portfolio Fotografico</p>
		<nav class="top-nav" aria-label="Navigazione principale">
			<div class="nav-dropdown">
				<a href="/temi" class="temi-link">temi</a>
				<div class="submenu">
					<a href="/temi/persone">persone</a>
					<a href="/temi/ritratti">ritratti</a>
					<a href="/temi/natura">natura</a>
					<a href="/temi/citta">città</a>
				</div>
			</div>
			<a href="#about">about</a>
			<a href="/album">album</a>
			<a href="/">home</a>
			<a href="https://instagram.com/frammemento" target="_blank" rel="noreferrer">@frammemento</a>
		</nav>
		<h1>Album 2025</h1>
	</header>

	<section class="frame-wrap" aria-label="Visualizzatore album con sfoglio orizzontale">
		{#if isLoading}
			<p class="status">Caricamento album...</p>
		{:else if loadError}
			<p class="status error">{loadError}</p>
		{/if}

		<div class="pdf-track" bind:this={viewerTrack}></div>
	</section>
</main>

<style>
	:global(html),
	:global(body) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		background: #fff;
		color: #000;
		font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	.album-page {
		height: 100dvh;
		padding: 1rem;
		display: grid;
		grid-template-rows: auto 1fr;
		gap: 1rem;
	}

	.album-header {
		position: relative;
		display: grid;
		border-bottom: 4px solid #000;
		padding: 1.8rem 0 0.6rem;
	}

	.label {
		margin: 0 0 0.4rem;
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: #ff5f1f;
	}

	.top-nav {
		position: absolute;
		top: 0;
		right: 0;
		display: flex;
		gap: 0.9rem;
		font-size: 0.86rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 700;
	}

	h1 {
		margin: 0;
		font-size: clamp(1.7rem, 5vw, 3.2rem);
		text-transform: uppercase;
		letter-spacing: -0.02em;
	}

	.top-nav a {
		color: #000;
		text-decoration: none;
		border-bottom: 2px solid transparent;
		padding-bottom: 0.1rem;
	}

	.top-nav a:hover,
	.top-nav a:focus-visible,
	.temi-link:hover,
	.temi-link:focus-visible {
		border-bottom-color: #ff5f1f;
		color: #ff5f1f;
	}

	.nav-dropdown {
		position: relative;
	}

	.submenu {
		position: absolute;
		top: calc(100% + 0.35rem);
		left: 50%;
		transform: translateX(-50%);
		display: none;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.5rem 0.6rem;
		border: 2px solid #000;
		background: #fff;
		min-width: 8.5rem;
		z-index: 10;
	}

	.nav-dropdown:hover .submenu,
	.nav-dropdown:focus-within .submenu {
		display: flex;
	}

	.submenu a {
		padding: 0.1rem 0;
	}

	.frame-wrap {
		border: 3px solid #000;
		background: #fff7f2;
		padding: 0.75rem;
		overflow-x: auto;
		overflow-y: hidden;
		position: relative;
	}

	.pdf-track {
		height: 100%;
		display: flex;
		gap: 1rem;
		align-items: center;
		width: max-content;
		min-width: 100%;
	}

	:global(.pdf-page) {
		flex: 0 0 auto;
		height: 100%;
		border: 2px solid #000;
		background: #fff;
		padding: 0.4rem;
		scroll-snap-align: start;
	}

	:global(.pdf-page canvas) {
		display: block;
		height: 100%;
		width: auto;
		max-width: none;
	}

	.status {
		position: absolute;
		top: 1.2rem;
		left: 1.2rem;
		margin: 0;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		background: #fff;
		border: 2px solid #000;
		padding: 0.35rem 0.6rem;
	}

	.status.error {
		color: #ff5f1f;
	}

	@media (max-width: 740px) {
		.album-header {
			padding-top: 3.8rem;
		}

		.top-nav {
			left: 0;
			right: 0;
			justify-content: flex-end;
			flex-wrap: wrap;
			gap: 0.5rem 0.9rem;
		}
	}
</style>
