<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { goto } from '$app/navigation';

	onMount(() => {
		const pathname = window.location.pathname;
		if (pathname === '/') {
			goto('/auth/signin');
		}
	});

	let { children } = $props();
</script>

<div class="app">
	{@render children()}
</div>

<style>
</style>
