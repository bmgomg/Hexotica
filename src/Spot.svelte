<script>
	import { fade } from 'svelte/transition';
	import { HEX_DIMS, HEX_RATIO, HEX_WIDTH } from './const';
	import { currentTurns, drawTile, goTile, isMoving, neighbors, persist, placedTiles, remesh, ss } from './shared.svelte';
	import { post, rectCenter } from './utils';
	import { checkWin } from './ai';

	const { row, col, tile, scale = ss.zoom } = $props();
	const tt = $derived(tile?.place === 'tray');
	const player = $derived(tile?.player);
	const id = $derived('spot ' + row + ':' + col);
	const ga = $derived(`${tile || !row ? 1 : row}/${tile || !col ? 1 : col}`);
	const width = $derived(HEX_WIDTH * scale);
	const height = $derived(width / HEX_RATIO);
	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
	const stroke = $derived(player === 1 ? 'var(--amber-fill)' : player === 2 ? 'var(--slate-stroke)' : 'var(--spoke)');
	const sw = 10;
	const selected = $derived(ss.from && ss.from.row === row && ss.from.col === col ? ss.from.sector : 0);
	const tileTurns = $derived(tile?.turns || 0);
	const moving = $derived(isMoving());

	const onClick = (i) => {
		if (ss.over) {
			return;
		}

		if (!ss.from) {
			ss.from = { row, col, sector: i };
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
			ss.from = { row, col, sector: i };
			return;
		}

		const gotile = goTile();

		///////////////////

		let delta = i - (ss.from.sector + (tile ? 0 : gotile.turns));

		if (delta > 3) {
			delta -= 6;
		} else if (delta < -3) {
			delta += 6;
		}

		let ok = true;

		const norm = (bits, turns) => {
			bits = [...bits, ...bits, ...bits];
			bits = bits.slice(6 - turns, 12 - turns);
			return bits;
		};

		const bits = norm(gotile.bits, gotile.turns + delta);
		let nbs = neighbors(row, col);
		let count = 0;

		for (let i = 0; i < 6; i++) {
			const nb = nbs[i];

			if (!nb || nb === gotile) {
				continue;
			}

			count += 1;

			const nbits = norm(nb.bits, nb.turns);

			const j = i < 3 ? i + 3 : i - 3;
			const b = nbits[j];

			if (bits[i] && b !== bits[i]) {
				ok = false;
				break;
			}
		}

		if (!ok) {
			alert('Color mismatch!');
			return;
		}

		nbs = neighbors(gotile.place.row, gotile.place.col);
		const _count = nbs.filter((nb) => !!nb).length;

		if (_count > count) {
			alert('Too few neighbors!');
			return;
		}

		if (gotile.place !== 'tray') {
			const ptiles = placedTiles();

			const countContiguous = () => {
				let count = 0;

				const visit = (tile) => {
					if (tile.visited) {
						return;
					}

					count += 1;
					tile.visited = true;

					const nbs = neighbors(tile.place.row, tile.place.col, ptiles).filter((nb) => !!nb);

					for (const nb of nbs) {
						visit(nb);
					}
				};

				visit(gotile);
				return count;
			};

			count = countContiguous();

			for (const tile of ptiles) {
				delete tile.visited;
			}

			if (count < ptiles.length) {
				alert('No islands!');
				return;
			}
		}

		///////////////////

		ss.to = { row, col, sector: i };

		if (tile) {
			ss.ms = 500;
		} else {
			ss.to.sector -= gotile.turns;

			const { x: x1, y: y1 } = rectCenter(gotile.id);
			const { x: x2, y: y2 } = rectCenter(id);

			gotile.off = { x: x2 - x1, y: y2 - y1 };

			ss.ms = 750;
		}

		post(() => {
			gotile.turns += currentTurns();

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

			if (checkWin(ss.tiles)) {
				ss.over = true;
				alert(`Player ${ss.actor} wins!`);
			}

			post(() => {
				remesh();
				persist();
			}, 200);
		}, ss.ms);
	};

	const canClick = $derived.by(() => {
		if (moving) {
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
				{@const transform = `rotate(${-(deg + tileTurns * 60)}, 363, 95) translate(0, -220)`}
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
