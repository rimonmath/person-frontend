<script lang="ts">
	export let value = false;
	export let title = '';
	export let width = `fit-content`;
	export let closeOnOutsideClick = false;
	export let hideHeader = false;

	let dialogEl: HTMLDialogElement;

	function handleAnimationEnd() {
		if (!value) {
			dialogEl?.close();
		}
	}

	function handleOutsideClick(e: MouseEvent) {
		if (closeOnOutsideClick) {
			const rect: any = dialogEl?.getBoundingClientRect();
			const isInDialog =
				rect.top <= e.clientY &&
				e.clientY <= rect.top + rect.height &&
				rect.left <= e.clientX &&
				e.clientX <= rect.left + rect.width;
			if (!isInDialog) {
				close();
			}
		}
	}

	$: if (value) {
		dialogEl?.showModal();
	} else {
		close();
	}

	export function close() {
		value = false;
		// dialogEl?.close();
	}

	export function open() {
		value = true;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if value}
	<div class="a-dialog-backdrop" on:click={close}></div>
{/if}
<dialog
	class="a-dialog"
	class:a-dialog-open={value}
	bind:this={dialogEl}
	on:click|stopPropagation={handleOutsideClick}
	style="width: {width}"
	on:cancel|preventDefault={close}
	on:animationend={handleAnimationEnd}
>
	<slot name="header" {close}>
		{#if !hideHeader}
			<div class="a-dialog-header">
				<div class="a-dialog-title">
					{title}
				</div>
				<button class="a-dialog-close" on:click={close}>X</button>
			</div>
		{/if}
	</slot>
	<div class="a-dialog-body">
		<slot />
	</div>

	{#if $$slots.footer}
		<div class="a-dialog-footer">
			<slot name="footer" {close} />
		</div>
	{/if}
</dialog>

<style lang="postcss">
</style>
