import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const jwt = cookies.get('jwt');

	// If no cookie, redirect to signin page
	if (!jwt) {
		throw redirect(302, '/auth/signin');
	}

	// Optionally, you can verify or decode the token here
	// Example:
	// const user = verifyJwt(jwt);
	// return { user };

	return { jwt }; // returned data is available to all child pages
};
