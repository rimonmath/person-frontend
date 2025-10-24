import * as api from '$lib/script/api';
import { API_PATHS } from '$lib/config';
import { PRIVATE_API_ENDPOINT } from '$env/static/private';

async function getPersons(jwt) {
	try {
		const { response, json } = await api.get(PRIVATE_API_ENDPOINT, API_PATHS.PERSONS, {
			jwt
		});

		if (!response.ok || !Array.isArray(json)) {
			return []; // Always return an array
		}

		console.log(response, json);

		return json;
	} catch (error) {
		console.error(`Error fetching persons: ${error.message}`, error);
		return []; // Return an empty array on error
	}
}

export const load = async ({ cookies }) => {
	const jwt = cookies.get('jwt');
	let persons = await getPersons(jwt); // Use 'let' to allow reassignment

	return {
		persons
	};
};
