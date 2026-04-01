<script>
	import { HEX_DIMS, HEX_RATIO, HEX_WIDTH } from './const';
	import { ss } from './shared.svelte';

	const { row, col, player, spokes = true, scale = ss.zoom, selected } = $props();
	const id = $derived(`spot ${row}/${col}`);
	const ga = $derived(`${row || 1}/${col || 2}`);
	const width = $derived(HEX_WIDTH * scale);
	const height = $derived(width / HEX_RATIO);

	const off = $derived.by(() => {
		const w = width;
		const z1 = 2.6;
		const z2 = 2.3;
		const z3 = 1.4;

		switch (selected) {
			case 1:
				return [0, -w * z1];
			case 2:
				return [w * z2, -w * z3];
			case 3:
				return [w * z2, w * z3];
			case 4:
				return [0, w * z1];
			case 5:
				return [-w * z2, w * z3];
			case 6:
				return [-w * z2, -w * z3];
		}
	});

	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
	const spoke = '#c8bfa828';
	const stroke = $derived(player === 1 ? 'var(--amber-fill)' : player === 2 ? 'var(--slate-stroke)' : spoke);
	const sw = 10;

	const onClick = () => {};
</script>

<div {id} class="spot" style="grid-area: {ga}">
	{#snippet sector(i)}
		<path class="sector" d="M363,314 183,620 543,620 Z" transform="rotate({(i * 60 + 120) % 360}, 363, 314)" onClick={() => onClick(i)} />
		{#if selected}
			{@const r = width * 0.6}
			<g style="translate: {off[0]}px {off[1]}px;" stroke='none'>
				<circle cx="363" cy="314" {r} fill="var(--bg)" />
				<circle cx="363" cy="314" r={r * 0.8} fill="var(--green)" />
				<circle cx={363 - r * 0.2} cy={314 - r * 0.2} r={r * 0.3} fill="var(--green-shine)" />
			</g>
		{/if}
	{/snippet}
	<svg {width} {height} {viewBox} {xmlns}>
		<g stroke={!spokes ? 'none' : player ? 'var(--bg)' : spoke} stroke-width={sw} stroke-line-join="round" fill="transparent">
			{#each [1, 2, 3, 4, 5, 6] as i (i)}
				{@render sector(i)}
			{/each}
		</g>
		<path class="nope" d="M183,620 543,620 726,314 543,0 183,0 0,314 Z" {stroke} stroke-width={sw} stroke-line-join="round" fill="none" />
	</svg>
</div>

<style>
	.spot {
		display: grid;
		place-content: center;
	}

	.sector {
		grid-area: 1/1;
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
		display: grid;
		place-self: center;
	}
</style>
