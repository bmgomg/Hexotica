<script>
	import Avatar from './• Avatar.svelte';
	import Hand from './• Hand.svelte';
	import Tray from './• Tray.svelte';
</script>

<div class="header no-highlight">
	<Avatar player={1} />
	<Hand  player={1}/>
	<Tray />
	<Hand  player={2}/>
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
