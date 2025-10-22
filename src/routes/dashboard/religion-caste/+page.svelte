<script lang="ts">
	import * as api from '$lib/script/api';
	import { base_endpoint_external } from '$lib/app/env.js';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { API_PATHS } from '$lib/config';
	import { onMount } from 'svelte';
	import ReligionCaste from '$lib/components/ReligionCaste.svelte';

	const { data } = $props();

	let castes: any[] = $state([]);

	let religionsMap = $derived(Object.fromEntries(data.religions.map((r) => [r._id, r])));

	let castesMap = $derived(Object.fromEntries(castes.map((c) => [c._id, c])));

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
				base_endpoint_external,
				`${API_PATHS.CASTES_EXTERNAL}/${selectedReligionId}`
			);

			if (!response.ok) {
				throw new Error(json.message || 'Something went wrong!');
			}

			castes = json || [];
			// if (castes.length > 0) {
			// 	selectedCasteId = castes[0]._id;
			// } else {
			// 	selectedCasteId = null;
			// }
		} catch (error: any) {
			showToast(error.message || 'Something went wrong', '❌');
		} finally {
		}
	}
</script>

<ReligionCaste religions={data.religions} {castes} onChangeReligion={getCastes} />
