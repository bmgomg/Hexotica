<script>
	import { trayTile } from './shared.svelte';
	import Tile from './Tile.svelte';

	let tile = $derived(trayTile());
</script>

{#if tile}
	<div class="tray no-highlight">
		<Tile bind:tile />
	</div>
{/if}

<style>
	.tray {
		grid-area: 1/3;
		display: grid;
		place-content: center;
	}
</style>
