<script>
	import { base } from '$app/paths';
</script>

<main class="tema-page">
	<header>
		<p class="label">Temi</p>
		<h1>Ritratti</h1>
	</header>

	<nav class="tema-nav" aria-label="Navigazione tema">
		<a href={`${base}/`}>home</a>
		<a href={`${base}/album`}>album</a>
		<a href={`${base}/temi/persone`}>persone</a>
		<a href={`${base}/temi/natura`}>natura</a>
		<a href={`${base}/temi/citta`}>città</a>
	</nav>

	<section class="content">
		<p>Sezione dedicata ai ritratti.</p>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		background: #fff;
		color: #000;
		font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	.tema-page {
		min-height: 100dvh;
		padding: 1.25rem;
		display: grid;
		gap: 1rem;
	}

	header {
		border-bottom: 5px solid #000;
		padding-bottom: 0.7rem;
	}

	.label {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.82rem;
		font-weight: 700;
		color: #ff5f1f;
	}

	h1 {
		margin: 0.2rem 0 0;
		font-size: clamp(2rem, 7vw, 4.5rem);
		text-transform: uppercase;
	}

	.tema-nav {
		display: flex;
		gap: 0.9rem;
		flex-wrap: wrap;
		font-weight: 700;
		text-transform: uppercase;
		font-size: 0.86rem;
	}

	.tema-nav a {
		color: #000;
		text-decoration: none;
		border-bottom: 2px solid transparent;
	}

	.tema-nav a:hover,
	.tema-nav a:focus-visible {
		color: #ff5f1f;
		border-bottom-color: #ff5f1f;
	}

	.content {
		border: 3px solid #000;
		padding: 1rem;
		background: #fff7f2;
	}
</style>
