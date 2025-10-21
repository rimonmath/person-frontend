<script lang="ts">
	export let label: string = '';
	export let placeholder: string = '';
	export let value: string = '';
	export let type: string = 'text';
	export let onInput: (val: string) => void = () => {};
	export let name: string;

	export let formData: Record<string, any> = {};
	export let errors: Record<string, string> = {};

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		onInput(value);
	}
</script>

<div class="mb-4 flex flex-col">
	{#if label}
		<label for={name} class="mb-1 font-medium text-gray-700">{label}</label>
	{/if}

	<input
		id={name}
		{type}
		{placeholder}
		{name}
		bind:value={formData[name]}
		on:input={handleInput}
		class={`rounded-md border px-3 py-1 transition-colors focus:outline-none
			${
				errors[name]
					? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500'
					: 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500'
			}`}
		autocomplete={name as any}
	/>

	{#if errors[name]}
		<p class="mt-1 text-sm text-red-600">{errors[name]}</p>
	{/if}
</div>
