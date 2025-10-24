<script lang="ts">
	import { API_DOMAIN } from '$lib/data';

	type Props = {
		src: string;
		alt: string;
		maxHeight?: string;
	};

	let { src, alt, maxHeight = 'auto' }: Props = $props();

	let imageSrc = $derived.by(() => (src ? API_DOMAIN + src : '/img/user-avatar.jpg'));
</script>

<!-- {JSON.stringify(imageSrc)} -->
<img {alt} src={imageSrc} style:max-height={maxHeight} />
