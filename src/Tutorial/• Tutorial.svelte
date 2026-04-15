<script>
	import { fade } from 'svelte/transition';
	import { ss } from '../shared.svelte';
	import { scrollClass } from '../utils';
	import { ts } from './ts.svelte';
	import Board from './• Board.svelte';
	import Header from './• Header.svelte';
	import { onMount } from 'svelte';

	const SCRIPT = [
		/*1*/ ['A tile from Player 1’s deck is drawn.'],
		/*2*/ ['Player 1 chooses a sector on the drawn tile.'],
		/*3*/ ['Player 1 chooses a sector on an empty space on the board.'],
		/*4*/ ['The chosen sector sets the tile’s orientation when it’s placed.'],
		/*5*/ ['A tile from Player 2’s deck is drawn.'],
		/*6*/ ['Player 2 places the tile on the board.'],
		/*7*/ ['A tile from Player 1’s deck is drawn.'],
		/*8*/ ['Before placing the drawn tile, the player may rotate and/or reposition any of their tiles already on the board.'],
		/*9*/ ['Placing the drawn tile ends the player’s turn.']
	];

	onMount(() => {
		ts.init();
	});
</script>

{#if ss.tutorial}
	<div class="tutorial">
		<div class="script-container" transition:fade>
			<div class="script no-highlight {scrollClass()}" tabindex="-1">
				{#each SCRIPT as section, i (i)}
					{#each section as line, j (j)}
						<div class="line {ts.step === i + 1 ? 'hi' : ''}">{line}</div>
					{/each}
				{/each}
			</div>
		</div>
		<div class="game" transition:fade>
			<Header />
			<Board />
		</div>
	</div>
{/if}

<style>
	.tutorial {
		grid-area: 1/1/span 3/1;
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		background: var(--menu-bg);
		z-index: 4;
	}

	.script-container {
		overflow: hidden;
		display: grid;
	}

	.script {
		display: grid;
		padding: 20px 10px 10px 20px;
		font-family: Crimson;
		font-style: italic;
		font-size: 20px;
		width: 300px;
	}

	.line {
		margin-bottom: 15px;
		opacity: 0.35;
		transition: opacity 1s;
		box-sizing: border-box;
	}

	.hi {
		opacity: 1;
	}

	.game {
		display: grid;
		padding: 10px;
	}
</style>
