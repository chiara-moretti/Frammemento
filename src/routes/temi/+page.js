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
 * @param {number} maxItems
 * @returns {T[]}
 */
function pickRandomSubset(items, maxItems) {
	const shuffled = [...items].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, Math.min(maxItems, shuffled.length));
}

export function load() {
	const photos = [];

	for (const [category, images] of Object.entries(manifest)) {
		const slug = SLUG_BY_CATEGORY[category];
		const pickedImages = pickRandomSubset(images, 8);
		for (const imageName of pickedImages) {
			const detailIndex = images.indexOf(imageName);
			const detailSlug = slug ?? '';
			const detailHref =
				slug !== undefined && detailIndex >= 0
					? `${base}/temi/foto/${slug}/${detailIndex}`
					: null;
			photos.push({
				key: `${category}-${imageName}`,
				category,
				imageUrl: `${base}/assets/${encodeURIComponent(category)}/${encodeURIComponent(imageName)}`,
				size: randomItem(SIZE_VARIANTS),
				detailHref,
				detailSlug,
				detailIndex
			});
		}
	}

	photos.sort((a, b) => a.category.localeCompare(b.category, 'it'));
	return { photos };
}
