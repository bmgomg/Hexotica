<script>
	import { HEX_DIMS, HEX_RATIO, HEX_WIDTH } from './const';
	import { ss } from './shared.svelte';

	const { row, col, tile, scale = ss.zoom } = $props();
	const tt = $derived(tile?.place === 'tray');
	const _row = $derived(tt ? 0 : row);
	const _col = $derived(tt ? 0 : col);
	const player = $derived(tile?.player);
	const id = $derived('spot ' + _row + ':' + _col);
	const ga = $derived(`${row || 1}/${col || 2}`);
	const width = $derived(HEX_WIDTH * scale);
	const height = $derived(width / HEX_RATIO);
	const r = $derived(width * 1.3);
	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
</script>

<div {id} class="knob" style="grid-area: {ga};">
	<svg {width} {height} {viewBox} {xmlns}>
		<g class="knob" stroke="none">
			<circle cx="363" cy="314" {r} fill="var(--bg)" stroke="var(--{player === 1 ? 'amber-shine' : 'slate-shine'})" stroke-width={12} />
			<circle cx="363" cy="314" r={r * 0.65} fill="var(--{player === 1 ? 'amber-fill' : 'slate-stroke'})" />
			<circle cx={363 - r * 0.2} cy={314 - r * 0.2} r={r * 0.22} fill="var(--{player === 1 ? 'amber-shine' : 'slate-shine'})" />
		</g>
	</svg>
</div>

<style>
	.knob {
		grid-area: 1/1;
		display: grid;
		place-content: center;
		place-items: center;
        pointer-events: none;
        z-index: 1;
	}

	svg {
		grid-area: 1/1;
	}
</style>
