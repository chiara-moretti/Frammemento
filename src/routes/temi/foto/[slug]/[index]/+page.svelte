<script>
	import { base } from '$app/paths';

	let { data } = $props();

	const themeHref = $derived(`${base}/temi/${data.slug}`);

	/** @type {HTMLImageElement | null} */
	let imgEl = $state(null);
	/** @type {'unknown' | 'landscape' | 'portrait'} */
	let photoOrientation = $state('unknown');

	function setOrientationFromImage() {
		if (!imgEl?.naturalWidth) {
			photoOrientation = 'unknown';
			return;
		}
		photoOrientation = imgEl.naturalWidth >= imgEl.naturalHeight ? 'landscape' : 'portrait';
	}

	$effect(() => {
		data.photo.url;
		photoOrientation = 'unknown';
		queueMicrotask(() => {
			if (imgEl?.complete && imgEl.naturalWidth) setOrientationFromImage();
		});
	});
</script>

<main class="photo-detail">
	<div class="photo-top">
		<a class="back-link" href={themeHref} aria-label={`Torna al tema ${data.themeTitle}`}>
			<svg class="back-icon" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M15 6 9 12 15 18"
					fill="none"
					stroke="currentColor"
					stroke-width="3.1"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
	</div>
	<div class="header-line" aria-hidden="true"></div>

	<section class="detail-content">
		<div class="photo-column">
			<figure
				class="photo-stage"
				class:is-landscape={photoOrientation === 'landscape'}
				class:is-portrait={photoOrientation === 'portrait'}
			>
				<img
					bind:this={imgEl}
					src={data.photo.url}
					alt={data.photo.alt}
					loading="eager"
					onload={setOrientationFromImage}
				/>
			</figure>
		</div>

		<aside class="description-panel">
			<p class="description-title">{data.themeTitle}</p>
			{#if data.description}
				<p class="description">{data.description}</p>
			{:else}
				<p class="description description-empty">Descrizione in arrivo.</p>
			{/if}
		</aside>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		background: #fff;
		color: #000;
		font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	.photo-detail {
		--photo-nav-align-top: 0.8rem;
		--photo-back-size: 1.85rem;
		--photo-line-gap: 0.42rem;
		--photo-line-h: 5px;
		--photo-line-side-space: 1rem;
		--photo-column-left-pad: 1rem;
		--photo-landscape-stage-w: calc(50vw - var(--photo-column-left-pad));
		--photo-content-after-header: calc(
			var(--photo-nav-align-top) + var(--photo-back-size) + var(--photo-line-gap) + var(--photo-line-h) +
				0.85rem
		);
		--photo-detail-pad-bottom: 1rem;
		--photo-portrait-bottom-margin: 1.15rem;
		/* Altezza utile area foto (sotto header fisso + margini) */
		--photo-fill-height: calc(
			100dvh - var(--photo-content-after-header) - var(--photo-detail-pad-bottom) -
				var(--photo-portrait-bottom-margin) - env(safe-area-inset-bottom, 0px)
		);
		min-height: calc(100dvh - 5rem);
		max-width: 100%;
		padding: var(--photo-content-after-header) 1rem 1rem 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.photo-top {
		position: fixed;
		top: var(--photo-nav-align-top);
		left: 1rem;
		z-index: 99;
		display: flex;
		align-items: center;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--photo-back-size);
		height: var(--photo-back-size);
		padding: 0;
		color: #000;
		text-decoration: none;
		border: 1.5px solid #000;
		background: #fff;
		box-sizing: border-box;
	}

	.back-icon {
		display: block;
		flex-shrink: 0;
		width: 0.92rem;
		height: 0.92rem;
	}

	.back-link:hover,
	.back-link:focus-visible {
		color: #ff5f1f;
		border-color: #ff5f1f;
	}

	.header-line {
		position: fixed;
		top: calc(var(--photo-nav-align-top) + var(--photo-back-size) + var(--photo-line-gap));
		left: var(--photo-line-side-space);
		width: calc(100% - (var(--photo-line-side-space) * 2));
		height: var(--photo-line-h);
		background: #000;
		z-index: 98;
	}

	.detail-content {
		display: grid;
		grid-template-columns: 50vw minmax(0, 1fr);
		align-items: flex-start;
		column-gap: 1rem;
		row-gap: 0.85rem;
	}

	.photo-column {
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		padding-left: var(--photo-column-left-pad);
	}

	.photo-stage {
		margin: 0;
		overflow: hidden;
		border: 3px solid #000;
		background: #fff;
		box-sizing: border-box;
	}

	/*
	 * Metà schermo (prima colonna griglia = 50vw, meno padding sinistro sulla colonna):
	 * riquadro con larghezza e altezza fisse; l’immagine in contain occupa il massimo possibile senza tagli.
	 */
	.photo-stage:not(.is-landscape) {
		width: 100%;
		height: var(--photo-fill-height);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.photo-stage:not(.is-landscape) img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center;
	}

	.photo-stage.is-landscape {
		width: var(--photo-landscape-stage-w);
		min-width: var(--photo-landscape-stage-w);
		max-width: var(--photo-landscape-stage-w);
		height: var(--photo-fill-height);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.photo-stage.is-landscape img {
		display: block;
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
		object-position: center;
	}

	.description-panel {
		flex: 1 1 0;
		min-width: 0;
		padding: 0.15rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.description-title {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #ff5f1f;
	}

	.description {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.5;
		max-width: 48ch;
	}

	.description-empty {
		opacity: 0.7;
		font-style: italic;
	}

	@media (max-width: 740px) {
		.photo-detail {
			--photo-nav-align-top: 0.75rem;
			--photo-line-side-space: 0.65rem;
			--photo-column-left-pad: 0.65rem;
			--photo-content-after-header: 0;
			--photo-detail-pad-bottom: 0.75rem;
			--photo-portrait-bottom-margin: 0.65rem;
			--photo-mobile-stack-before-photo: 5.85rem;
			--photo-fill-height: calc(
				100dvh - var(--photo-mobile-stack-before-photo) - var(--photo-detail-pad-bottom) -
					var(--photo-portrait-bottom-margin) - env(safe-area-inset-bottom, 0px)
			);
			min-height: calc(100dvh - 4.6rem);
			padding: 0.5rem 0.65rem 0.75rem 0;
		}

		.photo-top {
			position: static;
			z-index: auto;
			margin-bottom: 0.35rem;
		}

		.header-line {
			position: static;
			width: 100%;
			margin-bottom: 0.65rem;
			z-index: auto;
		}

		.detail-content {
			display: flex;
			flex-direction: column;
			gap: 0.85rem;
		}

		.photo-column {
			width: 100%;
			max-width: 100%;
			padding-left: var(--photo-column-left-pad);
		}

		.description-panel {
			padding: 0;
		}

		.description {
			font-size: 0.82rem;
		}

	}
</style>
