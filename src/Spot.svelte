<script>
	import { fade } from 'svelte/transition';
	import { HEX_DIMS, HEX_RATIO, HEX_WIDTH } from './const';
	import { isMoving, ss } from './shared.svelte';

	const { row, col, tile, scale = ss.zoom } = $props();
	const tt = $derived(tile?.place === 'tray');
	const _row = $derived(tt ? 0 : row);
	const _col = $derived(tt ? 0 : col);
	const player = $derived(tile?.player);
	const id = $derived('spot ' + _row + ':' + _col);
	const ga = $derived(`${row || 1}/${col || 2}`);
	const width = $derived(HEX_WIDTH * scale);
	const height = $derived(width / HEX_RATIO);
	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
	const spoke = '#c8bfa828';
	const stroke = $derived(player === 1 ? 'var(--amber-fill)' : player === 2 ? 'var(--slate-stroke)' : spoke);
	const sw = 10;
	const selected = $derived(ss.from && ss.from.row === _row && ss.from.col === _col ? ss.from.sector : 0);
	const tileTurns = $derived(tile?.turns || 0);
	const moving = $derived(isMoving());

	const onClick = (i) => {
		if (ss.from) {
			if (ss.from.row === _row && ss.from.col === _col && ss.from.sector === i) {
				delete ss.from;
			} else {
				ss.to = { row: _row, col: _col, sector: i };
			}
		} else {
			ss.from = { row: _row, col: _col, sector: i };
		}
	};
</script>

<div {id} class="spot" style="grid-area: {ga};">
	{#snippet sector(i)}
		{@const deg = ((i - 1) * 60) % 360}
		<g transform="rotate({deg}, 363, 314)" stroke={tile ? 'none' : spoke} stroke-width={sw} stroke-line-join="round" fill="transparent">
			<path class="sector" d="M363,314 183,8 543,8 Z" onpointerdown={() => onClick(i)} />
			{#if selected === i}
				{@const r = width * 0.6}
				{@const transform = `rotate(${-(deg + tileTurns * 60)}, 363, 95) translate(0, -220)`}
				<g class="nope" {transform} stroke="none" out:fade={{ duration: 100 }}>
					<circle cx="363" cy="314" {r} fill="var(--bg)" />
					<circle cx="363" cy="314" r={r * 0.8} fill={moving ? 'var(--green-shine)' : 'var(--green)'} />
					<circle cx={363 - r * 0.2} cy={314 - r * 0.2} r={r * 0.3} fill="var(--green-shine)" />
				</g>
			{/if}
		</g>
	{/snippet}
	<svg {width} {height} {viewBox} {xmlns}>
		{#each [1, 2, 3, 4, 5, 6] as i (i)}
			{@render sector(i)}
		{/each}
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

	.nope {
		pointer-events: none;
	}

	svg {
		grid-area: 1/1;
	}
</style>
