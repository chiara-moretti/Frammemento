<script>
	let { data } = $props();
</script>

<main class="temi-page">
	<header class="temi-header">
		<p class="label">Portfolio Fotografico</p>
		<h1>Temi</h1>
	</header>

	<section class="grid" aria-label="Categorie fotografiche">
		{#each data.photos as photo}
			<article class={`card ${photo.size}`}>
				<div class="photo-wrap">
					<img src={photo.imageUrl} alt={`Foto categoria ${photo.category}`} loading="lazy" />
				</div>
				<h2>{photo.category}</h2>
			</article>
		{/each}
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		background: #fff;
		color: #000;
		font-family: 'Helvetica Neue', Arial, sans-serif;
		overflow: auto;
	}

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	.temi-page {
		min-height: 100dvh;
		padding: 1rem;
	}

	.temi-header {
		position: relative;
		border-bottom: 5px solid #000;
		padding: 0 0 0.7rem;
	}

	.label {
		margin: 0 0 0.35rem;
		font-size: 0.86rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #ff5f1f;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 8vw, 5rem);
		letter-spacing: -0.03em;
		text-transform: uppercase;
	}

	.grid {
		column-count: 4;
		column-gap: 1rem;
		padding-top: 1rem;
	}

	.card {
		display: inline-block;
		width: 100%;
		margin: 0 0 1rem;
		border: 3px solid #000;
		background: #fff7f2;
		padding: 0.55rem;
		break-inside: avoid;
	}

	.photo-wrap {
		border: 2px solid #000;
		background: #fff;
		aspect-ratio: 4 / 3;
		overflow: hidden;
	}

	.card.tile .photo-wrap {
		aspect-ratio: 4 / 3;
	}

	.card.wide .photo-wrap {
		aspect-ratio: 16 / 9;
	}

	.card.tall .photo-wrap {
		aspect-ratio: 3 / 4;
	}

	.card.large .photo-wrap {
		aspect-ratio: 1 / 1;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	h2 {
		margin: 0.5rem 0 0;
		font-size: 0.82rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	@media (max-width: 780px) {
		.grid {
			column-count: 2;
		}
	}

	@media (min-width: 1200px) {
		.grid {
			column-count: 5;
		}
	}
</style>
