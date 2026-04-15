<script>
	import { fade } from 'svelte/transition';
	import { validateMove } from '../ai';
	import { ERR_COLOR, ERR_ISLAND, ERR_NEIGHBORS, ERR_NO_TILE, HEX_DIMS, HEX_RATIO, HEX_WIDTH } from '../const';
	import { placedTiles, showMessage } from '../shared.svelte';
	import { _sound } from '../sound.svelte';
	import { doPlacement, isMoving, spotId, ts } from './ts.svelte';

	const { row, col, tile } = $props();
	const tt = $derived(tile?.place === 'tray');
	const player = $derived(tile?.player);
	const id = $derived(spotId(row, col));
	const ga = $derived(`${tile || row < 0 ? 1 : row}/${tile || col < 0 ? 1 : col}`);
	const width = $derived(HEX_WIDTH);
	const height = $derived(width / HEX_RATIO);
	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
	const stroke = $derived(player === 1 ? 'var(--amber-fill)' : player === 2 ? 'var(--slate-stroke)' : 'var(--spoke)');
	const sw = 10;
	const selected = $derived(ts.from && ts.from.row === row && ts.from.col === col ? ts.from.sector : 0);
	const moving = $derived(isMoving());

	const onClick = (i) => {
		_sound.play('click');

		const placement = { row, col, sector: i };

		if (!ts.from) {
			ts.from = placement;
			return;
		}

		if (ts.from.row === row && ts.from.col === col) {
			if (ts.from.sector === i) {
				delete ts.from;
				return;
			}

			if (tt) {
				ts.from.sector = i;
				return;
			}
		} else if (tile) {
			ts.from = placement;
			return;
		}

		const bits = validateMove(ts.from, placement, ts.tiles);

		switch (bits) {
			case ERR_NO_TILE:
				throw new Error('No tile!');
			case ERR_COLOR:
				showMessage('Color mismatch!');
				return;
			case ERR_NEIGHBORS:
				showMessage('Too few neighbors!');
				return;
			case ERR_ISLAND:
				showMessage('No islands!');
				return;
		}

		doPlacement(placement, bits);
	};

	const classes = $derived.by(() => {
		let cls = 'spot nope ';

		if (!tile) {
			if (ts.restart) {
				cls += 'fade-out';
			} else if (placedTiles(ts.tiles).length === 0) {
				cls += 'fade-in';
			}
		}

		return cls;
	});
</script>

<div {id} class={classes} style="grid-area: {ga};" in:fade>
	{#snippet sector(i)}
		{@const deg = ((i - 1) * 60) % 360}
		{@const stroke = tile ? 'none' : 'var(--spoke)'}
		{@const fill = !tile && ts.to?.sector === i ? 'var(--spoke)' : 'none'}
		{@const sw = tile ? 0 : 10}
		<g transform="rotate({deg}, 363, 314)" {stroke} stroke-width={sw} stroke-line-join="round" fill="transparent">
			<path class="sector nope" d="M363,314 183,8 543,8 Z" {fill} onpointerdown={() => onClick(i)} />
			<text class="text nope" x="340" y="314" fill={tile ? 'var(--bg)' : 'var(--slate-deep)'}>{i}</text>
			{#snippet dot(angle)}
				{@const r = width * 0.6}
				{@const transform = `rotate(${angle}, 363, 95) translate(0, -220)`}
				{@const shades = tile.player === 1 ? ['var(--amber-fill)', 'var(--amber-shine)'] : ['var(--slate-stroke)', 'var(--slate-shine)']}
				<g class="nope" {transform} stroke="none" out:fade={{ duration: ts.ms || 0 }}>
					<circle cx="363" cy="314" {r} fill="var(--bg)" />
					<circle cx="363" cy="314" r={r * 0.8} fill={moving ? shades[1] : shades[0]} />
					<circle cx={363 - r * 0.2} cy={314 - r * 0.2} r={r * 0.3} fill={shades[1]} />
				</g>
			{/snippet}
			{#if selected === i && !moving}
				{@render dot(-deg)}
			{/if}
		</g>
	{/snippet}
	{#key tile?.place}
		<svg {width} {height} {viewBox} {xmlns}>
			{#each [1, 2, 3, 4, 5, 6] as i (i)}
				{@render sector(i)}
			{/each}
			<path class="nope" d="M183,620 543,620 726,314 543,0 183,0 0,314 Z" {stroke} stroke-width={sw} stroke-line-join="round" fill="none" />
			{#if !tile}
				<circle class="center" cx="363" cy="314" r={width * 1.2} {stroke} stroke-width={sw * 2} fill='var(--menu-bg)' />
			{/if}
		</svg>
	{/key}
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
	}

	.center {
		cursor: initial;
		/* pointer-events: all; */
	}

	svg {
		grid-area: 1/1;
		transition: scale 1s linear;
	}

	.fade-in {
		animation: fade-in 1s forwards;
	}

	@keyframes fade-in {
		0% {
			transform: scale(0);
			rotate: -360deg;
		}
		100% {
			transform: scale(1);
			rotate: 0deg;
		}
	}

	.fade-out {
		animation: fade-out 1s forwards;
	}

	@keyframes fade-out {
		0% {
			transform: scale(1);
			rotate: 0deg;
		}
		100% {
			transform: scale(0);
			rotate: 360deg;
		}
	}
</style>
