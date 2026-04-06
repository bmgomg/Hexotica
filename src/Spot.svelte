<script>
	import { fade } from 'svelte/transition';
	import { checkWin, validateMove } from './ai';
	import { ERR_COLOR, ERR_ISLAND, ERR_NEIGHBORS, ERR_NO_TILE, HEX_DIMS, HEX_RATIO, HEX_WIDTH, MSG_SUCCESS } from './const';
	import { currentTurns, drawTile, goTile, isMoving, persist, remesh, showMessage, ss } from './shared.svelte';
	import { post, rectCenter } from './utils';

	const { row, col, tile, scale = ss.zoom } = $props();
	const tt = $derived(tile?.place === 'tray');
	const player = $derived(tile?.player);
	const id = $derived('spot ' + (row < 0 ? 'tray' : row + ':' + col));
	const ga = $derived(`${tile || row < 0 ? 1 : row}/${tile || col < 0 ? 1 : col}`);
	const width = $derived(HEX_WIDTH * scale);
	const height = $derived(width / HEX_RATIO);
	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
	const stroke = $derived(player === 1 ? 'var(--amber-fill)' : player === 2 ? 'var(--slate-stroke)' : 'var(--spoke)');
	const sw = 10;
	const selected = $derived(ss.from && ss.from.row === row && ss.from.col === col ? ss.from.sector : 0);
	const moving = $derived(isMoving());

	const onClick = (i) => {
		delete ss.choice;

		if (ss.over) {
			return;
		}

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

		ss.to = placement;
		const gotile = goTile();

		if (tile) {
			ss.ms = 500;
		} else {
			const { x: x1, y: y1 } = rectCenter(gotile.id);
			const { x: x2, y: y2 } = rectCenter(id);

			gotile.off = { x: x2 - x1, y: y2 - y1 };

			ss.ms = 750;
		}

		post(() => {
			gotile.bits = bits;
			gotile.imgTurns = (gotile.imgTurns + currentTurns()) % 6;

			if (gotile.off) {
				delete gotile.off;

				if (gotile.place === 'tray') {
					post(() => {
						ss.actor = 3 - ss.actor;
						drawTile();
					});
				}

				gotile.place = { row, col };
			}

			delete ss.from;
			delete ss.to;
			delete ss.ms;

			const win = checkWin(ss.tiles);

			if (win) {
				const { player, tileIds } = win;

				if (player) {
					ss.over = tileIds;
					showMessage(`Player ${ss.actor} wins!`, MSG_SUCCESS);
				}
			}

			post(() => {
				remesh();
				persist();
			}, 200);
		}, ss.ms);
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
</script>

<div {id} class="spot nope" style="grid-area: {ga};">
	{#snippet sector(i)}
		{@const deg = ((i - 1) * 60) % 360}
		{@const stroke = tile ? 'none' : 'var(--spoke)'}
		{@const sw = tile ? 0 : 10}
		<g transform="rotate({deg}, 363, 314)" {stroke} stroke-width={sw} stroke-line-join="round" fill="transparent">
			<path class="sector {canClick ? 'ape' : 'nope'}" d="M363,314 183,8 543,8 Z" onpointerdown={() => onClick(i)} />
			<text class="text nope" x="340" y="314" fill={tile ? 'var(--bg)' : 'var(--slate-deep)'}>{i}</text>
			{#if selected === i && !moving}
				{@const r = width * 0.6}
				{@const transform = `rotate(${-deg}, 363, 95) translate(0, -220)`}
				{@const shades = tile.player === 1 ? ['var(--amber-fill)', 'var(--amber-shine)'] : ['var(--slate-stroke)', 'var(--slate-shine)']}
				<g class="nope" {transform} stroke="none" out:fade={{ duration: ss.ms || 0 }}>
					<circle cx="363" cy="314" {r} fill="var(--bg)" />
					<circle cx="363" cy="314" r={r * 0.8} fill={moving ? shades[1] : shades[0]} />
					<circle cx={363 - r * 0.2} cy={314 - r * 0.2} r={r * 0.3} fill={shades[1]} />
				</g>
			{/if}
		</g>
	{/snippet}
	{#key tile?.place}
		<svg {width} {height} {viewBox} {xmlns}>
			{#each [1, 2, 3, 4, 5, 6] as i (i)}
				{@render sector(i)}
			{/each}
			<path class="nope" d="M183,620 543,620 726,314 543,0 183,0 0,314 Z" {stroke} stroke-width={sw} stroke-line-join="round" fill="none" />
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

	.ape {
		cursor: pointer;
		pointer-events: all;
	}

	svg {
		grid-area: 1/1;
		transition: scale 1s linear;
	}
</style>
