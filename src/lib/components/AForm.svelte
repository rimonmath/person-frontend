<script lang="ts">
	import type { Snippet } from 'svelte';
	import { type ZodObject, type ZodRawShape, type ZodType } from 'zod';

	// ---- Props ----
	export let schema: ZodObject<ZodRawShape>;
	export let formData: Record<string, any>;
	export let debug = false;

	// Callback for valid submission
	export let onSuccessSubmit: (data: typeof formData) => void;

	// Snippet prop (tuple with one element)
	export let children: Snippet<[{ errors: Record<string, string> }]>;

	// ---- State ----
	let errors: Record<string, string> = {};
	let submittedOnce = false;
	let prevFormData: Record<string, any> = {};

	// ---- Validation ----
	function validate() {
		const result = schema.safeParse(formData);

		if (!result.success) {
			const e: Record<string, string> = {};
			result.error.issues.forEach((err) => {
				if (err.path[0] !== undefined) e[String(err.path[0])] = err.message;
			});
			errors = e;

			const firstPath = result.error.issues[0]?.path[0];
			if (firstPath !== undefined) {
				const elementToFocus = document.querySelector<HTMLElement>(`[name="${String(firstPath)}"]`);
				elementToFocus?.focus();
			}

			if (debug) console.error(e);
		} else {
			errors = {};
		}
	}

	function validateField(fieldName: keyof typeof formData) {
		if (!submittedOnce) return;

		const shape = schema.shape as Record<string, ZodType<unknown>>;
		const fieldSchema = shape[String(fieldName)];
		if (!fieldSchema) return;

		const result = fieldSchema.safeParse(formData[fieldName]);

		if (!result.success) {
			errors[String(fieldName)] = result.error.issues[0].message;
		} else {
			errors[fieldName] = '';
		}
	}

	function handleSubmit() {
		submittedOnce = true;
		validate();

		if (Object.keys(errors).length > 0) return;
		submittedOnce = false;
		onSuccessSubmit?.(formData);
	}

	// Deep watch using reactive statement
	$: if (submittedOnce) {
		for (const key in formData) {
			if (formData[key] !== prevFormData[key]) {
				validateField(key);
			}
		}
		prevFormData = { ...formData };
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	{@render children({ errors })}
</form>
