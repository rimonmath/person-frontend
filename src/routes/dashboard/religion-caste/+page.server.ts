import * as api from '$lib/script/api';
import { base_endpoint_external } from '$lib/app/env.js';
import { API_PATHS } from '$lib/config';

async function getReligions<T = any>(): Promise<T[]> {
	try {
		const { response, json } = await api.get(base_endpoint_external, API_PATHS.RELIGIONS_EXTERNAL, {
			aud: 'aud'
		});

		if (!response.ok || !Array.isArray(json)) {
			return [];
		}

		return json as T[];
	} catch (error: any) {
		console.error(`Error fetching religions: ${error.message}`, error);
		return [];
	}
}

export const load = async () => {
	// define Religion type if you have one, for example:
	// interface Religion { id: number; name: string; }

	const religions = await getReligions<{ _id: string; name: string }>();

	console.log('Religions fetched:', religions);

	return {
		religions
	};
};
