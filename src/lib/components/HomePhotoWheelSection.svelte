<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import manifest from '$lib/media-manifest.json';

	/** @type {string[]} */
	const allPhotoUrls = Object.entries(manifest).flatMap(([category, photos]) =>
		photos.map(
			(fileName) => `${base}/assets/${encodeURIComponent(category)}/${encodeURIComponent(fileName)}`
		)
	);

	let wheelCards = $state(
		/** @type {{url: string; angleDeg: number; radius: number; lift: number; tilt: number; scale: number}[]} */ (
			[]
		)
	);
	let rotationY = $state(0);
	let isDragging = $state(false);
	let isPaused = $state(false);

	let dragStartX = 0;
	let dragStartRotationY = 0;
	let rafId = 0;
	let lastFrameTs = 0;

	/**
	 * @param {string[]} source
	 * @param {number} count
	 */
	function pickPhotos(source, count) {
		const shuffled = [...source];
		for (let i = shuffled.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		if (shuffled.length >= count) return shuffled.slice(0, count);
		const filled = [];
		for (let i = 0; i < count; i += 1) filled.push(shuffled[i % shuffled.length]);
		return filled;
	}

	/**
	 * Restituisce l'indice della card in asse con il centro prospettico.
	 * @param {number} rotationDeg
	 * @param {number} count
	 */
	function getActiveIndex(rotationDeg, count) {
		if (!count) return 0;
		const step = 360 / count;
		const rawIndex = Math.round(-rotationDeg / step);
		return ((rawIndex % count) + count) % count;
	}

	/**
	 * @param {string[]} photos
	 */
	function buildWheelCards(photos) {
		if (!photos.length) return [];
		const step = 360 / photos.length;
		return photos.map((url, index) => {
			const angleDeg = step * index;
			// Raggio stretto + card larghe = effetto impilato attorno all'anello.
			const radius = 14.4;
			const lift = 0;
			const tilt = 0;
			const scale = 1;
			return { url, angleDeg, radius, lift, tilt, scale };
		});
	}

	/**
	 * @param {number} timestamp
	 */
	function animate(timestamp) {
		if (!lastFrameTs) lastFrameTs = timestamp;
		const delta = timestamp - lastFrameTs;
		lastFrameTs = timestamp;
		if (!isDragging && !isPaused) rotationY -= delta * 0.016;
		rafId = requestAnimationFrame(animate);
	}

	/**
	 * @param {PointerEvent} event
	 */
	function startDrag(event) {
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		isDragging = true;
		dragStartX = event.clientX;
		dragStartRotationY = rotationY;
		const target = /** @type {HTMLElement | null} */ (event.currentTarget);
		target?.setPointerCapture(event.pointerId);
	}

	/**
	 * @param {PointerEvent} event
	 */
	function moveDrag(event) {
		if (!isDragging) return;
		const deltaX = event.clientX - dragStartX;
		rotationY = dragStartRotationY + deltaX * 0.32;
	}

	function endDrag() {
		isDragging = false;
	}

	onMount(() => {
		wheelCards = buildWheelCards(pickPhotos(allPhotoUrls, allPhotoUrls.length));
		rafId = requestAnimationFrame(animate);
		return () => {
			if (rafId) cancelAnimationFrame(rafId);
		};
	});
</script>

<section class="wheel-section" aria-label="Wheel 3D fotografico">
	<div class="wheel-frame">
		<div class="focus-preview">
			{#if wheelCards.length > 0}
				<img
					src={wheelCards[getActiveIndex(rotationY, wheelCards.length)].url}
					alt="Anteprima della foto attualmente al centro della ruota"
					loading="lazy"
				/>
			{/if}
		</div>

		<div
			class="wheel-viewport"
			role="application"
			aria-label="Ruota 3D trascinabile di fotografie"
			onpointerdown={startDrag}
			onpointermove={moveDrag}
			onpointerup={endDrag}
			onpointercancel={endDrag}
			onlostpointercapture={endDrag}
			onmouseenter={() => (isPaused = true)}
			onmouseleave={() => (isPaused = false)}
		>
			<div
				class="wheel"
				class:dragging={isDragging}
				style={`--rotation-y: ${rotationY}deg;`}
			>
				{#each wheelCards as card, index (`${card.url}-${index}`)}
					<figure
						class="wheel-card"
						style={`--angle: ${card.angleDeg}deg; --radius: ${card.radius}rem; --lift: ${card.lift}%; --tilt: ${card.tilt}deg; --scale: ${card.scale};`}
					>
						<img src={card.url} alt="Fotografia della ruota 3D" loading="lazy" />
					</figure>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.wheel-section {
		padding: 3rem 1.25rem 2.6rem;
		background: #fff;
	}

	.wheel-frame {
		position: relative;
		border: 2px solid #000;
		min-height: min(80dvh, 46rem);
		overflow: hidden;
		background:
			radial-gradient(circle at 70% 20%, rgba(255, 95, 31, 0.1), transparent 45%),
			linear-gradient(180deg, #fff, #f7f7f7);
	}

	.focus-preview {
		position: absolute;
		left: 1rem;
		top: 1rem;
		width: clamp(8rem, 18vw, 15rem);
		aspect-ratio: 3 / 4;
		z-index: 4;
		border: 2px solid #000;
		background: #fff;
		overflow: hidden;
	}

	.focus-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.wheel-viewport {
		height: min(80dvh, 46rem);
		display: grid;
		place-items: center;
		perspective: 1250px;
		perspective-origin: 50% 40%;
		overflow: hidden;
		touch-action: none;
		user-select: none;
	}

	.wheel {
		position: relative;
		width: min(64vw, 46rem);
		height: min(58dvh, 28rem);
		transform-style: preserve-3d;
		transform: rotateX(-10deg) rotateY(var(--rotation-y));
		will-change: transform;
		cursor: grab;
	}

	.wheel.dragging {
		cursor: grabbing;
	}

	.wheel-card {
		position: absolute;
		left: 50%;
		top: 50%;
		width: clamp(5.5rem, 10vw, 8.6rem);
		aspect-ratio: 3 / 4;
		margin: 0;
		border: 2px solid #000;
		overflow: hidden;
		background: #fff;
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
		transform:
			translate(-50%, calc(-50% + var(--lift)))
			rotateY(var(--angle))
			translateZ(var(--radius))
			rotateY(90deg)
			rotateZ(var(--tilt))
			scale(var(--scale));
	}

	.wheel-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	@media (max-width: 740px) {
		.wheel-section {
			width: calc(100% + 2rem);
			margin-inline: -1rem;
			padding: 2rem 0 1.5rem;
		}

		.wheel-frame {
			border-width: 0;
			min-height: min(78dvh, 34rem);
		}

		.focus-preview {
			left: 0.75rem;
			top: 0.75rem;
			width: clamp(7.3rem, 36vw, 9.6rem);
			border-width: 2px;
		}

		.wheel-viewport {
			height: min(78dvh, 34rem);
		}

		.wheel {
			width: min(86vw, 24rem);
			height: min(50dvh, 16rem);
		}

		.wheel-card {
			width: clamp(4.6rem, 19vw, 6.2rem);
			transform:
				translate(-50%, calc(-50% + var(--lift)))
				rotateY(var(--angle))
				translateZ(calc(var(--radius) * 0.72))
				rotateY(90deg)
				rotateZ(var(--tilt))
				scale(var(--scale));
		}
	}
</style>
