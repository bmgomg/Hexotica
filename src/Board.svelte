<script>
	import { _log, boardParams, remesh, ss } from './shared.svelte';
	import { post, scrollClass } from './utils';

	let _this = $state();
	const { rows, cols } = $derived(ss.dims);
	const { rowHeight, colWidth, gap: g, padding: pad } = boardParams();
	const grid = $derived(`repeat(${rows}, ${rowHeight}px)/ repeat(${cols}, ${colWidth}px)`);
	const gap = $derived(`${g?.y}px ${g?.x}px`);
	const padding = $derived(`${pad?.top}px ${pad?.right}px ${pad?.bottom}px ${pad?.left}px`);
	const meshStyle = $derived(`grid: ${grid}; gap: ${gap}; padding: ${padding};`);

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
	<div id="mesh" class="mesh" style={meshStyle}></div>
</div>

<style>
	.board {
		grid-area: 2/1;
		box-sizing: border-box;
		border: 1px dotted var(--text);
	}

	.mesh {
		display: grid;
		place-self: center;
		border: 1px dotted var(--text);
	}
</style>
