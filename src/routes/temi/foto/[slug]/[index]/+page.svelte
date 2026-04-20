<script>
	import { base } from '$app/paths';

	let { data } = $props();

	const themeHref = $derived(`${base}/temi/${data.slug}`);
	const imagePanelIds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	const cropClassIds = [
		'crop-1',
		'crop-2',
		'crop-3',
		'crop-4',
		'crop-5',
		'crop-6',
		'crop-7',
		'crop-8',
		'crop-9',
		'crop-10',
		'crop-11',
		'crop-12',
		'crop-13',
		'crop-14',
		'crop-15',
		'crop-16'
	];

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

	<section class="detail-content">
		<div class={`zoom-panels ${mosaicVariant}`} aria-label="Dettagli ravvicinati della stessa foto">
			<figure class={`zoom-panel zoom-panel--a ${getPanelCropClass('a')}`}>
				<img src={data.photo.url} alt={data.photo.alt} loading="eager" />
			</figure>
			<figure class={`zoom-panel zoom-panel--b ${getPanelCropClass('b')}`}>
				<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
			</figure>
			<figure class={`zoom-panel zoom-panel--c ${getPanelCropClass('c')}`}>
				<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
			</figure>
			<figure class={`zoom-panel zoom-panel--d ${getPanelCropClass('d')}`}>
				<img src={data.photo.url} alt="" aria-hidden="true" loading="lazy" />
			</figure>
			<article class="zoom-panel zoom-panel--text">
				<p class="description-title">{data.themeTitle}</p>
				{#if data.description}
					<p class="description">{data.description}</p>
				{:else}
					<p class="description description-empty">Descrizione in arrivo.</p>
				{/if}
			</article>
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
		</div>
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
		min-height: calc(100dvh - 12.6rem);
	}

	.description-title {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 700;
		line-height: 1.25;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #ff5f1f;
	}

	.description {
		margin: 0;
		font-size: clamp(1.04rem, 1.02vw, 1.24rem);
		line-height: 1.48;
		max-width: 42ch;
	}

	.description-empty {
		opacity: 0.7;
		font-style: italic;
	}

	.zoom-panels {
		--mosaic-gap: 0.4rem;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		grid-template-rows: repeat(4, minmax(0, 1fr));
		gap: var(--mosaic-gap);
		margin-top: 0;
		height: calc(100dvh - 12.6rem);
		min-height: 24rem;
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
		transform: scale(2);
		transform-origin: 24% 30%;
	}

	.zoom-panel.crop-2 img {
		transform: scale(2.3);
		transform-origin: 72% 36%;
	}

	.zoom-panel.crop-3 img {
		transform: scale(2.2);
		transform-origin: 35% 62%;
	}

	.zoom-panel.crop-4 img {
		transform: scale(2.45);
		transform-origin: 80% 58%;
	}

	.zoom-panel.crop-5 img {
		transform: scale(2.15);
		transform-origin: 22% 78%;
	}

	.zoom-panel.crop-6 img {
		transform: scale(2.35);
		transform-origin: 64% 34%;
	}

	.zoom-panel.crop-7 img {
		transform: scale(2.28);
		transform-origin: 42% 52%;
	}

	.zoom-panel.crop-8 img {
		transform: scale(2.2);
		transform-origin: 18% 46%;
	}

	.zoom-panel.crop-9 img {
		transform: scale(2.5) translate(-1.5%, 1%);
		transform-origin: 86% 16%;
	}

	.zoom-panel.crop-10 img {
		transform: scale(2.12) rotate(-1.2deg);
		transform-origin: 14% 18%;
	}

	.zoom-panel.crop-11 img {
		transform: scale(2.4) translate(1.8%, -1.2%);
		transform-origin: 56% 84%;
	}

	.zoom-panel.crop-12 img {
		transform: scale(2.22) rotate(1.1deg);
		transform-origin: 88% 48%;
	}

	.zoom-panel.crop-13 img {
		transform: scale(2.34) translate(-2.2%, -0.8%);
		transform-origin: 8% 68%;
	}

	.zoom-panel.crop-14 img {
		transform: scale(2.18) rotate(0.9deg);
		transform-origin: 48% 12%;
	}

	.zoom-panel.crop-15 img {
		transform: scale(2.46) translate(0.8%, 2%);
		transform-origin: 72% 88%;
	}

	.zoom-panel.crop-16 img {
		transform: scale(2.26) rotate(-0.8deg);
		transform-origin: 32% 44%;
	}

	.zoom-panel--text {
		grid-column: 2 / span 2;
		grid-row: 2 / span 2;
		padding: 0.86rem 0.82rem 0.6rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		overflow: hidden;
		justify-content: stretch;
	}

	.zoom-panel--text .description {
		flex: 1 1 auto;
		max-width: none;
	}

	@media (min-width: 741px) {
		.zoom-panel--text {
			gap: 0.55rem;
		}

		.zoom-panel--text .description {
			font-size: clamp(1.2rem, 1.55vw, 1.95rem);
			line-height: 1.32;
		}
	}

	.zoom-panels.mosaic-1 .zoom-panel--a {
		grid-column: 1;
		grid-row: 1;
	}

	.zoom-panels.mosaic-1 .zoom-panel--b {
		grid-column: 2;
		grid-row: 1;
	}

	.zoom-panels.mosaic-1 .zoom-panel--c {
		grid-column: 4;
		grid-row: 1 / span 2;
	}

	.zoom-panels.mosaic-1 .zoom-panel--d {
		grid-column: 1;
		grid-row: 2 / span 2;
	}

	.zoom-panels.mosaic-1 .zoom-panel--e {
		grid-column: 4;
		grid-row: 3 / span 2;
	}

	.zoom-panels.mosaic-1 .zoom-panel--f {
		grid-column: 1 / span 2;
		grid-row: 4;
	}

	.zoom-panels.mosaic-1 .zoom-panel--g {
		grid-column: 3;
		grid-row: 1;
	}

	.zoom-panels.mosaic-1 .zoom-panel--h {
		grid-column: 3 / span 2;
		grid-row: 4;
	}


	.zoom-panels.mosaic-2 .zoom-panel--a {
		grid-column: 1 / span 2;
		grid-row: 1;
	}

	.zoom-panels.mosaic-2 .zoom-panel--b {
		grid-column: 4;
		grid-row: 1 / span 2;
	}

	.zoom-panels.mosaic-2 .zoom-panel--c {
		grid-column: 1;
		grid-row: 2 / span 2;
	}

	.zoom-panels.mosaic-2 .zoom-panel--d {
		grid-column: 2 / span 2;
		grid-row: 4;
	}

	.zoom-panels.mosaic-2 .zoom-panel--e {
		grid-column: 3;
		grid-row: 1;
	}

	.zoom-panels.mosaic-2 .zoom-panel--f {
		grid-column: 1;
		grid-row: 4;
	}

	.zoom-panels.mosaic-2 .zoom-panel--g {
		grid-column: 4;
		grid-row: 3 / span 2;
	}

	.zoom-panels.mosaic-2 .zoom-panel--h {
		grid-column: 3;
		grid-row: 4;
	}


	.zoom-panels.mosaic-3 .zoom-panel--a {
		grid-column: 1 / span 2;
		grid-row: 1;
	}

	.zoom-panels.mosaic-3 .zoom-panel--b {
		grid-column: 4;
		grid-row: 1 / span 2;
	}

	.zoom-panels.mosaic-3 .zoom-panel--c {
		grid-column: 1;
		grid-row: 2;
	}

	.zoom-panels.mosaic-3 .zoom-panel--d {
		grid-column: 1;
		grid-row: 3 / span 2;
	}

	.zoom-panels.mosaic-3 .zoom-panel--e {
		grid-column: 4;
		grid-row: 3 / span 2;
	}

	.zoom-panels.mosaic-3 .zoom-panel--f {
		grid-column: 2;
		grid-row: 4;
	}

	.zoom-panels.mosaic-3 .zoom-panel--g {
		grid-column: 2 / span 2;
		grid-row: 1;
	}

	.zoom-panels.mosaic-3 .zoom-panel--h {
		grid-column: 3;
		grid-row: 4;
	}


	@media (max-width: 740px) {
		.photo-detail {
			min-height: auto;
			padding: 0.5rem 0.65rem 7.2rem;
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

		.zoom-panels {
			height: auto;
			min-height: 0;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-template-rows: auto;
		}

		.detail-content {
			min-height: 0;
		}

		.zoom-panel {
			aspect-ratio: 1 / 1;
		}

		.zoom-panel--text {
			aspect-ratio: auto;
			min-height: 10rem;
			grid-column: 1 / -1;
			grid-row: auto;
		}

		.zoom-panels.mosaic-1 .zoom-panel--a,
		.zoom-panels.mosaic-1 .zoom-panel--b,
		.zoom-panels.mosaic-1 .zoom-panel--c,
		.zoom-panels.mosaic-1 .zoom-panel--d,
		.zoom-panels.mosaic-1 .zoom-panel--e,
		.zoom-panels.mosaic-1 .zoom-panel--f,
		.zoom-panels.mosaic-1 .zoom-panel--g,
		.zoom-panels.mosaic-1 .zoom-panel--h,
		.zoom-panels.mosaic-2 .zoom-panel--a,
		.zoom-panels.mosaic-2 .zoom-panel--b,
		.zoom-panels.mosaic-2 .zoom-panel--c,
		.zoom-panels.mosaic-2 .zoom-panel--d,
		.zoom-panels.mosaic-2 .zoom-panel--e,
		.zoom-panels.mosaic-2 .zoom-panel--f,
		.zoom-panels.mosaic-2 .zoom-panel--g,
		.zoom-panels.mosaic-2 .zoom-panel--h,
		.zoom-panels.mosaic-3 .zoom-panel--a,
		.zoom-panels.mosaic-3 .zoom-panel--b,
		.zoom-panels.mosaic-3 .zoom-panel--c,
		.zoom-panels.mosaic-3 .zoom-panel--d,
		.zoom-panels.mosaic-3 .zoom-panel--e,
		.zoom-panels.mosaic-3 .zoom-panel--f,
		.zoom-panels.mosaic-3 .zoom-panel--g,
		.zoom-panels.mosaic-3 .zoom-panel--h {
			grid-column: auto;
			grid-row: auto;
		}
	}
</style>
