<script lang="ts">
	import { public_cdn_domain } from '$lib/app/env.public';

	type Props = {
		src: string;
		alt: string;
		maxHeight?: string;
	};

	let { src, alt, maxHeight = 'auto' }: Props = $props();

	let imageSrc = $derived(src ? public_cdn_domain + src : '/img/user-avatar.jpg');
</script>

<!-- {JSON.stringify(imageSrc)} -->
<img {alt} src={imageSrc} style:max-height={maxHeight} />
