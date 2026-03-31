<script>
	import { fade } from 'svelte/transition';
	import { ss } from './shared.svelte';
	import TextButton from './Text Button.svelte';

</script>

{#if !ss.menu}
<div class="footer" transition:fade>
    <TextButton id="tb-menu" text={['Menu']} framed onClick={() => ss.menu = true} />
</div>
{/if}

<style>
	.footer {
        grid-area: 3/1;
		display: grid;
        place-self: center;
	}
</style>
