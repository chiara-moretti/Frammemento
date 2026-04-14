import manifest from '$lib/media-manifest.json';
import { base } from '$app/paths';

const SIZE_VARIANTS = ['tile', 'wide', 'tall', 'large'];

function randomItem(items) {
	return items[Math.floor(Math.random() * items.length)];
}

function pickRandomSubset(items, maxItems) {
	const shuffled = [...items].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, Math.min(maxItems, shuffled.length));
}

export function load() {
	const photos = [];

	for (const [category, images] of Object.entries(manifest)) {
		const pickedImages = pickRandomSubset(images, 8);
		for (const imageName of pickedImages) {
			photos.push({
				key: `${category}-${imageName}`,
				category,
				imageUrl: `${base}/assets/${encodeURIComponent(category)}/${encodeURIComponent(imageName)}`,
				size: randomItem(SIZE_VARIANTS)
			});
		}
	}

	photos.sort((a, b) => a.category.localeCompare(b.category, 'it'));
	return { photos };
}
