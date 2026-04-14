<script>
	let { title, photos = [] } = $props();

	let currentIndex = $state(0);

	const currentPhoto = $derived(photos[currentIndex]);
	const hasPhotos = $derived(photos.length > 0);

	const goPrev = () => {
		if (!hasPhotos) return;
		currentIndex = (currentIndex - 1 + photos.length) % photos.length;
	};

	const goNext = () => {
		if (!hasPhotos) return;
		currentIndex = (currentIndex + 1) % photos.length;
	};

	/** @param {KeyboardEvent} event */
	const onKeyDown = (event) => {
		if (event.key === 'ArrowLeft') goPrev();
		if (event.key === 'ArrowRight') goNext();
	};
</script>

<svelte:window onkeydown={onKeyDown} />

<main class="theme-slider">
	<header>
		<p class="label">Temi</p>
		<h1>{title}</h1>
	</header>

	{#if hasPhotos}
		<section class="slider" aria-label={`Slider fotografico categoria ${title}`}>
			<button class="nav prev" type="button" onclick={goPrev} aria-label="Foto precedente">‹</button>

			<figure class="frame">
				<img src={currentPhoto.url} alt={currentPhoto.alt} loading="eager" />
			</figure>

			<button class="nav next" type="button" onclick={goNext} aria-label="Foto successiva">›</button>
		</section>

		<p class="counter">{currentIndex + 1} / {photos.length}</p>
	{:else}
		<p class="empty">Nessuna foto disponibile per questa categoria.</p>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		background: #fff;
		color: #000;
		font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	.theme-slider {
		height: 100dvh;
		min-height: 100dvh;
		padding: 0.8rem 1rem 0.65rem;
		box-sizing: border-box;
		display: grid;
		grid-template-rows: auto 1fr auto;
		gap: 0.5rem;
		overflow: hidden;
		outline: none;
	}

	header {
		border-bottom: 5px solid #000;
		padding-bottom: 0.3rem;
	}

	.label {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.74rem;
		font-weight: 700;
		color: #ff5f1f;
	}

	h1 {
		margin: 0.2rem 0 0;
		font-size: clamp(1.35rem, 3.6vw, 2.3rem);
		text-transform: uppercase;
	}

	.slider {
		height: 100%;
		min-height: 0;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem;
	}

	.frame {
		margin: 0;
		height: 100%;
		min-height: 0;
		border: 3px solid #000;
		background: #f9f9f9;
		display: grid;
		place-items: center;
		justify-self: center;
		width: 100%;
		overflow: hidden;
	}

	img {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
		object-position: center;
		display: block;
	}

	.nav {
		height: 3.2rem;
		width: 3.2rem;
		border: 3px solid #000;
		background: #fff;
		color: #000;
		font-size: 2rem;
		line-height: 1;
		cursor: pointer;
		box-shadow: 0 4px 0 #000;
	}

	.nav:hover,
	.nav:focus-visible {
		color: #ff5f1f;
		border-color: #ff5f1f;
	}

	.counter,
	.empty {
		margin: 0;
		font-size: 0.64rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	@media (max-width: 740px) {
		.theme-slider {
			height: 100dvh;
			min-height: 100dvh;
			padding: 0.45rem 0.45rem 0.4rem;
			grid-template-rows: auto minmax(0, 0.82fr) auto;
			gap: 0.28rem;
			overflow: hidden;
		}

		.slider {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr auto auto;
			gap: 0.38rem;
		}

		.frame {
			height: min(100%, 52dvh);
			border-width: 2px;
			width: min(100%, 92vw);
		}

		.nav {
			width: 100%;
			height: 1.85rem;
			box-shadow: 0 2px 0 #000;
			font-size: 1.1rem;
		}

		.prev {
			order: 1;
		}

		.next {
			order: 2;
		}

		header {
			padding-bottom: 0.28rem;
			border-bottom-width: 2px;
		}

		.label {
			font-size: 0.72rem;
		}

		h1 {
			margin-top: 0.12rem;
			font-size: clamp(1.1rem, 6.3vw, 1.7rem);
			line-height: 1.05;
		}

		.counter,
		.empty {
			font-size: 0.58rem;
		}
	}
</style>
