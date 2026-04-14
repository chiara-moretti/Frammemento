import { readFile } from 'node:fs/promises';
import path from 'node:path';

/** @type {Record<string, string>} */
const MIME_BY_EXT = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif'
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const safeCategory = path.basename(params.category);
	const safeImage = path.basename(params.image);
	const filePath = path.join(process.cwd(), 'assets', safeCategory, safeImage);

	try {
		const buffer = await readFile(filePath);
		const ext = path.extname(safeImage).toLowerCase();
		const contentType = MIME_BY_EXT[ext] ?? 'application/octet-stream';

		return new Response(buffer, {
			headers: {
				'content-type': contentType,
				'cache-control': 'no-store'
			}
		});
	} catch {
		return new Response('Not found', { status: 404 });
	}
}
