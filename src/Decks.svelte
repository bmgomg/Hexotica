<script>
	import { fade } from 'svelte/transition';
	import { HEXES } from './const';
	import Knob from './Knob.svelte';
	import { ss } from './shared.svelte';
	import Spot from './Spot.svelte';
	import { _range } from './utils';

	const getTile = (i, player) => {
		const key = ss.deck[i];
		const tile = ss.tiles.find((t) => t.player === player && key === t.key);
		return tile;
	};
</script>

{#if ss.decks}
	<div id="decks" class="decks" in:fade>
		{#each [1, 2] as player (player)}
			<div class="deck">
				{#each _range(0, 15) as i (i)}
					{@const row = i < 8 ? 1 : 2}
					{@const col = (i % 8) + 1}
					{@const tile = getTile(i, player)}
					<div class="hex no-highlight" style="grid-area: {row}/{col}">
						{#if tile.place}
							<Spot row={1} col={1} deck />
						{:else}
							<Spot row={1} col={1} {tile} deck />
							<div class="knob">
								<Knob tile={{ player }} deck />
							</div>
						{/if}
					</div>
				{/each}
			</div>
			{#if player === 1}
				<div class="divider"></div>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.decks {
		grid-area: 1/1 / span 3/1;
		display: grid;
		place-self: center;
		box-sizing: border-box;
		padding: 40px 30px;
		background: var(--menu-bg);
		z-index: 4;
		gap: 10px;
	}

	.deck {
		display: grid;
		gap: 5px;
	}

	.hex {
		display: grid;
		place-items: center;
		width: 80px;
		aspect-ratio: 1.156;
	}

	.knob {
		grid-area: 1/1;
		z-index: 1;
	}

	.divider {
		place-self: center;
		width: 400px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--text), transparent);
		margin: 35px 0;
	}
</style>
