// src/hooks.server.js
// import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	const jwt = event.cookies.get('jwt');
	const path = event.url.pathname;

	// Protect admin APIs
	if (path.startsWith('/api/admin')) {
		if (!jwt) {
			// Option 1: Redirect (if it's a page request)
			// throw redirect(302, '/signin');

			// Option 2: Return 401 for API calls
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// (Optional) verify the token here if needed
		// const decoded = jwtVerify(jwt, process.env.JWT_SECRET);
	}

	// Continue request
	return resolve(event);
};
