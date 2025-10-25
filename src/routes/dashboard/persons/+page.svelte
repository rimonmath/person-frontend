<script lang="ts">
	import AButton from '$lib/components/AButton.svelte';
	import ADialog from '$lib/components/ADialog.svelte';
	import EditIcon from '$lib/components/icons/EditIcon.svelte';
	import TrashIcon from '$lib/components/icons/TrashIcon.svelte';
	import { usePost } from '$lib/composables/usePost';
	import { useToast } from '$lib/composables/useToast';
	import { type Person, type SuccessResponse } from '$lib/types';

	import { useDelete } from '$lib/composables/useDelete';
	import { usePut } from '$lib/composables/usePut';
	import { putFormData } from '$lib/script/api';
	import UploadedImage from '$lib/components/UploadedImage.svelte';
	import AddPerson from '$lib/components/persons/AddPerson.svelte';
	import UpdatePerson from '$lib/components/persons/UpdatePerson.svelte';
	import { persons } from '../../../stores/persons.js';
	import { public_api_endpoint } from '$lib/app/env.public.js';
	import PersonsTable from '$lib/components/persons/PersonsTable.svelte';

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
	let {
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

	async function onChangePhoto(e: Event, person: Person) {
		$itemToUpdate = { ...person, id: person._id };
		const inputElement = e.target as HTMLInputElement;

		if (!inputElement || !inputElement.files) {
			return;
		}

		const file = inputElement?.files[0];

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

	function onUpdate(person: Person) {
		$itemToUpdate = person;
		$updateDialog = true;
	}

	function onDelete(person: Person) {
		$itemToDelete = person;
		$deleteDialog = true;
	}
</script>

<div class="p-2 md:p-10">
	<div class="flex items-center justify-between">
		<h1 class="text-lg">All Persons</h1>
		<AButton onClick={() => ($addDialog = true)}>Add New</AButton>
	</div>

	<PersonsTable persons={$persons} {onChangePhoto} {onUpdate} {onDelete}></PersonsTable>

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
