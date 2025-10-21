<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let color: 'primary' | 'secondary' | 'danger' = 'primary';
	export let loading: boolean = false;
	export let disabled: boolean = false;
	export let block: boolean = false; // new prop

	export let onClick: (event: MouseEvent) => void = () => {};
</script>

<button
	on:click={onClick}
	{type}
	disabled={disabled || loading}
	class={`flex cursor-pointer items-center justify-center rounded-md font-medium transition-all focus:outline-none
    ${size === 'sm' ? 'px-2 py-1 text-xs' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base'}
    ${
			color === 'primary'
				? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
				: color === 'secondary'
					? 'bg-gray-500 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500'
					: 'bg-red-500 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500'
		}
    ${disabled || loading ? 'cursor-not-allowed opacity-50' : ''}
    ${block ? 'w-full' : ''}
  `}
>
	{#if loading}
		<svg
			class="mr-2 h-5 w-5 animate-spin text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
		</svg>
	{/if}

	<slot />
</button>
