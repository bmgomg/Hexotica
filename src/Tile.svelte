<script>
	import HexBg from '$lib/images/Hex Background.webp';
	import { DECK, HEX_WIDTH, HEXES } from './const';
	import Knob from './Knob.svelte';
	import { currentTurns, fromTile, ss } from './shared.svelte';
	import Spot from './Spot.svelte';

	const { tile, row, col } = $props();
	const i = $derived(DECK.findIndex((bits) => JSON.stringify(bits) === JSON.stringify(tile.idBits)));
	const tt = $derived(tile.place === 'tray');
	const ga = $derived(tt ? 'auto' : `${row}/${col}`);
	const scale = $derived(tile.off || !tt ? ss.zoom : 0.9);
	const turns = $derived(tile === fromTile() ? currentTurns() : 0);
	const translate = $derived(tile.off ? `${tile.off.x}px ${tile.off.y}px` : '0');
	const style = $derived(`grid-area: ${ga}; translate: ${translate}; scale: ${scale}; z-index: ${tile.off ? 3 : 2}`);
</script>

<div id={tile.id} class="tile nope {tt ? 'swirl' : ss.restart ? 'fade-out' : ''}" {style}>
	<div class="tile-inner" style="rotate: {turns * 60}deg; transition-duration: {ss.ms}ms;">
		<img src={HexBg} alt="" width={HEX_WIDTH * scale} />
		<img src={HEXES[i]} alt="" width={HEX_WIDTH * scale} style="rotate: {tile.imgTurns * 60}deg;" />
		<Spot {row} {col} {tile} {scale} />
	</div>
	<Knob {tile} {scale} />
</div>

<style>
	.tile {
		display: grid;
		place-self: center;
		box-sizing: border-box;
		transition:
			translate 0.75s linear,
			scale 0.75s linear;
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

	img {
		grid-area: 1/1;
		transition: scale 1s linear;
	}
</style>
