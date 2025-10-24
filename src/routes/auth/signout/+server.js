// src/routes/signout/+server.js
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	// Delete the jwt cookie
	cookies.delete('jwt', { path: '/' });

	// Redirect to the signin page
	throw redirect(302, '/auth/signin');
};
