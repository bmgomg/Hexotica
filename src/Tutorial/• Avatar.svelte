<script>
	import HumanB from '$lib/images/Human Blue.webp';
	import HumanY from '$lib/images/Human Yellow.webp';
	import { ts } from './ts.svelte';

	const { player } = $props();
	const src = $derived(player === 1 ? HumanY : HumanB);
	const spin = $derived(ts.actor === player);
	const classes = $derived(`${player === 1 ? 'p1' : 'p2'} ${spin ? 'spin' : ''}`);
</script>

<img class={classes} {src} alt="" width={60} />

<style>
	.p1 {
		grid-area: 1/2;
	}

	.p2 {
		grid-area: 1/6;
	}

	.spin {
		animation: spin 0.5s alternate infinite linear;
	}

	@keyframes spin {
		from {
			transform: rotateY(0deg);
		}
		to {
			transform: rotateY(90deg);
		}
	}
</style>
