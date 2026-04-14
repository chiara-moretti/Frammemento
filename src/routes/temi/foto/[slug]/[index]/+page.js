import { error } from '@sveltejs/kit';
import { getThemePageData } from '$lib/theme-page-data';
import { getPhotoDescription } from '$lib/photo-descriptions';

/** @param {{ params: { slug: string; index: string } }} event */
export function load({ params }) {
	const { slug, index: indexRaw } = params;
	const index = Number.parseInt(indexRaw, 10);

	if (!Number.isInteger(index) || index < 0) {
		error(404, 'Foto non trovata');
	}

	const theme = getThemePageData(slug);
	if (!theme.photos.length || index >= theme.photos.length) {
		error(404, 'Foto non trovata');
	}

	const photo = theme.photos[index];
	const description = getPhotoDescription(slug, index);

	return {
		slug,
		themeTitle: theme.title,
		photo,
		index,
		total: theme.photos.length,
		description
	};
}
