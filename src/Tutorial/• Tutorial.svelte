<script>
	import { ss } from '../shared.svelte';
	import Header from './• Header.svelte';
</script>

{#if ss.tutorial}
	<div class="tutorial">
		<div class="script">Before placing it, the current player may rotate or reposition any of their tiles already on the board.</div>
		<div class="game">
			<Header />
		</div>
	</div>
{/if}

<style>
	.tutorial {
		grid-area: 2/1;
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		background: var(--menu-bg);
		z-index: 4;
	}

	.script {
		display: grid;
		padding: 20px;
		font-family: Crimson;
		font-style: italic;
		font-size: 20px;
		width: 300px;
	}

	.game {
		display: grid;
		padding: 10px;
	}
</style>
