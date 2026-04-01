<script>
	import { HEX_DIMS, HEX_RATIO, HEX_WIDTH } from './const';
	import { ss } from './shared.svelte';

	const { row, col, tile, scale = ss.zoom } = $props();
	const tt = $derived(tile?.place === 'tray');
	const player = $derived(tile?.player);
	const id = $derived('spot ' + (tt ? 'tray' : row + ':' + col));
	const ga = $derived(`${row || 1}/${col || 2}`);
	const width = $derived(HEX_WIDTH * scale);
	const height = $derived(width / HEX_RATIO);
	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
	const spoke = '#c8bfa828';
	const stroke = $derived(player === 1 ? 'var(--amber-fill)' : player === 2 ? 'var(--slate-stroke)' : spoke);
	const sw = 10;
	const selected = $derived(ss.from && ss.from.row === row && ss.from.col === col ? ss.from.sector : 0);

	const onClick = (i) => {
		if (ss.from) {
			if (ss.from.row === row && ss.from.col === col && ss.from.sector === i) {
				delete ss.from;
			} else {
				ss.to = { row, col, sector: i };
			}
		} else {
			ss.from = { row, col, sector: i };
		}
	};
</script>

<div {id} class="spot" style="grid-area: {ga};">
	{#snippet sector(i)}
		{@const deg = ((i - 1) * 60) % 360}
		<g transform="rotate({deg}, 363, 314)">
			<path class="sector" d="M363,314 183,620 543,620 Z" onpointerdown={() => onClick(i)} />
			{#if selected === i}
				{@const r = width * 0.6}
				<g class="selected" transform="rotate({-(deg + (ss.spin || 0))}, 363, 95) translate(0, -220)" stroke="none">
					<circle cx="363" cy="314" {r} fill="var(--bg)" />
					<circle cx="363" cy="314" r={r * 0.8} fill="var(--green)" />
					<circle cx={363 - r * 0.2} cy={314 - r * 0.2} r={r * 0.3} fill="var(--green-shine)" />
				</g>
			{/if}
		</g>
	{/snippet}
	<svg {width} {height} {viewBox} {xmlns}>
		<g stroke={tile ? 'none' : spoke} stroke-width={sw} stroke-line-join="round" fill="transparent">
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
		place-items: center;
	}

	.sector {
		grid-area: 1/1;
		cursor: pointer;
	}

	.selected {
		transition: transform 1s linear;
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
