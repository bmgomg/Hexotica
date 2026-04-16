<script>
	import { fade } from 'svelte/transition';
	import { validateMove } from './ai';
	import { ERR_COLOR, ERR_ISLAND, ERR_NEIGHBORS, ERR_NO_TILE, HEX_DIMS, HEX_RATIO, HEX_WIDTH } from './const';
	import { doPlacement, isMoving, placedTiles, roboTurn, showMessage, spotId, ss } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { post } from './utils';

	const { row, col, tile, deck } = $props();
	const tt = $derived(tile?.place === 'tray');
	const player = $derived(tile?.player);
	const id = $derived(spotId(row, col));
	const ga = $derived(`${tile || row < 0 ? 1 : row}/${tile || col < 0 ? 1 : col}`);
	const width = $derived(HEX_WIDTH * ss.zoom * (deck ? 0.9 : 1));
	const height = $derived(width / HEX_RATIO);
	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
	const stroke = $derived(player === 1 ? 'var(--amber-fill)' : player === 2 ? 'var(--slate-stroke)' : 'var(--spoke)');
	const sw = 10;
	const selected = $derived(ss.from && ss.from.row === row && ss.from.col === col ? ss.from.sector : 0);
	const moving = $derived(isMoving());
	let clickSector = $state(0);

	const onClick = (i) => {
		delete ss.choice;

		if (ss.over) {
			return;
		}

		_sound.play('click');

		const placement = { row, col, sector: i };

		if (!ss.from) {
			ss.from = placement;
			return;
		}

		if (ss.from.row === row && ss.from.col === col) {
			if (ss.from.sector === i) {
				delete ss.from;
				return;
			}

			if (tt) {
				ss.from.sector = i;
				return;
			}
		} else if (tile) {
			ss.from = placement;
			return;
		}

		clickSector = i;
		post(() => (clickSector = 0), 750);

		const bits = validateMove(ss.from, placement, ss.tiles);

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

	const canClick = $derived.by(() => {
		if (moving || ss.over) {
			return false;
		}

		if (!tile) {
			return ss.from;
		}

		if (tile.player !== ss.actor) {
			return false;
		}

		return true;
	});

	const classes = $derived.by(() => {
		let cls = 'spot nope ';

		if (!tile && !deck) {
			if (ss.restart) {
				cls += 'fade-out';
			} else if (placedTiles().length === 0) {
				cls += 'fade-in';
			}
		}

		return cls;
	});
</script>

<div {id} class={classes} style="grid-area: {ga};" in:fade={{ duration: tile ? 0 : 300 }}>
	{#snippet sector(i)}
		{@const deg = ((i - 1) * 60) % 360}
		{@const stroke = tile ? (deck ? 'var(--menu-bg)' : 'var(--bg)') : 'var(--spoke)'}
		{@const blue = tile?.bits[i - 1] === '2'}
		{@const fill = tile ? (blue ? 'var(--slate-fill)' : 'var(--amber-fill)') : clickSector === i ? 'var(--spoke)' : ''}
		<g transform="rotate({deg}, 363, 314)" {stroke} stroke-width={sw} stroke-line-join="round" fill="transparent">
			<path class="sector {canClick ? 'ape' : 'nope'}" d="M183,8 363,314 543,8" {fill} onpointerdown={() => onClick(i)} />
			<text class="text nope" x="340" y="314" fill={tile ? 'var(--bg)' : 'var(--slate-deep)'}>{i}</text>
			{#snippet dot(angle)}
				{@const r = width * 0.6}
				{@const transform = `rotate(${angle}, 363, 95) translate(0, -220)`}
				{@const shades = tile.player === 1 ? ['var(--amber-fill)', 'var(--amber-shine)'] : ['var(--slate-stroke)', 'var(--slate-shine)']}
				<g class="nope" {transform} stroke="none" out:fade={{ duration: ss.ms || 0 }}>
					<circle cx="363" cy="314" {r} fill="var(--bg)" />
					<circle cx="363" cy="314" r={r * 0.8} fill={moving ? shades[1] : shades[0]} />
					<circle cx={363 - r * 0.2} cy={314 - r * 0.2} r={r * 0.3} fill={shades[1]} />
				</g>
			{/snippet}
			{#if selected === i && !moving && !roboTurn()}
				{@render dot(-deg)}
			{/if}
		</g>
	{/snippet}
	<svg {width} {height} {viewBox} {xmlns}>
		{#snippet outline(stroke, fill = 'none')}
			<path class="nope" d="M183,620 543,620 726,314 543,0 183,0 0,314 Z" {stroke} stroke-width={sw} stroke-line-join="round" {fill} />
		{/snippet}
		{#if tile}
			{@const fill = deck ? 'var(--menu-bg)' : 'var(--bg)'}
			{@render outline('none', fill)}
		{/if}
		{#each [1, 2, 3, 4, 5, 6] as i (i)}
			{@render sector(i)}
		{/each}
		{@render outline(stroke)}
		{#if !tile}
			{@render outline(stroke)}
			{@const fill = deck ? 'var(--menu-bg)' : 'var(--bg)'}
			<circle class="center" cx="363" cy="314" r={width * 1.2} {stroke} stroke-width={sw * 2} {fill} />
		{/if}
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
	}

	.ape {
		cursor: pointer;
		pointer-events: all;
	}

	.center {
		cursor: initial;
		pointer-events: all;
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
