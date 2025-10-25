import * as api from '$lib/script/api';
import { API_PATHS } from '$lib/config';
import { PRIVATE_API_ENDPOINT } from '$env/static/private';
import type { Person } from '$lib/types.js';

async function getPersons(jwt: string) {
	try {
		const { response, json } = await api.get(PRIVATE_API_ENDPOINT, API_PATHS.PERSONS, {
			jwt
		});

		if (!response.ok || !Array.isArray(json)) {
			return [];
		}

		console.log(response, json);

		return json;
	} catch (error: any) {
		console.error(`Error fetching persons: ${error.message}`, error);
		return [];
	}
}

export const load = async ({ cookies }) => {
	const jwt = cookies.get('jwt');
	const persons = (await getPersons(jwt!)) as Person[];

	return {
		persons
	};
};
