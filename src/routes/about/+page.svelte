<script>
	import { onMount } from 'svelte';

	const framLetters = [...'frammento'];
	const memLetters = [...'memento'];
	const finalWord = 'FRAMMEMENTO';

	/** Fallback se la misura non è ancora pronta */
	/** @param {number} slot */
	function slotTxCh(slot) {
		return `${(slot - 5) * 1.78}ch`;
	}

	/** @param {number} i */
	function framTokenStyle(i) {
		/* «frammento» in alto, centrato */
		const tx0 = tx0ForFram(i);
		const ty0 = '-11vh';
		const tx1 = `calc(${tx0} + ${(i - 4) * 0.5}ch)`;
		const ty1 = `${-11 + ((i % 3) - 1) * 0.9}vh`;
		const tx2 = `calc(${tx0} + ${(i - 4) * 0.18}ch)`;
		const ty2 = '-8.8vh';
		if (i <= 3) {
			return {
				tx0,
				ty0,
				tx1,
				ty1,
				tx2,
				ty2,
				tx3: slotTxCh(i),
				ty3: '0vh',
				st: i * 0.035,
				role: 'final',
				finalSlot: i
			};
		}
		const r = i - 4;
		/** «mento»: 5 lettere centrate sullo stage (indice r 0…4 → -2…+2) */
		const stepVw = 5.25;
		const tx3Rest = `${(r - 2) * stepVw}vw`;
		return {
			tx0,
			ty0,
			tx1,
			ty1,
			tx2,
			ty2,
			tx3: tx3Rest,
			ty3: '11vh',
			st: i * 0.035,
			role: 'rest',
			finalSlot: null
		};
	}

	/** @param {number} j */
	function memTokenStyle(j) {
		/* «memento» sotto, centrato */
		const tx0 = tx0ForMem(j);
		const ty0 = '3vh';
		const tx1 = `calc(${tx0} + ${(j - 3) * 0.4}ch)`;
		const ty1 = `${3 + ((j % 3) - 1) * 0.9}vh`;
		const tx2 = `calc(${tx0} + ${(j - 3) * 0.12}ch)`;
		const ty2 = '0.8vh';
		const slot = j + 4;
		return {
			tx0,
			ty0,
			tx1,
			ty1,
			tx2,
			ty2,
			tx3: slotTxCh(slot),
			ty3: '0vh',
			st: (j + 9) * 0.035,
			role: 'final',
			finalSlot: slot
		};
	}

	/** @type {HTMLElement | undefined} */
	let stageEl = $state();
	/** @type {HTMLElement | undefined} */
	let probeEl = $state();
	/** @type {HTMLElement | undefined} */
	let framProbeEl = $state();
	/** @type {HTMLElement | undefined} */
	let memProbeEl = $state();

	/** Centri X delle 11 lettere rispetto al centro dello stage (px) */
	let finalOffsetsPx = $state(/** @type {number[]} */ ([]));
	/** Centri X di "frammento" rispetto al centro stage (px) */
	let framOffsetsPx = $state(/** @type {number[]} */ ([]));
	/** Centri X di "memento" rispetto al centro stage (px) */
	let memOffsetsPx = $state(/** @type {number[]} */ ([]));

	async function measureFinalWord() {
		if (!stageEl || !probeEl || !framProbeEl || !memProbeEl) return;
		if (typeof document !== 'undefined' && document.fonts?.ready) {
			try {
				await document.fonts.ready;
			} catch {
				/* ignore */
			}
		}
		const spans = probeEl.querySelectorAll('.probe-char');
		if (spans.length !== finalWord.length) return;
		const scr = stageEl.getBoundingClientRect();
		const mid = scr.left + scr.width / 2;
		finalOffsetsPx = [...spans].map((el) => {
			const r = el.getBoundingClientRect();
			return r.left + r.width / 2 - mid;
		});

		const framSpans = framProbeEl.querySelectorAll('.probe-char');
		if (framSpans.length === framLetters.length) {
			framOffsetsPx = [...framSpans].map((el) => {
				const r = el.getBoundingClientRect();
				return r.left + r.width / 2 - mid;
			});
		}

		const memSpans = memProbeEl.querySelectorAll('.probe-char');
		if (memSpans.length === memLetters.length) {
			memOffsetsPx = [...memSpans].map((el) => {
				const r = el.getBoundingClientRect();
				return r.left + r.width / 2 - mid;
			});
		}
	}

	$effect(() => {
		if (!stageEl || !probeEl || !framProbeEl || !memProbeEl) return;
		void measureFinalWord();
		const ro = new ResizeObserver(() => {
			void measureFinalWord();
		});
		ro.observe(stageEl);
		let rafA = 0;
		let rafB = 0;
		rafA = requestAnimationFrame(() => {
			rafB = requestAnimationFrame(() => {
				void measureFinalWord();
			});
		});
		return () => {
			cancelAnimationFrame(rafA);
			cancelAnimationFrame(rafB);
			ro.disconnect();
		};
	});

	/** @param {number | null} slot */
	function tx3ForFinal(slot) {
		if (slot == null) return '';
		if (finalOffsetsPx.length === finalWord.length) return `${finalOffsetsPx[slot]}px`;
		return slotTxCh(slot);
	}

	/** @param {number} i */
	function tx0ForFram(i) {
		if (framOffsetsPx.length === framLetters.length) return `${framOffsetsPx[i]}px`;
		return `${(i - 4) * 1.32}ch`;
	}

	/** @param {number} j */
	function tx0ForMem(j) {
		if (memOffsetsPx.length === memLetters.length) return `${memOffsetsPx[j]}px`;
		return `${(j - 3) * 1.32}ch`;
	}

	onMount(() => {
		document.documentElement.classList.add('route-about');
		return () => document.documentElement.classList.remove('route-about');
	});
