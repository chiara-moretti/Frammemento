<script>
	/** @type {{ title: string; photos?: { url: string; alt: string; detailHref?: string }[] }} */
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
				{#if currentPhoto.detailHref}
					<a
						class="photo-open"
						href={currentPhoto.detailHref}
						aria-label="Apri questa foto a schermo intero"
					>
						<img src={currentPhoto.url} alt={currentPhoto.alt} loading="eager" />
					</a>
				{:else}
					<img src={currentPhoto.url} alt={currentPhoto.alt} loading="eager" />
				{/if}
			</figure>

			<button class="nav next" type="button" onclick={goNext} aria-label="Foto successiva">›</button>
		</section>

		<div class="counter-bar" role="status" aria-live="polite" aria-atomic="true">
			<span class="counter-label">foto</span>
			<span class="counter-current">{currentIndex + 1}</span>
			<span class="counter-sep" aria-hidden="true">/</span>
			<span class="counter-total">{photos.length}</span>
		</div>
	{:else}
		<p class="empty">Nessuna foto disponibile per questa categoria.</p>
	{/if}
</main>

<style>
	:root {
		--slider-border-size: 3px;
		--slider-left-margin: 0;
	}

	:global(body) {
		margin: 0;
		background: #fff;
		color: #000;
		font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	.theme-slider {
		height: 100%;
		min-height: 0;
		padding: 0.8rem 1rem 1.5rem;
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
		margin-left: 0;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
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

	.photo-open {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		min-height: 0;
		color: inherit;
		text-decoration: none;
		cursor: pointer;
	}

	.photo-open:focus-visible {
		outline: 3px solid #ff5f1f;
		outline-offset: 2px;
	}

	.photo-open img {
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

	.counter-bar {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.45rem;
		margin: 0.8rem 0 0.35rem 0;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		padding: 0.45rem 0.75rem;
		border: var(--slider-border-size) solid #000;
		background: #fff;
		box-shadow: 0 4px 0 #000;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		line-height: 1;
		flex-shrink: 0;
		min-height: 0;
	}

	.counter-label {
		margin-right: 0.15rem;
		font-size: 1em;
		line-height: 1;
		color: #000;
	}

	.counter-current {
		color: #ff5f1f;
		font-size: 1em;
		line-height: 1;
		min-width: 1.35ch;
		text-align: center;
	}

	.counter-sep {
		color: #000;
		opacity: 0.45;
		font-weight: 800;
		font-size: 1em;
		line-height: 1;
	}

	.counter-total {
		color: #000;
		font-size: 1em;
		line-height: 1;
		min-width: 1.35ch;
		text-align: center;
	}

	.empty {
		margin: 0.8rem 0 0.35rem 0;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		padding: 0.45rem 0.75rem;
		border: var(--slider-border-size) solid #000;
		background: #fff7f2;
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		flex-shrink: 0;
	}

	@media (min-width: 741px) {
		.theme-slider {
			padding-top: 1.15rem;
		}

		header {
			padding-top: 0.1rem;
		}
	}

	@media (max-width: 740px) {
		.theme-slider {
			--slider-left-margin: 0;
			padding: 0.45rem 1rem 1.1rem;
			grid-template-rows: auto minmax(0, 1fr) auto;
			gap: 0.28rem;
			overflow: hidden;
		}

		.slider {
			grid-template-columns: auto minmax(0, 1fr) auto;
			grid-template-rows: 1fr;
			gap: 0.38rem;
			margin-top: 0.28rem;
			margin-left: 0;
			width: 100%;
			max-width: 100%;
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

		.counter-bar {
			margin: 0.28rem 0 0.35rem 0;
			width: 100%;
			max-width: 100%;
			padding: 0.38rem 0.55rem;
			font-size: 0.7rem;
			box-shadow: 0 3px 0 #000;
			gap: 0.35rem;
		}

		.empty {
			margin: 0.28rem 0 0.35rem 0;
			width: 100%;
			max-width: 100%;
			font-size: 0.58rem;
		}
	}
</style>
