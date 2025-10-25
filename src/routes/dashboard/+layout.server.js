import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const jwt = cookies.get('jwt');

	if (!jwt) {
		throw redirect(302, '/auth/signin');
	}

	return { jwt };
};
