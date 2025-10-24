import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const jwt = cookies.get('jwt');

	// If no cookie, redirect to signin page
	if (jwt) {
		throw redirect(302, '/dashboard/persons');
	}

	return {};
};
