import * as api from '$lib/script/api';
import { API_PATHS } from '$lib/config';
import { PRIVATE_API_ENDPOINT_EXTERNAL } from '$lib/app/env.private';

async function getReligions<T>(): Promise<T[]> {
	try {
		const { response, json } = await api.get(
			PRIVATE_API_ENDPOINT_EXTERNAL,
			API_PATHS.RELIGIONS_EXTERNAL,
			{
				aud: 'aud'
			}
		);

		if (!response.ok || !Array.isArray(json)) {
			return [];
		}

		return json as T[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
