<script lang="ts">
	import AButton from '$lib/components/AButton.svelte';
	import ADialog from '$lib/components/ADialog.svelte';
	import AForm from '$lib/components/AForm.svelte';
	import ASpinner from '$lib/components/ASpinner.svelte';
	import EditIcon from '$lib/components/icons/EditIcon.svelte';
	import TrashIcon from '$lib/components/icons/TrashIcon.svelte';
	import SelectInput from '$lib/components/SelectInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { usePost } from '$lib/composables/usePost';
	import { useGet } from '$lib/composables/useGet';
	import { useToast } from '$lib/composables/useToast';
	import { type Person, type SuccessResponse } from '$lib/types';
	import { onMount } from 'svelte';
	import { object as zObject, string as zString, email as zEmail, enum as zEnum } from 'zod';

	import { useDelete } from '$lib/composables/useDelete';
	import { usePut } from '$lib/composables/usePut';

	const { showSuccessToast, showErrorToast } = useToast();

	//=========== Read=============
	const {
		start: getPersons,
		error: getPersonError,
		loading: getting,
		response: persons
	} = useGet<Person[]>('/admin/persons/', true);

	//=========== Create person =============
	const addPersonSchema = zObject({
		first_name: zString().min(1, 'First name is required'),
		last_name: zString().min(1, 'Last name is required'),
		email: zEmail('Invalid email address'),
		gender: zEnum(['Male', 'Female', 'Other']),
		address: zString().min(1, 'Address is required')
	});

	const {
		start: addNewPerson,
		error: addPersonError,
		loading: adding,
		response: addResponse,
		dialog: addDialog
	} = usePost<SuccessResponse>('/admin/persons/', true);

	let newPerson = $state({
		first_name: '',
		last_name: '',
		email: '',
		gender: '',
		address: ''
	});

	const addPerson = async () => {
		await addNewPerson(newPerson);

		if ($addPersonError) {
			showErrorToast($addPersonError?.message!);
			return;
		}

		showSuccessToast($addResponse?.message || '');
		$addDialog = false;
		getPersons();
	};

	//=========== Update person =============
	const {
		start: updatePerson,
		error: updateError,
		loading: updating,
		response: updateResponse,
		dialog: updateDialog,
		itemToUpdate
	} = usePut<SuccessResponse>(true);

	const updateSelectedPerson = async () => {
		await updatePerson($itemToUpdate, `/admin/persons/${$itemToUpdate?._id}`);

		if ($updateError) {
			showErrorToast($updateError?.message!);
			return;
		}

		showSuccessToast($updateResponse?.message || '');
		$updateDialog = false;
		getPersons();
	};

	//=========== Delete person =============

	const {
		start: deletePerson,
		error: deleteError,
		loading: deleting,
		response: deleteResponse,
		itemToDelete,
		dialog: deleteDialog
	} = useDelete<SuccessResponse>(true);

	const deleteSelectedPerson = async () => {
		await deletePerson(`/admin/persons/${$itemToDelete?._id}`);
		if ($deleteError) {
			showErrorToast($deleteError?.message!);
			return;
		}
		showSuccessToast($deleteResponse?.message || '');
		$deleteDialog = false;
		getPersons();
	};

	onMount(() => {
		getPersons();
	});
</script>

<div class="p-2 md:p-10">
	<div class="flex items-center justify-between">
		<h1 class="text-lg">All Persons</h1>
		<AButton onClick={() => ($addDialog = true)}>Add New</AButton>
	</div>
	{#if $getting}
		<ASpinner></ASpinner>
	{:else}
		<div class="table-container">
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Gender</th>
						<th>Address</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each $persons as person}
						<tr>
							<td>
								{person.first_name}
								{person.last_name}
							</td>
							<td>
								{person.email}
							</td>
							<td>
								{person.gender}
							</td>
							<td>
								{person.address}
							</td>
							<td>
								<div class="flex items-center gap-2">
									<AButton
										size="sm"
										color="secondary"
										onClick={() => {
											$itemToUpdate = person;
											$updateDialog = true;
										}}
									>
										<EditIcon></EditIcon>
									</AButton>
									<AButton
										size="sm"
										color="danger"
										onClick={() => {
											$itemToDelete = person;
											$deleteDialog = true;
										}}
									>
										<TrashIcon></TrashIcon>
									</AButton>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<ADialog title="Add New Person" bind:value={$addDialog} width="400px">
		<div>
			<AForm schema={addPersonSchema} bind:formData={newPerson} onSuccessSubmit={addPerson}>
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

						<AButton type="submit" block loading={$adding}>Add</AButton>
					</div>
				{/snippet}
			</AForm>
		</div>
	</ADialog>

	<ADialog title="Are you sure?" bind:value={$deleteDialog} width="500px">
		<div>
			Do you really want to delete <strong> {$itemToDelete.first_name} </strong>. This can not be
			undone?
		</div>

		<div class="mt-4 flex justify-end space-x-2">
			<AButton color="primary" onClick={() => ($deleteDialog = false)}>No</AButton>

			<AButton color="danger" onClick={deleteSelectedPerson} loading={$deleting}>Yes</AButton>
		</div>
	</ADialog>

	<ADialog title="Update Person" bind:value={$updateDialog} width="400px">
		<div>
			<AForm
				schema={addPersonSchema}
				bind:formData={$itemToUpdate}
				onSuccessSubmit={updateSelectedPerson}
			>
				{#snippet children({ errors })}
					<div class="space-y-2 p-4">
						<TextInput
							name="first_name"
							label="First name"
							placeholder="Enter first name"
							bind:formData={$itemToUpdate}
							{errors}
						></TextInput>

						<TextInput
							name="last_name"
							label="Last name"
							placeholder="Enter last name"
							bind:formData={$itemToUpdate}
							{errors}
						></TextInput>

						<TextInput
							name="email"
							label="Email"
							placeholder="Enter Email"
							bind:formData={$itemToUpdate}
							{errors}
						></TextInput>

						<SelectInput
							name="gender"
							label="Gender"
							placeholder="--Select Gender--"
							bind:formData={$itemToUpdate}
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
							bind:formData={$itemToUpdate}
							{errors}
						></TextInput>

						<AButton type="submit" block loading={$updating}>Save Changes</AButton>
					</div>
				{/snippet}
			</AForm>
		</div>
	</ADialog>
</div>
