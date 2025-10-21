<script lang="ts" context="module">
	import * as api from '$lib/script/api';
	import { base_endpoint_external } from '$lib/app/env.js';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { API_PATHS } from '$lib/config';
	import { onMount } from 'svelte';

	const { data } = $props();

	let selectedReligionId = $state('');
	let castes: any[] = $state([]);
	let selectedCasteId = $state('');

	let religionsMap = $derived(Object.fromEntries(data.religions.map((r) => [r._id, r])));

	let castesMap = $derived(Object.fromEntries(castes.map((c) => [c._id, c])));

	function showToast(message, icon = '👏') {
		toast(message, { icon, style: toastStyle });
	}

	async function getCastes() {
		try {
			const { response, json } = await api.get(
				base_endpoint_external,
				`${API_PATHS.CASTES_EXTERNAL}/${selectedReligionId}`
			);

			if (!response.ok) {
				throw new Error(json.message || 'Something went wrong!');
			}

			castes = json || [];
			if (castes.length > 0) {
				selectedCasteId = castes[0]._id;
			} else {
				selectedCasteId = null;
			}
		} catch (error) {
			showToast(error.message || 'Something went wrong', '❌');
		} finally {
		}
	}

	$effect(() => {
		if (selectedReligionId) {
			getCastes();
		}
	});

	onMount(() => {
		selectedReligionId = data.religions.length > 0 ? data.religions[0]._id : null;
	});
</script>

<Toaster />
<div class="w-full">
	<div class="flex dark:text-white">
		<div class="w-full rounded bg-[rgb(20,100,111)] p-1">
			<div class="flex space-x-4 rounded border border-blue-500 p-3">
				<div class="flex-1">
					<label for="religion-select" class="svelte-1kug393 block font-medium text-gray-900"
						>Select a Religion:</label
					>
					<select
						id="religion-select"
						class="svelte-1kug393 mt-2 mb-2 w-full max-w-xs rounded border px-3 py-1 dark:text-gray-900"
						bind:value={selectedReligionId}
					>
						{#each data.religions as religion}
							<option value={religion._id}>{religion.name}</option>
						{/each}
					</select>
				</div>
				<!---->
				<div class="flex-1">
					<label for="caste-select" class="svelte-1kug393 block font-medium text-gray-900">
						Select a Caste:
					</label>
					<select
						id="caste-select"
						class="svelte-1kug393 mt-2 mb-2 w-full max-w-xs rounded border px-3 py-1 dark:text-gray-900"
						bind:value={selectedCasteId}
					>
						{#each castes as caste}
							<option value={caste._id}>
								{caste.name}
							</option>
						{/each}
					</select>
				</div>
				<!---->
			</div>
		</div>
	</div>
	<div class="bg-[rgb(219 196 231)] rounded p-2">
		<!--[!-->
		<h2>Selected Religion:</h2>
		<p>Religion: {religionsMap[selectedReligionId]?.name}</p>
		<p>ReligionId: {selectedReligionId}</p>
		<p>Caste: {castesMap[selectedCasteId]?.name}</p>
		<p>CasteId: {selectedCasteId}</p>
		<!--]-->
		<a href="/" class="btn btn-primary mt-4 w-full max-w-xs">Home</a>
	</div>
</div>
