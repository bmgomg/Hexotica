<script>
	import { HEX_DIMS, HEX_RATIO, HEX_WIDTH } from './const';
	import { ss } from './shared.svelte';

	const { row, col, player } = $props();
	const id = $derived(`spot ${row}/${col}`);
	const ga = $derived(`${row || 1}/${col || 2}`);
	const width = $derived(HEX_WIDTH * ss.zoom);
	const height = $derived(width / HEX_RATIO);

	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
	const spoke = '#c8bfa8a0';
	const stroke = $derived(player === 1 ? 'var(--amber-fill)' : player === 2 ? 'var(--slate-stroke)' : spoke);
	const strokeWidth = 8;

	const onClick = () => {};
</script>

<div {id} class="spot" style="grid-area: {ga}">
	{#snippet sector(i)}
		<path
			class="sector {i % 2 ? 'nope' : ''}"
			d="M363,314 183,620 543,620 Z"
			fill="none"
			transform="rotate({(i * 60 + 180) % 360}, 363, 314)"
			onClick={() => onClick(i)}
		/>
	{/snippet}
	<svg {width} {height} {viewBox} {xmlns}>
		<g stroke={player ? 'var(--bg)' : spoke} {strokeWidth} strokeLinejoin="round" fill="none">
			{#each [0, 1, 2, 3, 4, 5] as i (i)}
				{@render sector(i)}
			{/each}
		</g>
		<path d="M183,620 543,620 726,314 543,0 183,0 0,314 Z" fill="none" {stroke} strokeLinejoin="round" {strokeWidth} />
	</svg>
</div>

<style>
	.spot {
		grid-area: 1/1;
	}

	.sector {
		cursor: pointer;
	}

	.nope {
		pointer-events: none;
	}
</style>
