<script>
	import Heart from '$lib/images/Heart.webp';
	import Trophy1 from '$lib/images/Trophy Yellow.webp';
	import Trophy2 from '$lib/images/Trophy Blue.webp';
	import { ss } from './shared.svelte';
	import { fade } from 'svelte/transition';

	const { player } = $derived(ss.over);
	const src = $derived(ss.over ? (player === 1 ? Trophy1 : player === 2 ? Trophy2 : Heart) : null);
</script>

{#if ss.over}
	<div class="trophy no-highlight" transition:fade>
		<img {src} alt="" width="70%" />
	</div>
{/if}

<style>
	.trophy {
		grid-area: 1/4;
		display: grid;
	}

	img {
		place-self: center;
	}
</style>
