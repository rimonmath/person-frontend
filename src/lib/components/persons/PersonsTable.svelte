<script>
	import AButton from '../AButton.svelte';
	import EditIcon from '../icons/EditIcon.svelte';
	import TrashIcon from '../icons/TrashIcon.svelte';
	import UploadedImage from '../UploadedImage.svelte';

	const { persons, onChangePhoto, onUpdate, onDelete } = $props();
</script>

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
			{#each persons as person}
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
						<div class="flex items-center">
							<UploadedImage src={person.image} alt="Person Image" maxHeight="70px"></UploadedImage>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
							<label
								onclick={(/*$itemToUpdate = { ...person, id: person._id }*/) => ({})}
								class="ml-2 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
							>
								Change
								<input
									type="file"
									accept="image/*"
									placeholder="Image"
									style="display: none;"
									onchange={(e) => {
										onChangePhoto(e, person);
									}}
								/>
							</label>
						</div>
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
									onUpdate({ ...person, id: person._id });
									// $itemToUpdate = { ...person, id: person._id };
									// $updateDialog = true;
								}}
							>
								<EditIcon></EditIcon>
							</AButton>
							<AButton
								size="sm"
								color="danger"
								onClick={() => {
									onDelete(person);
									// $itemToDelete = person;
									// $deleteDialog = true;
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
