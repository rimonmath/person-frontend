import * as api from '$lib/script/api';

import { PRIVATE_API_ENDPOINT } from '$lib/app/env.private.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */

export const POST = async ({ cookies, request, locals }) => {
	// const jwt = cookies.get('jwt');
	const data = await request.json();

	// console.log('post data object', data);

	const { response, json } = await api.post(PRIVATE_API_ENDPOINT, `auth/signin`, data /*{ jwt }*/);

	// console.log('json, response.status', json, response.status);

	if (response.status !== 200 && response.status !== 500) {
		throw (
			response.error || new Error(`Request failed with status ${response.status}, ${json.error}`)
		);
	}

	// ✅ Set cookie from server
	if (json.accessToken) {
		cookies.set('jwt', json.accessToken, {
			path: '/', // cookie available across the entire site
			httpOnly: true, // can't be accessed by client-side JS
			sameSite: 'strict', // prevents CSRF
			secure: true, // set true if using HTTPS (recommended in production)
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});
	}

	return new Response(JSON.stringify(json), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
