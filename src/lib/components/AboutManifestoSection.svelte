<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import manifest from '$lib/media-manifest.json';

	/** @type {{ albumPdf: string }} */
	let { albumPdf } = $props();

	let mobilePhotoUrl = $state(/** @type {string | null} */ (null));
	let mobilePhotoPan = $state(/** @type {HTMLDivElement | null} */ (null));
	let mobilePhotoStyle = $state('');
	let panX = $state(0);
	let panY = $state(0);
	let maxPanX = $state(0);
	let maxPanY = $state(0);
	let isDragging = $state(false);
	let dragStartX = 0;
	let dragStartY = 0;
	let dragOriginX = 0;
	let dragOriginY = 0;

	/** @type {string[]} */
	const allPhotoUrls = Object.entries(manifest).flatMap(([category, photos]) =>
		photos.map(
			(fileName) => `${base}/assets/${encodeURIComponent(category)}/${encodeURIComponent(fileName)}`
		)
	);

	onMount(() => {
		if (allPhotoUrls.length === 0) return;
		const randomIndex = Math.floor(Math.random() * allPhotoUrls.length);
		mobilePhotoUrl = allPhotoUrls[randomIndex];
	});

	/**
	 * Mantiene il rapporto originale, scala in cover e aggiunge zoom/pan senza stretch.
	 * @param {Event} event
	 */
	function centerMobilePhoto(event) {
		if (!mobilePhotoPan) return;
		const img = /** @type {HTMLImageElement} */ (event.currentTarget);
		if (!img.naturalWidth || !img.naturalHeight) return;

		const viewportW = mobilePhotoPan.clientWidth;
		const viewportH = mobilePhotoPan.clientHeight;
		if (!viewportW || !viewportH) return;

		const coverScale = Math.max(viewportW / img.naturalWidth, viewportH / img.naturalHeight);
		const zoom = 1.22;
		const finalScale = coverScale * zoom;
		const finalW = Math.round(img.naturalWidth * finalScale);
		const finalH = Math.round(img.naturalHeight * finalScale);
		maxPanX = Math.max(0, (finalW - viewportW) / 2);
		maxPanY = Math.max(0, (finalH - viewportH) / 2);
		panX = 0;
		panY = 0;
		mobilePhotoStyle =
			`width:${finalW}px;height:${finalH}px;` +
			`left:50%;top:50%;transform:translate(-50%,-50%) translate(${panX}px,${panY}px);`;
	}

	function handleMobilePhotoError() {
		mobilePhotoStyle = '';
		panX = 0;
		panY = 0;
		maxPanX = 0;
		maxPanY = 0;
	}

	/**
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 */
	function clamp(value, min, max) {
		return Math.min(max, Math.max(min, value));
	}

	/**
	 * @param {PointerEvent} event
	 */
	function startDrag(event) {
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		isDragging = true;
		dragStartX = event.clientX;
		dragStartY = event.clientY;
		dragOriginX = panX;
		dragOriginY = panY;
		const target = /** @type {HTMLDivElement | null} */ (event.currentTarget);
		target?.setPointerCapture(event.pointerId);
	}

	/**
	 * @param {PointerEvent} event
	 */
	function moveDrag(event) {
		if (!isDragging) return;
		const deltaX = event.clientX - dragStartX;
		const deltaY = event.clientY - dragStartY;
		panX = clamp(dragOriginX + deltaX, -maxPanX, maxPanX);
		panY = clamp(dragOriginY + deltaY, -maxPanY, maxPanY);
		mobilePhotoStyle = mobilePhotoStyle.replace(
			/transform:[^;]+;/,
			`transform:translate(-50%,-50%) translate(${panX}px,${panY}px);`
		);
	}

	function endDrag() {
		isDragging = false;
	}
</script>

