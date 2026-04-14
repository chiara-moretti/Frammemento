import manifest from '$lib/media-manifest.json';
import { base } from '$app/paths';

const CATEGORY_BY_SLUG = {
	persone: 'Persone',
	ritratti: 'Ritratti',
	natura: 'Natura',
	citta: 'Città'
};

export function getThemePageData(slug) {
	const category = CATEGORY_BY_SLUG[slug];
	const images = category ? manifest[category] ?? [] : [];

	return {
		title: category ?? slug,
		photos: images.map((fileName, index) => ({
			url: `${base}/assets/${encodeURIComponent(category)}/${encodeURIComponent(fileName)}`,
			alt: `${category} - foto ${index + 1}`
		}))
	};
}
