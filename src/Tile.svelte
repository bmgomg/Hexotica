<script>
	import Knob from './Knob.svelte';
	import { currentTurns, fromTile, roboTurn, ss } from './shared.svelte';
	import Spot from './Spot.svelte';

	const { tile, row, col } = $props();
	const tt = $derived(tile.place === 'tray');
	const ga = $derived(tt ? 'auto' : `${row}/${col}`);
	const scale = $derived(tile.off || !tt ? 1 : 0.9);
	const turns = $derived(tile === fromTile() ? currentTurns() : 0);
	const roboSelect = $derived(roboTurn() && fromTile() === tile);
	const translate = $derived(tile.off ? `${tile.off.x}px ${tile.off.y}px` : '0');
	const style = $derived(
		`grid-area: ${ga}; translate: ${translate}; scale: ${scale}; transition-duration: ${ss.ms}ms; z-index: ${tile.off ? 3 : 2}`
	);
</script>

<div id={tile.id} class="tile nope {roboSelect ? 'pulse' : ''} {tt ? 'swirl' : ss.restart ? 'fade-out' : ''}" {style}>
	<div class="tile-inner" style="rotate: {turns * 60}deg; transition-duration: {ss.ms}ms;">
		<Spot {row} {col} {tile} />
	</div>
	<Knob {tile} />
</div>

<style>
	.tile {
		display: grid;
		place-self: center;
		box-sizing: border-box;
		transition:
			translate linear,
			scale linear;
		z-index: 2;
	}

	.tile-inner {
		grid-area: 1/1;
		display: grid;
		place-items: center;
		transition: rotate linear;
	}

	.fade-out {
		animation: fade 1s forwards;
	}

	@keyframes fade {
		0% {
			transform: scale(1);
			rotate: 0deg;
		}
		100% {
			transform: scale(0);
			rotate: 360deg;
		}
	}

	.swirl {
		z-index: 1;
		animation: swirl 1s forwards;
	}

	@keyframes swirl {
		0% {
			transform: scale(0);
			rotate: -360deg;
		}
		100% {
			transform: scale(1);
			rotate: 0deg;
		}
	}

	.pulse {
		animation: pulse 0.3s alternate infinite ease-in-out;
	}

	@keyframes pulse {
		from {
			scale: 1;
		}
		to {
			scale: 0.85;
		}
	}
</style>
