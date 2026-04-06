<script>
	import { fade } from 'svelte/transition';
	import Message from './Message.svelte';
	import { ss } from './shared.svelte';
	import Toolbar from './Toolbar.svelte';
	import Choice from './Choice.svelte';
</script>

{#if !ss.menu}
	<div class="footer" transition:fade>
		<Toolbar />
		<Message />
		<Choice/>
	</div>
{/if}

<style>
	.footer {
		grid-area: 3/1;
		display: grid;
		place-self: center;
		place-items: center;
	}
</style>
