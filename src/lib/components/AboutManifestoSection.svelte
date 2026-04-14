<script>
	/** @type {{ albumPdf: string }} */
	let { albumPdf } = $props();
</script>

<section id="about" class="content-grid">
	<article class="manifesto">
		<p>
			La passione per la fotografia analogica non è nata in me come un progetto deliberato, né come il
			frutto di un lungo apprendistato tecnico. È piuttosto emersa in modo inatteso, quasi silenzioso, come
			accade a quelle inclinazioni profonde che si rivelano solo nel momento in cui trovano il loro
			linguaggio.
		</p>

		<p>
			In un’epoca dominata dall’immediatezza dell’immagine digitale, l’incontro con la fotografia analogica ha
			rappresentato per me una forma di sospensione: un ritorno alla lentezza, all’attesa e all’incertezza.
			Ogni scatto non è soltanto il risultato di un gesto meccanico, ma un atto di fiducia nei confronti del
			tempo e della materia. La pellicola custodisce l’immagine in uno stato di latenza, come un pensiero
			ancora non pronunciato, che solo attraverso lo sviluppo trova finalmente la propria rivelazione.
		</p>

		<p>
			Questo processo introduce una dimensione quasi meditativa nel rapporto con la fotografia. L’assenza
			dell’immediatezza costringe lo sguardo a essere più attento, più consapevole; ogni inquadratura diventa
			una scelta ponderata, ogni fotogramma una possibilità unica e irripetibile. In questo senso, la
			fotografia analogica non è soltanto una tecnica, ma un modo di abitare il tempo e di osservare il
			mondo.
		</p>

		<p>
			Le immagini raccolte in questo album nascono da questo incontro fortuito, ma progressivamente sempre più
			necessario. Non aspirano a essere definitive né esaustive: sono piuttosto tracce di uno sguardo in
			formazione, tentativi di dialogo con la luce, con gli spazi e con gli istanti fugaci che attraversano la
			quotidianità.
		</p>

		<p>
			Se queste fotografie possiedono un valore, esso risiede forse proprio nella loro origine spontanea:
			nell’atto semplice di fermarsi, guardare e affidare a un frammento di pellicola il compito fragile e
			silenzioso di trattenere il tempo.
		</p>
	</article>

	<div class="album">
		<iframe title="Portfolio analogico" src={`${albumPdf}#zoom=page-width`} loading="lazy"></iframe>
		<a class="mobile-pdf-link" href={albumPdf} target="_blank" rel="noopener noreferrer">
			Apri PDF completo
		</a>
	</div>
</section>

<style>
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

	.mobile-pdf-link {
		display: none;
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
		.content-grid {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 0;
			height: auto;
			min-height: auto;
			overflow: visible;
		}

		.manifesto,
		.album {
			height: auto;
		}

		.album {
			order: 0;
			border: 3px solid #ff5f1f;
			height: min(66dvh, 36rem);
			min-height: 0;
			padding: 0.6rem;
		}

		.manifesto {
			display: block;
			order: 2;
		}

		iframe {
			border: 2px solid #000;
			min-height: 0;
		}

		.mobile-pdf-link {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			margin-top: 0.55rem;
			padding: 0.55rem 0.75rem;
			border: 2px solid #000;
			background: #fff;
			color: #000;
			text-decoration: none;
			font-size: 0.82rem;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}
	}
</style>
