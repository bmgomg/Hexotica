<script>
	import { trayTile } from './shared.svelte';
	import Tile from './Tile.svelte';
</script>

<div class="tray">
	<Tile tile={trayTile()} />
</div>

<style>
	.tray {
		grid-area: 1/3;
		display: grid;
		place-content: center;
	}
</style>
