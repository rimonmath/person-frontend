<script lang="ts">
	import { useGet } from '$lib/composables/useGet';
	import type { User } from '$lib/types';
	import { onMount } from 'svelte';

	const { start, response } = useGet<User[]>('/admin/users/', true);

	onMount(() => {
		start();
	});
</script>

<div class="p-2 md:p-10">
	<h1 class="text-lg">All Users</h1>
	<hr class="my-4" />
	<div>
		{JSON.stringify($response)}
	</div>
</div>
