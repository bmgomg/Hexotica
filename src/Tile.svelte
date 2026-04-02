<script>
	import Hex1 from '$lib/images/Hex 1.webp';
	import Hex10 from '$lib/images/Hex 10.webp';
	import Hex11 from '$lib/images/Hex 11.webp';
	import Hex12 from '$lib/images/Hex 12.webp';
	import Hex13 from '$lib/images/Hex 13.webp';
	import Hex14 from '$lib/images/Hex 14.webp';
	import Hex2 from '$lib/images/Hex 2.webp';
	import Hex3 from '$lib/images/Hex 3.webp';
	import Hex4 from '$lib/images/Hex 4.webp';
	import Hex5 from '$lib/images/Hex 5.webp';
	import Hex6 from '$lib/images/Hex 6.webp';
	import Hex7 from '$lib/images/Hex 7.webp';
	import Hex8 from '$lib/images/Hex 8.webp';
	import Hex9 from '$lib/images/Hex 9.webp';
	import { DECK, HEX_WIDTH } from './const';
	import Knob from './Knob.svelte';
	import { currentTurns, ss } from './shared.svelte';
	import Spot from './Spot.svelte';

	const { tile, row, col } = $props();
	const hexes = [Hex1, Hex2, Hex3, Hex4, Hex5, Hex6, Hex7, Hex8, Hex9, Hex10, Hex11, Hex12, Hex13, Hex14];
	const i = DECK.findIndex((bits) => JSON.stringify(bits) === JSON.stringify(tile.bits));
	const tt = $derived(tile.place === 'tray');
	const ga = $derived(tt ? 'auto' : `${row}/${col}`);
	const scale = $derived(tt ? 0.9 : ss.zoom);
	const turns = $derived(currentTurns());
</script>

<div class="tile {tt ? 'swirl' : ''}" style="grid-area: {ga};">
	<div class="tile-inner" style="rotate: {(tile.turns + turns) * 60}deg; transition-duration: {ss.ms}ms;">
		<img src={hexes[i]} alt="" width={HEX_WIDTH * scale} />
		<Spot row={1} col={1} {tile} {scale} />
	</div>
	<Knob row={1} col={1} {tile} {scale} />
</div>

<style>
	.tile {
		display: grid;
	}

	.tile-inner {
		grid-area: 1/1;
		display: grid;
		place-items: center;
		transition: rotate linear;
	}

	.swirl {
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
	}
</style>
