<script>
	import { boardParams, neighbors, placedTiles, remesh, ss, trayTile } from './shared.svelte';
	import Spot from './Spot.svelte';
	import { _range, post, scrollClass } from './utils';

	let _this = $state();
	const { rows, cols } = $derived(ss.dims);
	const { rowHeight, colWidth, gap: g, padding: pad } = boardParams();
	const grid = $derived(`repeat(${rows}, ${rowHeight}px)/ repeat(${cols}, ${colWidth}px)`);
	const gap = $derived(`${g?.y}px ${g?.x}px`);
	const padding = $derived(`${pad?.top}px ${pad?.right}px ${pad?.bottom}px ${pad?.left}px`);
	const meshStyle = $derived(`grid: ${grid}; gap: ${gap}; padding: ${padding};`);
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

<div id="board" bind={_this} class="board {scrollClass()}">
	<div id="mesh" class="mesh" style={meshStyle}>
		{#each _range(1, rows) as row (row)}
			{#each _range(1, cols) as col (col)}
				{@const tile = ptiles.find((tile) => tile.place.row === row && tile.place.col === col)}
				{#if tile}
					<div>tile</div>
				{:else if ptiles.length === 0 && row === (rows + 1) / 2 && col === (cols + 1) / 2 && trayTile()}
					<Spot {row} {col} player={0} selected={2}/>
				{:else}
					{@const nbs = neighbors(row, col)}
					{#if nbs.some((a) => !!a)}
						<Spot {row} {col}/>
					{:else}
						{@const style = `width: ${colWidth}; height: ${rowHeight}`}
						<div class="cell" {style}>{row + ':' + col}</div>
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
		border: 1px dotted #ffffff;
		place-content: center;
	}
</style>
