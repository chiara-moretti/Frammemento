<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import manifest from '$lib/media-manifest.json';

	const FACE_COUNT = 8;

	let sectionEl = $state(/** @type {HTMLElement | null} */ (null));
	let viewportEl = $state(/** @type {HTMLDivElement | null} */ (null));
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
	let touchStartX = 0;
	let touchStartY = 0;
	let touchLastX = 0;
	let touchLastY = 0;

	function isMobileViewport() {
		return window.matchMedia('(max-width: 740px)').matches;
	}

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
		rotationYDeg = snapRotation(rotationYDeg - 45);
	}

	function prevFace() {
		rotationYDeg = snapRotation(rotationYDeg + 45);
	}

	/**
	 * Allinea la rotazione al lato più vicino (8 facce => step da 45°).
	 * @param {number} value
	 */
	function snapRotation(value) {
		const step = 360 / FACE_COUNT;
		return Math.round(value / step) * step;
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
				rotationYDeg = snapRotation(rotationYDeg);
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
		if (isMobileViewport()) return;
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
	 * @param {TouchEvent} event
	 */
	function startTouchDrag(event) {
		if (!isMobileViewport()) return;
		const touch = event.touches[0];
		if (!touch) return;
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
		touchLastX = touch.clientX;
		touchLastY = touch.clientY;
	}

	/**
	 * @param {PointerEvent} event
	 */
	function moveDrag(event) {
		if (isMobileViewport()) return;
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

	/**
	 * @param {TouchEvent} event
	 */
	function moveTouchDrag(event) {
		if (!isMobileViewport()) return;
		const touch = event.touches[0];
		if (!touch) return;
		touchLastX = touch.clientX;
		touchLastY = touch.clientY;
		const dx = touchLastX - touchStartX;
		const dy = touchLastY - touchStartY;
		if (Math.abs(dx) > Math.abs(dy)) event.preventDefault();
	}

	/**
	 * @param {TouchEvent} event
	 */
	function endTouchDrag(event) {
		if (!isMobileViewport()) return;
		const touch = event.changedTouches[0];
		const endX = touch ? touch.clientX : touchLastX;
		const deltaX = endX - touchStartX;
		const SWIPE_THRESHOLD = 28;
		if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
		if (deltaX < 0) nextFace();
		else prevFace();
	}

	function endDrag() {
		if (!isDragging) return;
		isDragging = false;
		startInertia();
	}

	onMount(() => {
		prismPhotos = fillToFaceCount(pickPhotos(allPhotoUrls));
		updatePrismRadius();
		const onTouchStart = /** @param {TouchEvent} event */ (event) => startTouchDrag(event);
		const onTouchMove = /** @param {TouchEvent} event */ (event) => moveTouchDrag(event);
		const onTouchEnd = /** @param {TouchEvent} event */ (event) => endTouchDrag(event);
		viewportEl?.addEventListener('touchstart', onTouchStart, { passive: true });
		viewportEl?.addEventListener('touchmove', onTouchMove, { passive: false });
		viewportEl?.addEventListener('touchend', onTouchEnd, { passive: true });
		viewportEl?.addEventListener('touchcancel', onTouchEnd, { passive: true });
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
			viewportEl?.removeEventListener('touchstart', onTouchStart);
			viewportEl?.removeEventListener('touchmove', onTouchMove);
			viewportEl?.removeEventListener('touchend', onTouchEnd);
			viewportEl?.removeEventListener('touchcancel', onTouchEnd);
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<section class="cylinder-section" bind:this={sectionEl} aria-label="Galleria 3D delle foto">
	<div class="cylinder-header" aria-hidden="true">
		<h2>Esplora</h2>
	</div>
	<div class="cylinder-frame">
		<div class="cylinder-viewport" bind:this={viewportEl}>
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
								class="panel-image panel-image--front"
								src={photoUrl}
								alt="Foto analogica in galleria 3D"
								loading="lazy"
							/>
							<img
								class="panel-image panel-image--back"
								src={photoUrl}
								alt=""
								aria-hidden="true"
								loading="lazy"
							/>
						</figure>
					{/each}
				</div>
			</div>
			<button class="nav nav-next" type="button" onclick={nextFace} aria-label="Foto successiva">›</button>
		</div>
	</div>
</section>

<style>
	.cylinder-section {
		--frame-border: 2px;
		--header-width: 100%;
		--carousel-width: min(calc(var(--header-width) - 1.4rem), 72rem);
		--carousel-height: 100%;
		min-height: auto;
		height: auto;
		background: #fff;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 1.2rem 1.25rem 3.2rem;
		overflow-x: clip;
		box-sizing: border-box;
	}

	.cylinder-header {
		width: var(--header-width);
		padding: 0.35rem 0.6rem 0;
		margin-bottom: 0.35rem;
		align-self: center;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		flex: 0 0 auto;
	}

	.cylinder-header::after {
		content: '';
		width: 100%;
		height: 5px;
		background: #000;
		margin-top: 0.35rem;
	}

	h2 {
		margin: 0;
		padding: 0;
		font-size: clamp(1.3rem, 2.7vw, 2.3rem);
		font-weight: 800;
		line-height: 0.95;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: #ff5f1f;
	}

	.cylinder-frame {
		width: var(--header-width);
		flex: 0 0 auto;
		height: min(70dvh, 36rem);
		min-height: 0;
		border: var(--frame-border) solid #000;
		box-sizing: border-box;
		display: flex;
		align-items: stretch;
		position: relative;
		overflow: hidden;
	}

	.cylinder-viewport {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: 0;
		overflow: visible;
		perspective: 1800px;
		perspective-origin: 50% 42%;
		padding-top: 0;
		box-sizing: border-box;
		position: relative;
		touch-action: none;
	}

	.cylinder-wrap {
		width: var(--carousel-width);
		height: 100%;
		display: grid;
		place-items: center;
		padding-top: 0;
		transform-style: preserve-3d;
		flex: 1;
	}

	.cylinder {
		position: relative;
		width: min(48vw, 18rem);
		height: min(46dvh, 22rem);
		transform-style: preserve-3d;
		transform: translateY(-1.8rem) rotateX(var(--rotation-x)) rotateY(var(--rotation-y));
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
		backface-visibility: visible;
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
		transform-style: preserve-3d;
		pointer-events: none;
	}

	.panel-image--front {
		transform: translateZ(0.1px);
	}

	.panel-image--back {
		transform: rotateY(180deg) translateZ(0.1px);
	}

	.nav {
		position: absolute;
		top: var(--frame-border);
		bottom: var(--frame-border);
		height: auto;
		width: 2rem;
		border: none;
		background: #fff;
		color: #000;
		font-size: 1.55rem;
		line-height: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: transform 120ms ease;
		z-index: 2;
		box-sizing: border-box;
	}

	.nav-prev {
		left: 0;
		border-right: var(--frame-border) solid #000;
	}

	.nav-next {
		right: 0;
		border-left: var(--frame-border) solid #000;
	}

	.nav:active {
		transform: scale(0.97);
	}

	@media (max-width: 740px) {
		.cylinder-section {
			--header-width: 100%;
			min-height: auto;
			height: auto;
			width: calc(100% + 2rem);
			margin-inline: -1rem;
			padding: 2rem 0 0;
		}

		.cylinder-header {
			width: min(94vw, 28rem);
			padding: 0.2rem 0.6rem 0;
			margin-bottom: 0.7rem;
		}

		h2 {
			padding: 0;
			font-size: 0.92rem;
			letter-spacing: 0.02em;
		}

		.cylinder-frame {
			border: 0;
			height: auto;
			min-height: 0;
		}

		.cylinder-viewport {
			height: min(46dvh, 18.5rem);
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
