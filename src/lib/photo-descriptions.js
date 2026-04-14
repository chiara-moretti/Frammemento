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

/**
 * @param {string} slug
 * @param {number} index
 */
export function getPhotoDescription(slug, index) {
	const key = `${slug}-${index}`;
	const text = descriptions[key];
	return typeof text === 'string' ? text.trim() : '';
}
