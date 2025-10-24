import * as api from '$lib/script/api';

import { PRIVATE_API_ENDPOINT_EXTERNAL } from '$lib/app/env.server.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */

export const GET = async ({ params }) => {
	// const jwt = cookies.get('jwt');

	const { response, json } = await api.get(
		PRIVATE_API_ENDPOINT_EXTERNAL,
		`caste/${params.religionId}`
		// { jwt }
	);

	// console.log('json, response.status', json, response.status);

	if (response.status !== 200 && response.status !== 500) {
		throw (
			response.error || new Error(`Request failed with status ${response.status}, ${json.error}`)
		);
	}

	return new Response(JSON.stringify(json), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
