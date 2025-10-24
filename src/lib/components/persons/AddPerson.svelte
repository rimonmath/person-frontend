<script lang="ts">
	import AButton from '$lib/components/AButton.svelte';
	import AForm from '$lib/components/AForm.svelte';
	import SelectInput from '$lib/components/SelectInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { object as zObject, string as zString, email as zEmail, enum as zEnum } from 'zod';

	let { onAddPerson, loading, newPerson = $bindable() } = $props();

	//=========== Create person =============
	const addPersonSchema = zObject({
		first_name: zString().min(1, 'First name is required'),
		last_name: zString().min(1, 'Last name is required'),
		email: zEmail('Invalid email address'),
		gender: zEnum(['Male', 'Female', 'Other']),
		address: zString().min(1, 'Address is required')
	});
</script>

<AForm schema={addPersonSchema} bind:formData={newPerson} onSuccessSubmit={onAddPerson}>
	{#snippet children({ errors })}
		<div class="space-y-2 p-4">
			<TextInput
				name="first_name"
				label="First name"
				placeholder="Enter first name"
				bind:formData={newPerson}
				{errors}
			></TextInput>

			<TextInput
				name="last_name"
				label="Last name"
				placeholder="Enter last name"
				bind:formData={newPerson}
				{errors}
			></TextInput>

			<TextInput
				name="email"
				label="Email"
				placeholder="Enter Email"
				bind:formData={newPerson}
				{errors}
			></TextInput>

			<SelectInput
				name="gender"
				label="Gender"
				placeholder="--Select Gender--"
				bind:formData={newPerson}
				options={[
					{ label: 'Male', value: 'Male' },
					{ label: 'Female', value: 'Female' },
					{ label: 'Other', value: 'Other' }
				]}
				{errors}
			></SelectInput>

			<TextInput
				name="address"
				label="Address"
				placeholder="Enter Address"
				bind:formData={newPerson}
				{errors}
			></TextInput>

			<AButton type="submit" block {loading}>Add</AButton>
		</div>
	{/snippet}
</AForm>
