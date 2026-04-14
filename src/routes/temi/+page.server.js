import { readdir } from 'node:fs/promises';
import path from 'node:path';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
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

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const assetsRoot = path.join(process.cwd(), 'assets');
	const entries = await readdir(assetsRoot, { withFileTypes: true });
	const photos = [];

	for (const entry of entries) {
		if (!entry.isDirectory() || entry.name.startsWith('.')) continue;

		const categoryPath = path.join(assetsRoot, entry.name);
		const files = await readdir(categoryPath, { withFileTypes: true });
		const images = files
			/** @param {import('node:fs').Dirent} file */
			.filter((file) => file.isFile() && IMAGE_EXTENSIONS.has(path.extname(file.name).toLowerCase()))
			/** @param {import('node:fs').Dirent} file */
			.map((file) => file.name);

		if (images.length === 0) continue;

		const pickedImages = pickRandomSubset(images, 8);
		for (const imageName of pickedImages) {
			photos.push({
				key: `${entry.name}-${imageName}`,
				category: entry.name,
				imageUrl: `/media/${encodeURIComponent(entry.name)}/${encodeURIComponent(imageName)}`,
				size: randomItem(SIZE_VARIANTS)
			});
		}
	}

	photos.sort((a, b) => a.category.localeCompare(b.category, 'it'));
	return { photos };
}
