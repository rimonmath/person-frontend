import { PUBLIC_DEBUG_MODE } from '$env/static/public';

const DEBUG_MODE = PUBLIC_DEBUG_MODE === 'true'; // Ensure boolean conversion

interface Session {
	aud?: string;
	session_id?: string;
	jwt?: string;
}

interface SendOptions {
	method: string;
	path: string;
	data?: any;
	session?: Session;
	base: string;
	formData?: any;
	withCredentials?: boolean;
}

async function send({
	method,
	path,
	data,
	session,
	base,
	formData,
	withCredentials
}: SendOptions): Promise<{ response: Response; json: any }> {
	const opts: RequestInit = {
		method,
		headers: new Headers()
	};

	if (data) {
		prepareRequestBody(opts, data, formData);
	}

	if (session) {
		attachSessionHeaders(opts.headers as Headers, session);
	}

	if (withCredentials) {
		(opts.headers as Headers)?.set(
			'Authorization',
			'Bearer ' + localStorage.getItem('accessToken')
		);
	}

	const fullPath = encodeURI(`${base}/${path}`);

	if (DEBUG_MODE) {
		console.debug(`[DEBUG] ${method} ${fullPath}`, opts);
	}

	try {
		console.log('======================full Path', fullPath);

		const response = await fetch(fullPath, opts);
		const json = await response.json();

		if (DEBUG_MODE) {
			console.debug('[DEBUG] Response:', json);
		}

		return { response, json };
	} catch (error) {
		console.error(`[ERROR] Request failed: ${method} ${fullPath}`, error);
		throw new Error('Network request failed');
	}
}

/**
 * Helper function to attach request body based on data type
 */
function prepareRequestBody(opts: RequestInit, data: any, formData: any = null) {
	if (data.creds) {
		(opts as any).credentials = 'include';
		delete data.creds;
	}

	if (!formData) {
		opts.headers = new Headers({ 'Content-Type': 'application/json' });
		opts.body = JSON.stringify(data);
	} else {
		opts.body = formData;
	}
}

/**
 * Helper function to attach session headers
 */
function attachSessionHeaders(headers: Headers, session: Session) {
	if (session.aud) headers.set('JWT_AUD', session.aud);
	if (session.session_id) headers.set('session_id', session.session_id);
	if (session.jwt)
		headers.set(
			'Authorization',
			session.jwt.startsWith('Bearer') ? session.jwt : `Bearer ${session.jwt}`
		);
}

/**
 * Shortcut functions for API requests
 */
export const get = (base: string, path: string, session?: Session) =>
	send({ method: 'GET', path, session, base });

export const del = (base: string, path: string, data: unknown, session?: Session) =>
	send({ method: 'DELETE', path, data, session, base });

export const post = (base: string, path: string, data: unknown, session?: Session) =>
	send({ method: 'POST', path, data, session, base });

export const put = (base: string, path: string, data: unknown, session?: Session) =>
	send({ method: 'PUT', path, data, session, base });

export const putFormData = (base: string, path: string, formData: any, withCredentials?: boolean) =>
	send({
		method: 'PUT',
		path,
		data: {},
		session: undefined,
		base,
		formData,
		withCredentials
	});
