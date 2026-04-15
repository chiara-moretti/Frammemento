<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	const albumPdf = `${base}/album.pdf`;
	/** @type {HTMLDivElement | undefined} */
	let viewerTrack = undefined;
	let useNativeFallback = $state(false);
	let isLoading = $state(true);
	let loadError = $state('');

	onMount(async () => {
		if (!viewerTrack) return;
		const track = viewerTrack;

		try {
			const isMobileViewport = window.matchMedia('(max-width: 740px)').matches;
			const renderScale = isMobileViewport ? 1 : 1.2;
			const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
			/** @param {boolean} useWorker */
			const renderPdf = async (useWorker) => {
				track.innerHTML = '';

				/** @type {any} */
				const documentSource = useWorker ? albumPdf : { url: albumPdf, disableWorker: true };

				const loadingTask = pdfjs.getDocument(documentSource);
				const pdf = await loadingTask.promise;

				for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
					const page = await pdf.getPage(pageNum);
					const viewport = page.getViewport({ scale: renderScale });

					const pageShell = document.createElement('article');
					pageShell.className = 'pdf-page';

					const canvas = document.createElement('canvas');
					const context = canvas.getContext('2d');
					if (!context) throw new Error('Canvas context non disponibile');

					canvas.width = viewport.width;
					canvas.height = viewport.height;

					pageShell.appendChild(canvas);
					track.appendChild(pageShell);

					await page.render({ canvasContext: context, viewport, canvas }).promise;
				}
			};

			try {
				const workerModule = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url');
				pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default;
				await renderPdf(true);
			} catch (workerError) {
				console.warn('Worker PDF non disponibile, uso fallback senza worker.', workerError);
				await renderPdf(false);
			}
		} catch (error) {
			useNativeFallback = true;
			loadError = '';
			console.error(error);
		} finally {
			isLoading = false;
		}
	});
</script>

<main class="album-page">
	<header class="album-header">
		<p class="label">Portfolio Fotografico</p>
		<h1>Album 2025</h1>
	</header>

	<section id="about" class="frame-wrap" aria-label="Visualizzatore album con sfoglio orizzontale">
		{#if isLoading}
			<p class="status">Caricamento album...</p>
		{:else if useNativeFallback}
			<iframe
				class="native-pdf"
				title="Album PDF"
				src={`${albumPdf}#view=FitH`}
				loading="lazy"
			></iframe>
		{:else if loadError}
			<p class="status error">{loadError}</p>
		{/if}

		<div class="pdf-track" class:hidden={useNativeFallback} bind:this={viewerTrack}></div>
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
		padding: 0 0 0.6rem;
	}

	.label {
		margin: 0 0 0.4rem;
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: #ff5f1f;
	}

	h1 {
		margin: 0;
		font-size: clamp(1.7rem, 5vw, 3.2rem);
		text-transform: uppercase;
		letter-spacing: -0.02em;
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

	.pdf-track.hidden {
		display: none;
	}

	.native-pdf {
		width: 100%;
		height: 100%;
		border: 2px solid #000;
		background: #fff;
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
		.album-page {
			height: auto;
			min-height: calc(100dvh - 4.6rem);
		}

		.album-header {
			padding-top: 0.2rem;
		}

		.frame-wrap {
			height: 59dvh;
			min-height: 59dvh;
			padding: 0.55rem;
			overflow-x: auto;
			overflow-y: hidden;
			-webkit-overflow-scrolling: touch;
			scroll-snap-type: x proximity;
			touch-action: pan-x;
		}

		.pdf-track {
			height: 100%;
			gap: 0.65rem;
			align-items: stretch;
		}

		:global(.pdf-page) {
			height: 100%;
			padding: 0.3rem;
		}

		:global(.pdf-page canvas) {
			width: auto;
			height: 100%;
			max-height: 100%;
		}

		.native-pdf {
			height: 100%;
			min-height: 0;
		}
	}
</style>
