<script>
	import { fade } from 'svelte/transition';
	import { ss } from '../shared.svelte';
	import { scrollClass } from '../utils';
	import Header from './• Header.svelte';

	let step = $state(1);

	const SCRIPT = [
		['A tile from Player 1’s deck is drawn.'],
		['Player 1 chooses a sector on the drawn tile.'],
		['Player 1 chooses a sector on an empty space on the board.', 'The chosen sector sets the tile’s orientation when it’s placed.'],
		['A tile from Player 2’s deck is drawn.'],
		['Player 2 places the drawn tile on the board.'],
		['A tile from Player 1’s deck is drawn.'],
		['Before placing the drawn tile, the player may rotate or reposition any of their tiles already on the board.'],
		['Placing the drawn tile ends the player’s turn.']
	];
</script>

{#if ss.tutorial}
	<div class="tutorial">
		<div class="script-container" transition:fade>
			<div class="script no-highlight {scrollClass()}" tabindex="-1">
				{#each SCRIPT as section, i (i)}
					{#each section as line, j (j)}
						<div class="line {step === i + 1 ? 'hi' : ''}">{line}</div>
					{/each}
				{/each}
			</div>
		</div>
		<div class="game" transition:fade>
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
		opacity: 0.4;
	}

	.hi {
		opacity: 1;
	}

	.game {
		display: grid;
		padding: 10px;
	}
</style>
