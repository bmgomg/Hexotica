<script>
	import { fade } from 'svelte/transition';
	import { HEX_DIMS, HEX_RATIO, HEX_WIDTH } from './const';
	import { currentTurns, drawTile, fromTile, isMoving, ss } from './shared.svelte';
	import { post, rectCenter } from './utils';

	const { row, col, tile, scale = ss.zoom } = $props();
	const tt = $derived(tile?.place === 'tray');
	const _row = $derived(tt ? 0 : row);
	const _col = $derived(tt ? 0 : col);
	const player = $derived(tile?.player);
	const id = $derived('spot-' + _row + ':' + _col);
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
				const ftile = fromTile();

				if (tile) {
					ss.ms = 750;
				} else {
					ss.to.sector -= ftile.turns;

					const { x: x1, y: y1 } = rectCenter(ftile.id);
					const { x: x2, y: y2 } = rectCenter(id);

					ftile.off = { x: x2 - x1, y: y2 - y1, scale: ftile.place === 'tray' ? 1 / 0.9 : 1 };

					ss.ms = 1000;
				}

				post(() => {
					ftile.turns += currentTurns();

					if (ftile.off) {
						delete ftile.off;
						ftile.place = { row, col };
					}

					delete ss.from;
					delete ss.to;

					ss.actor = 3 - ss.actor;
					post(drawTile);
				}, ss.ms);
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
			<path class="sector {!tile && !ss.from ? 'nope' : ''}" d="M363,314 183,8 543,8 Z" onpointerdown={() => onClick(i)} />
			<text class="text nope" x="340" y="314" fill={tile ? 'var(--bg)' : 'var(--slate-deep)'}>{i}</text>
			{#if selected === i}
				{@const r = width * 0.6}
				{@const transform = `rotate(${-(deg + tileTurns * 60)}, 363, 95) translate(0, -220)`}
				{@const shades = tile.player === 1 ? ['var(--amber-fill)', 'var(--amber-shine)'] : ['var(--slate-stroke)', 'var(--slate-shine)']}
				<g class="nope" {transform} stroke="none" out:fade>
					<circle cx="363" cy="314" {r} fill="var(--bg)" />
					<circle cx="363" cy="314" r={r * 0.8} fill={moving ? shades[1] : shades[0]} />
					<circle cx={363 - r * 0.2} cy={314 - r * 0.2} r={r * 0.3} fill={shades[1]} />
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
		place-self: center;
		place-items: center;
		box-sizing: border-box;
		z-index: 1;
	}

	.text {
		display: none;
		font-family: RC;
		font-size: 120px;
		translate: 0 -170px;
		color: var(--slate-stroke);
	}

	.sector {
		grid-area: 1/1;
		cursor: pointer;
	}

	svg {
		grid-area: 1/1;
		transition: scale 1s linear;
	}
</style>
