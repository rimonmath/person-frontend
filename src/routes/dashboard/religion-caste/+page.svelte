<script lang="ts">
	import * as api from '$lib/script/api';
	import { public_api_endpoint } from '$lib/app/env.js';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { API_PATHS } from '$lib/config';
	import ReligionCaste from '$lib/components/castes/ReligionCaste.svelte';

	const { data } = $props();

	let castes: { _id: string; name: string; description: string }[] = $state([]);

	const toastStyle = {
		borderRadius: '200px',
		background: '#333',
		color: '#fff'
	};

	function showToast(message: string, icon = '👏') {
		toast(message, { icon, style: toastStyle });
	}

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
			showToast(error.message || 'Something went wrong', '❌');
		} finally {
		}
	}
</script>

<Toaster />
<ReligionCaste religions={data.religions} {castes} onChangeReligion={getCastes} />
