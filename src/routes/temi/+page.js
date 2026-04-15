import manifest from '$lib/media-manifest.json';
import { base } from '$app/paths';
import { SLUG_BY_CATEGORY } from '$lib/theme-page-data';

const SIZE_VARIANTS = ['tile', 'wide', 'tall', 'large'];

/**
 * @template T
 * @param {T[]} items
 * @returns {T}
 */
function randomItem(items) {
	return items[Math.floor(Math.random() * items.length)];
}

/**
 * @template T
 * @param {T[]} items
 * @returns {T[]}
 */
function shuffle(items) {
	const shuffled = [...items];
	for (let i = shuffled.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export function load() {
	const photosByCategory = [];

	for (const [category, images] of Object.entries(manifest)) {
		const slug = SLUG_BY_CATEGORY[category];
		const categoryPhotos = [];
		for (const [detailIndex, imageName] of images.entries()) {
			const detailSlug = slug ?? '';
			const detailHref =
				slug !== undefined && detailIndex >= 0
					? `${base}/temi/foto/${slug}/${detailIndex}`
					: null;
			categoryPhotos.push({
				key: `${category}-${imageName}`,
				category,
				imageUrl: `${base}/assets/${encodeURIComponent(category)}/${encodeURIComponent(imageName)}`,
				size: randomItem(SIZE_VARIANTS),
				detailHref,
				detailSlug,
				detailIndex
			});
		}
		photosByCategory.push({ category, photos: shuffle(categoryPhotos) });
	}

	photosByCategory.sort((a, b) => a.category.localeCompare(b.category, 'it'));
	return { photos: photosByCategory.flatMap((entry) => entry.photos) };
}
