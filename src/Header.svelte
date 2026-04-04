<script>
	import { fade } from 'svelte/transition';
	import Avatar from './Avatar.svelte';
	import { ss } from './shared.svelte';
	import Tray from './Tray.svelte';
	import Stats from './Stats.svelte';
</script>

{#if !ss.menu}
	<div class="header" transition:fade>
		<Avatar player={1} />
		<Stats player={1} />
        <Tray />
		<Stats player={2} />
		<Avatar player={2} />
	</div>
{/if}

<style>
	.header {
		grid-area: 1/1;
		place-self: center;
		align-items: center;
		display: grid;
		grid-auto-flow: column;
		grid: auto / auto 100px 80px 100px auto;
	}
</style>
