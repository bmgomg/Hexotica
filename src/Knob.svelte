<script>
	import { fade } from 'svelte/transition';
	import { HEX_DIMS, HEX_RATIO, HEX_WIDTH } from './const';
	import { fromTile, isWinner, roboTurn, ss } from './shared.svelte';

	const { tile, scale = ss.zoom } = $props();
	const player = $derived(tile?.player);
	const width = $derived(HEX_WIDTH * scale);
	const height = $derived(width / HEX_RATIO);
	const r = $derived(width * 1.3);
	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
	const shine = $derived(`var(--${player === 1 ? 'amber-shine' : 'slate-shine'})`);
	const roboSelect = $derived(roboTurn() && fromTile() === tile);
	const winner = $derived(isWinner(tile));
	const pulse = $derived(winner || roboSelect);

	const classes = $derived(
		`knob nope ${pulse ? 'pulse' : ''} ${roboSelect || (winner && ss.over?.player === 2) ? 'hi2' : winner && ss.over?.player === 1 ? 'hi1' : ''}`
	);
</script>

<div class={classes} in:fade={{ duration: pulse ? 200 : 0 }}>
	<svg {width} {height} {viewBox} {xmlns}>
		<g class="core" stroke="none">
			<circle cx="363" cy="314" {r} fill="var(--bg)" stroke={shine} stroke-width={12} />
			<circle cx="363" cy="314" r={r * 0.65} fill="var(--{player === 1 ? 'amber-fill' : 'slate-stroke'})" />
			<circle cx={363 - r * 0.2} cy={314 - r * 0.2} r={r * 0.22} fill={shine} />
		</g>
	</svg>
</div>

<style>
	.knob {
		grid-area: 1/1;
		display: grid;
		place-content: center;
		place-items: center;
		z-index: 1;
	}

	.hi2 {
		filter: contrast(1.6) brightness(1.6);
	}

	.hi1 {
		filter: contrast(1.3) brightness(1.3);
	}

	svg {
		grid-area: 1/1;
	}

	.core {
		pointer-events: all;
	}

	.pulse {
		animation: pulse 0.4s alternate infinite ease-in-out;
	}

	@keyframes pulse {
		from {
			scale: 1;
		}
		to {
			scale: 1.2;
		}
	}
</style>
