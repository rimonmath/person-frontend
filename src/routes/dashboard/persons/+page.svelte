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
	import { onMount, tick } from 'svelte';
	import { object as zObject, string as zString, email as zEmail, enum as zEnum } from 'zod';

	import { useDelete } from '$lib/composables/useDelete';
	import { usePut } from '$lib/composables/usePut';
	import { putFormData } from '$lib/script/api';
	import UploadedImage from '$lib/components/UploadedImage.svelte';
	import AddPerson from '$lib/components/persons/AddPerson.svelte';
	import UpdatePerson from '$lib/components/persons/UpdatePerson.svelte';
	import { persons } from '../../../stores/persons.js';
	import { public_api_endpoint } from '$lib/app/env.js';

	const { showSuccessToast, showErrorToast } = useToast();

	const { data } = $props();
	persons.set(data.persons);

	//=========== Create person =============
	let newPerson = $state({
		first_name: '',
		last_name: '',
		email: '',
		gender: '',
		address: ''
	});

	function reserNewPerson() {
		newPerson.first_name = '';
		newPerson.last_name = '';
		newPerson.email = '';
		newPerson.gender = '';
		newPerson.address = '';
	}

	const {
		start: addNewPerson,
		error: addPersonError,
		loading: adding,
		response: addResponse,
		dialog: addDialog
	} = usePost<SuccessResponse>('/admin/persons/', true);

	const addPerson = async (newPerson: Person) => {
		await addNewPerson(newPerson);

		if ($addPersonError) {
			showErrorToast($addPersonError?.message!);
			return;
		}

		reserNewPerson();
		showSuccessToast($addResponse?.message || 'Success');
		$addDialog = false;
		// getPersons();
		persons?.update((oldPersons) => [...oldPersons!, $addResponse?.result]);
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
		updatePersonStore($itemToUpdate as Person);
	};

	// Function to update a person in the store
	function updatePersonStore(updatedPerson: Person) {
		persons.update((currentPersons) =>
			currentPersons.map((person) => (person._id === updatedPerson.id ? updatedPerson : person))
		);
	}

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
		persons.update(($persons) => $persons.filter((p) => p._id !== $itemToDelete._id));
	};

	async function changePhoto(e: Event, person: Person) {
		console.log(person);

		const file = e.target.files[0];

		if (file) {
			// console.log(file.size)
			if (file.size > 8000000) {
				showErrorToast('File size exceeds 8MB limit');
				return;
			}

			const formData = new FormData();

			formData.append('image', file, file.name);

			const { json } = await putFormData(
				public_api_endpoint,
				'admin/persons/' + $itemToUpdate._id + '/change-image',
				formData
			);

			updatePersonStore({ ...json.result, id: json.result._id });
			// getPersons();
			showSuccessToast(json.message);
		}
	}
</script>

<div class="p-2 md:p-10">
	<div class="flex items-center justify-between">
		<h1 class="text-lg">All Persons</h1>
		<AButton onClick={() => ($addDialog = true)}>Add New</AButton>
	</div>

	<div class="table-container">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Image</th>
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
							<div class="flex items-center">
								<span class="ml-2">
									{person.first_name}
									{person.last_name}
								</span>
							</div>
						</td>
						<td>
							<UploadedImage src={person.image} alt="Person Image" maxHeight="50px"></UploadedImage>
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
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<label
									onclick={() => ($itemToUpdate = { ...person, id: person._id })}
									class="min-w-[133px] rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
								>
									Change Image
									<input
										type="file"
										placeholder="Image"
										style="display: none;"
										onchange={(e) => {
											changePhoto(e, person);
										}}
									/>
								</label>
								<AButton
									size="sm"
									color="secondary"
									onClick={() => {
										$itemToUpdate = { ...person, id: person._id };
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

	<ADialog title="Add New Person" bind:value={$addDialog} width="400px">
		<AddPerson onAddPerson={addPerson} loading={$adding} bind:newPerson></AddPerson>
	</ADialog>

	<ADialog title="Update Person" bind:value={$updateDialog} width="400px">
		<UpdatePerson bind:person={$itemToUpdate} {updateSelectedPerson} loading={$updating}
		></UpdatePerson>
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
</div>