<section id="about" class="content-grid">
	<article class="manifesto">
		<p>
			La passione per la fotografia analogica non è nata in me come un progetto deliberato, né come il
			frutto di un lungo apprendistato tecnico. È piuttosto emersa in modo inatteso, quasi silenzioso, come
			accade a quelle inclinazioni profonde che si rivelano solo nel momento in cui trovano il loro
			linguaggio.
		</p>

		<p>
			In un’epoca dominata dall’immediatezza dell’immagine digitale, l’incontro con la fotografia analogica ha
			rappresentato per me una forma di sospensione: un ritorno alla lentezza, all’attesa e all’incertezza.
			Ogni scatto non è soltanto il risultato di un gesto meccanico, ma un atto di fiducia nei confronti del
			tempo e della materia. La pellicola custodisce l’immagine in uno stato di latenza, come un pensiero
			ancora non pronunciato, che solo attraverso lo sviluppo trova finalmente la propria rivelazione.
		</p>

		<p>
			Questo processo introduce una dimensione quasi meditativa nel rapporto con la fotografia. L’assenza
			dell’immediatezza costringe lo sguardo a essere più attento, più consapevole; ogni inquadratura diventa
			una scelta ponderata, ogni fotogramma una possibilità unica e irripetibile. In questo senso, la
			fotografia analogica non è soltanto una tecnica, ma un modo di abitare il tempo e di osservare il
			mondo.
		</p>

		<p>
			Le immagini raccolte in questo album nascono da questo incontro fortuito, ma progressivamente sempre più
			necessario. Non aspirano a essere definitive né esaustive: sono piuttosto tracce di uno sguardo in
			formazione, tentativi di dialogo con la luce, con gli spazi e con gli istanti fugaci che attraversano la
			quotidianità.
		</p>

		<p>
			Se queste fotografie possiedono un valore, esso risiede forse proprio nella loro origine spontanea:
			nell’atto semplice di fermarsi, guardare e affidare a un frammento di pellicola il compito fragile e
			silenzioso di trattenere il tempo.
		</p>
	</article>

	<div class="album">
		{#if mobilePhotoUrl}
			<div
				class="mobile-photo-pan"
				class:dragging={isDragging}
				bind:this={mobilePhotoPan}
				role="application"
				aria-label="Trascina per muoverti nella foto"
				onpointerdown={startDrag}
				onpointermove={moveDrag}
				onpointerup={endDrag}
				onpointercancel={endDrag}
				onlostpointercapture={endDrag}
			>
				<img
					class="mobile-random-photo"
					src={mobilePhotoUrl}
					alt="Foto analogica casuale della collezione"
					style={mobilePhotoStyle}
					onload={centerMobilePhoto}
					onerror={handleMobilePhotoError}
				/>
			</div>
		{/if}
		<iframe title="Portfolio analogico" src={`${albumPdf}#zoom=page-width`} loading="lazy"></iframe>
	</div>
</section>

<style>
	.content-grid {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		gap: 1rem;
		padding: 1rem 1.25rem;
		height: 100%;
		min-height: 0;
		overflow: hidden;
		align-items: stretch;
	}

	.manifesto,
	.album {
		border: 3px solid #000;
		padding: 1rem;
		min-height: 0;
		min-width: 0;
	}

	.manifesto {
		overflow: hidden;
	}

	.manifesto p {
		margin: 0;
		font-size: 1.02rem;
		line-height: 1.55;
	}

	.manifesto p + p {
		margin-top: 1rem;
	}

	.album {
		background: #fff7f2;
		border-color: #ff5f1f;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 2px solid #000;
		background: #fff;
		flex: 1;
		min-height: 0;
	}

	.mobile-random-photo {
		display: none;
	}

	.mobile-photo-pan {
		display: none;
	}

	@media (min-width: 980px) {
		.album {
			order: 1;
		}

		.manifesto {
			order: 2;
		}
	}

	@media (max-width: 740px) {
		.content-grid {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 0;
			height: auto;
			min-height: auto;
			overflow-x: clip;
			overflow-y: visible;
			max-width: 100%;
		}

		.manifesto,
		.album {
			height: auto;
		}

		.album {
			order: 0;
			border: 3px solid #ff5f1f;
			height: min(66dvh, 36rem);
			min-height: 0;
			max-width: 100%;
			padding: 0;
			overflow: hidden;
		}

		.manifesto {
			display: block;
			order: 2;
		}

		.manifesto p {
			font-size: 0.97rem;
			line-height: 1.5;
		}

		.mobile-random-photo {
			display: block;
			position: absolute;
			width: auto;
			height: auto;
			max-width: none;
			max-height: none;
			user-select: none;
			-webkit-user-drag: none;
			pointer-events: none;
		}

		.mobile-photo-pan {
			display: flex;
			width: 100%;
			height: 100%;
			max-width: 100%;
			min-width: 0;
			min-height: 0;
			position: relative;
			overflow: hidden;
			touch-action: none;
			cursor: grab;
			contain: layout paint size;
		}

		.mobile-photo-pan.dragging {
			cursor: grabbing;
		}

		iframe {
			display: none;
		}

		.album:has(.mobile-random-photo) {
			border: 3px solid #000;
		}
	}
</style>
