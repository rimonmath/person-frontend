import { writable } from 'svelte/store';
import type { ErrorResponse, SuccessResponse } from '$lib/types';
import { ofetch, type FetchError } from 'ofetch';

import { api_endpoint } from '$lib/app/env';

export function usePost<
	TResponse = SuccessResponse,
	TPayload extends Record<string, unknown> = Record<string, unknown>
>(url: string, withCredentials = false) {
	const loading = writable(false);
	const dialog = writable(false);
	const response = writable<TResponse | undefined>(undefined);
	const error = writable<ErrorResponse | null>(null);

	async function start(payload: TPayload, customUrl: string | null = null): Promise<void> {
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

			const result = await ofetch<TResponse>(api_endpoint + (customUrl ?? url), {
				method: 'POST',
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

	return { start, loading, error, response, dialog };
}
