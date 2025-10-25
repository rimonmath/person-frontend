import * as api from '$lib/script/api';

import { PRIVATE_API_ENDPOINT } from '$lib/app/env.private.js';

/** @type {import('./$types').RequestHandler} */

export const PUT = async ({ cookies, request, params }) => {
	const jwt = cookies.get('jwt');
	const data = await request.formData();

	// console.log(data);

	// console.log('post data object', data);

	const { response, json } = await api.putFormData(
		PRIVATE_API_ENDPOINT,
		`admin/persons/${params.personId}/change-image`,
		data,
		{ jwt }
	);

	console.log('json, response.status', json, response.status);

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
