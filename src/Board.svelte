<script>
	import { boardParams, neighbors, placedTiles, remesh, ss, trayTile } from './shared.svelte';
	import Spot from './Spot.svelte';
	import Tile from './Tile.svelte';
	import { _range, post, scrollClass } from './utils';

	let _this = $state();
	const { rows, cols } = $derived(ss.dims);
	const { rowHeight, colWidth, gap: g, pad } = boardParams();
	const grid = $derived(`repeat(${rows}, ${rowHeight}px)/ repeat(${cols}, ${colWidth}px)`);
	const gap = $derived(`${g?.y}px ${g?.x}px`);
	const padding = $derived(`${pad?.y / 2}px ${pad?.x / 2}px`);
	const ptiles = $derived(placedTiles());

	$effect(() => {
		const onResize = () => {
			remesh();
		};

		post(onResize);

		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<div id="board" bind={_this} class="board  no-highlight {scrollClass()}">
	<div id="mesh" class="mesh" style="grid: {grid}; gap: {gap}; padding: {padding};">
		{#each _range(1, rows) as row (row)}
			{#each _range(1, cols) as col (col)}
				{@const style = `grid-area: ${row}/${col}; width: ${colWidth}; height: ${rowHeight}`}
				<div class="cell nope" {style}>{row + ':' + col}</div>
				{@const i = ss.tiles.findIndex((tile) => tile.place?.row === row && tile.place?.col === col)}
				{#if i >= 0}
					<Tile bind:tile={ss.tiles[i]} {row} {col} />
				{:else if ptiles.length === 0 && row === (rows + 1) / 2 && col === (cols + 1) / 2 && trayTile()}
					<Spot {row} {col} />
				{:else}
					{@const nbs = neighbors(row, col)}
					{#if nbs.some((a) => !!a)}
						<Spot {row} {col} />
					{/if}
				{/if}
			{/each}
		{/each}
	</div>
</div>

<style>
	.board {
		grid-area: 2/1;
		box-sizing: border-box;
		/* border: 1px dotted var(--text); */
	}

	.mesh {
		display: grid;
		place-self: center;
		/* border: 1px dotted var(--text); */
	}

	.cell {
		display: none;
		font-family: Crimson;
		opacity: 0.25;
		box-sizing: border-box;
		border: 1px dotted #ffffff;
		place-content: center;
		z-index: -1;
	}
</style>
