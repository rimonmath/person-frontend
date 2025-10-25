<script lang="ts">
	import * as api from '$lib/script/api';
	import { public_api_endpoint } from '$lib/app/env.public.js';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { API_PATHS } from '$lib/config';
	import ReligionCaste from '$lib/components/castes/ReligionCaste.svelte';
	import { useToast } from '$lib/composables/useToast.js';

	const { showErrorToast } = useToast();

	const { data } = $props();

	let castes: { _id: string; name: string; description: string }[] = $state([]);

	async function getCastes(selectedReligionId: string) {
		try {
			const { response, json } = await api.get(
				public_api_endpoint,
				`${API_PATHS.CASTE}/${selectedReligionId}`
			);

			if (!response.ok) {
				throw new Error(json.message || 'Something went wrong!');
			}

			castes = json || [];
		} catch (error: any) {
			showErrorToast(error.message || 'Something went wrong');
		} finally {
		}
	}
</script>

<Toaster />
<ReligionCaste religions={data.religions} {castes} onChangeReligion={getCastes} />
