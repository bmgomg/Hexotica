<script>
	import { trayTile } from './shared.svelte';
	import Tile from './Tile.svelte';

	let tile = $derived(trayTile());
</script>

<div class="tray no-highlight">
	<Tile bind:tile />
</div>

<style>
	.tray {
		grid-area: 1/3;
		display: grid;
		place-content: center;
	}
</style>