</script>

<svelte:head>
	<title>About — Frammemento</title>
</svelte:head>

<div class="about-root">
	<div class="stage" bind:this={stageEl} role="img" aria-label="Frammento e memento: le lettere si ricompongono in FRAMMEMENTO">
		<!-- Probe: stesso peso/spacing della fine animazione, per misurare i centri reali -->
		<div class="final-probe" bind:this={probeEl} aria-hidden="true">
			{#each [...finalWord] as c}
				<span class="probe-char">{c}</span>
			{/each}
		</div>
		<div class="word-probe word-probe--fram" bind:this={framProbeEl} aria-hidden="true">
			{#each framLetters as c}
				<span class="probe-char">{c}</span>
			{/each}
		</div>
		<div class="word-probe word-probe--mem" bind:this={memProbeEl} aria-hidden="true">
			{#each memLetters as c}
				<span class="probe-char">{c}</span>
			{/each}
		</div>

		<div class="ety ety--fram">
			Dal latino <i>fragmentum</i>, «pezzo infranto».
		</div>
		<div class="ety ety--mem">
			Dal latino <i>memento</i>, imperativo di <i>meminisse</i> («ricordare»).
		</div>

		{#each framLetters as ch, i}
			{@const s = framTokenStyle(i)}
			<span
				class="token token--fram"
				class:token--final={s.role === 'final'}
				class:token--rest={s.role === 'rest'}
				style="--tx0: {s.tx0}; --ty0: {s.ty0}; --tx1: {s.tx1}; --ty1: {s.ty1}; --tx2: {s.tx2}; --ty2: {s.ty2}; --tx3: {s.role === 'final'
					? tx3ForFinal(s.finalSlot)
					: s.tx3}; --ty3: {s.ty3}; --st: {s.st}"
			>{ch}</span>
		{/each}
		{#each memLetters as ch, j}
			{@const s = memTokenStyle(j)}
			<span
				class="token token--mem token--final"
				style="--tx0: {s.tx0}; --ty0: {s.ty0}; --tx1: {s.tx1}; --ty1: {s.ty1}; --tx2: {s.tx2}; --ty2: {s.ty2}; --tx3: {tx3ForFinal(
					s.finalSlot
				)}; --ty3: {s.ty3}; --st: {s.st}"
			>{ch}</span>
		{/each}
	</div>
</div>

<style>
	:global(html.route-about),
	:global(html.route-about body) {
		height: 100%;
	}

	:global(html.route-about body) {
		margin: 0;
		background: #fff;
		color: #000;
		font-family: 'Helvetica Neue', Arial, sans-serif;
		overflow-x: hidden;
		overflow-y: hidden;
	}

	/* Annulla offset del layout mobile (padding-top su <main>) */
	:global(html.route-about body > main) {
		padding-top: 0 !important;
		min-height: 100dvh;
	}

	:global(html.route-about *),
	:global(html.route-about *::before),
	:global(html.route-about *::after) {
		box-sizing: border-box;
	}

	.about-root {
		position: relative;
		min-height: 100dvh;
		width: 100%;
		padding: 0;
		display: grid;
		place-items: center;
		overflow: hidden;
		--about-center-offset-y: -5rem;
	}

	.stage {
		position: relative;
		width: 100vw;
		max-width: 100vw;
		height: 100dvh;
		min-height: 100dvh;
		margin-inline: auto;
		overflow: hidden;
	}

	/* Allineamento come la riga finale: baseline + kerning del font */
	.final-probe {
		position: absolute;
		left: 50%;
		top: calc(50% + var(--about-center-offset-y));
		z-index: 0;
		transform: translate(-50%, -50%) scale(1.12);
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: baseline;
		justify-content: center;
		gap: 0;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		white-space: nowrap;
		color: transparent;
		font-size: clamp(1rem, 3.2vw, 1.85rem);
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
		letter-spacing: 0.055em;
		font-kerning: normal;
		font-feature-settings: 'kern' 1;
	}

	.probe-char {
		display: inline-block;
		flex-shrink: 0;
	}

	.word-probe {
		position: absolute;
		left: 50%;
		top: calc(50% + var(--about-center-offset-y));
		z-index: 0;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: baseline;
		justify-content: center;
		gap: 0;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		white-space: nowrap;
		color: transparent;
		font-size: clamp(1.1rem, 4.1vw, 2.25rem);
		font-weight: 700;
		line-height: 1;
		text-transform: lowercase;
		letter-spacing: 0.02em;
		font-kerning: normal;
		font-feature-settings: 'kern' 1;
	}

	.token--fram,
	.token--mem {
		font-kerning: normal;
		font-feature-settings: 'kern' 1;
		letter-spacing: 0.02em;
	}

	.ety {
		position: absolute;
		left: 50%;
		top: calc(62% + var(--about-center-offset-y));
		width: min(38vw, 14.5rem);
		margin: 0;
		padding: 0 0.35rem;
		font-size: clamp(0.62rem, 1.45vw, 0.78rem);
		line-height: 1.45;
		color: #333;
		font-weight: 500;
		text-align: center;
		pointer-events: none;
		animation: ety-out 7.4s ease-in-out forwards;
	}

	.ety--fram {
		top: calc(42% + var(--about-center-offset-y));
		transform: translate(-50%, 0);
	}

	.ety--mem {
		top: calc(56% + var(--about-center-offset-y));
		transform: translate(-50%, 0);
	}

	@keyframes ety-out {
		0%,
		11% {
			opacity: 1;
			filter: blur(0);
		}
		17%,
		100% {
			opacity: 0;
			visibility: hidden;
			filter: blur(2px);
		}
	}

	.token {
		position: absolute;
		left: 50%;
		top: calc(50% + var(--about-center-offset-y));
		z-index: 1;
		transform: translate(-50%, -50%);
		font-size: clamp(1.1rem, 4.1vw, 2.25rem);
		font-weight: 700;
		line-height: 1;
		text-transform: lowercase;
		opacity: 1;
		display: inline-flex;
		align-items: baseline;
		justify-content: center;
		will-change: transform, font-weight, text-transform;
		animation-duration: 7.4s;
		animation-timing-function: cubic-bezier(0.33, 0.82, 0.2, 1);
		/* Durante animation-delay applica il keyframe 0%: niente lettere impilate al centro */
		animation-fill-mode: both;
		animation-delay: calc(var(--st) * 1s);
	}

	.token--final {
		animation-name: token-path-final;
	}

	.token--rest {
		animation-name: token-path-rest;
		color: #4a4a4a;
	}

	@keyframes token-path-final {
		0%,
		14% {
			transform: translate(-50%, -50%) translate(var(--tx0), var(--ty0)) scale(1);
			font-weight: 700;
			text-transform: lowercase;
			letter-spacing: 0.02em;
		}
		21%,
		22% {
			transform: translate(-50%, -50%) translate(var(--tx0), var(--ty0)) scale(1);
			font-weight: 700;
			text-transform: lowercase;
			letter-spacing: 0.02em;
		}
		38% {
			transform: translate(-50%, -50%) translate(var(--tx1), var(--ty1)) scale(1);
			font-weight: 700;
			text-transform: lowercase;
			letter-spacing: 0.02em;
		}
		52% {
			transform: translate(-50%, -50%) translate(var(--tx2), var(--ty2)) scale(1);
			font-weight: 700;
			text-transform: lowercase;
			letter-spacing: 0.02em;
		}
		78%,
		90%,
		100% {
			transform: translate(-50%, -50%) translate(var(--tx3), var(--ty3)) scale(1.12);
			font-weight: 800;
			text-transform: uppercase;
			letter-spacing: 0.055em;
			font-feature-settings: 'kern' 1;
		}
	}

	@keyframes token-path-rest {
		0%,
		14% {
			transform: translate(-50%, -50%) translate(var(--tx0), var(--ty0)) scale(1);
			letter-spacing: 0.02em;
		}
		21%,
		22% {
			transform: translate(-50%, -50%) translate(var(--tx0), var(--ty0)) scale(1);
			letter-spacing: 0.02em;
		}
		38% {
			transform: translate(-50%, -50%) translate(var(--tx1), var(--ty1)) scale(1);
			letter-spacing: 0.02em;
		}
		52% {
			transform: translate(-50%, -50%) translate(var(--tx2), var(--ty2)) scale(1);
			letter-spacing: 0.02em;
		}
		82% {
			transform: translate(-50%, -50%) translate(var(--tx3), var(--ty3)) scale(0.84);
			letter-spacing: 0.02em;
			opacity: 0.9;
		}
		100% {
			transform: translate(-50%, -50%) translate(var(--tx3), var(--ty3)) scale(0.84);
			letter-spacing: 0.02em;
			opacity: 0;
		}
	}

	@media (max-width: 740px) {
		.about-root {
			/* Rifinitura mobile: centro visivo della parola finale */
			--about-center-offset-y: -6rem;
		}

		.stage {
			height: 100dvh;
			min-height: 100dvh;
		}

		.ety {
			width: min(72vw, 20rem);
			font-size: clamp(0.62rem, 2.9vw, 0.74rem);
		}

		.token,
		.final-probe {
			font-size: clamp(0.95rem, 5.4vw, 1.45rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ety {
			animation: none;
			opacity: 0;
			visibility: hidden;
		}

		.token {
			animation: none;
			transform: translate(-50%, -50%) translate(var(--tx3), var(--ty3));
		}

		.token--final {
			font-weight: 800;
			text-transform: uppercase;
			letter-spacing: 0.055em;
			transform: translate(-50%, -50%) translate(var(--tx3), var(--ty3)) scale(1.12);
		}

		.token--rest {
			transform: translate(-50%, -50%) translate(var(--tx3), var(--ty3)) scale(0.84);
			opacity: 0.9;
		}
	}
</style>
