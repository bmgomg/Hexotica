<script>
	import { fade } from 'svelte/transition';
	import { boardParams, ss } from './shared.svelte';
	import TextButton from './Text Button.svelte';
</script>

{#if !ss.menu}
	<div class="footer" style="translate: -{boardParams().padding.right / 2}px 0;" transition:fade>
		<TextButton id="tb-menu" text={['Menu']} framed onClick={() => (ss.menu = true)} />
	</div>
{/if}

<style>
	.footer {
		grid-area: 3/1;
		display: grid;
		place-self: center;
	}
</style>
