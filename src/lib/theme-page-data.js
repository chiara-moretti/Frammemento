import manifest from '$lib/media-manifest.json';
import { base } from '$app/paths';

/** @type {Record<string, string>} */
const CATEGORY_BY_SLUG = {
	persone: 'Persone',
	ritratti: 'Ritratti',
	natura: 'Natura',
	citta: 'Città'
};

/** Mappa nome categoria (manifest) → slug URL */
export const SLUG_BY_CATEGORY = /** @type {Record<string, string>} */ (
	Object.fromEntries(Object.entries(CATEGORY_BY_SLUG).map(([slug, category]) => [category, slug]))
);

/**
 * @param {string} slug
 */
export function getThemePageData(slug) {
	const category = CATEGORY_BY_SLUG[slug];
	if (!category || !Object.prototype.hasOwnProperty.call(manifest, category)) {
		return {
			slug,
			title: category ?? slug,
			photos: []
		};
	}

	const images = manifest[/** @type {keyof typeof manifest} */ (category)];

	return {
		slug,
		title: category,
		photos: images.map((fileName, index) => ({
			url: `${base}/assets/${encodeURIComponent(category)}/${encodeURIComponent(fileName)}`,
			alt: `${category} - foto ${index + 1}`,
			detailHref: `${base}/temi/foto/${slug}/${index}`
		}))
	};
}
