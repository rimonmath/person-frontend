<script lang="ts">
	export let label: string = '';
	export let placeholder: string = 'Select an option';
	export let value: string = '';
	export let name: string;
	export let options: { label: string; value: string }[] = [];

	export let onInput: (val: string) => void = () => {};

	export let formData: Record<string, any> = {};
	export let errors: Record<string, string> = {};

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		value = target.value;
		formData[name] = value;
		onInput(value);
	}
</script>

<div class="mb-4 flex flex-col">
	{#if label}
		<label for={name} class="mb-1 font-medium text-gray-700">{label}</label>
	{/if}

	<select
		id={name}
		{name}
		bind:value={formData[name]}
		on:change={handleChange}
		class={`rounded-md border px-3 py-1 transition-colors focus:outline-none
      ${
				errors[name]
					? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500'
					: 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500'
			}`}
	>
		<option value="" disabled selected>{placeholder}</option>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>

	{#if errors[name]}
		<p class="mt-1 text-sm text-red-600">{errors[name]}</p>
	{/if}
</div>
