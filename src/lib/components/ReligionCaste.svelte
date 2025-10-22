<script lang="ts">
	import { onMount } from 'svelte';

	const { religions = [], castes = [], onChangeReligion } = $props();

	let selectedReligionId = $state('');
	let selectedCasteId = $state('');

	let religionsMap = $derived(Object.fromEntries(religions.map((r) => [r._id, r])));
	let castesMap = $derived(Object.fromEntries(castes.map((c) => [c._id, c])));

	$effect(() => {
		if (castes.length > 0) {
			selectedCasteId = castes[0]._id;
		}
	});

	$effect(() => {
		if (selectedReligionId) {
			onChangeReligion?.(selectedReligionId);
		}
	});

	onMount(() => {
		selectedReligionId = religions.length > 0 ? religions[0]._id : null;
	});
</script>

<div class="w-full p-6">
	<div class="flex dark:text-white">
		<div class="w-full rounded bg-[rgb(20,100,111)] p-2">
			<div class="flex space-x-4 rounded border border-blue-500 p-3">
				<!-- Religion select -->
				<div class="flex-1">
					<label for="religion-select" class="block font-medium text-gray-900">
						Select a Religion:
					</label>
					<select
						id="religion-select"
						class="mt-2 mb-2 w-full max-w-xs rounded border bg-white px-3 py-1 dark:text-gray-900"
						bind:value={selectedReligionId}
					>
						{#each religions as religion}
							<option value={religion._id}>{religion.name}</option>
						{/each}
					</select>
				</div>

				<!-- Caste select -->
				<div class="flex-1">
					<label for="caste-select" class="block font-medium text-gray-900">
						Select a Caste:
					</label>
					<select
						id="caste-select"
						class="mt-2 mb-2 w-full max-w-xs rounded border bg-white px-3 py-1 dark:text-gray-900"
						bind:value={selectedCasteId}
					>
						{#each castes as caste}
							<option value={caste._id}>{caste.name}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Display selected data -->
	<div class="bg-[rgb(219 196 231)] mt-4 rounded p-2">
		<h2>Selected Religion:</h2>
		<p>Religion: {religionsMap[selectedReligionId]?.name}</p>
		<p>ReligionId: {selectedReligionId}</p>
		<p>Caste: {castesMap[selectedCasteId]?.name}</p>
		<p>CasteId: {selectedCasteId}</p>
	</div>
</div>
