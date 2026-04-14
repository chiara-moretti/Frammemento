<script>
	import { base } from '$app/paths';

	const albumPdf = `${base}/album.pdf`;
</script>

<main class="page">
	<section class="hero">
		<p class="label">Portfolio Fotografico</p>
		<nav class="top-nav" aria-label="Navigazione principale">
			<div class="nav-dropdown">
				<a href={`${base}/temi`} class="temi-link">temi</a>
				<div class="submenu">
					<a href={`${base}/temi/persone`}>persone</a>
					<a href={`${base}/temi/ritratti`}>ritratti</a>
					<a href={`${base}/temi/natura`}>natura</a>
					<a href={`${base}/temi/citta`}>città</a>
				</div>
			</div>
			<a href="#about">about</a>
			<a href={`${base}/album`}>album</a>
			<a href="https://instagram.com/frammemento" target="_blank" rel="noreferrer">@frammemento</a>
		</nav>
		<h1>Frammemento</h1>
	</section>

	<section id="about" class="content-grid">
		<article class="manifesto">
			<p>
				La passione per la fotografia analogica non è nata in me come un progetto deliberato, né come il
				frutto di un lungo apprendistato tecnico. È piuttosto emersa in modo inatteso, quasi silenzioso,
				come accade a quelle inclinazioni profonde che si rivelano solo nel momento in cui trovano il loro
				linguaggio.
			</p>

			<p>
				In un’epoca dominata dall’immediatezza dell’immagine digitale, l’incontro con la fotografia
				analogica ha rappresentato per me una forma di sospensione: un ritorno alla lentezza, all’attesa e
				all’incertezza. Ogni scatto non è soltanto il risultato di un gesto meccanico, ma un atto di fiducia
				nei confronti del tempo e della materia. La pellicola custodisce l’immagine in uno stato di latenza,
				come un pensiero ancora non pronunciato, che solo attraverso lo sviluppo trova finalmente la propria
				rivelazione.
			</p>

			<p>
				Questo processo introduce una dimensione quasi meditativa nel rapporto con la fotografia. L’assenza
				dell’immediatezza costringe lo sguardo a essere più attento, più consapevole; ogni inquadratura
				diventa una scelta ponderata, ogni fotogramma una possibilità unica e irripetibile. In questo senso,
				la fotografia analogica non è soltanto una tecnica, ma un modo di abitare il tempo e di osservare il
				mondo.
			</p>

			<p>
				Le immagini raccolte in questo album nascono da questo incontro fortuito, ma progressivamente sempre
				più necessario. Non aspirano a essere definitive né esaustive: sono piuttosto tracce di uno sguardo
				in formazione, tentativi di dialogo con la luce, con gli spazi e con gli istanti fugaci che
				attraversano la quotidianità.
			</p>

			<p>
				Se queste fotografie possiedono un valore, esso risiede forse proprio nella loro origine spontanea:
				nell’atto semplice di fermarsi, guardare e affidare a un frammento di pellicola il compito fragile e
				silenzioso di trattenere il tempo.
			</p>
		</article>

		<div class="album">
			<iframe title="Portfolio analogico" src={`${albumPdf}#view=FitH`} loading="lazy"></iframe>
		</div>
	</section>
</main>

<style>
	:global(html),
	:global(body) {
		height: 100%;
	}

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		background: #fff;
		color: #000;
		font-family: 'Helvetica Neue', Arial, sans-serif;
		overflow: hidden;
	}

	.page {
		height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr;
		overflow: hidden;
	}

	.hero {
		position: relative;
		padding: 2.5rem 1.25rem 1rem;
		border-bottom: 6px solid #000;
	}

	.top-nav {
		position: absolute;
		top: 0.8rem;
		right: 1.25rem;
		display: flex;
		gap: 0.9rem;
		font-size: 0.86rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 700;
	}

	.top-nav a {
		color: #000;
		text-decoration: none;
		border-bottom: 2px solid transparent;
		padding-bottom: 0.1rem;
	}

	.top-nav a:hover,
	.top-nav a:focus-visible,
	.temi-link:hover,
	.temi-link:focus-visible {
		border-bottom-color: #ff5f1f;
		color: #ff5f1f;
	}

	.nav-dropdown {
		position: relative;
	}

	.submenu {
		position: absolute;
		top: calc(100% + 0.35rem);
		left: 50%;
		transform: translateX(-50%);
		display: none;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.5rem 0.6rem;
		border: 2px solid #000;
		background: #fff;
		min-width: 8.5rem;
		z-index: 10;
	}

	.nav-dropdown:hover .submenu,
	.nav-dropdown:focus-within .submenu {
		display: flex;
	}

	.submenu a {
		padding: 0.1rem 0;
	}

	.label {
		margin: 0 0 0.4rem;
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: #ff5f1f;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.2rem, 8vw, 5.8rem);
		line-height: 0.95;
		text-transform: uppercase;
		letter-spacing: -0.03em;
	}

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
	}

	.manifesto {
		overflow: auto;
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

	@media (min-width: 980px) {
		.album {
			order: 1;
		}

		.manifesto {
			order: 2;
		}
	}

	@media (max-width: 740px) {
		:global(body) {
			overflow-y: auto;
		}

		.page {
			height: auto;
			min-height: 100dvh;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 1rem;
			overflow-y: auto;
			scroll-snap-type: y mandatory;
		}

		.hero {
			padding: 3.8rem 1rem 1rem;
			border: 3px solid #000;
			min-height: calc(100dvh - 2rem);
			scroll-snap-align: start;
			scroll-snap-stop: always;
		}

		.top-nav {
			left: 1rem;
			right: 1rem;
			justify-content: flex-end;
			flex-wrap: wrap;
			gap: 0.5rem 0.9rem;
		}

		.content-grid {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 0;
			height: auto;
			overflow: visible;
		}

		.manifesto,
		.album {
			height: calc(100dvh - 2rem);
			scroll-snap-align: start;
			scroll-snap-stop: always;
		}
	}
</style>
