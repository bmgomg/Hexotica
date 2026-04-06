<script>
	import { OPP_ROBOT } from './const';
	import HumanB from '$lib/images/Human Blue.webp';
	import HumanY from '$lib/images/Human Yellow.webp';
	import Robot from '$lib/images/Robot.webp';
	import { ss } from './shared.svelte';

	const { player } = $props();
	const src = $derived(player === 1 ? HumanY : ss.opp === OPP_ROBOT ? Robot : HumanB);
</script>

<img class="{player === 1 ? 'p1' : 'p2'} {ss.actor === player && !ss.over ? 'spin' : ''}" {src} alt="" width={60} />

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
