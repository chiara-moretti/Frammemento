<script>
	import { base } from '$app/paths';

	let { data } = $props();

	const themeHref = $derived(`${base}/temi/${data.slug}`);
	const imagePanelIds = ['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
	const cropClassIds = [
		'crop-1',
		'crop-2',
		'crop-3',
		'crop-4',
		'crop-5',
		'crop-6',
		'crop-7',
		'crop-8',
		'crop-9'
	];

	/** @type {HTMLImageElement | null} */
	let imgEl = $state(null);
	/** @type {'unknown' | 'landscape' | 'portrait'} */
	let photoOrientation = $state('unknown');
	let photoAspectRatio = $state(0.66);

	function setPhotoMeta() {
		if (!imgEl?.naturalWidth || !imgEl?.naturalHeight) {
			photoOrientation = 'unknown';
			photoAspectRatio = 0.66;
			return;
		}

		photoAspectRatio = imgEl.naturalWidth / imgEl.naturalHeight;
		photoOrientation = photoAspectRatio >= 1 ? 'landscape' : 'portrait';
	}

	$effect(() => {
		data.photo.url;
		photoOrientation = 'unknown';
		photoAspectRatio = 0.66;
		queueMicrotask(() => {
			if (imgEl?.complete) setPhotoMeta();
		});
	});

	/**
	 * Hash deterministico semplice per avere variazioni stabili per foto.
	 * @param {string} value
	 */
	function hashString(value) {
		let hash = 2166136261;
		for (let i = 0; i < value.length; i += 1) {
			hash ^= value.charCodeAt(i);
			hash = Math.imul(hash, 16777619);
		}
		return hash >>> 0;
	}

	/**
	 * @param {number} seed
	 */
	function seededRandom(seed) {
		let t = seed + 0x6d2b79f5;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	}

	/**
	 * @template T
	 * @param {T[]} items
	 * @param {number} seed
	 */
	function shuffleSeeded(items, seed) {
		const out = [...items];
		let localSeed = seed;
		for (let i = out.length - 1; i > 0; i -= 1) {
			localSeed += 1;
			const j = Math.floor(seededRandom(localSeed) * (i + 1));
			[out[i], out[j]] = [out[j], out[i]];
		}
		return out;
	}

	const mosaicSeed = $derived(hashString(`${data.slug}-${data.index}-${data.photo.url}`));
	const mosaicVariant = $derived(`mosaic-${(mosaicSeed % 3) + 1}`);
	const cropClasses = $derived(shuffleSeeded(cropClassIds, mosaicSeed));
	const panelCropMap = $derived(
		Object.fromEntries(imagePanelIds.map((panelId, i) => [panelId, cropClasses[i] || 'crop-1']))
	);

	/**
	 * @param {string} panelId
	 */
	function getPanelCropClass(panelId) {
		return panelCropMap[panelId] || 'crop-1';
	}
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

	<section
		class="detail-content"
		class:is-portrait={photoOrientation === 'portrait'}
		class:is-landscape={photoOrientation === 'landscape'}
	>
		<div class="photo-column">
			<figure
				class="photo-stage"
				class:is-portrait={photoOrientation === 'portrait'}
				style={`--photo-ratio: ${photoAspectRatio};`}
			>
				<img bind:this={imgEl} src={data.photo.url} alt={data.photo.alt} loading="eager" onload={setPhotoMeta} />
			</figure>
		</div>

		<aside class="description-panel">
			<div class="description-copy">
				<p class="description-title">{data.themeTitle}</p>
				{#if data.description}
					<p class="description">{data.description}</p>
				{:else}
					<p class="description description-empty">Descrizione in arrivo.</p>
				{/if}
			</div>

			<div class={`zoom-panels ${mosaicVariant}`} aria-label="Dettagli ravvicinati della stessa foto">
				<figure class={`zoom-panel zoom-panel--a ${getPanelCropClass('a')}`}>
					<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
				</figure>
				<figure class={`zoom-panel zoom-panel--b ${getPanelCropClass('b')}`}>
					<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
				</figure>
				<article class="zoom-panel zoom-panel--text">
					<p class="zoom-description-title">{data.themeTitle}</p>
					{#if data.description}
						<p class="zoom-description">{data.description}</p>
					{:else}
						<p class="zoom-description zoom-description-empty">Descrizione in arrivo.</p>
					{/if}
				</article>
				<figure class={`zoom-panel zoom-panel--d ${getPanelCropClass('d')}`}>
					<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
				</figure>
				<figure class={`zoom-panel zoom-panel--e ${getPanelCropClass('e')}`}>
					<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
				</figure>
				<figure class={`zoom-panel zoom-panel--f ${getPanelCropClass('f')}`}>
					<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
				</figure>
				<figure class={`zoom-panel zoom-panel--g ${getPanelCropClass('g')}`}>
					<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
				</figure>
				<figure class={`zoom-panel zoom-panel--h ${getPanelCropClass('h')}`}>
					<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
				</figure>
				<figure class={`zoom-panel zoom-panel--i ${getPanelCropClass('i')}`}>
					<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
				</figure>
				<figure class={`zoom-panel zoom-panel--j ${getPanelCropClass('j')}`}>
					<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
				</figure>
			</div>
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
		--photo-back-size: 1.85rem;
		--photo-line-h: 5px;
		min-height: calc(100dvh - 5rem);
		max-width: 100%;
		padding: 1.45rem 1rem 1rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}

	.photo-top {
		position: fixed;
		top: 1.72rem;
		left: 1rem;
		z-index: 260;
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
		width: 100%;
		height: var(--photo-line-h);
		background: #000;
		margin-top: 0.9rem;
	}

	.detail-content {
		display: grid;
		grid-template-columns: minmax(0, 1.62fr) minmax(0, 1fr);
		align-items: end;
		column-gap: 1.2rem;
		row-gap: 1rem;
		min-height: calc(100dvh - 12.6rem);
	}

	.detail-content.is-portrait {
		grid-template-columns: max-content minmax(0, 1fr);
		justify-content: flex-start;
		column-gap: 0.95rem;
	}

	.detail-content.is-landscape {
		grid-template-columns: minmax(0, 1.18fr) minmax(0, 1fr);
		align-items: start;
	}

	.photo-column {
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.photo-stage {
		margin: 0;
		overflow: clip;
		border: 3px solid #000;
		background: #fff;
		box-sizing: border-box;
		width: min(100%, calc((100dvh - 11.9rem) * var(--photo-ratio)));
		max-width: 100%;
	}

	.photo-stage.is-portrait {
		width: min(100%, calc((100dvh - 11.9rem) * var(--photo-ratio)));
	}

	.detail-content.is-landscape .photo-stage {
		width: min(100%, calc((100dvh - 14.6rem) * var(--photo-ratio)));
	}

	.detail-content.is-portrait .photo-column {
		width: fit-content;
		max-width: 100%;
	}

	.photo-stage img {
		display: block;
		width: 100%;
		height: auto;
		max-height: calc(100dvh - 11.9rem);
	}

	.description-panel {
		flex: 1 1 0;
		min-width: 0;
		height: calc(100dvh - 11.9rem);
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.description-copy {
		display: none;
	}

	.detail-content.is-portrait .description-panel {
		padding-top: 0.15rem;
	}

	.description-title {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 700;
		line-height: 1.25;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #ff5f1f;
	}

	.description {
		margin: 0;
		font-size: 0.86rem;
		line-height: 1.42;
		max-width: 52ch;
	}

	.description-empty {
		opacity: 0.7;
		font-style: italic;
	}

	.zoom-panels {
		--mosaic-gap: 0.34rem;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		grid-template-rows: repeat(5, minmax(0, 1fr));
		gap: var(--mosaic-gap);
		margin-top: 0;
		height: 100%;
		grid-auto-flow: row dense;
		flex: 1 1 auto;
		min-height: 0;
	}

	.zoom-panel--i,
	.zoom-panel--j {
		grid-column: auto;
		grid-row: auto;
	}

	.zoom-panel {
		margin: 0;
		border: 2px solid #000;
		overflow: clip;
		background: #fff;
		min-height: 0;
	}

	.zoom-panel img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.zoom-panel.crop-1 img {
		transform: scale(1.7);
		transform-origin: 24% 30%;
	}

	.zoom-panel.crop-2 img {
		transform: scale(1.95);
		transform-origin: 72% 36%;
	}

	.zoom-panel.crop-3 img {
		transform: scale(1.8);
		transform-origin: 35% 62%;
	}

	.zoom-panel.crop-4 img {
		transform: scale(2.2);
		transform-origin: 80% 58%;
	}

	.zoom-panel.crop-5 img {
		transform: scale(1.75);
		transform-origin: 22% 78%;
	}

	.zoom-panel.crop-6 img {
		transform: scale(2);
		transform-origin: 64% 34%;
	}

	.zoom-panel.crop-7 img {
		transform: scale(2.05);
		transform-origin: 42% 52%;
	}

	.zoom-panel.crop-8 img {
		transform: scale(1.9);
		transform-origin: 18% 46%;
	}

	.zoom-panel.crop-9 img {
		transform: scale(2.15);
		transform-origin: 74% 76%;
	}

	.zoom-panel--text {
		grid-column: 1 / span 2;
		grid-row: 2 / span 3;
		padding: 0.86rem 0.82rem 0.16rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		overflow: hidden;
		align-self: start;
		height: fit-content;
	}

	.zoom-description-title {
		margin: 0;
		color: #ff5f1f;
		font-size: 0.84rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		line-height: 1.28;
	}

	.zoom-description {
		margin: 0;
		font-size: clamp(0.94rem, 0.96vw, 1.06rem);
		line-height: 1.45;
	}

	.zoom-description-empty {
		opacity: 0.7;
		font-style: italic;
	}

	.zoom-panels.mosaic-1 .zoom-panel--a {
		grid-column: 1 / span 2;
		grid-row: 1;
	}

	.zoom-panels.mosaic-1 .zoom-panel--b {
		grid-column: 3;
		grid-row: 1 / span 2;
	}

	.zoom-panels.mosaic-1 .zoom-panel--d {
		grid-column: 4;
		grid-row: 1 / span 3;
	}

	.zoom-panels.mosaic-1 .zoom-panel--e {
		grid-column: 3;
		grid-row: 3 / span 2;
	}

	.zoom-panels.mosaic-1 .zoom-panel--f {
		grid-column: 1 / span 2;
		grid-row: 5;
	}

	.zoom-panels.mosaic-1 .zoom-panel--g {
		grid-column: 3 / span 2;
		grid-row: 5;
	}

	.zoom-panels.mosaic-1 .zoom-panel--h {
		grid-column: 4;
		grid-row: 4;
	}


	.zoom-panels.mosaic-2 .zoom-panel--a {
		grid-column: 1 / span 2;
		grid-row: 1;
	}

	.zoom-panels.mosaic-2 .zoom-panel--b {
		grid-column: 3 / span 2;
		grid-row: 1;
	}

	.zoom-panels.mosaic-2 .zoom-panel--d {
		grid-column: 4;
		grid-row: 2 / span 3;
	}

	.zoom-panels.mosaic-2 .zoom-panel--e {
		grid-column: 3;
		grid-row: 2 / span 2;
	}

	.zoom-panels.mosaic-2 .zoom-panel--f {
		grid-column: 1 / span 2;
		grid-row: 5;
	}

	.zoom-panels.mosaic-2 .zoom-panel--g {
		grid-column: 3 / span 2;
		grid-row: 5;
	}

	.zoom-panels.mosaic-2 .zoom-panel--h {
		grid-column: 3;
		grid-row: 4;
	}


	.zoom-panels.mosaic-3 .zoom-panel--a {
		grid-column: 1;
		grid-row: 1;
	}

	.zoom-panels.mosaic-3 .zoom-panel--b {
		grid-column: 2 / span 2;
		grid-row: 1;
	}

	.zoom-panels.mosaic-3 .zoom-panel--d {
		grid-column: 4;
		grid-row: 1 / span 2;
	}

	.zoom-panels.mosaic-3 .zoom-panel--e {
		grid-column: 3;
		grid-row: 2 / span 2;
	}

	.zoom-panels.mosaic-3 .zoom-panel--f {
		grid-column: 1 / span 2;
		grid-row: 5;
	}

	.zoom-panels.mosaic-3 .zoom-panel--g {
		grid-column: 3 / span 2;
		grid-row: 5;
	}

	.zoom-panels.mosaic-3 .zoom-panel--h {
		grid-column: 4;
		grid-row: 3 / span 2;
	}


	@media (max-width: 740px) {
		.photo-detail {
			min-height: calc(100dvh - 4.6rem);
			padding: 0.5rem 0.65rem 0.75rem;
		}

		.photo-top {
			position: static;
			top: auto;
			left: auto;
			z-index: auto;
			margin-bottom: 0.35rem;
		}

		.header-line {
			margin-bottom: 0.65rem;
		}

		.detail-content {
			display: flex;
			flex-direction: column;
			gap: 0.85rem;
		}

		.photo-column {
			width: 100%;
			max-width: 100%;
		}

		.photo-stage {
			max-height: none;
			width: 100%;
		}

		.description-panel {
			padding: 0;
		}

		.description-copy {
			display: block;
		}

		.description {
			font-size: 0.82rem;
		}

		.zoom-panels {
			display: none;
		}

	}
</style>
