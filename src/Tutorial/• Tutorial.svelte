<script>
	import { ss } from '../shared.svelte';
	import Header from './• Header.svelte';
</script>

{#if ss.tutorial}
	<div class="tutorial">
		<Header />
	</div>
{/if}

<style>
	.tutorial {
		grid-area: 2/1;
		place-self: center;
		display: grid;
		background: var(--menu-bg);
		padding: 40px 30px;
		z-index: 4;
	}
</style>
