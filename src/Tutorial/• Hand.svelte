<script>
	import HandB from '$lib/images/Hand Blue.webp';
	import HandY from '$lib/images/Hand Yellow.webp';
	import { fade } from 'svelte/transition';
	import { ts } from './ts.svelte';

	const { player } = $props();
	const src = $derived(player === 1 ? HandY : HandB);
	const hand = $derived(player === 1 ? ts.hand1 : ts.hand2);
	const show = $derived(hand.show);
	const translate = $derived(`${hand.off?.x || 0}px ${hand.off?.y || 0}px`);
	const style = $derived(`translate: ${translate}; scale: ${hand.scale}`);
</script>

{#if show}
	<img class={player === 1 ? 'p1' : 'p2'} {src} alt="" width={32} transition:fade={{ duration: 1000 }} {style} />
{/if}

<style>
	img {
		place-self: center;
		transition:
			translate 1.5s 2s,
			scale 0.2s;
		z-index: 3;
	}

	.p1 {
		grid-area: 1/3;
	}

	.p2 {
		grid-area: 1/5;
	}
</style>
