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
	:root {
		--slider-border-size: 3px;
	}

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
		border-bottom: var(--slider-border-size) solid #000;
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
		align-items: stretch;
		gap: 0.75rem;
		margin-top: 0.8rem;
	}

	.frame {
		margin: 0;
		height: 100%;
		min-height: 0;
		border: var(--slider-border-size) solid #000;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		justify-self: center;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
	}

	img {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		object-position: center;
		background: #fff;
		display: block;
		margin: auto;
	}

	.nav {
		height: 3.2rem;
		width: 3.2rem;
		border: var(--slider-border-size) solid #000;
		box-sizing: border-box;
		padding: 0;
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
			height: calc(100dvh - 4.6rem);
			min-height: calc(100dvh - 4.6rem);
			padding: 0.45rem 0.45rem 0.4rem;
			grid-template-rows: auto minmax(0, 1fr) auto;
			gap: 0.28rem;
			overflow: hidden;
		}

		.slider {
			grid-template-columns: auto minmax(0, 1fr) auto;
			grid-template-rows: 1fr;
			gap: 0.38rem;
			margin-top: 0.28rem;
		}

		.frame {
			height: 100%;
			width: 100%;
		}

		.nav {
			width: 2.2rem;
			height: 100%;
			align-self: stretch;
			box-shadow: none;
			font-size: 1.35rem;
		}

		header {
			padding-bottom: 0.28rem;
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
