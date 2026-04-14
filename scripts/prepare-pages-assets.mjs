import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceAssets = path.join(root, 'assets');
const staticAssets = path.join(root, 'static', 'assets');
const manifestPath = path.join(root, 'src', 'lib', 'media-manifest.json');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

async function listManifest() {
	const manifest = {};
	const categories = await readdir(sourceAssets, { withFileTypes: true });

	for (const category of categories) {
		if (!category.isDirectory() || category.name.startsWith('.')) continue;
		const categoryPath = path.join(sourceAssets, category.name);
		const entries = await readdir(categoryPath, { withFileTypes: true });
		const files = entries
			.filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
			.map((entry) => entry.name)
			.sort((a, b) => a.localeCompare(b, 'it'));

		if (files.length > 0) {
			manifest[category.name] = files;
		}
	}

	return manifest;
}

async function main() {
	await rm(staticAssets, { recursive: true, force: true });
	await mkdir(path.dirname(staticAssets), { recursive: true });
	await cp(sourceAssets, staticAssets, { recursive: true });

	const manifest = await listManifest();
	await mkdir(path.dirname(manifestPath), { recursive: true });
	await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
