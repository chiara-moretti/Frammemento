/**
 * Testi opzionali per le pagine singola foto.
 * Chiave: `${slug}-${indice}` con indice 0-based come nell’URL `/temi/foto/[slug]/[index]`.
 *
 * @example
 * // 'persone-0': 'Luce del pomeriggio in strada.',
 */

/** @type {Record<string, string>} */
const descriptions = {
	// Aggiungi qui le descrizioni quando servono.
};

const defaultDescription = `C’è un errore di esposizione in questo scatto. La luce era troppo debole e la meccanica della Fuji troppo lenta. Il risultato è un nero che divora mezza inquadratura e un leggero mosso sui contorni. Se stessi lavorando a un progetto grafico, questo sarebbe uno scarto, un difetto da bilanciare e correggere. Qui, invece, l'errore diventa struttura. La grana esplode per compensare il buio e i dettagli collassano nell'ombra. Nessun tentativo di recuperare ciò che non c'è: solo il contrasto netto tra ciò che la luce è riuscita a colpire e ciò che ha lasciato indietro.`;

/**
 * @param {string} slug
 * @param {number} index
 */
export function getPhotoDescription(slug, index) {
	const key = `${slug}-${index}`;
	const text = descriptions[key];
	return typeof text === 'string' ? text.trim() : defaultDescription;
}
