<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import manifest from '$lib/media-manifest.json';

let cards = $state(
	/** @type {{url: string; transform: string; depth: number; aspectRatio: number}[]} */ ([])
);
	let viewportEl = $state(/** @type {HTMLDivElement | null} */ (null));
	let rotationY = $state(0);
let rotationX = $state(0);
let zoom = $state(1);
let panX = $state(0);
let panY = $state(0);
	let isDragging = $state(false);
	let startX = 0;
	let startY = 0;
	let startRotationY = 0;
	let startRotationX = 0;
let startPanX = 0;
let startPanY = 0;
let dragMode = $state(/** @type {'rotate' | 'pan'} */ ('rotate'));
let isPinching = $state(false);
let pinchLastDistance = 0;
let pinchLastMidOffsetX = 0;
let pinchLastMidOffsetY = 0;

const MIN_ZOOM = 0.55;
const MAX_ZOOM = 2.2;

	/** @type {string[]} */
	const allPhotoUrls = Object.entries(manifest).flatMap(([category, photos]) =>
		photos.map(
			(fileName) => `${base}/assets/${encodeURIComponent(category)}/${encodeURIComponent(fileName)}`
		)
	);

	/**
	 * @param {string[]} source
	 */
	function shuffle(source) {
		const shuffled = [...source];
		for (let i = shuffled.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
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
	 * Distribuisce le foto in uno spazio 3D pseudo-casuale.
	 * @param {string[]} photos
	 */
	function buildPhotoCloud(photos) {
		return photos.map((url, index) => {
			// Riempie tutto lo spazio 3D disponibile, evitando concentrazione al centro.
			const spreadX = (Math.random() - 0.5) * 1180;
			const spreadY = (Math.random() - 0.5) * 690;
			const spreadZ = (Math.random() - 0.5) * 980;
			const centerBiasKickX = Math.sign(spreadX || (index % 2 === 0 ? 1 : -1)) * 70;
			const centerBiasKickY = Math.sign(spreadY || (index % 3 === 0 ? 1 : -1)) * 52;
			const centerBiasKickZ = Math.sign(spreadZ || (index % 4 === 0 ? 1 : -1)) * 80;
			// Foto dritte: nessuna rotazione della singola card.
			const rotZ = 0;
			const rotY = 0;
			const scale = 0.74 + Math.random() * 0.22;
			const depth = Math.round(1000 + spreadZ);
			return {
				url,
				depth,
				aspectRatio: 3 / 4,
				transform: `translate(-50%, -50%) translate3d(${spreadX + centerBiasKickX}px, ${spreadY + centerBiasKickY}px, ${spreadZ + centerBiasKickZ}px) rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(${scale})`
			};
		});
	}

	/**
	 * Aggiorna il ratio della card per mostrare la foto intera nel suo orientamento reale.
	 * @param {number} index
	 * @param {Event} event
	 */
	function updateCardAspect(index, event) {
		const img = /** @type {HTMLImageElement | null} */ (event.currentTarget);
		if (!img || !img.naturalWidth || !img.naturalHeight) return;
		const ratio = img.naturalWidth / img.naturalHeight;
		cards = cards.map((card, i) => (i === index ? { ...card, aspectRatio: ratio } : card));
	}

	/**
	 * @param {PointerEvent} event
	 */
	function startDrag(event) {
	if (event.pointerType === 'touch' && isPinching) return;
	if (event.pointerType === 'mouse' && event.button !== 0 && event.button !== 2) return;
		isDragging = true;
		startX = event.clientX;
		startY = event.clientY;
		startRotationY = rotationY;
		startRotationX = rotationX;
	startPanX = panX;
	startPanY = panY;
	// Drag con sinistro quando zoom > 1 => sposta la vista; altrimenti ruota.
	// Con tasto destro ruota sempre per mantenere controllo 360°.
	dragMode = zoom > 1.01 && event.button === 0 ? 'pan' : 'rotate';
		const target = /** @type {HTMLElement | null} */ (event.currentTarget);
		target?.setPointerCapture(event.pointerId);
	}

	/**
	 * @param {PointerEvent} event
	 */
	function moveDrag(event) {
		if (!isDragging) return;
	if (event.pointerType === 'touch' && isPinching) return;
		const deltaX = event.clientX - startX;
		const deltaY = event.clientY - startY;
	if (dragMode === 'pan') {
		panX = startPanX + deltaX;
		panY = startPanY + deltaY;
		return;
	}
	rotationY = startRotationY + deltaX * 0.22;
	rotationX = startRotationX - deltaY * 0.22;
	}

	function endDrag() {
		isDragging = false;
	}

/**
 * @param {MouseEvent} event
 */
function preventContextMenu(event) {
	event.preventDefault();
}

/**
 * @param {WheelEvent} event
 */
function onWheelZoom(event) {
	event.preventDefault();
	const delta = event.deltaY;
	const factor = delta > 0 ? 0.92 : 1.08;
	const nextZoom = clamp(zoom * factor, MIN_ZOOM, MAX_ZOOM);
	if (nextZoom === zoom) return;
	const rect = viewportEl?.getBoundingClientRect();
	if (rect) {
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = event.clientX - cx;
		const dy = event.clientY - cy;
		const ratio = nextZoom / zoom;
		// Mantiene fisso il punto sotto al cursore durante lo zoom.
		panX = panX * ratio + (1 - ratio) * dx;
		panY = panY * ratio + (1 - ratio) * dy;
	}
	zoom = nextZoom;
}

/**
 * @param {Touch} a
 * @param {Touch} b
 */
function getTouchDistance(a, b) {
	const dx = a.clientX - b.clientX;
	const dy = a.clientY - b.clientY;
	return Math.hypot(dx, dy);
}

	onMount(() => {
		cards = buildPhotoCloud(shuffle(allPhotoUrls));

		const onTouchStart = /** @param {TouchEvent} event */ (event) => {
			if (event.touches.length < 2) return;
			const [a, b] = [event.touches[0], event.touches[1]];
			const rect = viewportEl?.getBoundingClientRect();
			if (!a || !b || !rect) return;
			isPinching = true;
			isDragging = false;
			pinchLastDistance = getTouchDistance(a, b);
			const midX = (a.clientX + b.clientX) / 2;
			const midY = (a.clientY + b.clientY) / 2;
			pinchLastMidOffsetX = midX - (rect.left + rect.width / 2);
			pinchLastMidOffsetY = midY - (rect.top + rect.height / 2);
		};

		const onTouchMove = /** @param {TouchEvent} event */ (event) => {
			if (event.touches.length < 2 || !isPinching) return;
			const [a, b] = [event.touches[0], event.touches[1]];
			const rect = viewportEl?.getBoundingClientRect();
			if (!a || !b || !rect || pinchLastDistance <= 0) return;
			event.preventDefault();
			const nextDistance = getTouchDistance(a, b);
			const nextZoom = clamp(zoom * (nextDistance / pinchLastDistance), MIN_ZOOM, MAX_ZOOM);
			const zoomRatio = nextZoom / zoom;
			const midX = (a.clientX + b.clientX) / 2;
			const midY = (a.clientY + b.clientY) / 2;
			const midOffsetX = midX - (rect.left + rect.width / 2);
			const midOffsetY = midY - (rect.top + rect.height / 2);

			let nextPanX = panX * zoomRatio + (1 - zoomRatio) * midOffsetX;
			let nextPanY = panY * zoomRatio + (1 - zoomRatio) * midOffsetY;
			nextPanX += midOffsetX - pinchLastMidOffsetX;
			nextPanY += midOffsetY - pinchLastMidOffsetY;

			panX = nextPanX;
			panY = nextPanY;
			zoom = nextZoom;
			pinchLastDistance = nextDistance;
			pinchLastMidOffsetX = midOffsetX;
			pinchLastMidOffsetY = midOffsetY;
		};

		const onTouchEnd = /** @param {TouchEvent} event */ (event) => {
			if (event.touches.length >= 2) return;
			isPinching = false;
			pinchLastDistance = 0;
		};

		viewportEl?.addEventListener('touchstart', onTouchStart, { passive: true });
		viewportEl?.addEventListener('touchmove', onTouchMove, { passive: false });
		viewportEl?.addEventListener('touchend', onTouchEnd, { passive: true });
		viewportEl?.addEventListener('touchcancel', onTouchEnd, { passive: true });

		return () => {
			viewportEl?.removeEventListener('touchstart', onTouchStart);
			viewportEl?.removeEventListener('touchmove', onTouchMove);
			viewportEl?.removeEventListener('touchend', onTouchEnd);
			viewportEl?.removeEventListener('touchcancel', onTouchEnd);
		};
	});
</script>

<section class="hero3d" aria-label="Galleria 3D">
	<div class="stage">
		<div class="viewport" bind:this={viewportEl} onwheel={onWheelZoom}>
			<div
				class="cloud"
				class:dragging={isDragging}
				role="application"
				aria-label="Galleria 3D: trascina per ruotare la vista"
				oncontextmenu={preventContextMenu}
				onpointerdown={startDrag}
				onpointermove={moveDrag}
				onpointerup={endDrag}
				onpointercancel={endDrag}
				onlostpointercapture={endDrag}
				style={`--rotation-y: ${rotationY}deg; --rotation-x: ${rotationX}deg; --zoom: ${zoom}; --pan-x: ${panX}px; --pan-y: ${panY}px;`}
			>
				{#each cards as card, index (`${card.url}-${index}`)}
					<figure
						class="card"
						style={`transform: ${card.transform}; z-index: ${card.depth}; --card-ratio: ${card.aspectRatio};`}
					>
						<img
							src={card.url}
							alt="Foto analogica nello spazio 3D"
							loading="lazy"
							onload={(event) => updateCardAspect(index, event)}
						/>
					</figure>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.hero3d {
		height: 100dvh;
		min-height: 100dvh;
		padding: 1.2rem 1.25rem 0.35rem;
		width: 100%;
		display: grid;
		place-items: center;
		box-sizing: border-box;
		background: #fff;
		color: #000;
	}

	.stage {
		position: relative;
		display: grid;
		place-items: center;
		width: 100%;
		height: min(88dvh, 52rem);
		margin: 0 auto;
	}

	.viewport {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		perspective: 1550px;
		perspective-origin: 50% 48%;
		overflow: clip;
		border: 2px solid #000;
		background:
			radial-gradient(circle at 35% 35%, rgba(255, 95, 31, 0.09), transparent 58%),
			linear-gradient(180deg, #fff, #fafafa);
	}

	.cloud {
		position: relative;
		width: min(82vw, 65rem);
		height: min(66dvh, 34rem);
		transform-style: preserve-3d;
		transform:
			translate3d(var(--pan-x), var(--pan-y), 0)
			rotateX(var(--rotation-x))
			rotateY(var(--rotation-y))
			scale(var(--zoom));
		transition: transform 180ms ease-out;
		cursor: grab;
		touch-action: none;
		user-select: none;
	}

	.cloud.dragging {
		transition: none;
		cursor: grabbing;
	}

	.card {
		position: absolute;
		left: 50%;
		top: 50%;
		width: clamp(5.8rem, 9vw, 8.2rem);
		aspect-ratio: var(--card-ratio, 3 / 4);
		margin: 0;
		border: 2px solid #000;
		overflow: hidden;
		transform-origin: center center;
		background: #f4f4f4;
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
		backface-visibility: visible;
	}

	.card img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
		backface-visibility: visible;
	}

	@media (max-width: 740px) {
		.hero3d {
			height: 100dvh;
			width: calc(100% + 2rem);
			margin-inline: -1rem;
			padding: 0.8rem 0 0.2rem;
		}

		.stage {
			width: min(94vw, 28rem);
			height: min(72dvh, 31rem);
		}

		.viewport {
			width: 100%;
			height: 100%;
		}

		.cloud {
			width: min(92vw, 34rem);
			height: min(52dvh, 19rem);
		}

		.card {
			width: clamp(4.8rem, 18vw, 6.2rem);
		}
	}
</style>
