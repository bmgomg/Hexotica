<script>
	import { OPP_ROBOT } from './const';
	import HumanB from '$lib/images/Human Blue.webp';
	import HumanY from '$lib/images/Human Yellow.webp';
	import Robot from '$lib/images/Robot.webp';
	import { drawTile, ss, trayTile } from './shared.svelte';
	import { post } from './utils';

	const { player } = $props();
	const src = $derived(player === 1 ? HumanY : ss.opp === OPP_ROBOT ? Robot : HumanB);
	const spin = $derived(ss.actor === player && !ss.over);

	const classes = $derived(
		`${player === 1 ? 'p1' : 'p2'} ${spin ? 'spin' : ''} ${spin || ss.over || (ss.actor === 2 && ss.opp === OPP_ROBOT) ? 'nope' : ''}`
	);

	const onClick = () => {
		delete ss.choice;

		const tile = trayTile();
		delete tile.place;

		ss.actor = 3 - ss.actor;
		post(drawTile);
	};
</script>

<img class={classes} {src} alt="" width={60} onpointerdown={onClick} />

<style>
	.p1 {
		grid-area: 1/2;
		cursor: pointer;
	}

	.p2 {
		grid-area: 1/6;
		cursor: pointer;
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
