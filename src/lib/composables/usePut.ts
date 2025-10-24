import { writable } from 'svelte/store';
import type { ErrorResponse, SuccessResponse } from '$lib/types';
import { ofetch, type FetchError } from 'ofetch';
import { public_api_endpoint } from '$lib/app/env';

export function usePut<
	TResponse = SuccessResponse,
	TPayload extends Record<string, unknown> = Record<string, unknown>
>(withCredentials = false) {
	const loading = writable(false);
	const dialog = writable(false);
	const response = writable<TResponse | undefined>(undefined);
	const error = writable<ErrorResponse | null>(null);
	const itemToUpdate = writable<Record<string, unknown>>({});

	async function start(payload: TPayload, customUrl: string): Promise<void> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};

		if (withCredentials) {
			console.log(withCredentials);
			// const token = localStorage.getItem('accessToken');
			// if (token) headers['Authorization'] = `Bearer ${token}`;
		}

		try {
			document.body.classList.add('lazy-loading');
			loading.set(true);
			error.set(null);
			response.set(undefined);

			const result = await ofetch<TResponse>(public_api_endpoint + customUrl, {
				method: 'PUT',
				body: payload,
				headers
			});

			response.set(result);
		} catch (err) {
			if ((err as FetchError).response) {
				const fetchErr = err as FetchError<ErrorResponse>;
				error.set(fetchErr.data || { message: fetchErr.message });
			} else {
				error.set({ message: (err as Error).message });
			}
		} finally {
			loading.set(false);
			document.body.classList.remove('lazy-loading');
		}
	}

	return { start, loading, error, response, dialog, itemToUpdate };
}
