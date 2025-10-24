import * as api from '$lib/script/api';

import { PRIVATE_API_ENDPOINT } from '$lib/app/env.server.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */

export const POST = async ({ cookies, request }) => {
	const jwt = cookies.get('jwt');
	const data = await request.json();

	// console.log('post data object', data);

	const { response, json } = await api.post(PRIVATE_API_ENDPOINT, `admin/persons`, data, { jwt });

	console.log('============>', json, response);

	if (response.status !== 200 && response.status !== 500) {
		if (json.message) {
			return new Response(JSON.stringify(json), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

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
