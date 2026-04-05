<script>
	import { fade } from 'svelte/transition';
	import Message from './Message.svelte';
	import { ss } from './shared.svelte';
	import Toolbar from './Toolbar.svelte';
</script>

{#if !ss.menu}
	<div class="footer" transition:fade>
		<Toolbar />
		<Message />
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
