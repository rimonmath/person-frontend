import * as api from '$lib/script/api';
import { base_endpoint_external } from '$lib/app/env.js';
import { API_PATHS } from '$lib/config';

async function getReligions() {
	try {
		// const { response, json } = await api.get(
		//   base_endpoint,
		//   API_PATHS.RELIGIONS,
		//   { aud: "aud" }
		// );

		const { response, json } = await api.get(base_endpoint_external, API_PATHS.RELIGIONS_EXTERNAL, {
			aud: 'aud'
		});

		if (!response.ok || !Array.isArray(json)) {
			return []; // Always return an array
		}

		return json;
	} catch (error: any) {
		console.error(`Error fetching persons: ${error.message}`, error);
		return []; // Return an empty array on error
	}
}

export const load = async () => {
	const religions = await getReligions(); // Use 'let' to allow reassignment
	console.log('Religions fetched:', religions);
	return {
		religions
	};
};
