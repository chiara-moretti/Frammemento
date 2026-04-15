<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import manifest from '$lib/media-manifest.json';

	const FACE_COUNT = 8;

	let sectionEl = $state(/** @type {HTMLElement | null} */ (null));
	let prismEl = $state(/** @type {HTMLDivElement | null} */ (null));
	let prismPhotos = $state(/** @type {string[]} */ ([]));
	let rotationYDeg = $state(0);
	const rotationXDeg = -8;
	let isDragging = $state(false);
	let dragStartX = 0;
	let dragStartRotationY = 0;
	let prismRadiusPx = $state(140);
	let velocityY = 0;
	let inertiaRafId = 0;
	let lastMoveTs = 0;

	/** @type {string[]} */
	const allPhotoUrls = Object.entries(manifest).flatMap(([category, photos]) =>
		photos.map(
			(fileName) => `${base}/assets/${encodeURIComponent(category)}/${encodeURIComponent(fileName)}`
		)
	);

	/**
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 */
	function clamp(value, min, max) {
		return Math.min(max, Math.max(min, value));
	}

	/**
	 * @param {string[]} source
	 */
	function pickPhotos(source) {
		const shuffled = [...source];
		for (let i = shuffled.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		if (shuffled.length >= FACE_COUNT) {
			return shuffled.slice(0, FACE_COUNT);
		}

		// Se il dataset dovesse essere più piccolo, ripete le immagini per riempire 8 lati.
		const result = [];
		for (let i = 0; i < FACE_COUNT; i += 1) {
			result.push(shuffled[i % shuffled.length]);
		}
		return result;
	}

	/**
	 * Garantisce sempre 8 elementi, ripetendo se necessario.
	 * @param {string[]} photos
	 */
	function fillToFaceCount(photos) {
		if (photos.length === 0) return pickPhotos(allPhotoUrls);
		if (photos.length >= FACE_COUNT) return photos.slice(0, FACE_COUNT);
		const repeated = [];
		for (let i = 0; i < FACE_COUNT; i += 1) {
			repeated.push(photos[i % photos.length]);
		}
		return repeated;
	}

	function updatePrismRadius() {
		if (!prismEl) return;
		const faceWidth = prismEl.clientWidth;
		if (!faceWidth) return;
		// Raggio circumferenziale di un poligono regolare a 8 lati.
		prismRadiusPx = faceWidth / (2 * Math.tan(Math.PI / FACE_COUNT));
	}

	function nextFace() {
		rotationYDeg -= 45;
	}

	function prevFace() {
		rotationYDeg += 45;
	}

	function stopInertia() {
		if (inertiaRafId) {
			cancelAnimationFrame(inertiaRafId);
			inertiaRafId = 0;
		}
	}

	function startInertia() {
		stopInertia();
		const friction = 0.95;
		const minSpeed = 0.006;
		const tick = () => {
			rotationYDeg += velocityY * 16;
			velocityY *= friction;
			if (Math.abs(velocityY) < minSpeed) {
				inertiaRafId = 0;
				return;
			}
			inertiaRafId = requestAnimationFrame(tick);
		};
		inertiaRafId = requestAnimationFrame(tick);
	}

	/**
	 * @param {PointerEvent} event
	 */
	function startDrag(event) {
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		stopInertia();
		isDragging = true;
		dragStartX = event.clientX;
		dragStartRotationY = rotationYDeg;
		velocityY = 0;
		lastMoveTs = performance.now();
		const target = /** @type {HTMLDivElement | null} */ (event.currentTarget);
		target?.setPointerCapture(event.pointerId);
	}

	/**
	 * @param {PointerEvent} event
	 */
	function moveDrag(event) {
		if (!isDragging) return;
		const deltaX = event.clientX - dragStartX;
		const dragFactor = event.pointerType === 'touch' ? 0.82 : 0.46;
		const nextY = dragStartRotationY + deltaX * dragFactor;
		const now = performance.now();
		const dt = Math.max(1, now - lastMoveTs);
		const rawVelocity = ((nextY - rotationYDeg) / dt) * 1.35;
		velocityY = clamp(rawVelocity, -1.2, 1.2);
		rotationYDeg = nextY;
		lastMoveTs = now;
	}

	function endDrag() {
		if (!isDragging) return;
		isDragging = false;
		startInertia();
	}

	onMount(() => {
		prismPhotos = fillToFaceCount(pickPhotos(allPhotoUrls));
		updatePrismRadius();
		/** @param {KeyboardEvent} event */
		const onKey = (event) => {
			if (!sectionEl || !sectionEl.matches(':hover')) return;
			if (event.key === 'ArrowRight') nextFace();
			if (event.key === 'ArrowLeft') prevFace();
		};
		const onResize = () => updatePrismRadius();
		window.addEventListener('keydown', onKey);
		window.addEventListener('resize', onResize);

		return () => {
			stopInertia();
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<section class="cylinder-section" bind:this={sectionEl} aria-label="Galleria 3D delle foto">
	<div class="cylinder-viewport">
		<button class="nav nav-prev" type="button" onclick={prevFace} aria-label="Foto precedente">‹</button>
		<div class="cylinder-wrap">
			<div
				class="cylinder"
				class:dragging={isDragging}
				role="application"
				aria-label="Carosello 3D a otto lati trascinabile"
				bind:this={prismEl}
				onpointerdown={startDrag}
				onpointermove={moveDrag}
				onpointerup={endDrag}
				onpointercancel={endDrag}
				onlostpointercapture={endDrag}
				style={`--rotation-y: ${rotationYDeg}deg; --rotation-x: ${rotationXDeg}deg; --count: ${FACE_COUNT}; --prism-radius: ${prismRadiusPx}px;`}
			>
				{#each prismPhotos as photoUrl, index (`${photoUrl}-${index}`)}
					<figure class="panel" style={`--i: ${index};`}>
						<img
							class="panel-image"
							src={photoUrl}
							alt="Foto analogica in galleria 3D"
							loading="lazy"
						/>
					</figure>
				{/each}
			</div>
		</div>
		<button class="nav nav-next" type="button" onclick={nextFace} aria-label="Foto successiva">›</button>
	</div>
</section>

<style>
	.cylinder-section {
		min-height: 100dvh;
		background: #fff;
		position: relative;
		display: grid;
		place-items: center;
		padding: 1rem;
		overflow-x: clip;
	}

	.cylinder-viewport {
		width: min(100%, 66rem);
		height: min(84dvh, 40rem);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.8rem;
		overflow: visible;
		perspective: 1800px;
		perspective-origin: 50% 42%;
	}

	.cylinder-wrap {
		width: min(92vw, 40rem);
		height: min(74dvh, 34rem);
		display: grid;
		place-items: center;
		transform-style: preserve-3d;
		flex: 1;
	}

	.cylinder {
		position: relative;
		width: min(68vw, 22rem);
		height: min(60dvh, 30rem);
		transform-style: preserve-3d;
		transform: rotateX(var(--rotation-x)) rotateY(var(--rotation-y));
		transition: transform 360ms cubic-bezier(0.22, 0.7, 0.14, 1);
		cursor: grab;
		/* Serve a garantire il drag touch continuo del prisma su mobile. */
		touch-action: none;
		user-select: none;
		will-change: transform;
	}

	.cylinder.dragging {
		cursor: grabbing;
		transition: none;
	}

	.panel {
		position: absolute;
		inset: 0;
		margin: 0;
		overflow: hidden;
		background: transparent;
		box-sizing: border-box;
		border: 3px solid #000;
		transform-style: preserve-3d;
		transform:
			rotateY(calc((360deg / var(--count)) * var(--i)))
			translateZ(var(--prism-radius));
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		display: grid;
		place-items: center;
	}

	.panel::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0) 42%, rgba(0, 0, 0, 0.22));
		mix-blend-mode: multiply;
	}

	.panel-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
		filter: grayscale(0.1) contrast(1.03);
		background: transparent;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		transform-style: preserve-3d;
		transform: translateZ(0.1px);
	}

	.nav {
		flex: 0 0 auto;
		width: 2.35rem;
		height: 2.35rem;
		border: 2px solid #000;
		background: #fff;
		color: #000;
		font-size: 1.55rem;
		line-height: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: transform 120ms ease;
	}

	.nav:active {
		transform: scale(0.97);
	}

	@media (max-width: 740px) {
		.cylinder-section {
			min-height: 100dvh;
			padding: 0.8rem 0.4rem 1rem;
		}

		.cylinder-viewport {
			height: min(60dvh, 24rem);
			gap: 0;
			overflow: hidden;
		}

		.cylinder-wrap {
			width: min(70vw, 13rem);
			height: min(46dvh, 17rem);
		}

		.cylinder {
			width: min(36vw, 7rem);
			height: min(33dvh, 13.5rem);
		}

		.panel {
			border-width: 0;
			transform:
				rotateY(calc((360deg / var(--count)) * var(--i)))
				translateZ(var(--prism-radius));
		}

		.nav {
			display: none;
		}
	}
</style>
