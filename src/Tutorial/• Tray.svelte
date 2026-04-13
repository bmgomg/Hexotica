<script>
	import { trayTile } from '../shared.svelte';
	import Tile from '../Tile.svelte';

	let tile = $derived(trayTile());
</script>

{#if tile}
	<div class="tray no-highlight">
		<Tile row={-1} col={-1} bind:tile />
	</div>
{/if}

<style>
	.tray {
		grid-area: 1/4;
		display: grid;
		place-content: center;
	}
</style>
