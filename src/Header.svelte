<script>
	import { fade } from 'svelte/transition';
	import Avatar from './Avatar.svelte';
	import { ss } from './shared.svelte';
	import Tray from './Tray.svelte';
	import Stats from './Stats.svelte';
	import { INFO_DECK, INFO_STATS } from './const';
</script>

{#if !ss.menu && !ss.decks}
	<div class="header" transition:fade>
		<Stats player={1} info={INFO_STATS}/>
		<Avatar player={1} />
		<Stats player={1} info={INFO_DECK} />
        <Tray />
		<Stats player={2} info={INFO_DECK} />
		<Avatar player={2} />
		<Stats player={2} info={INFO_STATS} />
	</div>
{/if}

<style>
	.header {
		grid-area: 1/1;
		place-self: center;
		align-items: center;
		display: grid;
		grid-auto-flow: column;
		grid: auto / 100px auto 120px 80px 120px auto 100px;
	}
</style>
