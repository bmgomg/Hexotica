<script>
	import { fade } from 'svelte/transition';
	import Avatar from './• Avatar.svelte';
	import Tray from './• Tray.svelte';
</script>

<div class="header no-highlight" transition:fade>
	<Avatar player={1} />
	<Tray />
	<Avatar player={2} />
</div>

<style>
	.header {
		grid-area: 1/1;
		place-self: center;
		align-items: center;
		display: grid;
		grid-auto-flow: column;
		grid: auto / 10px auto 85px 80px 85px auto 10px;
	}
</style>
