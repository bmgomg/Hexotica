<script>
	import { HEX_DIMS, HEX_RATIO, HEX_WIDTH } from './const';
	import { ss } from './shared.svelte';
	import Knob from '$lib/images/Knob Green.webp';

	const { row, col, player, spokes = true, scale = ss.zoom, selected } = $props();
	const id = $derived(`spot ${row}/${col}`);
	const ga = $derived(`${row || 1}/${col || 2}`);
	const width = $derived(HEX_WIDTH * scale);
	const height = $derived(width / HEX_RATIO);

	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
	const spoke = '#c8bfa828';
	const stroke = $derived(player === 1 ? 'var(--amber-fill)' : player === 2 ? 'var(--slate-stroke)' : spoke);
	const sw = 10;

	const onClick = () => {};
</script>

<div {id} class="spot" style="grid-area: {ga}">
	{#snippet sector(i)}
		<path
			class="sector"
			d="M363,314 183,620 543,620 Z"
			fill="none"
			transform="rotate({(i * 60 + 120) % 360}, 363, 314)"
			onClick={() => onClick(i)}
		/>
	{/snippet}
	<svg {width} {height} {viewBox} {xmlns}>
		{#if spokes}
			<g stroke={player ? 'var(--bg)' : spoke} stroke-width={sw} stroke-line-join="round" fill="none">
				{#each [1, 2, 3, 4, 5, 6] as i (i)}
					{@render sector(i)}
				{/each}
			</g>
		{/if}
		<path class="nope" d="M183,620 543,620 726,314 543,0 183,0 0,314 Z" {stroke} stroke-width={sw} stroke-line-join="round" fill="none" />
	</svg>
	{#if selected}
		<div class="selected" style="transform: rotate({(selected - 1) * 60}deg) translateY({-height * 0.33}px);">
			<img src={Knob} alt="" width={HEX_WIDTH * scale * 0.15} />
		</div>
	{/if}
</div>

<style>
	.spot {
		display: grid;
		place-content: center;
	}

	.sector {
		cursor: pointer;
	}

	.nope {
		pointer-events: none;
	}

	svg {
		grid-area: 1/1;
	}

	.selected {
		grid-area: 1/1;
		place-self: center;
	}
</style>
