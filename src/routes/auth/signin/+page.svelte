<script lang="ts">
	import AButton from '$lib/components/AButton.svelte';
	import AForm from '$lib/components/AForm.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { usePost } from '$lib/composables/usePost';
	import { type SigninResponse } from '$lib/types';
	import { useToast } from '$lib/composables/useToast';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { object as zObject, string as zString, email as zEmail } from 'zod';

	const { showSuccessToast, showErrorToast } = useToast();

	const loginSchema = zObject({
		email: zEmail().min(3).max(100).nonempty(),
		password: zString().min(6).nonempty()
	});

	let formData = $state({
		email: '',
		password: ''
	});

	const { start, error, loading, response } = usePost<SigninResponse>('auth/signin', true);

	async function handleSubmit() {
		await start(formData);
		if ($error) {
			console.dir($error);
			// alert($error.message);
			showErrorToast($error.message!);
			return;
		}

		console.log(response);
		console.log($response);

		showSuccessToast($response?.message || '');

		// localStorage.setItem('accessToken', $response?.accessToken!);
		// localStorage.setItem('refreshToken', signinResponse.value!.refreshToken);
		console.log('about to go');

		if ($response?.redirect) {
			goto($response?.redirect);
			console.log('GOne');
		}
	}

	const autheChecked = $state(false);

	onMount(() => {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			goto('/dashboard/persons');
		}
	});
</script>

<div class="text-center">
	<img src="/favicon.svg" class="inline-block max-h-[50px]" alt="" />

	<h2 class="mt-4 text-xl">User signin</h2>
</div>
<AForm schema={loginSchema} bind:formData onSuccessSubmit={handleSubmit}>
	{#snippet children({ errors })}
		<TextInput name="email" label="Email" placeholder="Enter your email" bind:formData {errors}
		></TextInput>

		<TextInput
			type="password"
			name="password"
			label="Password"
			placeholder="Enter your password"
			bind:formData
			{errors}
		></TextInput>

		<AButton type="submit" block loading={$loading}>Signin</AButton>
	{/snippet}
</AForm>

<p class="mt-4 text-center">
	Don't have an account?
	<span>Sign up </span>
</p>

<p class="mt-2 text-center">
	<a href="/" class="back-home">← Back to Home</a>
</p>
